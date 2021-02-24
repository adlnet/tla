const keycloakAdapter = require("simple-keycloak-adapter")

// Handler to allow for secret key instead of Keycloak auth
const auth = () => {
    return (req, res, next) => {
        if (req.query.secret == config.secret)
            next()
        else
            keycloakAdapter.protect()(req, res, next);
    }
}

// Handler to confirm our request looks correct 
const validate = () => {
    return (req, res, next) => {
        let payload = (req.method == "GET") ? req.query : req.body;

        // Check the user is allowed to be doing this (needs secret or admin rights)
        if (payload.secret != config.secret && res.locals.user.admin == false && res.locals.user.id != payload.user)
            res.status(401).send(`Unauthorized: Admin or Secret access required to modify other users.`)
        
        else
            next();
    }
}