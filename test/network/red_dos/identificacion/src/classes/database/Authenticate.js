class Authenticate {

    constructor(environment) {
        this.environment = environment;
    }

    async execute(publicParameters, privateParameters, configurations) {
        try {
            this.environment.utils.trace("Authenticate.execute");
            const { project } = publicParameters;
            const authenticator = new this.environment.auth.Authenticator(this.environment, project);
            const authentication = await authenticator.authenticate(configurations.authorization);
            return { message: "Operation «authenticate» successfully achieved", authentication: authentication.toPlainObject() };
        } catch (error) {
            this.environment.utils.debugError("Authenticate.execute", error, true);
        }
    }

}

module.exports = Authenticate;