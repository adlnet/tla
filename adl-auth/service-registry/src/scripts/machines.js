// Background logic for the machine configuration page.
//
var machineElements = window.machineElements || {

    // Text entry for new machines
    textMachineName: window.$("#textMachineName"),
    textMachineIp: window.$("#textMachineIp"),

    // Table we'll use to show saved machines
    tbodySavedMachines: window.$("#tbodySavedMachines"),

    // Buttons to submit and clear machines
    machineSubmitButton: window.$("#machineSubmitButton"),
    machineClearButton: window.$("#machineClearButton"),
}

// Clear all machines on our registry.  This will not change the Manual Configuation.
function clearMachines() {

     // Make a promise chain to get our registered services
     fetch("/registry/clear-machines", {
        method: "POST",
        headers: {
            Accept: "application/json",
            "X-TLA-POST-KEY": window.checkKey(),
        }
    })
    .then( response => response.json())
    .then( machines => {

        // Update our table
        updateMachineTable(machines);
    });
}


// Take our text entries and save them as a machine.
function postMachine(machine) {

    // Make a promise chain to get our registered services
    fetch("/registry/machines", {
        method: "POST",
        headers: {
            Accept: "application/json",
            "X-TLA-MACHINE-NAME": machine.name,
            "X-TLA-MACHINE-IP": machine.ip,
            "X-TLA-POST-KEY": window.checkKey(),
        }
    })
    .then( response => response.json())
    .then( machines => {
        
        if (machines.error !== undefined) {
            alert("Error submitting machine:\n\n" + response.error);
            return;
        }

        // Update our table
        updateMachineTable(machines);
    });
}

// Add a machine to our table. 
function addMachineToTable(machine) {
    
    // Sanity
    let element = `
    <tr>
        <td scope="row">
            <p>{name}</p>
        </td>
        <td>
            <p>{ip}</p>
        </td>
        <td>
        </td>
    </tr>`.formatUnicorn(machine);

    // Append this to our tbody element
    machineElements.tbodySavedMachines.append(element);
}

// Populate the table with known machine names
function populateSavedMachines() {

    // First, we need to get those addresses
    fetch("/registry/saved-machines", {
        method: "GET",
        headers: {
            Accept: "application/json",
        }
    })
    .then( response => response.json())
    .then( savedMachines => {

        updateMachineTable(savedMachines);
    });
}

function updateMachineTable(machines) {

    // If we have services registered, update the table
    if (machines !== undefined) {

        console.log(machines)

        // Clear our entries
        machineElements.tbodySavedMachines.empty();

        // Just iterate through the object
        for (let ip in machines) {
            if (machines.hasOwnProperty(ip)) {

                console.log("ADDING: ", machines[ip])

                // Reassign its fill attribute
                addMachineToTable(machines[ip]);
            }
        }
    } 
}

// Assign our click events
machineElements.machineSubmitButton.click(function() {

    // Assing what we're using
    let machine = {name: machineElements.textMachineName.val(), ip: machineElements.textMachineIp.val()}

    // Make sure we have a real name
    if (machine.name === undefined || machine.name.trim() === "") {

        alert("Machine name cannot be empty.");
        return;
    }

    // Make sure this is a valid IP
    if (machine.ip === undefined || machine.ip.trim() == ""){
        
        alert("You must enter an IP or URL.");
        return;
    }

    // Make sure the user wants to do this
    let confirmed = confirm( `
        Add this machine preset? If this IP is already in use, this preset will replace it.\n
        Machine Name: {name}
        Machine IP or URL: {ip}
    `.formatUnicorn(machine));

    // If we're ok, go ahead and add it
    if (confirmed) {
        postMachine(machine);

        // Clear the text
        machineElements.textMachineName.val("");
        machineElements.textMachineIp.val("");
    }
});

machineElements.machineClearButton.click(function() {

    // Make sure they want to do this
    let confirmed = confirm("This will delete ALL machine presets.  This cannot be undone.\n\nAre you sure you want to do this?");
    
    if (confirmed) 
        clearMachines();
});

// Start by showing these
populateSavedMachines();

window.machineElements = machineElements;