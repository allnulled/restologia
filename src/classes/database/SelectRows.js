const AVAILABLE_WHERE_OPERATIONS = ["=", "!=", "<", "<=", ">", ">=", "=null", "!=null", "has", "!has", "in", "!in"];

class SelectRows {

    constructor(environment) {
        this.environment = environment;
    }

    async execute(publicParameters, privateParameters, configurations) {
        try {
            this.environment.utils.trace("SelectRows.execute");
            const project = publicParameters.project;
            const authenticator = new this.environment.auth.Authenticator(this.environment, project);
            const authentication = await authenticator.authenticate(configurations.authorization);
            const authorizator = new this.environment.auth.Authorizator(this.environment, project);
            const authorization = await authorizator.authorize(authentication);
            const hasAuthorization = await authorization.forOperation(
                publicParameters.operation,
                publicParameters.table,
                publicParameters.where,
                publicParameters.sort,
                publicParameters.paginate
            );
            if (!hasAuthorization) {
                throw new Error("User is not allowed to «select-rows»");
            }
            // @TODO: apply protectors
            const { projectData } = await this.environment.database.Project.initialize(project, "select-rows");
            const { table } = publicParameters;
            if (!this.environment.utils.check.that(table).isStringMatchingRegex(/^[A-Za-z0-9\.\-\_]+$/g)) {
                throw new Error("Parameter «table» must be a non-empty string based only on letters, numbers, '.', '-' and '_' in order to «select-rows»");
            }
            let where = JSON.parse(publicParameters.where || "[]");
            let sort = JSON.parse(publicParameters.sort || "[]");
            let paginate = JSON.parse(publicParameters.paginate || "[]");
            if (!this.environment.utils.check.that(where).isArray()) {
                throw new Error("Parameter «where» must be a JSON array or omitted in order to «select-rows»");
            }
            if (!this.environment.utils.check.that(sort).isArray()) {
                throw new Error("Parameter «sort» must be a JSON array or omitted in order to «select-rows»");
            }
            if (!this.environment.utils.check.that(paginate).isArray()) {
                throw new Error("Parameter «paginate» must be a JSON array or omitted in order to «select-rows»");
            }
            const tablePath = this.environment.utils.resolveFromSrc("data/projects/" + project + "/data/" + table + ".json");
            const tableDB = await this.environment.utils.hydrateJSON(tablePath);
            const tableSchema = projectData.schema.tables[table];
            const protectorHandler = await this.environment.database.ProtectorHandler.initialize(this.environment, publicParameters, privateParameters, configurations, authentication, projectData);
            await protectorHandler.applyOnBeforeViewProtectors({ projectData });
            where = JSON.parse(publicParameters.where || "[]");
            sort = JSON.parse(publicParameters.sort || "[]");
            paginate = JSON.parse(publicParameters.paginate || "[]");
            const allItems = Object.values(tableDB.data);
            // @STEP: if it is an externalized table:
            if (this.environment.utils.check.that(projectData).itsProperty(["schema", "tables", table, "attributes", "isExternalizedBy"], undefined).isObject()) {
                const { host: externalHost, project: externalProject, table: externalTable } = projectData.schema.tables[table].attributes.isExternalizedBy;
                const response = await this.environment.server.Requester.request("GET", externalHost, {
                    ...publicParameters,
                    project: externalProject,
                    operation: "select",
                    table: externalTable,
                }, privateParameters, {
                    authorization: configurations.authorization
                }, false, false);
                if (response.response.status === "error") {
                    throw new Error(response.response.error.message);
                }
                return response.response.data;
            }
            // @STEP: if it is suboperation 'hasIds':
            let suboperation = publicParameters.suboperation || undefined;
            if (suboperation === "hasIds") {
                const allIds = publicParameters.ids.split(",").map(id => parseInt(id));
                const missingIds = [];
                // this.environment.utils.dieStringify(allIds, allItems);
                for(let index = 0; index < allIds.length; index++) {
                    const id = allIds[index];
                    let isMissingItem = true;
                    for(let index = 0; index < allItems.length; index++) {
                        const item = allItems[index];
                        if(item.id === id) {
                            isMissingItem = false;
                        }
                    }
                    if(isMissingItem) {
                        missingIds.push(id);
                    }
                }
                return {
                    message: "Operation «select-rows.has-ids» successfully achieved",
                    table,
                    missingIds,
                }
            }
            let matchedItems = [];
            // @STEP: apply where:
            if(!where.length) {
                matchedItems = allItems;
            } else {
                FilteringRows:
                for(let indexRows = 0; indexRows < allItems.length; indexRows++) {
                    const item = allItems[indexRows];
                    let isAcceptedRow = true;
                    ApplyingWheres:
                    for(let indexWhereRules = 0; indexWhereRules < where.length; indexWhereRules++) {
                        const whereRule = where[indexWhereRules];
                        if(!Array.isArray(whereRule)) {
                            throw new Error("Parameter «where» in index «" + indexWhereRules + "» must be an array of arrays");
                        } else if (whereRule.length !== 2 && whereRule.length !== 3 && whereRule.length !== 4) {
                            throw new Error("Parameter «where» in index «" + indexWhereRules + "» does not have 2, 3 or 4 elements");
                        }
                        let [ subject, operation, object = undefined, isType = "string" ] = whereRule;
                        const tableColumns = projectData.schema.tables[table].columns;
                        if(AVAILABLE_WHERE_OPERATIONS.indexOf(operation) === -1) {
                            throw new Error("Parameter «where» in index «" + indexWhereRules + "» must be a valid operator");
                        } else if (typeof subject !== "string") {
                            throw new Error("Parameter «where» in index «" + indexWhereRules + "» has 3 elements but element 1 is not a string");
                        } else if (subject === "id") {
                            // @OK
                        } else if (!(subject in tableColumns)) {
                            throw new Error("Parameter «where» in index «" + indexWhereRules + "» has 3 elements but element 1 is not a valid column of «" + table + "»");
                        }
                        if(isType === "json") {
                            object = JSON.parse(object);
                        }
                        if(operation === "=null") {
                            if(!(subject in item)) {
                                continue ApplyingWheres;
                            } else if(item[subject] === null) {
                                continue ApplyingWheres;
                            } else {
                                isAcceptedRow = false;
                                break ApplyingWheres;
                            }
                        } else if(operation === "!=null") {
                            if (!(subject in item)) {
                                continue ApplyingWheres;
                            } else if (item[subject] === null) {
                                continue ApplyingWheres;
                            } else {
                                isAcceptedRow = false;
                                break ApplyingWheres;
                            }
                        } else if(whereRule.length < 3) {
                            throw new Error("Parameter «where» in index «" + indexWhereRules + "» does not have 3 elements for operation «" + operation + "»");
                        }
                        if(operation === "=") {
                            if(item[subject] === object) {
                                continue ApplyingWheres;
                            } else {
                                isAcceptedRow = false;
                                break ApplyingWheres;
                            }
                        } else if (operation === "!=") {
                            if (item[subject] !== object) {
                                continue ApplyingWheres;
                            } else {
                                isAcceptedRow = false;
                                break ApplyingWheres;
                            }
                        } else if (operation === "<") {
                            if (item[subject] < object) {
                                continue ApplyingWheres;
                            } else {
                                isAcceptedRow = false;
                                break ApplyingWheres;
                            }
                        } else if (operation === "<=") {
                            if (item[subject] <= object) {
                                continue ApplyingWheres;
                            } else {
                                isAcceptedRow = false;
                                break ApplyingWheres;
                            }
                        } else if (operation === ">") {
                            if (item[subject] > object) {
                                continue ApplyingWheres;
                            } else {
                                isAcceptedRow = false;
                                break ApplyingWheres;
                            }
                        } else if (operation === ">=") {
                            if (item[subject] >= object) {
                                continue ApplyingWheres;
                            } else {
                                isAcceptedRow = false;
                                break ApplyingWheres;
                            }
                        } else if (operation === "has") {
                            if (item[subject].indexOf(object) !== -1) {
                                continue ApplyingWheres;
                            } else {
                                isAcceptedRow = false;
                                break ApplyingWheres;
                            }
                        } else if (operation === "!has") {
                            if (item[subject].indexOf(object) === -1) {
                                continue ApplyingWheres;
                            } else {
                                isAcceptedRow = false;
                                break ApplyingWheres;
                            }
                        } else if (operation === "in") {
                            if (object.indexOf(item[subject]) !== -1) {
                                continue ApplyingWheres;
                            } else {
                                isAcceptedRow = false;
                                break ApplyingWheres;
                            }
                        } else if (operation === "!in") {
                            if (object.indexOf(item[subject]) === -1) {
                                continue ApplyingWheres;
                            } else {
                                isAcceptedRow = false;
                                break ApplyingWheres;
                            }
                        }
                    }
                    if(isAcceptedRow) {
                        matchedItems.push(item);
                    }
                }
            }
            // @STEP: apply sort:
            let sortedItems = matchedItems;
            if(sort.length) {
                const sanitizedSort = [];
                for(let indexSortRules = 0; indexSortRules < sort.length; indexSortRules++) {
                    const sortRuleOriginal = sort[indexSortRules];
                    if (typeof sortRuleOriginal !== "string") {
                        throw new Error("Parameter «sort» in index «" + indexSortRules + "» must be a string");
                    }
                    const isDescendent = sortRuleOriginal.startsWith("!");
                    const sortColumn = isDescendent ? sortRuleOriginal.substr(1) : sortRuleOriginal;
                    if(sortColumn !== "id") {
                        if (!(sortColumn in projectData.schema.tables[table].columns)) {
                            throw new Error("Parameter «sort» in index «" + indexSortRules + "» must be a valid column");
                        }
                    }
                    sanitizedSort.push([ sortColumn, isDescendent ? "desc" : "asc" ]);
                }
                sortedItems = matchedItems.sort(function(itemA, itemB) {
                    SortingItems:
                    for(let indexSortRules = 0; indexSortRules < sanitizedSort.length; indexSortRules++) {
                        const [ column, sense ] = sanitizedSort[indexSortRules];
                        const itemAHasColumn = (column in itemA) && (itemA[column] !== null);
                        const itemBHasColumn = (column in itemB) && (itemB[column] !== null);
                        if((!itemAHasColumn) && (!itemBHasColumn)) {
                            continue SortingItems;
                        }
                        if (sense === "asc") {
                            // @NOTE: NULLs and Undefineds always at the bottom
                            if(!itemBHasColumn) {
                                return -1;
                            } else if(!itemAHasColumn) {
                                return 1;
                            } else if(itemB[column] < itemA[column]) {
                                return 1;
                            } else if (itemA[column] < itemB[column]) {
                                return -1;
                            }
                        } else if (sense === "desc") {
                            // @NOTE: NULLs and Undefineds always at the bottom
                            if (!itemBHasColumn) {
                                return -1;
                            } else if (!itemAHasColumn) {
                                return 1;
                            } else if (itemB[column] < itemA[column]) {
                                return -1;
                            } else if (itemA[column] < itemB[column]) {
                                return 1;
                            }
                        }
                    }
                    return -1;
                });
            }
            // @STEP: apply paginate:
            let paginatedResults = sortedItems;
            if(paginate.length) {
                const [ page = 1, items = 20 ] = paginate;
                let currentPage = 1;
                paginatedResults = [];
                PaginatingRows:
                for (let indexRows = 0; indexRows < sortedItems.length; indexRows++) {
                    const item = sortedItems[indexRows];
                    if(page === 0) {
                        // @OK
                        paginatedResults.push(item);
                        continue PaginatingRows;
                    }
                    if(page === currentPage) {
                        paginatedResults.push(item);
                    }
                    if(((indexRows+1) % items) === 0) {
                        currentPage++;
                    }
                    if(currentPage > page) {
                        break PaginatingRows;
                    }
                }
            } else {
                paginatedResults = paginatedResults.slice(0, 20);
            }
            // @TODO: apply triggers
            const response = {
                message: "Operation «select-rows» successfully achieved",
                table,
                structure: tableSchema,
                items: paginatedResults,
                total: matchedItems.length,
                pagination: paginate.length ? paginate : [ 1, 20 ]
            };
            await protectorHandler.applyOnAfterViewProtectors(response, { results: paginatedResults });
            return response;
        } catch (error) {
            this.environment.utils.debugError("SelectRows.execute", error, true);
        }
    }

}

module.exports = SelectRows;