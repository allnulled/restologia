class ViewSchema {

    constructor(environment) {
        this.environment = environment;
    }

    async execute(publicParameters, privateParameters, configurations) {
        try {
            this.environment.utils.trace("ViewSchema.execute");
            const project = publicParameters.project;
            const authenticator = new this.environment.auth.Authenticator(this.environment, project);
            const authentication = await authenticator.authenticate(configurations.authorization);
            const authorizator = new this.environment.auth.Authorizator(this.environment, project);
            const authorization = await authorizator.authorize(authentication);
            const hasAuthorization = await authorization.forOperation(
                publicParameters.operation
            );
            if (!hasAuthorization) {
                throw new Error("User is not allowed to «view-schema»");
            }
            // @TODO: apply protectors
            if (!this.environment.utils.check.that(project).isStringMatchingRegex(/^[A-Za-z0-9\.\-\_]+$/g)) {
                throw new Error("Parameter «project» must be a non-empty string based only on letters, numbers, '.', '-' and '_' in order to «delete-row»");
            }
            const { projectData } = await this.environment.database.Project.initialize(project, "view-schema");
            const schema = projectData.schema;
            // @TODO: apply triggers
            return { message: "Operation «view-schema» successfully achieved", schema };
        } catch (error) {
            this.environment.utils.debugError("ViewSchema.execute", error, true);
        }
    }

}

module.exports = ViewSchema;