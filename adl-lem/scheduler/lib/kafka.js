const kafka = require("simple-kafka-consumer");
const mom = require("tla-mom-proto");

const models = require("./models");
const config = require("../config");
const enums = require("./enums")
const xapi = require("./xapi")

const kafkaInterop = {

    /**
     * Called when a task has been SCHEDULED.  This IS NOT CALLED IN REACTION TO LRP xAPI TRAFFIC,
     * but only cases where a "scheduled" statement was made.
     */
    addTask: async(user, task, time) => {

        let clause = {
            where: [
                `user=${user}`,
                `uri=${task}`,
                `status<>${enums.taskStatusEnums.completed}`
            ]
        }  

        let duplicateTasks = await models.tasks.select("*", clause)
        if (duplicateTasks.length == 0) {
            
            let inserted = await models.tasks.insert({
                [models.tasks.user]: user,
                [models.tasks.uri]: task,
                [models.tasks.timestamp]: time,
                [models.tasks.status]: enums.taskStatusEnums.new
            })
            console.log(`[Tasks] Activation:\n\tUser: ${user}\n\tActivated: ${task}`)

            return inserted
        }

        else {
            console.log(`[Tasks] Duplicate Task Ignored:\n\tUser: ${user}\n\tIgnored: ${task}`)
        }
    },

    /**
     * Called in reaction to statements from an LRP.  This function can also send a captured statement
     */
    editTask: async(user, task, time, status, statement) => {

        let clause = {
            where: [
                `user=${user}`,
                `uri=${task}`,
                `status<>${enums.taskStatusEnums.completed}`
            ]
        }

        let knownTasks = await models.tasks.select("*", clause)
        if (knownTasks.length > 0) {
            return await models.tasks.update({ 
                [models.tasks.status]: status,
                [models.tasks.timestamp]: time 
            }, clause)
        } else if (statement) {
            await kafkaInterop.sendCapturedStatement(statement);
        }
    },

    /**
     * Called in reaction to a "deselected" statement.
     */
    removeTask: async(user, task, id) => {

        let clause = {
            where: [
                `user=${user}`,
                `uri=${task}`
            ]
        }
        if (id != undefined)
            clause.where.push(`id=${id}`)
        
        let deleted = await models.tasks.delete(clause)
        console.log(`[Tasks] Deletion Request:\n\tUser: ${user}\n\tDeselected: ${task}`)

        return deleted
    },

    sendCapturedStatement: async(statement) => {

        // Clean the readonly fields to send properly
        delete statement.id
        delete statement.authority
        delete statement.timestamp

        statement.verb = mom.verbs.captured
        await xapi.sendStatement(statement)
    },

    init: (kafkaConfig) => {
        
        kafka.configure(kafkaConfig)
        kafka.initConsumer(async(topic, offset, message) => {
            
            try {
                let statement = JSON.parse(message)
                if (!statement.actor.account || !statement.actor.account.name)
                    return
    
                let user = statement.actor.account.name;
                let task = statement.object.id;
                let time = statement.timestamp;
    
                if (statement.verb.id == mom.verbs.scheduled.id)
                    await kafkaInterop.addTask(user, task, time)
                    
                if (statement.verb.id == mom.verbs.initialized.id)
                    await kafkaInterop.editTask(user, task, time, enums.taskStatusEnums.started, statement)
                
                if (statement.verb.id == mom.verbs.completed.id)
                    await kafkaInterop.editTask(user, task, time, enums.taskStatusEnums.completed)
                
                if (statement.verb.id == mom.verbs.deselected.id) {
                    let def = statement.object.definition
                    let ext = def != undefined ? def.extensions : undefined

                    let type = def != undefined ? def.type : undefined
                    let id = ext != undefined ? ext[mom.objectExtensions.instance] : undefined

                    if (type == mom.activityTypes.activity && id != undefined)
                        await kafkaInterop.removeTask(user, task, id)
                    else {
                        console.log(`[Tasks] Removal request without proper $.object.definition fields.  Ignoring User: ${user}, Task: ${task}`)
                        console.log(`\tExpected $.object.definition.type == ${mom.activityTypes.activity}, got ${type}`)
                        console.log(`\tExpected $.object.definition.extensions[${mom.objectExtensions.instance}] to be defined, got ${id}`)
                    }
                }
    
            } catch (err) {
                console.error(err);
            }
        })
    }
}

module.exports = kafkaInterop