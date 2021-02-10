// Constants used across this service
//
class ServiceCodeTriple {
    constructor(owner, service, code) {
        this.owner = owner;
        this.service = service;
        this.code = code;
    }
}

// Map defining each service's code
//
var services = {

   // Unused code for example posts
   CODE_EXAMPLE: "tla_example",

   // ADL
   CODE_LRS: "lrs",
   CODE_LOGGING_LRS: "logging_lrs",
   CODE_LAUNCH: "launch",
   CODE_KEYCLOAK: "keycloak",
   CODE_DISCOVERY: "discovery",
   CODE_REGISTRY: "registry",
   CODE_AMQP_FORWARDING: "amqp",
   CODE_STATIC_CONTENT_VIEWER: "static_content_viewer",
   CODE_VIDEO_PLAYER: "video_player",
   CODE_MOODLE: "moodle",
   CODE_PALMS: "palms",
   
   // SoarTech
   CODE_RECOMMENDER_UI: "recommender_ui",
   CODE_RECOMMENDER_UI_SUPPORT: "recommender_ui_support",
   CODE_RECOMMENDER_ENGINE: "recommender_engine",
   CODE_LEARNER_ANALYTICS: "learner_analytics",
   CODE_LEARNER_ANALYTICS_STORE: "learner_analytics_store",
   CODE_LEARNER_INFERENCE: "learner_inference",
   CODE_ACTIVITY_INDEX: "activity_index",
   CODE_ASSESSMENT_QUIZ: "assessment_quiz",
   
   // Eduworks
   CODE_CASS: "cass",
   CODE_PEBL: "pebl",

   // Perigean
   CODE_SERO: "sero",

   // All
   CODE_STATIC_CONTENT: "static_content",


   // Added for 2019
   CODE_PERLS: "perls",
   CODE_ADL: "adl",
   CODE_KAFKA: "kafka",
   CODE_CONTENT: "content",
   CODE_NILE: "nile",
}

// URL templates.  These will be replaced by the IP / Port of each service.
// The goal is to map service codes to these endpoints, then store that fully
// qualified endpoint when the user submits a code / IP / Port.
//
var endpointTemplates = {

    // Replace the IP and Port when we use them
    //
    // Unused
    [services.CODE_EXAMPLE]: "http://{ip}:{port}",

    // ADL
    [services.CODE_LRS]: "http://{ip}:{port}",
    [services.CODE_LOGGING_LRS]: "http://{ip}:{port}",
    [services.CODE_KEYCLOAK]: "http://{ip}:{port}/auth",
    [services.CODE_REGISTRY]: "http://{ip}:{port}/registry",
    [services.CODE_AMQP_FORWARDING]: "http://{ip}:{port}",
    [services.CODE_VIDEO_PLAYER]: "http://{ip}:{port}",
    [services.CODE_STATIC_CONTENT_VIEWER]: "http://{ip}:{port}",
    [services.CODE_MOODLE]: "http://{ip}:{port}",
    [services.CODE_PALMS]: "http://{ip}:{port}",

    // SoarTech
    [services.CODE_RECOMMENDER_UI]: "http://{ip}:{port}",
    [services.CODE_RECOMMENDER_UI_SUPPORT]: "http://{ip}:{port}",
    [services.CODE_RECOMMENDER_ENGINE]: "http://{ip}:{port}",
    [services.CODE_LEARNER_ANALYTICS]: "http://{ip}:{port}",
    [services.CODE_LEARNER_ANALYTICS_STORE]: "http://{ip}:{port}",
    [services.CODE_LEARNER_INFERENCE]: "http://{ip}:{port}",
    [services.CODE_ACTIVITY_INDEX]: "http://{ip}:{port}",
    [services.CODE_ASSESSMENT_QUIZ]: "http://{ip}:{port}",

    // Eduworks
    [services.CODE_CASS]: "http://{ip}:{port}/api",
    [services.CODE_PEBL]: "http://{ip}:{port}",

    // Perigean
    [services.CODE_SERO]: "http://{ip}:{port}",

    // Content
    [services.CODE_STATIC_CONTENT]: "http://{ip}:{port}",

    // Added for 2019
    [services.CODE_PERLS]: "http://{ip}:{port}",
    [services.CODE_ADL]: "http://{ip}:{port}",
    [services.CODE_KAFKA]: "http://{ip}:{port}",
    [services.CODE_CONTENT]: "http://{ip}:{port}",
    [services.CODE_NILE]: "http://{ip}:{port}",
}

