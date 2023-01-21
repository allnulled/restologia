class DeleteRow {

    constructor(environment) {
        this.environment = environment;
    }

    async execute(publicParameters, privateParameters, configurations) {
        try {
            this.environment.utils.trace("DeleteRow.execute");
            const project = publicParameters.project;
            const authenticator = new this.environment.auth.Authenticator(this.environment, project);
            const authentication = await authenticator.authenticate(configurations.authorization);
            const authorizator = new this.environment.auth.Authorizator(this.environment, project);
            const authorization = await authorizator.authorize(authentication);
            const hasAuthorization = await authorization.forOperation(
                publicParameters.operation,
                privateParameters.table,
                privateParameters.id
            );
            if (!hasAuthorization) {
                throw new Error("User is not allowed to «delete-row»");
            }
            // @TODO: apply protectors
            const { table, id } = privateParameters;
            if (!this.environment.utils.check.that(project).isStringMatchingRegex(/^[A-Za-z0-9\.\-\_]+$/g)) {
                throw new Error("Parameter «project» must be a non-empty string based only on letters, numbers, '.', '-' and '_' in order to «delete-row»");
            }
            if (!this.environment.utils.check.that(table).isStringMatchingRegex(/^[A-Za-z0-9\.\-\_]+$/g)) {
                throw new Error("Parameter «table» must be a non-empty string based only on letters, numbers, '.', '-' and '_' in order to «delete-row»");
            }
            if (typeof id === "number") {
                // @OK
            } else if (!this.environment.utils.check.that(id).isStringMatchingRegex(/^[0-9]+$/g)) {
                throw new Error("Parameter «id» must be a number in order to «delete-row»");
            }
            const { projectData } = await this.environment.database.Project.initialize(project, "delete-row");
            // @STEP: A) if main table is an externalized table:
            if (this.environment.utils.check.that(projectData).itsProperty(["schema", "tables", table, "attributes", "isExternalizedBy"], undefined).isObject()) {
                const { host: externalHost, project: externalProject, table: externalTable } = projectData.schema.tables[table].attributes.isExternalizedBy;
                const response = await this.environment.server.Requester.request("POST", externalHost, {
                    ...publicParameters,
                    project: externalProject,
                    operation: "delete",
                }, {
                    ...privateParameters,
                    table: externalTable,
                }, {
                    authorization: configurations.authorization
                }, false, false);
                if (response.response.status === "error") {
                    throw new Error(response.response.error.message);
                }
                return response.response.data;
            }
            // @STEP: B) if main table is a local table:
            let deletedItem = undefined;
            await this.environment.database.TransactionManager.block(project + "/" + table + ".json", async (unblock, unblockFailing) => {
                try {
                    this.environment.utils.trace("DeleteRow.execute:transaction#1");
                    const tablePath = this.environment.utils.resolveFromSrc("data/projects/" + project + "/data/" + table + ".json");
                    const tableDB = await this.environment.utils.hydrateJSON(tablePath);
                    if (!(id in tableDB.data)) {
                        throw new Error("Parameter «id» must refer to an existing «" + table + "» identifier in order to «delete-row»");
                    }
                    // @TOTEST: check secondary table reference integrity
                    const allTables = projectData.schema.tables;
                    const allTablesIds = Object.keys(allTables);
                    for(let indexTables = 0; indexTables < allTablesIds.length; indexTables++) {
                        const secondaryTableId = allTablesIds[indexTables];
                        const secondaryTableColumn = allTables[secondaryTableId].columns;
                        const secondaryTableColumnIds = Object.keys(secondaryTableColumn);
                        CheckingColumns:
                        for(let indexColumns = 0; indexColumns < secondaryTableColumnIds.length; indexColumns++) {
                            const secondaryColumnId = secondaryTableColumnIds[indexColumns];
                            const secondaryColumn = secondaryTableColumn[secondaryColumnId];
                            const isReferenceOf = secondaryColumn.attributes.isReferenceOf;
                            if(isReferenceOf === table) {
                                // @STEP: B.A) if secondary table is an externalized table:
                                if (this.environment.utils.check.that(projectData).itsProperty(["schema", "tables", secondaryTableId, "attributes", "isExternalizedBy"], undefined).isObject()) {
                                    const { host: externalHost, project: externalProject, table: externalTable } = projectData.schema.tables[secondaryTableId].attributes.isExternalizedBy;
                                    if (secondaryColumn.attributes.isType === "list") {
                                        const responseList = await this.environment.server.Requester.request("GET", externalHost, {
                                            ...publicParameters,
                                            project: externalProject,
                                            table: externalTable,
                                            operation: "select",
                                            where: JSON.stringify([[secondaryColumnId, "has", id]]),
                                        }, {}, {
                                            authorization: configurations.authorization
                                        }, false, false);
                                        if (responseList.response.status === "error") {
                                            throw new Error(responseList.response.error.message);
                                        }
                                        if (responseList.response.data.items.length !== 0) {
                                            throw new Error("Row cannot be deleted because «" + secondaryTableId + "." + secondaryColumnId + "» as list on id «" + responseList.response.data.items[0].id + "» contains an externalized reference to it and at least " + responseList.response.data.items.length + " items more also contain externalized references to this item");
                                        }
                                    } else if (secondaryColumn.attributes.isType === "object") {
                                        const responseObject = await this.environment.server.Requester.request("GET", externalHost, {
                                            ...publicParameters,
                                            project: externalProject,
                                            table: externalTable,
                                            operation: "select",
                                            where: JSON.stringify([[secondaryColumnId, "=", id]]),
                                        }, {}, {
                                            authorization: configurations.authorization
                                        }, false, false);
                                        if (responseObject.response.status === "error") {
                                            throw new Error(responseObject.response.error.message);
                                        }
                                        if (responseObject.response.data.items.length !== 0) {
                                            throw new Error("Row cannot be deleted because «" + secondaryTableId + "." + secondaryColumnId + "» as object on id «" + responseObject.response.data.items[0].id + "» contains an externalized reference to it and at least " + responseObject.response.data.items.length + " items more also contain externalized references to this item.");
                                        }
                                    }
                                    continue CheckingColumns;
                                }
                                // @STEP: B.B) if secondary table is a local table:
                                const secondaryTablePath = this.environment.utils.resolveFromSrc("data/projects/" + project + "/data/" + isReferenceOf + ".json");
                                const secondaryTableDB = await this.environment.utils.hydrateJSON(secondaryTablePath);
                                const secondaryTableData = secondaryTableDB.data;
                                const secondaryTableIds = Object.keys(secondaryTableData);
                                CheckingItems:
                                for(let indexItems = 0; indexItems < secondaryTableIds.length; indexItems++) {
                                    const secondaryTableId = secondaryTableIds[indexItems];
                                    const secondaryItem = secondaryTableData[secondaryTableId];
                                    if (secondaryColumn.attributes.isType === "list") {
                                        if (!Array.isArray(secondaryItem[secondaryColumnId])) {
                                            continue CheckingItems;
                                        }
                                        const containsItem = secondaryItem[secondaryColumnId].indexOf(id) !== -1;
                                        if(containsItem) {
                                            throw new Error("Row cannot be deleted because «" + secondaryTableId + "." + secondaryColumnId + "» on id «" + secondaryTableId + "» contains a reference to it");
                                        }
                                    } else if (secondaryColumn.attributes.isType === "object") {
                                        const isItem = secondaryItem[secondaryColumnId] === id;
                                        if(isItem) {
                                            throw new Error("Row cannot be deleted because «" + secondaryTableId + "." + secondaryColumnId + "» on id «" + secondaryTableId + "» refers to it");
                                        }
                                    }
                                }
                            }
                        }
                    }
                    deletedItem = tableDB.data[id];
                    delete tableDB.data[id];
                    await this.environment.utils.dehydrateJSON(tablePath, tableDB);
                    unblock();
                } catch (error) {
                    unblockFailing(error);
                }
            });
            // @TODO: apply triggers
            return { message: "Operation «delete-row» successfully achieved", table, id: deletedItem.id, item: deletedItem };
        } catch (error) {
            this.environment.utils.debugError("DeleteRow.execute", error, true);
        }
    }

}

module.exports = DeleteRow;