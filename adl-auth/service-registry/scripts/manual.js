// Background logic for this dangerous mistake of a page
//
var manualElements = window.manualElements || {

    // Selection control for the dropdown service choices
    manualCodeSelection: window.$("#manualCodeSelection"),

    // Text Inputs for IP and Port
    manualIpInput: window.$("#manualIpInput"),
    manualPortInput: window.$("#manualPortInput"),

    // Button to submit the registration
    manualSubmitButton: window.$("#manualSubmitButton"),
    buttonShowMachines: window.$("#buttonShowMachines"),
    buttonShowResponse: window.$("#buttonShowResponse"),

    // Then a text block to show the post response
    manualPostResponse: window.$("#manualPostResponse"),
    manualMachinePresets: window.$("#manualMachinePresets"),

    // Sections for those areas
    manualResponseSection: window.$("#manualResponseSection"),
    manualMachineSection: window.$("#manualMachineSection"),

    // Modal-related
    //
    // Buttons on the confirmation window
    manualSubmitConfirmModalRegister: window.$("#manualSubmitConfirmModalRegister"),
    manualSubmitConfirmModalCancel: window.$("#manualSubmitConfirmModalCancel"),

    // Hidden buttons to show the modal windows
    manualSubmitConfirmModalButton: window.$("#manualSubmitConfirmModalButton"),
    manualSubmitReceiptModalButton: window.$("#manualSubmitReceiptModalButton"),
    manualSubmitErrorModalButton: window.$("#manualSubmitErrorModalButton"),
    
    // Body contents of each window
    manualSubmitConfirmBody: window.$("#manualSubmitConfirmBody"),
    manualSubmitReceiptBody: window.$("#manualSubmitReceiptBody"),
    manualSubmitErrorBody: window.$("#manualSubmitErrorBody"),
}

// Add the service code to our dropdown list
function addServiceToTable(service)
{
    // Commented fully in the index version
    //
    manualElements.manualCodeSelection.append(`
        <option value="{code}" label="{service}">{service}</option>
        `.formatUnicorn(service)
    );
}

// Add a server IP to the list of default endpoints
function addMachineToTable(machine) {

    // Add an element to the table
    manualElements.manualMachinePresets.append(
        `<tr>
            <td>
                <p>{name}</p>
            </td>
            <td>
                <p>{ip}</p>
            </td>
            <td>
                <!-- Button to register this change -->
                <td><button id="machineAddressSelect_{name}" class="btn btn-secondary">Use</button></td>
            </td>
            <td></td>
        </tr>`.formatUnicorn(machine)
    );

    // Then assign a click event to that button
    window.$("[id='machineAddressSelect_{name}']".replace("{name}", machine.name)).click(function(){
        
        // Use 'let' here to prevent weird behavior
        let address = machine.ip;

        // Then assign this value to the service's IP input
        manualElements.manualIpInput.val(address);
    });
}

// Submit the values as whatever service the user selected
function postServiceEndpoint(endpoint) {

    // Make a promise chain to get our registered services
    fetch("/registry/endpoints", {
        method: "POST",
        headers: {
            Accept: "application/json",
            "X-TLA-SERVICE-NAME": endpoint.code,
            "X-TLA-SERVICE-IP": endpoint.ip,
            "X-TLA-SERVICE-PORT": endpoint.port,
            "X-TLA-POST-KEY": window.checkKey(),
        }
    })
    .then( response => response.json())
    .then( response => {

        if (response.error !== undefined) {

            // Update our error text to whatever this error was
            manualElements.manualSubmitErrorBody.empty();
            manualElements.manualSubmitErrorBody.append(`
                <p> 
                    There was an error when registering this service:
                </p>
                <hr>
                <p>
                    {error}
                </p>
            `.formatUnicorn(response));

            // Show the error modal
            manualElements.manualSubmitErrorModalButton.click();
            return;
        }

        // If we didn't get an error, then these should be the service codes
        var serviceCodes = response;

        // Just populate with whatever we just got back
        manualElements.manualPostResponse.text(JSON.stringify(serviceCodes));

        // Update the receipt modal
        manualElements.manualSubmitReceiptBody.empty();
        manualElements.manualSubmitReceiptBody.append(`
            <p>
                An IP and Port have been registered for {name}.
                <br><br>
                Return to the <a href="/">Status Page</a> to view all registered endpoints
                or close this window to continue registering services. 
            </p>
        `.formatUnicorn(manualElements.currentEndpoint));

        // Then show it
        manualElements.manualSubmitReceiptModalButton.click();
        })
    .catch(function(error) {

        // Update our error text to whatever this error was
        manualElements.manualSubmitErrorBody.empty();
        manualElements.manualSubmitErrorBody.append(`
            <p> 
                There was an error when registering this service:
            </p>
            <hr>
            <p>
                {message}
            </p>
        `.formatUnicorn(error));

        // Show the error modal
        manualElements.manualSubmitErrorModalButton.click();
        return;
    })
    .finally(function() {
        
        // Hide the original
        manualElements.manualSubmitConfirmModalCancel.click();
        manualElements.manualSubmitConfirmModalRegister.prop("disabled", false);

        // Clear our form
        manualElements.manualIpInput.val("");
        manualElements.manualPortInput.val("");
    });
}

