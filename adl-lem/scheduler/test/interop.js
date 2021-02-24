const fs = require("fs")
const chai = require("chai");
const expect = chai.expect;
const sqlite = require("sqlite3").verbose()

const kafkaInterop = require("../lib/kafka");
const models = require("../lib/models")
const enums = require("../lib/enums")

describe("Kafka Interop", () => {

    let dbPath = __dirname + "/interop-test.db";
    
    if (fs.existsSync(dbPath))
        fs.unlinkSync(dbPath)

    let user = "user1234"
    let time = "2020-06-08T20:43:03Z"

    const db = new sqlite.Database(dbPath, sqlite.OPEN_READWRITE | sqlite.OPEN_CREATE, err => {if (err) console.error(err)});
    
    before(async() => {
        await models.init(db);
    })

    it("AddTask should not add a new task if that same one already exists", async() => {

        await kafkaInterop.addTask(user, "task1", time)
        await kafkaInterop.addTask(user, "task1", time)

        let records = await models.tasks.select("*", {where: [`user=${user}`]})
        expect(records.length).to.equal(1);
    })

    it("AddTask should allow a new task if a duplicate has been completed", async() => {

        let taskName = `task_${Math.random()}`

        await kafkaInterop.addTask(user, taskName, time)
        await kafkaInterop.editTask(user, taskName, time, enums.taskStatusEnums.completed)
        
        await kafkaInterop.addTask(user, taskName, time)

        let records = await models.tasks.select("*", {where: [
            `user=${user}`, 
            `uri=${taskName}`, 
            `status<>${enums.taskStatusEnums.completed}`]
        })

        expect(records.length).to.equal(1);
    })

    it("RemoveTask should remove a task when provided with an 'id'", async() => {

        let added = await kafkaInterop.addTask(user, "task3", time)
        let deleted = await kafkaInterop.removeTask(user, "task3", added[0])

        expect(JSON.stringify(added)).to.equal(JSON.stringify(deleted));
    })
})