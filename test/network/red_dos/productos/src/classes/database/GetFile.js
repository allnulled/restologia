const fs = require("fs");

class GetFile {

    constructor(environment) {
        this.environment = environment;
    }

    async execute(publicParameters, privateParameters, configurations, originalResponse) {
        try {
            this.environment.utils.trace("GetFile.execute");
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
                throw new Error("User is not allowed to «get-file»");
            }
            // @TODO: apply protectors
            const { table, column, columnIndex = undefined } = publicParameters;
            let { id = "0" } = publicParameters;
            if (!this.environment.utils.check.that(table).isStringMatchingRegex(/^[A-Za-z0-9\.\-\_]+$/g)) {
                throw new Error("Required parameter «table» to be a non-empty string based only on letters, numbers, '.', '-' and '_' in order to «get-file»");
            }
            if (typeof id === "number") {
                // @OK
            } else if (!this.environment.utils.check.that(id).isStringMatchingRegex(/^[0-9]+$/g)) {
                throw new Error("Required parameter «id» to be a number in order to «get-file»");
            }
            if (!this.environment.utils.check.that(column).isStringMatchingRegex(/^[A-Za-z0-9\.\-\_]+$/g)) {
                throw new Error("Required parameter «column» to be a non-empty string based only on letters, numbers, '.', '-' and '_' in order to «get-file»");
            }
            if(typeof columnIndex === "undefined") {
                // @OK
            } else if (typeof columnIndex === "number") {
                // @OK
            } else if (!this.environment.utils.check.that(id).isStringMatchingRegex(/^[0-9]+$/g)) {
                throw new Error("Required parameter «id» to be a number in order to «get-file»");
            }
            if(typeof id === "string") {
                id = parseInt(id);
            }
            const { projectData } = await this.environment.database.Project.initialize(project, "get-file");
            const tableSchema = projectData.schema.tables[table];
            if (!this.environment.utils.check.that(tableSchema).itsProperty([ "columns", column, "attributes", "isType"], undefined).isOneOf(["file", "image"])) {
                this.environment.utils.debug(tableSchema.columns[column].attributes.isType);
                throw new Error("Required parameter «table» and «column» to refer to a schema column that is type «file» or «image» in order to «get-file»");
            }
            const protectorHandler = await this.environment.database.ProtectorHandler.initialize(this.environment, publicParameters, privateParameters, configurations, authentication, projectData);
            await protectorHandler.applyOnBeforeViewProtectors({ projectData });
            const selectOperation = new this.environment.database.SelectRows(this.environment);
            const selectResponse = await selectOperation.execute({
                project,
                table,
                where: JSON.stringify([[ "id", "=", id ]])
            }, {}, configurations);
            if(selectResponse.items.length === 0) {
                throw new Error("Required parameter «id» to refer to a «table» (" + table + ") identifier in order to «get-file»");
            } else if(selectResponse.items.length !== 1) {
                throw new Error("Parameter parameter «id» to not belong to a corrupted data item. Please, contact the administrator of the server.");
            }
            const selectedProperty = selectResponse.items[0][column];
            if (!this.environment.utils.check.that(selectedProperty).isStringMatchingRegex(/^[A-Za-z0-9\-\.\_]+/g)) {
                throw new Error("Required property «" + column + "» (" + selectedProperty + ") from item «" + table + "» on identifier «" + id + "» to only be composed by letters, numbers and «-», «.» and «_» in order to «get-file»")
            }
            // @TODO: apply triggers
            const targetItem = selectResponse.items[0];
            const targetPath = this.environment.utils.resolveFromSrc(targetItem[column]);
            const targetReader = fs.createReadStream(targetPath);
            originalResponse.setHeader("Access-Control-Allow-Origin", "*");
            originalResponse.setHeader("Access-Control-Allow-Headers", "*");
            originalResponse.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
            targetReader.on("error", error => {
                originalResponse.write("There were errors on the process of «get-file»: ");
                originalResponse.write("[Error:] " + error.name + " [Message:] " + error.message + " [Stack:] " + error.stack);
                originalResponse.end();
                return;
            });
            return targetReader.pipe(originalResponse);
        } catch (error) {
            this.environment.utils.debugError("GetFile.execute", error, true);
        }
    }

    dispatchResult(project, table, column, id, item) {
        try {
        } catch(error) {
            
        }
    }

}

module.exports = GetFile;