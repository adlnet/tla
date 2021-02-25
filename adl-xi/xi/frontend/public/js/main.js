/***  
 * This function detemines what the card will look like and should be updated with the metadata.js validation page
***/
function buildCard(course) {

    return `<div id="${course['_id']}" class="col-sm-4 mb-4">
              <div class="card h-100">
                <a target="_blank" href="${course['url']}">
                    <object data="${course['thumbnailUrl']}" type="image/png">
                        <img src="img/book.png" style="width: 100%" alt="">
                    </object>
                </a>
                  <div class="card-body" >
                    <h5 class="card-title" id="${course['_id']}-name" >${course['name']}</h5> 
                    <p class="card-text" id="${course['_id']}-description" >${course['description']}</p>
                  </div>
                  <ul class="list-group list-group-flush h-auto">
                    <li class="list-group-item" id="${course['_id']}-courseCode" >${course['courseCode']}</li>
                    <li class="list-group-item"><a target="_blank" href="${course['url']}" id="${course['_id']}-courseUrl" class="card-link">Course Link</a></li>
                  </ul>
                  <div class="card-body">
                    <a onclick="updateCard('${course['_id']}')" class="btn btn-info">Update</a>
                    <a onclick="removeEntry('${course['_id']}')" class="btn btn-warning">Delete</a>
                  </div>
              </div>
          </div>`;
}

/* 
clears and rebuilds current course cards
*/
async function constructTable() {
    clearTable();

    let list = await fetch('api/v1/experiences', {
        method: 'GET',
        mode: 'cors',
        headers: {
            "Authorization": "SRN1yHHGWAGzKSkTxKcFris71bISI2xX",
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            "method": "GET",
            "credentials": "same-origin"
        },
    }).then(resp => resp.json())
        .then(result => {
            console.log(result);
            return result;
        });
    console.log(list);

    let body = '';

    // Traversing the JSON data 
    list.forEach((item, index, array) => {
        body += buildCard(item);
    });

    let cardBody = document.getElementById("card-body");
    cardBody.innerHTML = body;
}

/* 
deletes card from database and page
*/
function removeEntry(id) {
    if (confirm("Delete Entry?")) {
        fetch(`api/v1/experiences/${id}`, {
            method: 'DELETE',
            mode: 'cors',
            headers: {
                "Authorization": "SRN1yHHGWAGzKSkTxKcFris71bISI2xX",
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                "method": "DELETE",
                "credentials": "same-origin"
            },
        }).then(resp => resp.json())
            .then(result => {
                console.log(result);
                document.getElementById(id).remove();
                return result;
            });
    }
}

function clearTable() {
    let body = document.getElementById('card-body');
    while (body.firstChild) {
        body.removeChild(body.firstChild);
    }
}


/* 
form handling functions
*/

var form = document.getElementById("addForm");

/*
Load the form withs cards data 
 */
async function updateCard(id) {

    let entryRes = await fetch(`api/v1/experiences/${id}`)
    let entryObj = await entryRes.json()

    /* Set form  */
    document.getElementById("name").value = entryObj.name;
    document.getElementById("courseCode").value = entryObj.courseCode;
    document.getElementById("description").value = entryObj.description;
    document.getElementById("thumbnailUrl").value = entryObj.thumbnailUrl;
    document.getElementById("courseUrl").value = entryObj.url;
    document.getElementById("_id").value = entryObj._id;

    document.getElementById("competencyArray").innerHTML = ""

    if (Array.isArray(entryObj.educationalAlignment)) {
        for (let alignment of entryObj.educationalAlignment) {
            addComp(alignment.competency, alignment.weight)
        }
    }

    /* Open the form */
    document.getElementById("formbutton").click();
}


/* 
Adds more inputs to the form
*/
function addComp(comp = "", weight = "") {
    let comps = document.getElementById("competencyArray");
    let x = comps.childElementCount;
    let newinput = document.createElement("DIV");
    newinput.className = "row comp";
    newinput.id = "comp" + x;
    newinput.innerHTML = `
        <input id="${x}-compUrl" name="educationalAlignment" placeholder="http://schema.cassproject.org/0.3/" value="${comp}" type="text" class="compUrl form-control m-1">
        <div class="row">
            <div class="col-10">
                <input id="${x}-compWeight" name="educationalAlignment" placeholder="Weight" type="text" value="${weight}" class="compWeight form-control m-1">
            </div>
            <div class="col-2">
                <button type="button" onclick="deleteComp('comp${x}')" class="btn btn-danger btn-sm m-auto">X</button>
            </div>
        </div>
    `;

    comps.appendChild(newinput);
}

function deleteComp(comp) {
    console.log(comp);
    document.getElementById(comp).remove();
}

/* 
Checks if _id exist and then handles POST and PUT
*/
async function handleForm(event) {
    event.preventDefault();
    let data;

    /* get competencies */
    let compDiv = document.getElementById("competencyArray");
    let comps = compDiv.getElementsByClassName("comp")
    let compCount = compDiv.childElementCount;

    let competencyArray = []
    
    for (let compBlock of comps) {
        let competency = compBlock.getElementsByClassName("compUrl")[0].value
        let weight = compBlock.getElementsByClassName("compWeight")[0].value
        
        competencyArray.push({ competency, weight })
    }

    if (document.getElementById("_id").value == "") {
        data = {
            name: document.getElementById("name").value,
            courseCode: document.getElementById("courseCode").value,
            description: document.getElementById("description").value,
            thumbnailUrl: document.getElementById("thumbnailUrl").value,
            url: document.getElementById("courseUrl").value,
            educationalAlignment: competencyArray
        }

        await fetch('api/v1/experiences', {
            method: 'POST',
            mode: 'cors',
            headers: {
                "Authorization": "SRN1yHHGWAGzKSkTxKcFris71bISI2xX",
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                "method": "POST",
                "credentials": "same-origin"
            },
            body: JSON.stringify(data),
        }).then(resp => resp.json())
            .then(result => {
                console.log(result);
                constructTable();
                form.reset();
                return result;
            });

    } else {

        data = {
            name: document.getElementById("name").value,
            courseCode: document.getElementById("courseCode").value,
            description: document.getElementById("description").value,
            thumbnailUrl: document.getElementById("thumbnailUrl").value,
            url: document.getElementById("courseUrl").value,
            educationalAlignment: competencyArray,
            _id: document.getElementById("_id").value
        }

        await fetch('api/v1/experiences', {
            method: 'PUT',
            mode: 'cors',
            headers: {
                "Authorization": "SRN1yHHGWAGzKSkTxKcFris71bISI2xX",
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                "method": "PUT",
                "credentials": "same-origin"
            },
            body: JSON.stringify(data),
        }).then(resp => resp.json())
            .then(result => {

                form.reset();
                constructTable();
                /* Close the form */
                document.getElementById("formbutton").click();
                return result;
            });
    }
}


/* 
To start the courses page.
*/
form.addEventListener('submit', handleForm);
constructTable();