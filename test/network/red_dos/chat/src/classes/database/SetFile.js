class SetFile {

    constructor(environment) {
        this.environment = environment;
    }

    async execute(publicParameters, privateParameters, configurations, originalRequest) {
        try {
            this.environment.utils.trace("SetFile.execute");
            const project = publicParameters.project;
            const authenticator = new this.environment.auth.Authenticator(this.environment, project);
            const authentication = await authenticator.authenticate(configurations.authorization);
            const authorizator = new this.environment.auth.Authorizator(this.environment, project);
            const authorization = await authorizator.authorize(authentication);
            const hasAuthorization = await authorization.forOperation(
                publicParameters.operation,
                publicParameters.table,
                publicParameters.id,
                publicParameters.column
            );
            if (!hasAuthorization) {
                throw new Error("User is not allowed to «set-file»");
            }
            this.environment.utils.trace("SetFile.execute:lookingForRow");
            const { table, column } = publicParameters;
            if (!this.environment.utils.check.that(table).isStringMatchingRegex(/^[A-Za-z0-9\.\-\_]+$/g)) {
                throw new Error("Parameter «table» must be a non-empty string based only on letters, numbers, '.', '-' and '_' in order to «set-file»");
            }
            if (!this.environment.utils.check.that(column).isStringMatchingRegex(/^[A-Za-z0-9\.\-\_]+$/g)) {
                throw new Error("Parameter «column» must be a non-empty string based only on letters, numbers, '.', '-' and '_' in order to «set-file»");
            }
            let { id = '0' } = publicParameters;
            if(typeof id === "string") {
                id = parseInt(id);
            }
            const selectOperation = new this.environment.database.SelectRows(this.environment);
            const selectResponse = await selectOperation.execute({
                project,
                table,
                where: JSON.stringify([[ "id", "=", id ]])
            }, privateParameters, configurations);
            if (!selectResponse.items.length) {
                throw new Error("Cannot find row identified by «id» (" + id + ":" + typeof(id) + ") in «table» (" + table + ") in order to «set-file»");
            }
            const [ firstMatched ] = selectResponse.items;
            this.environment.utils.trace("SetFile.execute:rowFound");
            const { projectData } = await this.environment.database.Project.initialize(project, "set-file");
            const allowedTypes = ["file", "image"];
            if (!this.environment.utils.check.that(projectData).itsProperty(["schema", "tables", table, "columns", column, "attributes", "isType"], undefined).isOneOf(allowedTypes)) {
                throw new Error("Required parameter «column» (" + column + ") to match a column in schema that is of type «" + allowedTypes.join("» or «") + "» in order «set-file»")
            }
            this.environment.utils.trace("SetFile.execute:rowValidated");
            const multipartParser = new this.environment.server.MultipartParser(this.environment);
            const details = await multipartParser.parseRequest(originalRequest);
            this.environment.utils.trace("SetFile.execute:dataParsed");
            const { files, fields } = details;
            const fileKeys = Object.keys(files);
            if (fileKeys.length === 0) {
                throw new Error("Required parameter «files» in form to be more than 0 in order to «set-file»");
            } else if(fileKeys.length > 1) {
                throw new Error("Required parameter «files» in form to not be more than 1 in order to «set-file»");
            }
            const uploadUid = this.environment.utils.generateRandomString(10);
            const updateOperation = new this.environment.database.UpdateRow(this.environment);
            const fileKey = Object.keys(files)[0];
            const value = Object.assign({}, { [column]: null });
            CopyingFile: {
                const fileMetadata = files[fileKey];
                if (typeof fileMetadata.info.filename !== "string") {
                    break CopyingFile;
                }
                const fileOrigin = fileMetadata.temporaryPath;
                const filenameSanitized = fileMetadata.info.filename.substr(0, 100).replace(/[^a-zA-Z0-9\.\-]/g, "x");
                const fileDate = this.environment.utils.fromDateToString(new Date(), true).replace(/[\/\: ]/g, "");
                const fileDestination = this.environment.utils.resolveFromSrc("./data/projects/" + project + "/files/file-column.on-" + fileDate + ".column-" + table + "." + id + column + ".uid-" + uploadUid + ".as-" + filenameSanitized);
                if (!this.environment.utils.check.that(filenameSanitized).isStringMatchingRegex(/^[A-Za-z0-9\-\.\_]+/g)) {
                    throw new Error("Required parameter «filename» (" + filenameSanitized + ") to only be composed by letters, numbers and «-», «.» and «_» in order to «set-file»");
                }
                await this.environment.utils.copyFile(fileOrigin, fileDestination);
                delete details.files[fileKey].temporaryPath;
                details.files[fileKey].uploadPath = fileOrigin.replace(this.environment.settings.PROJECT_SRC + "/", "./");
                details.files[fileKey].columnPath = fileDestination.replace(this.environment.settings.PROJECT_SRC + "/", "./");
                value[column] = details.files[fileKey].columnPath;
                this.environment.utils.trace("SetFile.execute:fileDumped");
            }
            this.environment.utils.trace("SetFile.execute:allFilesDumped");
            const updateResponse = await updateOperation.execute({
                project,
            }, {
                table,
                id,
                value: JSON.stringify(value),
            }, configurations);
            this.environment.utils.trace("SetFile.execute:rowUpdated");
            // @TODO: apply protectors
            // @TODO........
            // @TODO........
            // @TODO........
            // @TODO........
            // @TODO: apply triggers
            const response = {
                message: "Operation «set-file» successfully achieved",
                details
            }
            return response;
        } catch (error) {
            this.environment.utils.debugError("SetFile.execute", error, true);
        }
    }

}

module.exports = SetFile;