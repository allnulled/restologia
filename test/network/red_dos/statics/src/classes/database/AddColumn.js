

class AddColumn {

    constructor(environment) {
        this.environment = environment;
    }

    async execute(publicParameters, privateParameters, configurations) {
        try {
            this.environment.utils.trace("AddColumn.execute");
            const project = publicParameters.project;
            const authenticator = new this.environment.auth.Authenticator(this.environment, project);
            const authentication = await authenticator.authenticate(configurations.authorization);
            const authorizator = new this.environment.auth.Authorizator(this.environment, project);
            const authorization = await authorizator.authorize(authentication);
            const hasAuthorization = await authorization.forOperation(
                publicParameters.operation
            );
            if (!hasAuthorization) {
                throw new Error("User is not allowed to «add-column»");
            }
            // @TODO: apply protectors
            const { table, column, attributes: attributesOriginal = "{}", properties: propertiesOriginal = "{}" } = privateParameters;
            if (!this.environment.utils.check.that(project).isStringMatchingRegex(/^[A-Za-z0-9\.\-\_]+$/g)) {
                throw new Error("Parameter «project» must be a non-empty string based only on letters, numbers, '.', '-' and '_' in order to «delete-row»");
            }
            if (!this.environment.utils.check.that(table).isStringMatchingRegex(/^[A-Za-z0-9\.\-\_]+$/g)) {
                throw new Error("Parameter «table» must be a non-empty string based only on letters, numbers, '.', '-' and '_' in order to «add-column»");
            }
            if (!this.environment.utils.check.that(column).isStringMatchingRegex(/^[A-Za-z0-9\.\-\_]+$/g)) {
                throw new Error("Parameter «column» must be a non-empty string based only on letters, numbers, '.', '-' and '_' in order to «add-column»");
            }
            if (!this.environment.utils.check.that(attributesOriginal).isString()) {
                throw new Error("Parameter «attributes» must be a string or omitted in order to «add-column»");
            }
            if (!this.environment.utils.check.that(propertiesOriginal).isString()) {
                throw new Error("Parameter «properties» must be a string or omitted in order to «add-column»");
            }
            const attributes = JSON.parse(attributesOriginal);
            const properties = JSON.parse(propertiesOriginal);
            if (!this.environment.utils.check.that(attributes).isObject()) {
                throw new Error("Parameter «attributes» must be a JSON object or omitted in order to «add-column»");
            }
            if (!this.environment.utils.check.that(properties).isObject()) {
                throw new Error("Parameter «properties» must be a JSON object or omitted in order to «add-column»");
            }
            await this.environment.database.TransactionManager.block(project + "/project.json", async (unblock, unblockFailing) => {
                try {
                    const { projectPath, projectData } = await this.environment.database.Project.initialize(project, "add-column");
                    if (!(table in projectData.schema.tables)) {
                        throw new Error("Parameter «table» must exist as table in schema in order to «add-column»");
                    }
                    if (column in projectData.schema.tables[table].columns) {
                        throw new Error("Parameter «column» must not exist as column in schema in order to «add-column»");
                    }
                    projectData.schema.tables[table].columns[column] = {
                        attributes: Object.assign({}, this.environment.database.constructor.DEFAULT_COLUMN_ATTRIBUTES, attributes),
                        properties: Object.assign({}, this.environment.database.constructor.DEFAULT_COLUMN_PROPERTIES, properties),
                    };
                    await this.environment.utils.dehydrateJSON(projectPath, projectData);
                    unblock();
                } catch (error) {
                    unblockFailing(error);
                }
            });
            // @TODO: apply triggers
            return { message: "Operation «add-column» successfully achieved", table, column };
        } catch (error) {
            this.environment.utils.debugError("AddColumn.execute", error, true);
        }
    }

}

module.exports = AddColumn;