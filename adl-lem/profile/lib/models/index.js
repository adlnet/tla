
const Person = require("./Person");
const RolePersona = require("./RolePersona");
const RoleMembers = require("./RoleMembers");
const InterestGroup = require("./InterestGroup");
const InterestGroupMembers = require("./InterestGroupMembers");

const models = {
    person: new Person(),
    rolePersona: new RolePersona(),
    roleMembers: new RoleMembers(),
    interestGroup: new InterestGroup(),    
    interestGroupMembers: new InterestGroupMembers(),    

    init: async(db) => {
        
        await models.person.init(db);
        await models.rolePersona.init(db);
        await models.interestGroup.init(db);

        await models.roleMembers.init(db);
        await models.interestGroupMembers.init(db);
    },
}

models.objects = Object.keys(models).filter(key => key != "init").map(key => models[key])

module.exports = models;