class DeleteTable {

    constructor(environment) {
        this.environment = environment;
    }

    async execute(publicParameters, privateParameters, configurations) {
        try {
            this.environment.utils.trace("DeleteTable.execute");
            const project = publicParameters.project;
            const authenticator = new this.environment.auth.Authenticator(this.environment, project);
            const authentication = await authenticator.authenticate(configurations.authorization);
            const authorizator = new this.environment.auth.Authorizator(this.environment, project);
            const authorization = await authorizator.authorize(authentication);
            const hasAuthorization = await authorization.forOperation(
                publicParameters.operation
            );
            if (!hasAuthorization) {
                throw new Error("User is not allowed to «delete-table»");
            }
            // @TODO: apply protectors
            const { table } = privateParameters;
            if (!this.environment.utils.check.that(table).isStringMatchingRegex(/^[A-Za-z0-9\.\-\_]+$/g)) {
                throw new Error("Parameter «table» must be a non-empty string based only on letters, numbers, '.', '-' and '_' in order to «delete-table»");
            }
            const { projectPath, projectData } = await this.environment.database.Project.initialize(project, "delete-table");
            await this.environment.database.TransactionManager.block(project + "/project.json", async (unblock, unblockFailing) => {
                try {
                    if (!(table in projectData.schema.tables)) {
                        throw new Error("Parameter «table» must exist as table in schema in order to «delete-table»");
                    }
                    delete projectData.schema.tables[table];
                    await this.environment.utils.dehydrateJSON(projectPath, projectData);
                    const tablePath = this.environment.utils.resolveFromSrc("data/projects/" + project + "/data/" + table + ".json");
                    await this.environment.utils.deleteFile(tablePath);
                    unblock();
                } catch (error) {
                    unblockFailing(error);
                }
            });
            // @TODO: apply triggers
            return { message: "Operation «delete-table» successfully achieved" };
        } catch (error) {
            this.environment.utils.debugError("DeleteTable.execute", error, true);
        }
    }

}

module.exports = DeleteTable;