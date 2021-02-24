const fs = require("fs")
const chai = require("chai");
const sqlite = require("sqlite3").verbose()

const expect = chai.expect;

const TestModel = require("./models/TestLoggingModel")

describe("CRUD Operations", () => {

    let time = "2020-06-08T20:43:03Z"
    let dbPath = __dirname + "/log-test.db";

    if (fs.existsSync(dbPath))
        fs.unlinkSync(dbPath)

    const db = new sqlite.Database(dbPath, sqlite.OPEN_READWRITE | sqlite.OPEN_CREATE, err => {if (err) console.error(err)});
    const model = new TestModel();

    before(async() => {
        await model.init(db);
    })

    it("should allow READ", async() => {
        let records = await model.select("*")
        expect(records).to.be.an("Array")
    })

    it("Should allow CREATE", async() => {
        let records = await model.select("*")
        let previousCount = records.length

        await model.insert({
            [model.int]: 1,
            [model.real]: 3.14,
            [model.string]: "SOME STRING",
            [model.boolean]: true,
            [model.array]: [123, 1 ,"hello", ["nested"], {obj: "value"}],
        })
        records = await model.select("*")

        expect(previousCount).to.eql(records.length - 1)
    })

    it ("Should reject bad INSERTS", async() => {
        try {
            await model.insert({
                [model.int]: 1,
                [model.real]: 3.14,
                [model.date]: "SOME BAD DATE"
            })
        }
        catch (error) {            
            if (error instanceof TypeError) {} else {
                throw Error("Either Accepted or Rejected Unexpectedly");
            }
        }
    });

    it ("Should allow UPDATE", async() => {
        let records = await model.select("*", 1)
        let recordToUpdate = records[0]
        
        let random = Math.random()
        recordToUpdate.real = random

        await model.update(recordToUpdate, { where: [`id = ${recordToUpdate.id}`]})

        records = await model.select("*")
        let hopefullyUpdatedRecord = records[0]

        expect(hopefullyUpdatedRecord.real).to.eql(random)
    })

    it ("Should failed bad UPDATE", async() => {
        
        let records = await model.select("*", {
            limit: 1
        })
        let recordToUpdate = records[0]
        let props = { ...recordToUpdate, [model.date]: "SOME BAD DATE"}

        try {
            await model.update(props, { 
                where: [`id = ${recordToUpdate.id}`]
            })
        }
        catch (error) { }
        
        records = await model.select("*", {
            limit: 1, 
            where: [`id = ${recordToUpdate.id}`]
        })

        let hopefullyUnchangedRecord = records[0]

        expect(recordToUpdate.date).to.eql(hopefullyUnchangedRecord.date)
    })
    

    it ("Should allow DELETE", async() => {
        await model.insert({string: "DELETE ME"})
        
        let records = await model.select("*", {
            limit: 1,
            order: "id DESC"   
        })
        let recordToDelete = records[0]

        let deleteArgs = {
            where: [`id = ${recordToDelete.id}`]
        }
        await model.delete(deleteArgs)
        records = await model.select("*", deleteArgs)

        expect(records.length).to.eql(0)
    })

    it ("Should failed bad DELETE", async() => {
        
        try {
            await model.delete()
            throw Error("DIDN'T STOP THIS");
        } catch (err) {
            if (err instanceof TypeError) {} else {
                throw Error("Failed");
            }
        }
    })

    it ("Should work with the virtual REFACTOR type", async() => {
        await model.insert({string: "I HAVE VIRTUAL"})

        let records = await model.select("*")
        expect(records).to.be.an("Array")
    });

    it ("Should reject bad INSERTs per the predefined ARRAY rule", async() => {
        
        try {
            await model.insert({
                arrayLimited: ["a", "b", "c", "d", "e"]
            })
            throw Error("DIDN'T STOP THIS");
        } catch (err) {
            if (err instanceof TypeError) {} else {
                throw Error("Failed");
            }
        }
    })

    it ("Should store updated properties in the model's log", async() => {

        let inserts = await model.insert({ [model.int]: 1 })
        let updates = await model.update({ [model.int]: 2 }, { where: [`id=${inserts[0]}`]})

        let records = await model.select("*", { where: [`id=${inserts[0]}`], limit: 1})

        let logs = await model.logModel.select("*", {
            where: [`record=${records[0].id}`],
            order: "id desc"
        })
        let changes = logs.map(record => JSON.parse(record.payload))

        expect(changes[0].int).to.equal(2);
        expect(changes[1].int).to.equal(1);
    })
});