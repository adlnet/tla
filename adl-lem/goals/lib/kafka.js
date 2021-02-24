const kafka = require("simple-kafka-consumer");
const mom = require("tla-mom-proto");

const goals = require("./goal-gb");
const config = require("../config");

const relevantTypes = [
    mom.activityTypes.badge,
    mom.activityTypes.career,
    mom.activityTypes.credential,
    mom.activityTypes.competency,
    mom.activityTypes.jobDutyGig
]

const kafkaInterop = {

    init: () => {
        
        kafka.configure(config.kafka)
        kafka.initConsumer(async(topic, offset, message) => {

            try {
                let statement = JSON.parse(message)
                if (!statement.actor || !statement.actor.account || !statement.actor.account.name)
                    return

                let user = statement.actor.account.name;
                let goal = statement.object.id;
                let time = statement.timestamp;

                if (statement.verb.id == mom.verbs.planned.id) {
                    await kafkaInterop.activateGoal(user, goal, time)
                }

                else if (statement.verb.id == mom.verbs.prioritized.id) {
                    await kafkaInterop.activateGoal(user, goal, time)
                }
                
                else if (statement.verb.id == mom.verbs.conferred.id) {
                    await kafkaInterop.satisfyGoal(user, goal, time)
                }
                
                else if (statement.verb.id == mom.verbs.asserted.id) {
                    await kafkaInterop.satisfyGoal(user, goal, time)
                }

                else if (statement.verb.id == mom.verbs.deselected.id) {
                    let def = statement.object.definition
                    let type = def != undefined ? def.type : undefined

                    if (relevantTypes.includes(type))
                        await kafkaInterop.removeGoal(user, goal)
                    else
                        console.log(`[Goals] Removal request without proper $.object.definition fields.  Ignoring User: ${user}, Goal: ${goal}`)
                }

            } catch (err) {
                console.error(err);
            }
        })
    },

    activateGoal: async(user, goal, time) => {

        let records = await goals.deactivateIncompleteGoals(user, goals.statusEnum.inactive);
        let newGoal = records.filter(record => record.goal == goal).length == 0;

        if (newGoal) {
            await goals.createGoal(user, goal, time, goals.typeEnum.competency, goals.statusEnum.active);
            console.log("Created new goal!")
        }
        else {
            await goals.updateGoal(user, goal, time, goals.statusEnum.active);
            console.log("Updated goal!")
        }

        console.log(`[Goals] User ${user} Activated ${goal}`)
    },

    satisfyGoal: async(user, goal, time) => {
        
        let record = await goals.readGoal(user, goal);
        if (record) {
            await goals.updateGoal(user, goal, time, goals.statusEnum.satisfied);
            console.log(`[Goals] User ${user} Satisfied ${goal}`)
        }
    },

    removeGoal: async(user, goal) => {
        
        let record = await goals.readGoal(user, goal);
        if (record) {
            await goals.deleteGoal(user, goal);
            console.log(`[Goals] User ${user} Deleted ${goal}`)
        }
    }
}

module.exports = kafkaInterop