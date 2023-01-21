class UpdateProtector {

    constructor(environment) {
        this.environment = environment;
    }

    async execute(publicParameters, privateParameters, configurations) {
        try {
            this.environment.utils.trace("UpdateProtector.execute");
            const project = publicParameters.project;
            const authenticator = new this.environment.auth.Authenticator(this.environment, project);
            const authentication = await authenticator.authenticate(configurations.authorization);
            const authorizator = new this.environment.auth.Authorizator(this.environment, project);
            const authorization = await authorizator.authorize(authentication);
            const hasAuthorization = await authorization.forOperation(
                publicParameters.operation
            );
            if (!hasAuthorization) {
                throw new Error("User is not allowed to «update-protector»");
            }
            // @TODO: apply protectors
            const { table } = privateParameters;
            const { protector_new_name = undefined, protector_name, protector_type, parameters: parametersOriginal } = privateParameters;
            if (!this.environment.utils.check.that(project).isStringMatchingRegex(/^[A-Za-z0-9\.\-\_]+$/g)) {
                throw new Error("Parameter «project» must be a non-empty string based only on letters, numbers, '.', '-' and '_' in order to «update-protector»");
            }
            if (!this.environment.utils.check.that(table).isStringMatchingRegex(/^[A-Za-z0-9\.\-\_]+$/g)) {
                throw new Error("Parameter «table» must be a non-empty string based only on letters, numbers, '.', '-' and '_' in order to «update-protector»");
            }
            if (!this.environment.utils.check.that(parametersOriginal).isString()) {
                throw new Error("Parameter «parameters» must be a string in order to «update-protector»");
            }
            if ((!this.environment.utils.check.that(protector_new_name)) && (!this.environment.utils.check.that(protector_new_name).isStringMatchingRegex(/^[A-Za-z0-9\.\-\_]+$/g))) {
                throw new Error("Parameter «protector_new_name» must be ommited or a string based only on letters, numbers, '.', '-' and '_' in order to «update-protector»");
            }
            if (!this.environment.utils.check.that(protector_type).isStringMatchingRegex(/^[A-Za-z0-9\.\-\_]+$/g)) {
                throw new Error("Parameter «protector_type» must be ommited or a string based only on letters, numbers, '.', '-' and '_' in order to «update-protector»");
            }
            if (!this.environment.utils.check.that(protector_name).isString()) {
                throw new Error("Parameter «protector_name» must be a string in order to «update-protector»");
            }
            const parameters = JSON.parse(parametersOriginal);
            if (!this.environment.utils.check.that(parameters).isObject()) {
                throw new Error("Parameter «parameters» must be a JSON object in order to «update-protector»");
            }
            await this.environment.database.TransactionManager.block(project + "/project.json", async (unblock, unblockFailing) => {
                try {
                    const { projectPath, projectData } = await this.environment.database.Project.initialize(project, "update-table");
                    if (!(table in projectData.schema.tables)) {
                        throw new Error("Parameter «table» must exist as table in schema in order to «update-protector»");
                    }
                    const tableProtectors = projectData.schema.tables[table].attributes.hasProtectors || [];
                    const coincidingProtectors = tableProtectors.filter(protector => protector.name === protector_name);
                    if (this.environment.utils.check.that(coincidingProtectors.length).equals(0)) {
                        throw new Error("Parameter «protector_name» must exist as table protector name in order to «update-protector»");
                    }
                    if (!this.environment.utils.check.that(coincidingProtectors.length).equals(1)) {
                        throw new Error("Parameter «protector_name» must be unique as table protector name in order to «update-protector»");
                    }
                    const availableProtectorIdsBrute = await this.environment.utils.listDirectory(__dirname + "/protectors");
                    const availableProtectorIds = availableProtectorIdsBrute.filter(protector => protector.endsWith(".js")).map(protector => protector.replace(/\.js$/g, ""));
                    if (availableProtectorIds.indexOf(protector_type) === -1) {
                        throw new Error("Parameter «parameter_type» must match a valid protector type in order to «update-protector»");
                    }
                    const protectorClass = require(__dirname + "/protectors/" + protector_type + ".js");
                    await protectorClass.checkSettings(parameters, projectData, table, "update-protector");
                    if (!("hasProtectors" in projectData.schema.tables[table].attributes)) {
                        projectData.schema.tables[table].attributes.hasProtectors = [];
                    }
                    projectData.schema.tables[table].attributes.hasProtectors = projectData.schema.tables[table].attributes.hasProtectors.map(protector => {
                        if(protector.name !== protector_name) {
                            return protector;
                        }
                        return {
                            id: protector_type,
                            fixed: false,
                            name: protector_new_name,
                            parameters,
                        };
                    });
                    await this.environment.utils.dehydrateJSON(projectPath, projectData);
                    unblock();
                } catch (error) {
                    unblockFailing(error);
                }
            });
            // @TODO: apply triggers
            return { message: "Operation «update-protector» successfully achieved", project };
        } catch (error) {
            this.environment.utils.debugError("UpdateProtector.execute", error, true);
        }
    }

}

module.exports = UpdateProtector;