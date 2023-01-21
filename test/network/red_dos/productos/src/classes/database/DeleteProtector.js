class DeleteProtector {

    constructor(environment) {
        this.environment = environment;
    }

    async execute(publicParameters, privateParameters, configurations) {
        try {
            this.environment.utils.trace("DeleteProtector.execute");
            const project = publicParameters.project;
            const authenticator = new this.environment.auth.Authenticator(this.environment, project);
            const authentication = await authenticator.authenticate(configurations.authorization);
            const authorizator = new this.environment.auth.Authorizator(this.environment, project);
            const authorization = await authorizator.authorize(authentication);
            const hasAuthorization = await authorization.forOperation(
                publicParameters.operation
            );
            if (!hasAuthorization) {
                throw new Error("User is not allowed to «delete-protector»");
            }
            // @TODO: apply protectors
            const { table } = privateParameters;
            const { protector_new_name = undefined, protector_name, protector_type, parameters: parametersOriginal } = privateParameters;
            if (!this.environment.utils.check.that(project).isStringMatchingRegex(/^[A-Za-z0-9\.\-\_]+$/g)) {
                throw new Error("Parameter «project» must be a non-empty string based only on letters, numbers, '.', '-' and '_' in order to «delete-protector»");
            }
            if (!this.environment.utils.check.that(table).isStringMatchingRegex(/^[A-Za-z0-9\.\-\_]+$/g)) {
                throw new Error("Parameter «table» must be a non-empty string based only on letters, numbers, '.', '-' and '_' in order to «delete-protector»");
            }
            if (!this.environment.utils.check.that(protector_name).isString()) {
                throw new Error("Parameter «protector_name» must be a string in order to «delete-protector»");
            }
            await this.environment.database.TransactionManager.block(project + "/project.json", async (unblock, unblockFailing) => {
                try {
                    const { projectPath, projectData } = await this.environment.database.Project.initialize(project, "delete-table");
                    if (!(table in projectData.schema.tables)) {
                        throw new Error("Parameter «table» must exist as table in schema in order to «delete-protector»");
                    }
                    const tableProtectors = projectData.schema.tables[table].attributes.hasProtectors || [];
                    const coincidingProtectors = tableProtectors.filter(protector => protector.name === protector_name);
                    if (this.environment.utils.check.that(coincidingProtectors.length).equals(0)) {
                        throw new Error("Parameter «protector_name» must exist as table protector name in order to «delete-protector»");
                    }
                    if (!this.environment.utils.check.that(coincidingProtectors.length).equals(1)) {
                        throw new Error("Parameter «protector_name» must be unique as table protector name in order to «delete-protector»");
                    }
                    if (!("hasProtectors" in projectData.schema.tables[table].attributes)) {
                        projectData.schema.tables[table].attributes.hasProtectors = [];
                    }
                    projectData.schema.tables[table].attributes.hasProtectors = projectData.schema.tables[table].attributes.hasProtectors.filter(protector => protector.name !== protector_name);
                    await this.environment.utils.dehydrateJSON(projectPath, projectData);
                    unblock();
                } catch (error) {
                    unblockFailing(error);
                }
            });
            // @TODO: apply triggers
            return { message: "Operation «delete-protector» successfully achieved", project };
        } catch (error) {
            this.environment.utils.debugError("DeleteProtector.execute", error, true);
        }
    }

}

module.exports = DeleteProtector;