class UpdateRow {

    constructor(environment) {
        this.environment = environment;
    }

    async execute(publicParameters, privateParameters, configurations) {
        try {
            this.environment.utils.trace("UpdateRow.execute");
            const project = publicParameters.project;
            const authenticator = new this.environment.auth.Authenticator(this.environment, project);
            const authentication = await authenticator.authenticate(configurations.authorization);
            const authorizator = new this.environment.auth.Authorizator(this.environment, project);
            const authorization = await authorizator.authorize(authentication);
            const hasAuthorization = await authorization.forOperation(
                publicParameters.operation,
                privateParameters.table,
                privateParameters.id,
                privateParameters.value
            );
            if (!hasAuthorization) {
                throw new Error("User is not allowed to «update-row»");
            }
            // @TODO: apply protectors
            const { table, id, value } = privateParameters;
            if (!this.environment.utils.check.that(project).isStringMatchingRegex(/^[A-Za-z0-9\.\-\_]+$/g)) {
                throw new Error("Parameter «project» must be a non-empty string based only on letters, numbers, '.', '-' and '_' in order to «update-row»");
            }
            if (!this.environment.utils.check.that(table).isStringMatchingRegex(/^[A-Za-z0-9\.\-\_]+$/g)) {
                throw new Error("Parameter «table» must be a non-empty string based only on letters, numbers, '.', '-' and '_' in order to «update-row»");
            }
            if (!this.environment.utils.check.that(id).isInteger()) {
                throw new Error("Parameter «id» must be an integer number in order to «update-row»");
            }
            const originalValueParsed = JSON.parse(value);
            const { projectData } = await this.environment.database.Project.initialize(project, "update-row");
            // @STEP: A) if it is an externalized table:
            if (this.environment.utils.check.that(projectData).itsProperty(["schema", "tables", table, "attributes", "isExternalizedBy"], undefined).isObject()) {
                const { host: externalHost, project: externalProject, table: externalTable } = projectData.schema.tables[table].attributes.isExternalizedBy;
                const response = await this.environment.server.Requester.request("POST", externalHost, {
                    ...publicParameters,
                    project: externalProject,
                    operation: "update",
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
            const protectorErrors = [];
            let valueFixed = undefined;
            const protectorHandler = await this.environment.database.ProtectorHandler.initialize(this.environment, publicParameters, privateParameters, configurations, authentication, projectData);
            await this.environment.database.TransactionManager.block(project + "/" + table + ".json", async (unblock, unblockFailing) => {
                try {
                    this.environment.utils.trace("UpdateRow.execute:transaction#1");
                    const tablePath = this.environment.utils.resolveFromSrc("data/projects/" + project + "/data/" + table + ".json");
                    const tableDB = await this.environment.utils.hydrateJSON(tablePath);
                    if(!(id in tableDB.data)) {
                        throw new Error("Parameter «id» must refer to an existing «" + table + "» identifier in order to «update-row»");
                    }
                    const valuePrevious = tableDB.data[id];
                    let valueParsed = Object.assign({}, valuePrevious, originalValueParsed, { id });
                    await protectorHandler.applyOnBeforePersistProtectors({ value: valueParsed, protectorErrors });
                    valueParsed = Object.assign({}, valuePrevious, valueParsed, { id });
                    valueFixed = await this.environment.utils.check.that(valueParsed).followsSchemaOf(projectData, table, tableDB.data, "update", project, configurations.authorization, authentication, this.environment);
                    tableDB.data[id] = valueFixed;
                    await this.environment.utils.dehydrateJSON(tablePath, tableDB);
                    unblock();
                } catch (error) {
                    unblockFailing(error);
                }
            });
            const response = {
                message: "Operation «update-row» successfully achieved",
                table,
                // id: valueFixed.id,
                item: valueFixed,
                protectorErrors,
            };
            await protectorHandler.applyOnAfterPersistProtectors(response, { value: valueFixed });
            return response;
        } catch (error) {
            this.environment.utils.debugError("UpdateRow.execute", error, true);
        }
    }

}

module.exports = UpdateRow;