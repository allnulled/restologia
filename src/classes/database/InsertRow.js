class InsertRow {

    constructor(environment) {
        this.environment = environment;
    }

    async execute(publicParameters, privateParameters, configurations) {
        try {
            this.environment.utils.trace("InsertRow.execute");
            const project = publicParameters.project;
            const authenticator = new this.environment.auth.Authenticator(this.environment, project);
            const authentication = await authenticator.authenticate(configurations.authorization);
            const authorizator = new this.environment.auth.Authorizator(this.environment, project);
            const authorization = await authorizator.authorize(authentication);
            const hasAuthorization = await authorization.forOperation(
                publicParameters.operation,
                privateParameters.table,
                privateParameters.value
            );
            if (!hasAuthorization) {
                throw new Error("User is not allowed to «insert-row»");
            }
            const { projectData } = await this.environment.database.Project.initialize(project, "insert-row");
            const protectorHandler = await this.environment.database.ProtectorHandler.initialize(this.environment, publicParameters, privateParameters, configurations, authentication, projectData);
            const { table, value } = privateParameters;
            const valueParsed = JSON.parse(value);
            if (!this.environment.utils.check.that(table).isStringMatchingRegex(/^[A-Za-z0-9\.\-\_]+$/g)) {
                throw new Error("Parameter «table» must be a non-empty string based only on letters, numbers, '.', '-' and '_' in order to «insert-row»");
            }
            // @STEP: A) if it is an externalized table:
            if (this.environment.utils.check.that(projectData).itsProperty(["schema", "tables", table, "attributes", "isExternalizedBy"], undefined).isObject()) {
                const { host: externalHost, project: externalProject, table: externalTable } = projectData.schema.tables[table].attributes.isExternalizedBy;
                const response = await this.environment.server.Requester.request("POST", externalHost, {
                    ...publicParameters,
                    project: externalProject,
                    operation: "insert",
                }, {
                    ...privateParameters,
                    table: externalTable
                }, {
                    authorization: configurations.authorization
                }, false, false);
                if (response.response.status === "error") {
                    throw new Error(response.response.error.message);
                }
                return response.response.data;
            }
            // @STEP: B) if it is a local table:
            delete valueParsed.id;
            let valueFixed = undefined;
            await this.environment.database.TransactionManager.block(project + "/" + table + ".json", async (unblock, unblockFailing) => {
                try {
                    this.environment.utils.trace("InsertRow.execute:transaction#1");
                    const tablePath = this.environment.utils.resolveFromSrc("data/projects/" + project + "/data/" + table + ".json");
                    const tableDB = await this.environment.utils.hydrateJSON(tablePath);
                    await protectorHandler.applyOnBeforePersistProtectors({ value: valueParsed, projectData });
                    valueFixed = await this.environment.utils.check.that(valueParsed).followsSchemaOf(projectData, table, tableDB.data, "insert", project, configurations.authorization, authentication, this.environment);
                    const nextId = tableDB.id++;
                    valueFixed.id = nextId;
                    tableDB.data[nextId] = valueFixed;
                    await this.environment.utils.dehydrateJSON(tablePath, tableDB);
                    unblock();
                } catch(error) {
                    unblockFailing(error);
                }
            });
            const response = {
                message: "Operation «insert-row» successfully achieved",
                table,
                id: valueFixed.id,
                item: valueFixed
            };
            await protectorHandler.applyOnAfterPersistProtectors(response, { value: valueFixed });
            // @TODO: apply triggers
            return response;
        } catch (error) {
            this.environment.utils.debugError("InsertRow.execute", error, true);
        }
    }

}

module.exports = InsertRow;