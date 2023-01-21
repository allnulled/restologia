class DeleteProject {

    constructor(environment) {
        this.environment = environment;
    }

    async execute(publicParameters, privateParameters, configurations) {
        try {
            this.environment.utils.trace("DeleteProject.execute");
            ////////////////////////////////
            // 1. Authorize operation:
            const user = this.environment.settings.ADMINISTRATOR_USER;
            const password = this.environment.settings.ADMINISTRATOR_PASSWORD;
            if (privateParameters.user !== user) {
                throw new Error("Specified user does not correspond to administrator in order to «delete-project»");
            }
            if (privateParameters.password !== password) {
                throw new Error("Specified password does not correspond to administrator in order to «delete-project»");
            }
            ////////////////////////////////
            // 2. Execute operation:
            ////////////////////////////////
            // 2.1. Validate parameters
            const project = privateParameters.project;
            if (!this.environment.utils.check.that(project).isStringMatchingRegex(/^[A-Za-z0-9\.\-\_]+$/g)) {
                throw new Error("Parameter «project» must be a non-empty string based only on letters, numbers, '.' and '-' in order to «create-project»");
            }
            const { projectPath } = new this.environment.database.Project(project, "delete-project");
            const projectDirectory = require("path").dirname(projectPath);
            const projectExists = await this.environment.utils.fileExists(projectDirectory);
            if (!projectExists) {
                throw new Error("Project «" + project + "» cannot be deleted because it does not exist");
            }
            ////////////////////////////////
            // 2.2. Delete recursively files & folders
            await this.environment.utils.deleteDirectory(projectDirectory, true);
            ////////////////////////////////
            // 3. Respond:
            return { message: "Operation «delete-project» successfully achieved", project };
        } catch (error) {
            this.environment.utils.debugError("DeleteProject.execute", error, true);
        }
    }

}

module.exports = DeleteProject;