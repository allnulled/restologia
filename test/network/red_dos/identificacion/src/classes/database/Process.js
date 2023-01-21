class Process {

    constructor(environment) {
        this.environment = environment;
    }

    async execute(publicParameters, privateParameters, configurations) {
        try {
            this.environment.utils.trace("Process.execute");
            const { project, process: processParameter = "" } = publicParameters;
            const { authorization: token } = configurations;
            if (!this.environment.utils.check.that(project).isStringMatchingRegex(/^[A-Za-z0-9\.\-\_]+$/g)) {
                throw new Error("Parameter «project» must follow the proper format in order to «process»");
            }
            if (!this.environment.utils.check.that(token).hasLengthOf(100)) {
                throw new Error("Parameter «token» is not correct in order to «process»");
            }
            const { projectData } = await this.environment.database.Project.initialize(project, "process");
            if(Object.keys(projectData.schema.attributes.hasEnabledProcesses).indexOf(processParameter) === -1) {
                throw new Error("Required parameter «process» to be an identifiable process");
            }
            if(projectData.schema.attributes.hasEnabledProcesses[processParameter] !== true) {
                throw new Error("Required parameter «process» to refer to an enabled process");
            }
            let response = undefined;
            switch (processParameter) {
                case "": {
                    throw new Error("Required parameter «process» to be specified");
                }
                case "restologia.official.org/common/ping": {
                    response = await require(__dirname + "/process/" + "restologia.official.org/common/ping/index.js").call(this.environment, publicParameters, privateParameters, configurations);
                    break;
                }
                case "restologia.official.org/common/os": {
                    response = await require(__dirname + "/process/" + "restologia.official.org/common/os/index.js").call(this.environment, publicParameters, privateParameters, configurations);
                    break;
                }
                case "restologia.test.org/Correos/enviar-correo": {
                    response = await require(__dirname + "/process/" + "restologia.test.org/Correos/enviar-correo.js").call(this.environment, publicParameters, privateParameters, configurations);
                    break;
                }
                ////>>>> INSERT_PROCESSES_LAST_CASE_CLAUSE_HERE <<<<////
                default: {
                    throw new Error("Required parameter «process» to be an identifiable process");
                }
            }
            return { message: "Operation «process» successfully achieved", ...response };
        } catch (error) {
            this.environment.utils.debugError("Process.execute", error, true);
        }
    }

    static selfUpdate(environment) {
        delete require.cache[__dirname + "/Process.js"];
        environment.database.Process = require(__dirname + "/Process.js");
    }

}

module.exports = Process;