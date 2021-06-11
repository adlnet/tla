const path = require('path');
const fs = require("fs");
const mongo = require("./util/mongo");

let importFile = process.argv[2];

(async() => {

    if (!process.argv[2]) {
        console.log("[XI Import]: (ERROR) One or more arguments not provided.");
        console.log("[XI Import]: Syntax should be:  node import.js ./path/to/data.json [n/y]");
        return;
    }
    
    let importPath = path.join(__dirname, importFile);
    let fileText = fs.readFileSync(importPath);
    let fileData = JSON.parse(fileText);
    
    if (!Array.isArray(fileData)) {
        console.log("[XI Import]: (ERROR) Import format must be a JSON array.");
        return;
    }

    let overwrite = process.argv[3] != null && process.argv[3].toLowerCase().startsWith("y");

    console.log(`[XI Import]: Importing ${fileData.length} records into XI ...`);
    console.log(`[XI Import]: ... record overwrite IS ${overwrite ? "" : "NOT"} enabled ...`);

    await mongo.init(null);
    await mongo.post(fileData, overwrite).catch(console.error);
    
    console.log(`[XI Import]: Import Finished.`);

}).call();
