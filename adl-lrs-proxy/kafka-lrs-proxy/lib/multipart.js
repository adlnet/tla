module.exports = {

    /** Returns the boundary used for this multipart request 
     * @param {Request} req The multipart request we're parsing
    */
    parseBoundary: function (req) {
        let ctype = req.get("Content-Type");
        let boundaryStart = ctype.indexOf("boundary=") + "boundary=".length
        return ctype.substr(boundaryStart).trim()
    },

    /**
     * A song
     * @typedef {Object} RequestPart
     * @property {string} contentType - Content-Type header.
     * @property {string} body - Request body
     */
    /** Returns the boundary used for this multipart request 
     * @param {Request} req The multipart request we're parsing
     * @returns {RequestPart[]} The parts contained in this request
    */
    parseParts: function(boundary, payload, onlyJSON = true) {

        // Get our boundary from this request, checking the multipart header,
        // then split the request body using that as its delimiter
        let partsRaw = payload.split("--" + boundary);

        /** @type {RequestPart[]} */
        let parts = []

        // A multipart message only has interesting parts between its boundaries, with the
        // first and last parts being prologue and epilogue respectively.  These aren't of
        // any interest to use, so we'll skip them when we iterate over the parts.
        for (let k = 1; k < partsRaw.length - 1; k++) {

            /** @type {RequestPart} */
            let reqPart = {}
            let part = partsRaw[k] + boundary
            
            // Each line of our request contains a different bit of information, with the headers
            // taking the traditional form:
            //
            //  Content-Type: application/json
            //  <empty line>
            //  {"some": "payload"}
            //
            // Although, this is a little bit trickier than that, as these body parts aren't actually
            // required to have any headers at all.  When that happens, we have to assume that the
            // content-type is just plain text

            // Check if we got a content header here
            let typeMatch = /content-type: *(?<type>.*)/gmi.exec(part)
            if (typeMatch != undefined)
                reqPart.contentType = typeMatch.groups.type
            
            // This is a bit expensive, so only do this if we found JSON.  The hashes are pretty big,
            // so we're already wasting time going through non-xAPI content as-is.
            if (!onlyJSON || reqPart.contentType == "application/json") {
                let bodyMatch = new RegExp(`(.*)?(\\r)?\\n?(?<body>.*?(\\r)?\\n)(${boundary})`, "gmi").exec(part)
                if (bodyMatch != undefined)
                    reqPart.body = bodyMatch.groups.body
            }
            
            parts.push(reqPart)
        }
        
        return parts;
    }
}