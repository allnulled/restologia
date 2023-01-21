class AddTable {

    constructor(environment) {
        this.environment = environment;
    }

    async execute(publicParameters, privateParameters, configurations) {
        try {
            this.environment.utils.trace("AddTable.execute");
            const project = publicParameters.project;
            const authenticator = new this.environment.auth.Authenticator(this.environment, project);
            const authentication = await authenticator.authenticate(configurations.authorization);
            const authorizator = new this.environment.auth.Authorizator(this.environment, project);
            const authorization = await authorizator.authorize(authentication);
            const hasAuthorization = await authorization.forOperation(
                publicParameters.operation
            );
            if (!hasAuthorization) {
                throw new Error("User is not allowed to «add-table»");
            }
            // @TODO: apply protectors
            const { table, attributes: attributesOriginal = "{}", properties: propertiesOriginal = "{}", columns: columnsOriginal = "{}" } = privateParameters;
            if (!this.environment.utils.check.that(project).isStringMatchingRegex(/^[A-Za-z0-9\.\-\_]+$/g)) {
                throw new Error("Parameter «project» must be a non-empty string based only on letters, numbers, '.', '-' and '_' in order to «delete-row»");
            }
            if (!this.environment.utils.check.that(table).isStringMatchingRegex(/^[A-Za-z0-9\.\-\_]+$/g)) {
                throw new Error("Parameter «table» must be a non-empty string based only on letters, numbers, '.', '-' and '_' in order to «add-table»");
            }
            if (!this.environment.utils.check.that(attributesOriginal).isString()) {
                throw new Error("Parameter «attributes» must be a string or omitted in order to «add-table»");
            }
            if (!this.environment.utils.check.that(propertiesOriginal).isString()) {
                throw new Error("Parameter «properties» must be a string or omitted in order to «add-table»");
            }
            if (!this.environment.utils.check.that(columnsOriginal).isString()) {
                throw new Error("Parameter «columns» must be a string or omitted in order to «add-table»");
            }
            const attributes = JSON.parse(attributesOriginal);
            const properties = JSON.parse(propertiesOriginal);
            const allColumns = JSON.parse(columnsOriginal);
            if (!this.environment.utils.check.that(attributes).isObject()) {
                throw new Error("Parameter «attributes» must be a JSON object or omitted in order to «add-table»");
            }
            if (!this.environment.utils.check.that(properties).isObject()) {
                throw new Error("Parameter «properties» must be a JSON object or omitted in order to «add-table»");
            }
            if (!this.environment.utils.check.that(allColumns).isObject()) {
                throw new Error("Parameter «columns» must be a JSON object or omitted in order to «add-table»");
            }
            const { projectPath, projectData } = await this.environment.database.Project.initialize(project, "add-table");
            await this.environment.database.TransactionManager.block(project + "/project.json", async (unblock, unblockFailing) => {
                try {
                    if(table in projectData.schema.tables) {
                        throw new Error("Parameter «table» must not exist as table in schema in order to «add-table»");
                    }
                    const finalColumns = {};
                    const allColumnIds = Object.keys(allColumns);
                    for (let indexColumns = 0; indexColumns < allColumnIds.length; indexColumns++) {
                        const columnId = allColumnIds[indexColumns];
                        if (!this.environment.utils.check.that(columnId).isStringMatchingRegex(/^[A-Za-z0-9\.\-\_]+$/g)) {
                            throw new Error("Parameter «column» on index «" + columnId + "» must be keyed as a non-empty string based only on letters, numbers, '.', '-' and '_' in order to «add-table»");
                        }
                        const column = allColumns[columnId];
                        if(!this.environment.utils.check.that(column).isObject()) {
                            throw new Error("Parameter «columns» on index «" + columnId + "» must be an object in order to «add-table»");
                        }
                        finalColumns[columnId] = {
                            attributes: Object.assign({}, this.environment.database.constructor.DEFAULT_COLUMN_ATTRIBUTES, column.attributes || {}),
                            properties: Object.assign({}, this.environment.database.constructor.DEFAULT_COLUMN_PROPERTIES, column.properties || {}),
                        };
                    }
                    projectData.schema.tables[table] = {
                        attributes: Object.assign({}, this.environment.database.constructor.DEFAULT_TABLE_ATTRIBUTES, attributes),
                        properties: Object.assign({}, this.environment.database.constructor.DEFAULT_TABLE_PROPERTIES, properties),
                        columns: finalColumns
                    };
                    await this.environment.utils.dehydrateJSON(projectPath, projectData);
                    unblock();
                } catch(error) {
                    unblockFailing(error);
                }
            });
            // @NOTE: no need to block because this file does not exist yet here:
            const tablePath = this.environment.utils.resolveFromSrc("data/projects/" + project + "/data/" + table + ".json");
            await this.environment.utils.dehydrateJSON(tablePath, { id: 1, data: {} });
            // @TODO: apply triggers
            return { message: "Operation «add-table» successfully achieved", table };
        } catch (error) {
            this.environment.utils.debugError("AddTable.execute", error, true);
        }
    }

}

module.exports = AddTable;