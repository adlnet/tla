// Background logic for the export page.
//
var importElements = window.importElements || {
    
    // Buttons to select the files
    importSelectINI: window.$("#importSelectINI"),
    importSelectJSON: window.$("#importSelectJSON"),

    // Text of our files
    importStringINI: "",
    importStringJSON: "",

    // <samp> element to show response from server
    importServerResponse: window.$("#importServerResponse"),

    // Alerts for the import status
    importAlertSuccess: window.$("#importAlertSuccess"),
    importAlertError: window.$("#importAlertError"),
    importAlertErrorMessage: window.$("#importAlertErrorMessage"),
}

// Assign our change events for the inputs
//
importElements.importSelectINI.change(function(evt){
    handleFileSelect(evt, ".ini", function(data){
        importElements.importStringINI = data;
        importElements.importSelectINI.val(null);
        
        sendFile("/registry/import/ini", data);
        console.log(data);
    })
});
importElements.importSelectJSON.change(function(evt){
    handleFileSelect(evt, ".json", function(data){
        importElements.importStringJSON = data;
        importElements.importSelectJSON.val(null);
        
        sendFile("/registry/import/json", data);
        console.log(data);
    })
});

// Send data to the server
function sendFile(path, fileData) {

    // Use the fetch system for this
    // Make a promise chain to get our registered services
    fetch(path, {
        method: "POST",
        cache: "no-cache",
        headers: {
            'user-agent': 'Mozilla/4.0 MDN Example',
            'content-type': 'application/json',
            "X-TLA-POST-KEY": window.checkKey(),
        },
        body: JSON.stringify({"data": fileData}),
    })
    .then(function(response) {
        if (!response.ok) {
            throw Error(response.statusText);
        }
        return response;
    })
    .then( response => response.json())
    .then( response => {

        // Show the success message
        importElements.importAlertError.hide();
        importElements.importAlertSuccess.show();
    })
    .catch(function(error) {

        // What to tell them
        var message = error + ", make sure the file you submitted has proper formatting" + 
                        " and that you provided the correct TLA key.\n\n" + 
                        "https://github.com/adlnet/tla-demo-2018/blob/master/adl-launch-server/service-registry/src/tla-key.js";

        // Update our error text to whatever this error was
        importElements.importAlertError.show();
        importElements.importAlertSuccess.hide();
        importElements.importAlertErrorMessage.text(message);
    })
}

// Event that will upload our data to 
function handleFileSelect(evt, expectedType, dataCallback) {
    
    // Make sure this isn't enormous
    let name = event.target.files[0].name;
    let kbSize = event.target.files[0].size / 1024;
    if (kbSize >= 100) {

        let prompt = "The file {name} is quite large ({size} kBs), are you sure you want to use this file?".formatUnicorn({
            name: name,
            size: Math.round(kbSize),
        });
        if (confirm(prompt) !== true) {
            
            dataCallback(undefined);
            return;
        }
    }

    // Make sure we have the right sort of file
    if (name.toLowerCase().endsWith(expectedType) === false) {

        let prompt = "The file {name} was expected to end with {expectedType}, are you sure you want to use this file?".formatUnicorn({
            name: name,
            expectedType: expectedType,
        });
        if (confirm(prompt) !== true) {
            
            dataCallback(undefined);
            return;
        }
    }

    // Use the FileReader object for this
    reader = new FileReader();
    reader.onload = function(event) {
        dataCallback(event.target.result)
    };

    // Read in the image file as a text string.
    reader.readAsText(evt.target.files[0]);
}

window.importElements = importElements;
