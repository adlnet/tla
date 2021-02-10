// This script will set up some background logic to run on the main page.
//
// We will mainly be updating the table of endpoints and this will be required
// to know when an endpoint is no longer reachable OR to confirm that an endpoint
// is available after restarting the server.
//
var indexElements = window.indexElements || {
    // Main table of each service
    serviceTableBody: window.$("#serviceTableBody"),

    // Placeholder to show in case we don't have anything registered yet
    servicePlaceholder: window.$("#servicePlaceholder"),

    // Placeholder to show in case we don't have anything registered yet
    servicePlaceholderInitial: window.$("#servicePlaceholderInitial"),

    // Button to refresh the services table
    refreshTableButton: window.$("#refreshTableButton"),
}

// Also, make sure we don't refresh too often
var waitingForServer = false;

// Rather than wrangle the weird jquery objects, we'll just rewrite the table entries 
function addServiceToTable(service)
{
    // We'll add these explicitly.  This works because the extension method `formatUnicorn`
    // takes a json object and substitutes the keywords used in the format string with 
    // fields of the object provided.  
    //
    // Modify the last checked value first
    if (service.lastChecked !== "")
        service.lastChecked = new Date(parseInt(service.lastChecked)).toLocaleTimeString();

    if (!service.name || !service.endpoint)
        return;

    // If this endpoint is navigable, then make it a link.  Ignore ugly syntax
    let endpointElement = "<td>{endpoint}</td>";
    if (service.endpoint.indexOf("http") >= 0) 
        endpointElement = `<td><a target="_blank" href="{endpoint}">{endpoint}</a></td>`;

    // In this case, our server returned json objects from a class called Service with 
    // fields matching those specified here. 
    // 
    indexElements.serviceTableBody.append((`
        <tr>
            <td scope="row">{name}</td>
            <td>{ip}</td>
            <td>{port}</td>
            <td>{status}</td>
            <td>{lastChecked}</td>`
            + endpointElement +
            `
        </tr>`).formatUnicorn(service)
    );
}

// Clear the table entries
function clearServiceTable()
{
    // Just do this with jquery
    indexElements.serviceTableBody.empty();
}

// Check the server for services.  This will start a promise chain
// that will update our ui elements
function checkServer() {

    // After the timer has passed, hide the initial window
    indexElements.servicePlaceholderInitial.hide();
    indexElements.serviceTableBody.hide();

    // Make a promise chain to get our registered services
    fetch("/registry/endpoints", {
        method: "GET",
        headers: {
            Accept: "application/json",
        }
    })
    .then( response => response.json())
    .then( services => {

        // Keep track of how many we have here
        let serviceCount = 0;

        // Clear our current table
        clearServiceTable();

        // If we have services registered, update the table
        for (var service in services) {
            if (services.hasOwnProperty(service)) {

                // Add this to the table
                addServiceToTable(services[service]);

                // Update the counter
                serviceCount++;
            }
        }

        // If we have services registered, update the table
        if (serviceCount > 0) {
            
            // Hide the placeholder
            indexElements.serviceTableBody.show();
            indexElements.servicePlaceholder.hide();

        } else {

             // Show the placeholder
             indexElements.servicePlaceholder.show();
             indexElements.serviceTableBody.hide();
        }
    });

    // Once all of that is handled, allow another check
    waitingForServer = false;
}

// If things run immediately, it can be difficult to see that something has happened.
// We'll add a small delay to this so that the user will know that the http request
// has executed, even when nothing changes.
function checkServerDelayed() {

    // Check that we're not already waiting for something
    if (waitingForServer)
        return;
    
    // Mark that we're checking the server
    waitingForServer = true;

    // Hide our elements and show the initial placeholder
    indexElements.serviceTableBody.hide();
    indexElements.servicePlaceholder.hide();
    indexElements.servicePlaceholderInitial.show();

    setTimeout(checkServer, 1000);
}

// Assign that function to our refresh button
indexElements.refreshTableButton.click("click", checkServerDelayed);

// Start off by checking this
checkServerDelayed();