// Same as the codes page, just poll when we load this script
function getServiceCodes() {

    // Make a promise chain to get our registered services
    fetch("/registry/triples", {
        method: "GET",
        headers: {
            Accept: "application/json",
        }
    })
    .then( response => response.json())
    .then( serviceCodes => {

        // If we have services registered, update the table
        if (serviceCodes !== undefined && serviceCodes.length > 0) {

            // The JSON object is actually an array
            for (let k=0; k < serviceCodes.length; k++) {

                // We have a function to do all of the lifting here
                addServiceToTable(serviceCodes[k]);
            }
        } 
    });
}

// Submit the values as whatever service the user selected
function getMachinePresets() {

    // Make a promise chain to get our registered services
    fetch("/registry/saved-machines", {
        method: "GET",
        headers: {
            Accept: "application/json",
        }
    })
    .then( response => response.json())
    .then( savedMachines => {

        // Add the machines to our table
        for (let ip in savedMachines) {
            if (savedMachines.hasOwnProperty(ip)) {

                addMachineToTable(savedMachines[ip]);
            }
        }
    });
}

// Hook up our button events
manualElements.manualSubmitButton.click(function(){

    // Simple object for sanity later
    var endpoint = {
        name: manualElements.manualCodeSelection.children("option").filter(":selected").text(),
        code: manualElements.manualCodeSelection.val(),
        ip: manualElements.manualIpInput.val().trim(),
        port: manualElements.manualPortInput.val().trim(),
    }

    // Make sure this is a valid IP
    if (endpoint.ip === "" || (window.isValidPort(endpoint.port) === false && endpoint.port !== "")){

        // Update our error text
        manualElements.manualSubmitErrorBody.empty();
        manualElements.manualSubmitErrorBody.append(`
        <p>
            The IP and Port must be correctly formatted.  When registering a service from this page,
            the inferred IP will be the server's local connection, as it's speaking to itself.  The
            inferred Port will be its own, which is 8085 by default.
        </p>`);

        // Show the error modal
        manualElements.manualSubmitErrorModalButton.click();
        return;
    }

    // Make sure the user wants to do this
    manualElements.manualSubmitConfirmBody.empty();
    manualElements.manualSubmitConfirmBody.append((`
        <table>
            <tbody>
                <tr>
                    <td style="width: 50%"><b>Service Name</b></td>
                    <td>{name}</td>
                </tr>
                <tr>
                    <td><b>Service Code</b></td>
                    <td>{code}</td>
                </tr>
                <tr>
                    <td><b>IP Address</b></td>
                    <td>{ip}</td>
                </tr>
                <tr>
                    <td><b>Port</b></td>
                    <td>` + ((endpoint.port === "") ? "NOT ASSIGNED" : "{port}") + `</td>
                </tr>
            <tbody>
        </table>
        <br>
        <b>If you did not assign a Port, then a port will not be included in the service's endpoint.</b>
    `).formatUnicorn(endpoint));

    // Keep this for the click event
    manualElements.currentEndpoint = endpoint;

    // Then show the popup
    manualElements.manualSubmitConfirmModalButton.click();
});

// Click event for the popup window
manualElements.manualSubmitConfirmModalRegister.click(function() {

    // We saved the endpoint already
    postServiceEndpoint(manualElements.currentEndpoint);

    // Disable submissions until this has been returned
    manualElements.manualSubmitConfirmModalRegister.prop("disabled", true);
});

// We'll provide this as a callback to the buttons
function toggleExtraContent(showMachines) {

    if (showMachines) {
        manualElements.manualMachineSection.show();
        manualElements.manualResponseSection.hide();
    } else {
        manualElements.manualMachineSection.hide();
        manualElements.manualResponseSection.show();
    }
}

// Assign the show / hide buttons
manualElements.buttonShowMachines.click(function() {
    toggleExtraContent(true);
});
manualElements.buttonShowResponse.click(function() {
    toggleExtraContent(false);
});

// Start by hiding the POST response and only showing the presets
toggleExtraContent(true);

// Initialize our controls
getMachinePresets();
getServiceCodes();
