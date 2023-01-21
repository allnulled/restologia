class Authorizator {

    constructor(environment, project) {
        this.environment = environment;
        this.project = project;
    }

    authorize(authentication) {
        try {
            this.environment.utils.trace("Authorization.authorize");
            return new this.environment.auth.Authorization(this.environment, this.project, authentication);
        } catch (error) {
            this.environment.utils.debugError("AuthorizationRequest.requestAuthorizationFor", error, true);
        }
    }

}

module.exports = Authorizator;