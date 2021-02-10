// Background logic for the export page.
//
var exportElements = window.exportElements || {
    
    exportConfigNameInput: window.$("#exportConfigNameInput"),

    exportDownloadLinkINI: window.$("#exportDownloadLinkINI"),
    exportDownloadLinkJSON: window.$("#exportDownloadLinkJSON"),
}

// We'll update the download name whenever the text changes.  This should 
// remove the chance of running this through the actual download click
// and having to manage which events fired when.
//
exportElements.exportConfigNameInput.change(function() {

    // Check what the input's value currently is
    let configName = $(this).val();
    
    // Check if there's any interesting text for our input field
    if (configName.trim() !== "") 
        updateDownloadName(configName);
    
    else 
        updateDownloadName("tla-config");
});

// Sanity
function updateDownloadName(name) {
    exportElements.exportDownloadLinkINI.attr("download", name + ".ini");
    exportElements.exportDownloadLinkJSON.attr("download", name + ".json");
}

// Default this, as we won't change it automatically until a change() event
updateDownloadName("tla-config");

window.exportElements = exportElements;