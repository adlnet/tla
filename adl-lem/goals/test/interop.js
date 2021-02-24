const fs = require("fs")
const chai = require("chai");
const expect = chai.expect;
const sqlite = require("sqlite3").verbose()

const goals = require("../lib/goal-gb");
const kafkaInterop = require("../lib/kafka");


describe("Kafka Interop", () => {

    let dbPath = __dirname + "/test.db";
    let user = "user1234"

    let time = "2020-06-08T20:43:03Z"

    if (fs.existsSync(dbPath))
        fs.unlinkSync(dbPath)

    before(async() => {
        
        await new Promise((resolve, reject) => {
            goals.init(dbPath, error => {
                if (error) reject(error)
                else resolve()
            })
        })
    })

    it("Activation should not add a new goal if that same one already exists", async() => {

        await kafkaInterop.activateGoal(user, "goal1", time)
        await kafkaInterop.activateGoal(user, "goal1", time)

        let records = await goals.readGoals(user)
        expect(records.length).to.equal(1);
    })

    it("Activation should only disable unsatisfied goals", async() => {

        await goals.createGoal(user, "goal2.1", time, goals.typeEnum.competency, goals.statusEnum.active)
        await goals.createGoal(user, "goal2.2", time, goals.typeEnum.competency, goals.statusEnum.satisfied)

        await kafkaInterop.activateGoal(user, "goal2.3")

        let previouslyActive = await goals.readGoal(user, "goal2.1")
        let previouslySatisfied = await goals.readGoal(user, "goal2.2")

        expect(previouslyActive.status).to.equal(goals.statusEnum.inactive)
        expect(previouslySatisfied.status).to.equal(goals.statusEnum.satisfied)        
    })

    it("Satisfy should work", async() => {
        
        await goals.createGoal(user, "goal3", time, goals.typeEnum.competency, goals.statusEnum.active)
        await kafkaInterop.satisfyGoal(user, "goal3", time)
        
        let goal = await goals.readGoal(user, "goal3",)
        expect(goal.status).to.equal(goals.statusEnum.satisfied)
    })
    
    it("Removal should work", async() => {
        
        await goals.createGoal(user, "goal4", time, goals.typeEnum.competency, goals.statusEnum.active)
        await kafkaInterop.removeGoal(user, "goal4")
        
        let goal = await goals.readGoal(user, "goal4")
        expect(goal == undefined).to.equal(true);
    })
})