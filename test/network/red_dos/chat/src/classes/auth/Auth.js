class Auth {

    constructor(environment) {
        this.environment = environment;
        this.environment.utils.trace("Auth.constructor");
    }

    async start() {
        try {
            this.environment.utils.trace("Auth.start");
            this.Authentication = require(__dirname + "/Authentication.js");
            this.Authenticator = require(__dirname + "/Authenticator.js");
            this.Authorization = require(__dirname + "/Authorization.js");
            this.Authorizator = require(__dirname + "/Authorizator.js");
        } catch (error) {
            this.environment.utils.debugError("Auth.create", error);
        }
    }

}

module.exports = Auth;