// Map grouping possible service statuses.
//
var statusCodes = {

    OK: "OK",
    DOWN: "DOWN",
    OTHER: "OTHER",
    ERROR: "ERROR",
    NOT_IMPLEMENTED: "NOT_IMPLEMENTED",
}

// Various constants using the above groupings and some header simplifications
//
var constants = {

    // Headers
    HEADER_SERVICE_NAME: "X-TLA-SERVICE-NAME",
    HEADER_SERVICE_IP: "X-TLA-SERVICE-IP",
    HEADER_SERVICE_PORT: "X-TLA-SERVICE-PORT",
    HEADER_MACHINE_NAME: "X-TLA-MACHINE-NAME",
    HEADER_MACHINE_IP: "X-TLA-MACHINE-IP",

    // Service Codes
    services: services,

    // Status Codes
    statusCodes: statusCodes,

    // Endpoint Templates
    endpointTemplates: endpointTemplates,

    // Codes to Names
    serviceNameTriples: [
        new ServiceCodeTriple("N/A", "POST Example Service", services.CODE_EXAMPLE),

        new ServiceCodeTriple("ADL", "Primary LRS", services.CODE_LRS),
        new ServiceCodeTriple("ADL", "System Logging LRS", services.CODE_LOGGING_LRS),
        new ServiceCodeTriple("ADL", "AMQP Forwarding", services.CODE_AMQP_FORWARDING),
        new ServiceCodeTriple("ADL", "Discovery Service", services.CODE_DISCOVERY),
        new ServiceCodeTriple("ADL", "Service Registry", services.CODE_REGISTRY),
        new ServiceCodeTriple("ADL", "Launch Service", services.CODE_LAUNCH),
        new ServiceCodeTriple("ADL", "Keycloak Authentication Server", services.CODE_KEYCLOAK),
        new ServiceCodeTriple("ADL", "Video Player", services.CODE_VIDEO_PLAYER),
        new ServiceCodeTriple("ADL", "Static Content Viewer", services.CODE_STATIC_CONTENT_VIEWER),
        new ServiceCodeTriple("ADL", "Moodle", services.CODE_MOODLE),
        new ServiceCodeTriple("ADL", "Palms", services.CODE_PALMS),

        new ServiceCodeTriple("Eduworks", "CASS", services.CODE_CASS),
        new ServiceCodeTriple("Eduworks", "PEBL", services.CODE_PEBL),
        
        new ServiceCodeTriple("SoarTech", "Recommendation UI", services.CODE_RECOMMENDER_UI),
        new ServiceCodeTriple("SoarTech", "Recommendation UI Support", services.CODE_RECOMMENDER_UI_SUPPORT),
        new ServiceCodeTriple("SoarTech", "Recommendation Engine", services.CODE_RECOMMENDER_ENGINE),
        new ServiceCodeTriple("SoarTech", "Learner Analytics", services.CODE_LEARNER_ANALYTICS),
        new ServiceCodeTriple("SoarTech", "Learner Analytics Store", services.CODE_LEARNER_ANALYTICS_STORE),
        new ServiceCodeTriple("SoarTech", "Activity Index", services.CODE_ACTIVITY_INDEX),
        new ServiceCodeTriple("SoarTech", "Assessment Quiz", services.CODE_ASSESSMENT_QUIZ),

        new ServiceCodeTriple("Perigean", "Sero", services.CODE_SERO),
        
        new ServiceCodeTriple("ALL", "Static Content", services.CODE_STATIC_CONTENT),

        // Added for 2019
        new ServiceCodeTriple("ALL", "Perls", services.CODE_PERLS),
        new ServiceCodeTriple("ALL", "ADL", services.CODE_ADL),
        new ServiceCodeTriple("ALL", "Kafka", services.CODE_KAFKA),
        new ServiceCodeTriple("ALL", "Content", services.CODE_CONTENT),
        new ServiceCodeTriple("ALL", "Nile", services.CODE_NILE),
    ],

    // Array of service codes, this is just used for internal convenience
    servicesArray: [],
}

// We'll also have an array with just the values here
//
for (let k=0; k < constants.serviceNameTriples.length; k++) {
    let triple = constants.serviceNameTriples[k];
    constants.servicesArray.push(triple.code);
}

module.exports = constants;
