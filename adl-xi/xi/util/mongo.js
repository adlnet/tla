const MongoClient = require("mongodb").MongoClient;
const mongodb = require("mongodb");
const assert = require('assert');
const config = require("../config");
const { mongo } = require("../config");

// Connection URL.
const url = `mongodb://${config.mongo.host}:27017`;
const dbName = config.mongo.db;
const collectionName = config.mongo.collection;

/**
 * @type {mongodb.Db}
 */
var db;

module.exports = {
    init: async (collections) => new Promise((resolve, _) => {
        MongoClient.connect(url, async function (err, client) {
            assert.equal(null, err);
            console.log("Connected successfully to MongoDB server.");

            db = await client.db(dbName);
            db.createCollection(collectionName, function (err, res) {
                if (err) throw err;
                console.log("Collection  '" + collectionName + "'  created!");
            });
            resolve(true);
        });
    }),

    get: async (options, competency, content) => new Promise((resolve, _) => {

        let filter = {}
        let onlyExact = config.mongo.exactMatching

        if (competency)
            filter.educationalAlignment = {
                $elemMatch: {
                    competency: (onlyExact) ? {$eq: competency} : {$regex: `.*${competency}.*`}
                }
            }
        if (content)
            filter.url = (onlyExact) ? {$eq: content} : {$regex: `.*${content}.*`}

        console.log(filter);

        db.collection(collectionName)
            .find(filter, options).toArray(function (err, res) {
                console.log("Got records:", res);
                resolve(res);
            });
    }),

    getUnique: async(id) => new Promise((resolve, _) => {

        db.collection(collectionName).findOne({_id: new mongodb.ObjectID(id) }, function (err, res) {
            if (err) throw err;

            console.log("Found document: ", res);
            resolve(res);
        });
    }),

    post: async (data, overwrite) => new Promise((resolve, _) => {

        if (overwrite) {
            console.log("\n\noverwrite")
            db.collection(collectionName).deleteMany({});
        }
        
        console.log("\n\nadd")
        db.collection(collectionName).insertMany(data, function (err, res) {
            if (err) throw err;
            console.log("Number of documents inserted: " + res.insertedCount);
            resolve(res);
        });
    }),

    put: async (id, data) => new Promise((resolve, _) => {
        
        let query = id ? {_id: new mongodb.ObjectID(id) } : {}
        let body = {...data}

        delete body._id

        let payload = { $set: body };

        db.collection(collectionName).updateOne(query, payload, {upsert: true}, function (err, res) {
            if (err) throw err;
            console.log("1 document updated");
            resolve(res);
        });
    }),

    delete: async (id) => new Promise((resolve, _) => {
        db.collection(collectionName).deleteOne({_id: new mongodb.ObjectID(id) }, function (err, res) {
            if (err) throw err;
            console.log("1 document deleted");
            resolve(res);
        });
    }),
}