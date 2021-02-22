
(function (TLA) {
    TLA.verbs = {
        /**
         * Indicates that the learning activity requirements were met by means other than completing the activity. 
         * 
         * A waived statement is used to indicate that the activity may be skipped by the actor.
         */
        "waived": {
            "id": "https://w3id.org/xapi/adl/verbs/waived",
            "display": {
                "en-US": "waived"
            }
        },
        /**
         * Indicates the user started a service. This does not always need to be a specific 
         * activity but can be a service provider as well.
         */
        "launched": {
            "id": "https://adlnet.gov/expapi/verbs/launched",
            "display": {
                "en-US": "launched"
            }
        },
        /**
         * Indicates the actor finished or concluded the activity normally
         */
        "completed": {
            "id": "https://adlnet.gov/expapi/verbs/completed",
            "display": {
                "en-US": "completed"
            }
        },
        /**
         * Indicates the actor completed an activity to standard
         */
        "passed": {
            "id": "https://adlnet.gov/expapi/verbs/passed",
            "display": {
                "en-US": "passed"
            }
        },
        /**
         * Indicates the actor did not complete an activity to standard
         */
        "failed": {
            "id": "https://adlnet.gov/expapi/verbs/failed",
            "display": {
                "en-US": "failed"
            }
        },
        /**
         * Indicates that the authority or activity provider determined the actor has fulfilled the 
         * criteria of the object or activity by means other than completing the activity
         */
        "satisfied": {
            "id": "https://w3id.org/xapi/adl/verbs/satisfied",
            "display": {
                "en-US": "satisfied"
            }
        },
        /**
         * Indicates that the AU session was abnormally terminated by a learner's action (or due to a system failure)
         */
        "abandoned": {
            "id": "https://w3id.org/xapi/adl/verbs/abandoned",
            "display": {
                "en-US": "abandoned"
            }
        },
        /**
         * Indicates the actor has completed their session normally
         */
        "terminated": {
            "id": "https://adlnet.gov/expapi/verbs/terminated",
            "display": {
                "en-US": "terminated"
            }
        },
        /**
         * Indicates that the activity was started.
         */
        "initialized": {
            "id": "https://adlnet.gov/expapi/verbs/initialized",
            "display": {
                "en-US": "initialized"
            }
        },
        /**
         * Indicates the learner was given the recommendation to follow a career path, work towards a 
         * learning objective, or perform a learning activity by the actor
         */
        "recommended": {
            "id": "https://w3id.org/xapi/tla/verbs/recommended",
            "display": {
                "en-US": "recommended"
            }
        },
        /**
         * Indicates the actor filtered goals associated with select content, usually listing what 
         * competencies are demonstrated in recently viewed content
         */
        "prioritized": {
            "id": "https://w3id.org/xapi/tla/verbs/prioritized",
            "display": {
                "en-US": "prioritized"
            }
        },
        /**
         * Indicates the actor filtered content that aligns to specific goal
         */
        "organized": {
            "id": "https://w3id.org/xapi/tla/verbs/organized",
            "display": {
                "en-US": "organized"
            }
        },
        /**
         * Indicates the actor was presented a list of activity recommendations over time, based on selected goal 
         * with recursive depth, and on learner preferences, what set of content will achieve mastery in the ordered sub-goals
         */
        "curated": {
            "id": "https://w3id.org/xapi/tla/verbs/curated",
            "display": {
                "en-US": "curated"
            }
        },
        /**
         * Indicates the actor was presented a list of goal recommendations over time, based on selected goal with recursive 
         * depth, what set of content can achieve mastery in the ordered sub-goals
         */
        "projected": {
            "id": "https://w3id.org/xapi/tla/verbs/projected",
            "display": {
                "en-US": "projected"
            }
        },
        /**
         * Indicates that the actor assigned themselves a new learning goal, without needing approval
         */
        "planned": {
            "id": "https://w3id.org/xapi/tla/verbs/planned",
            "display": {
                "en-US": "planned"
            }
        },
        /**
         * Indicates the actor needed or demanded an object or another actor. Requested indicates a comment that is shared 
         * with peers as a group or Coach as a trainer. The request for coaching or help prompts users to respond giving them coaching credit
         */
        "requested": {
            "id": "https://w3id.org/xapi/adb/verbs/requested",
            "display": {
                "en-US": "requested"
            }
        },
        /**
         * Indicates an OICS approved a requested activity for the given learner
         */
        "approved": {
            "id": "https://w3id.org/xapi/tla/verbs/approved",
            "display": {
                "en-US": "approved"
            }
        },
        /**
         * Indicates the actor searched content on an active learning goal, viewing what other goals/branches can be related 
         * based on an active goal tree
         */
        "augmented": {
            "id": "https://w3id.org/xapi/tla/verbs/augmented",
            "display": {
                "en-US": "augmented"
            }
        },
        /**
         * Indicates the actor searched active learning goals related to specific content, viewing what other content may 
         * trigger related goals, based on active goal and recently completed content
         */
        "explored": {
            "id": "https://w3id.org/xapi/tla/verbs/explored",
            "display": {
                "en-US": "explored"
            }
        },
        /**
         * Indicates the actor queried what other content may also reinforce the current learning goal, after completing content
         */
        "clarified": {
            "id": "https://w3id.org/xapi/tla/verbs/clarified",
            "display": {
                "en-US": "clarified"
            }
        },
        /**
         * Indicates the actor assigned a learning goal to a learner
         */
        "directed": {
            "id": "https://w3id.org/xapi/tla/verbs/directed",
            "display": {
                "en-US": "directed"
            }
        },
        /**
         * Indicates the actor scheduled an activity or lesson
         */
        "scheduled": {
            "id": "https://w3id.org/xapi/tla/verbs/scheduled",
            "display": {
                "en-US": "scheduled"
            }
        },
        /**
         * Indicates the learner(s) appeared in a Measure of Effectiveness (MOE) search
         */
        "evaluated": {
            "id": "https://w3id.org/xapi/tla/verbs/evaluated",
            "display": {
                "en-US": "evaluated"
            }
        },
        /**
         * Indicates the learner(s) appeared in a competency search
         */
        "tracked": {
            "id": "https://w3id.org/xapi/tla/verbs/tracked",
            "display": {
                "en-US": "tracked"
            }
        },
        /**
         * Indicates the learner(s) appeared in a Measure of Performance (MOP) search
         */
        "surveyed": {
            "id": "https://w3id.org/xapi/tla/verbs/surveyed",
            "display": {
                "en-US": "surveyed"
            }
        },
        /**
         * Indicates the actor completed assessments in a way that will cause a change in their authoritative learner state
         */
        "assessed": {
            "id": "https://w3id.org/xapi/tla/verbs/assessed",
            "display": {
                "en-US": "assessed"
            }
        },
        /**
         * Indicates the user performed several connected learning activities that should result in a change in their authoritative learner state
         */
        "contextualized": {
            "id": "https://w3id.org/xapi/tla/verbs/contextualized",
            "display": {
                "en-US": "contextualized"
            }
        },
        /**
         * Indicates the actor's competency state needs to be updated based on completed content changes in the Competency Framework
         */
        "located": {
            "id": "https://w3id.org/xapi/tla/verbs/located",
            "display": {
                "en-US": "located"
            }
        },
        /**
         * Indicates the learner interacted with \"Wild\" (unscheduled) content in a social environment
         */
        "socialized": {
            "id": "https://w3id.org/xapi/tla/verbs/socialized",
            "display": {
                "en-US": "socialized"
            }
        },
        /**
         * Indicates the learner interacted with \"Wild\" (unscheduled) content in a social environment
         */
        "captured": {
            "id": "https://w3id.org/xapi/tla/verbs/captured",
            "display": {
                "en-US": "captured"
            }
        },
        /**
         * Indicates the learner has provided sufficient evidence to update the learner's measure of competence in a given competency
         */
        "asserted": {
            "id": "https://w3id.org/xapi/tla/verbs/asserted",
            "display": {
                "en-US": "asserted"
            }
        },
        /**
         * Indicates an OICS approved a change to a competency framework within the TLA that will affect the learners' states
         */
        "validated": {
            "id": "https://w3id.org/xapi/tla/verbs/validated",
            "display": {
                "en-US": "validated"
            }
        },
        /**
         * AUTHORITATIVE VERB.
         * 
         * Indicates an authoritative source changed a learner's competency assertions based on a valid competency framework change
         */
        "inferred": {
            "id": "https://w3id.org/xapi/tla/verbs/inferred",
            "display": {
                "en-US": "inferred"
            }
        },
        /**
         * Indicates the learner meets all the requirements for a badge, but hasn't been awarded the badge yet
         */
        "qualified": {
            "id": "https://w3id.org/xapi/tla/verbs/qualified",
            "display": {
                "en-US": "qualified"
            }
        },
        /**
         * AUTHORITATIVE VERB.
         * 
         * Indicates the learner received an accreditation by an authoritative source to perform a given job or task
         */
        "certified": {
            "id": "https://w3id.org/xapi/tla/verbs/certified",
            "display": {
                "en-US": "certified"
            }
        },
        /**
         * AUTHORITATIVE VERB.
         * 
         * Indicates the authoritative source verified evidence of learning from a non-authoritative source as reliable data
         */
        "verified": {
            "id": "https://w3id.org/xapi/tla/verbs/verified",
            "display": {
                "en-US": "verified"
            }
        },
        /**
         * Indicates the OICS conferred a badge to the learner in the learner context extension
         */
        "conferred": {
            "id": "https://w3id.org/xapi/tla/verbs/conferred",
            "display": {
                "en-US": "conferred"
            }
        },
        /**
         * Indicates the actor recruited the learner to join the ecosystem
         */
        "recruited": {
            "id": "https://w3id.org/xapi/tla/verbs/recruited",
            "display": {
                "en-US": "recruited"
            }
        },
        /**
         * Indicates the learner met entry criteria for jobs and assigned a career trajectory
         */
        "appraised": {
            "id": "https://w3id.org/xapi/tla/verbs/appraised",
            "display": {
                "en-US": "appraised"
            }
        },
        /**
         * OICS detailed the learner to a specific job
         */
        "detailed": {
            "id": "https://w3id.org/xapi/tla/verbs/detailed",
            "display": {
                "en-US": "detailed"
            }
        },
        /**
         * OICS mobilized the learner to a state of on duty
         */
        "mobilized": {
            "id": "https://w3id.org/xapi/tla/verbs/mobilized",
            "display": {
                "en-US": "mobilized"
            }
        },
        /**
         * OICS employs the actor such that they started work doing their job
         */
        "employed": {
            "id": "https://w3id.org/xapi/tla/verbs/employed",
            "display": {
                "en-US": "employed"
            }
        },
        /**
         * OICS has enrolled the learner in a schooling system
         */
        "schooled": {
            "id": "https://w3id.org/xapi/tla/verbs/schooled",
            "display": {
                "en-US": "schooled"
            }
        },
        /**
         * OICS has changed a learner's rank, either up or down
         */
        "promoted": {
            "id": "https://w3id.org/xapi/tla/verbs/promoted",
            "display": {
                "en-US": "promoted"
            }
        },
        /**
         * OICS screened learner for a potentially narrower career trajectory, and passed through a "gate" within their career trajectory
         */
        "screened": {
            "id": "https://w3id.org/xapi/tla/verbs/screened",
            "display": {
                "en-US": "screened"
            }
        },
        /**
         * OICS selected learner based on criteria for a potentially wider career trajectory, opening up new career possibilities
         */
        "selected": {
            "id": "https://w3id.org/xapi/tla/verbs/selected",
            "display": {
                "en-US": "selected"
            }
        },
        /**
         * Indicates the actor changed career paths, putting them on a completely different and brand new career trajectory
         */
        "reclassified": {
            "id": "https://w3id.org/xapi/tla/verbs/reclassified",
            "display": {
                "en-US": "reclassified"
            }
        },
        /**
         * Indicates OICS released the learner from the learning environment
         */
        "released": {
            "id": "https://w3id.org/xapi/tla/verbs/released",
            "display": {
                "en-US": "released"
            }
        },
        /**
         * Indicates OICS temporarily restricted the learner from some (possibly all) participation within the learning environment
         */
        "restricted": {
            "id": "https://w3id.org/xapi/tla/verbs/restricted",
            "display": {
                "en-US": "restricted"
            }
        },
    }
}(window.TLA = window.TLA || {}));