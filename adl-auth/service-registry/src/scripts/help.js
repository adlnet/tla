// Background code for the Help page.
//
// This page is mainly to provide information on using the API and provide examples
// on how the information needs to be submitted and how it will be returned.
//
var helpElements = window.helpElements ||  {
    // Buttons to query the /endpoints path and print whatever it returns
    exampleGetEndpointsButton: window.$("#exampleGetEndpointsButton"),
    examplePostEndpointsButton: window.$("#examplePostEndpointsButton"),
    examplePostBadEndpointsButton: window.$("#examplePostBadEndpointsButton"),

    // <samp> Bootstrap element to mirror computer output and keep things uniform
    exampleGetEndpointsOutput: window.$("#exampleGetEndpointsOutput"),
    examplePostEndpointsOutput: window.$("#examplePostEndpointsOutput"),
    examplePostBadEndpointsOutput: window.$("#examplePostBadEndpointsOutput"),

    // Old format buttons
    exampleGetOldJsonEndpointButton: window.$("#exampleGetOldJsonEndpointButton"),
    exampleGetOldPlainEndpointButton: window.$("#exampleGetOldPlainEndpointButton"),
    exampleGetOldJsonNameButton: window.$("#exampleGetOldJsonNameButton"),
    exampleGetInvalidOldEndpointsButton: window.$("#exampleGetInvalidOldEndpointsButton"),

    // Old format outputs
    exampleGetOldJsonEndpointOutput: window.$("#exampleGetOldJsonEndpointOutput"),
    exampleGetOldPlainEndpointOutput: window.$("#exampleGetOldPlainEndpointOutput"),
    exampleGetOldJsonNameOutput: window.$("#exampleGetOldJsonNameOutput"),
    exampleGetInvalidOldEndpointsOutput: window.$("#exampleGetInvalidOldEndpointsOutput"),
}

// Don't allow spamming
var waitingForExampleGet = false;
var waitingForExamplePost = false;

// GET Example logic
function exampleGet() {

    // Mark that we've started
    waitingForExampleGet = true;

    // Make a promise chain to get our registered services
    fetch("/registry/endpoints", {
        method: "GET",
        headers: {
            Accept: "application/json",
        }
    })
    .then( response => response.json())
    .then( services => {

        // Whatever we just got will need to go into the output element
        helpElements.exampleGetEndpointsOutput.text( JSON.stringify(services, null, 2));
    });

    waitingForExampleGet = false;
}

// POST Example  (Valid)
function examplePost() {

    // Mark that we've started
    waitingForExamplePost = true;

    // Make a promise chain to get our registered services
    fetch("/registry/endpoints", {
        method: "POST",
        headers: {
            Accept: "application/json",
            "X-TLA-SERVICE-NAME": "tla_example",
            "X-TLA-SERVICE-IP": "example.tla.gov",
            "X-TLA-SERVICE-PORT": "5432",
            "X-TLA-POST-KEY": window.checkKey(),
        }
    })
    .then( response => response.json())
    .then( services => {

        waitingForExamplePost = false;

        // Whatever we just got will need to go into the output element
        helpElements.examplePostEndpointsOutput.text( JSON.stringify(services, null, 2));
    })
    .catch( error => {
        
        console.log(error);
    });
}

// POST Example  (Bad)
function examplePostBad() {

    // Mark that we've started
    waitingForExamplePost = true;

    // Make a promise chain to get our registered services
    fetch("/registry/endpoints", {
        method: "POST",
        headers: {
            Accept: "application/json",
            "X-TLA-SERVICE-NAME": "BAD_ENDPOINT_CODE",
            "X-TLA-POST-KEY": window.checkKey(),
        }
    })
    .then( response => response.json())
    .then( services => {

        // Whatever we just got will need to go into the output element
        helpElements.examplePostBadEndpointsOutput.text( JSON.stringify(services, null, 2));
    });

    waitingForExamplePost = false;
}

// Template for the Old system Gets
function exampleOldGet(url, contentType, outputText) {

    console.log("calling old get:", url, contentType, outputText);

    // Make a promise chain to get our registered services
    fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": contentType,
            Accept: contentType,
        }
    })
    .then( response => response.text())
    .then( responseText => {

        console.log(responseText);

        // Whatever we just got will need to go into the output element
        outputText.text(responseText);
    });
}

// Get Endpoints with new system
helpElements.exampleGetEndpointsButton.click(function(){
    if (waitingForExampleGet)
        return;
    exampleGet();
});

// Post Endpoints
helpElements.examplePostEndpointsButton.click(function(){
    if (waitingForExamplePost)
        return;
    examplePost();
});
helpElements.examplePostBadEndpointsButton.click(function(){
    if (waitingForExamplePost)
        return;
    examplePostBad();
});

// Get Endpoints with old system
helpElements.exampleGetOldJsonEndpointButton.click(function(){
    exampleOldGet("/registry/list/lrs/endpoint", "application/json", helpElements.exampleGetOldJsonEndpointOutput);
});
helpElements.exampleGetOldPlainEndpointButton.click(function(){
    exampleOldGet("/registry/list/lrs/endpoint", "text/plain", helpElements.exampleGetOldPlainEndpointOutput);
});
helpElements.exampleGetOldJsonNameButton.click(function(){
    exampleOldGet("/registry/list/lrs/name", "application/json", helpElements.exampleGetOldJsonNameOutput);
});
helpElements.exampleGetInvalidOldEndpointsButton.click(function(){
    exampleOldGet("/registry/list/bad-service/endpoint", "application/json", helpElements.exampleGetInvalidOldEndpointsOutput);
});