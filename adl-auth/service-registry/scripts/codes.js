// Background code for the Codes page
//
// This will just be a table that requests the codes from our server
//
codesElements = window.codesElements || {
    serviceTableBody: window.$("#serviceTableBody"),
}

// Do the same trick we used in index-background.js
// The object used here is defined as "ServiceCodeTriple" at the top of /util/constants.js
//
function addServiceToTable(service)
{
    // Commented fully in the index version
    //
    codesElements.serviceTableBody.append(`
        <tr>
            <td scope="row">{owner}</td>
            <td>{service}</td>
            <td>{code}</td>
        </tr>`.formatUnicorn(service)
    );
}

// Just poll when we load this script
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

        // Clear the table
        codesElements.serviceTableBody.empty();

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

getServiceCodes();