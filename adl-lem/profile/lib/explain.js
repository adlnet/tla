const axios = require("axios").default
const btoa = require("btoa");
const mom = require("tla-mom-proto");
const config = require("../config");

let getAssertions = async(uuid, competency) => {

    let agent = {
        account: {
            name: uuid,
            homePage: config.keycloak["auth-server-url"]
        }
    }

    let queryActor = `agent=${encodeURIComponent(JSON.stringify(agent))}`
    let queryVerb = `verb=${encodeURIComponent(mom.verbs.asserted.id)}`
    let queryCompetency = `activity=${encodeURIComponent(competency)}`
    let queryLimit = `limit=10`

    let query = `?${queryActor}&${queryVerb}&${queryCompetency}&${queryLimit}`

    let assertions = []

    let promises = config.lrsPool.map(lrs => {
        return axios.get(lrs.endpoint + "/statements" + query, {
            headers: {
                "Authorization": "Basic " + btoa(`${lrs.user}:${lrs.pass}`),
                "Content-Type": "application/json",
                "X-Experience-API-Version": "1.0.3"
            }
        })
    })

    let responses = await Promise.all(promises)
    for (let res of responses) {
        if (res != undefined && Array.isArray(res.data.statements))
            assertions = [...assertions, ...res.data.statements]
    }

    return assertions
}

module.exports = async(uuid) => {

    let res = await axios.get(config.endpoints.competencies + `/api/read?user=${uuid}&secret=${config.secret}`).catch(console.error)
    if (res == undefined || res.data == undefined) 
        return { message: "Unable to find competencies."}

    // Map each competency URI to the statement history we got for it.
    let explanation = []
    let comps = res.data

    for (let comp of comps)
        explanation.push({
            competency: comp,
            assertions: await getAssertions(uuid, comp.competencyID)
        })

    return explanation;
}