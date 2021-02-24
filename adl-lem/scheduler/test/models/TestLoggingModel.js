const sqliter = require("sqliter-models");
const LoggingModel = require("../../lib/models/loggingModel");

const types = sqliter.types;

class TestModel extends LoggingModel
{
    
    get id() { return "id" }
    get int() { return "int" }
    get string() { return "string" }
    get real() { return "real" }
    get date() { return "date" }
    get boolean() { return "boolean" }
    get array() { return "array" }

    constructor() {
        super()

        this.name = "testModel"
        this.define({
            id: {
                name: "id",
                type: types.AUTO_ID,
                description: "Auto-ID",
            },
            string: {
                name: "string",
                type: types.TEXT,
                default: "",
                description: "Sample text field.",
                required: true,
            }, 
            int: {
                name: "int",
                type: types.INTEGER,
                default: 0,
                description: "Sample int field.",
            },
            real: {
                name: "real",
                type: types.REAL,
                default: 3.14,
                description: "Sample float field.",
            },
            date: {
                name: "date",
                type: types.ISO_DATE,
                default: Date.now(),
                description: "Sample date field (stored as a number).",
            },
            array: {
                name: "array",
                type: types.ARRAY(),
                default: [],
                description: "An array with mixed entries.",
            },
            arrayLimited: {
                name: "arrayLimited",
                type: types.ARRAY({
                    predefined: ["a", "e", "i", "o", "u"]
                }),
                default: [],
                description: "An array with predefined entries.",
            },
            boolean: {
                name: "boolean",
                type: types.BOOL,
                default: 0
            },
            virtual: {
                name: "virtual",
                type: types.REFACTOR(obj => `https://check.my.uri/${obj.id}`)
            }
        })
    }
}

module.exports = TestModel