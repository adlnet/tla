const axios = require("axios");

module.exports = {
    
    /**
     * Get an xAPI statement from the LRS itself.   
     * @param {string} redirect The redirect URL we're using. 
     * @param {Request} req The original request made through the proxy.
     * @param {string} id ID of the xAPI statement we want.
     * @param {Function<Statement>} callback Callback when we retrieve the statement.  Argument will be the statement.
     */
    statementFromLRS: function(redirect, req, id, callback) {

        // Do this with promises so we can stay async
        //
        let url = `${redirect}${req.url}?format=exact&statementId=${id}`
        let auth = req.get("Authorization")
        let version = req.get("X-Experience-API-Version")

        axios.get(url, {
            headers: {
                "Authorization": auth,
                "X-Experience-API-Version": version
            }
        })
        .then(response => {
            console.log(response);
            callback(JSON.parse(response.data));
        })
        .catch(error => {

            if (error.response != undefined)
                console.log(`ERROR ${error.response.status}:${error.response.statusText}\n\t${error.response.config.url}`)
            else
                console.log(`ERROR UNKNOWN ${error}`)

            callback(null);
        });
    },
}