class CreateProject {

    constructor(environment) {
        this.environment = environment;
    }

    async execute(publicParameters, privateParameters, configurations) {
        try {
            this.environment.utils.trace("CreateProject.execute");
            ////////////////////////////////
            // 1. Authorize operation:
            const user = this.environment.settings.ADMINISTRATOR_USER;
            const password = this.environment.settings.ADMINISTRATOR_PASSWORD;
            if(privateParameters.user !== user) {
                throw new Error("Specified user does not correspond to administrator in order to «create-project»");
            }
            if(privateParameters.password !== password) {
                throw new Error("Specified password does not correspond to administrator in order to «create-project»");
            }
            ////////////////////////////////
            // 2. Execute operation:
            ////////////////////////////////
            // 2.1. Validate parameters
            const project = privateParameters.project;
            if (!this.environment.utils.check.that(project).isStringMatchingRegex(/^[A-Za-z0-9\.\-\_]+$/g)) {
                throw new Error("Parameter «project» must be a non-empty string based only on letters, numbers, '.', '-' and '_' in order to «create-project»");
            }
            const { projectPath } = new this.environment.database.Project(project, "create-project");
            const projectDirectory = require("path").dirname(projectPath);
            const projectExists = await this.environment.utils.fileExists(projectDirectory);
            if(projectExists) {
                throw new Error("Project «" + project + "» cannot be created because it already exists");
            }
            ////////////////////////////////
            // 2.2. Copy & Paste defaults with proper alterations
            const projectOriginFile = __dirname + "/defaults/project.json";
            const projectData = await this.environment.utils.hydrateJSON(projectOriginFile);
            const projectDataDirectory = this.environment.utils.resolveFromSrc("data/projects/" + project + "/data");
            const projectFilesDirectory = this.environment.utils.resolveFromSrc("data/projects/" + project + "/files");
            const sessionsDestinationFile = projectDataDirectory + "/sessions.json";
            const usersDestinationFile = projectDataDirectory + "/users.json";
            const groupsDestinationFile = projectDataDirectory + "/groups.json";
            const privilegesDestinationFile = projectDataDirectory + "/privileges.json";
            await this.environment.utils.createDirectory(projectDirectory);
            await this.environment.utils.createDirectory(projectDataDirectory);
            await this.environment.utils.createDirectory(projectFilesDirectory);
            if(privateParameters.schema_attributes) {
                Object.assign(projectData.schema.attributes, privateParameters.schema_attributes);
            }
            if (!this.environment.utils.check.that(projectData).itsProperty(["schema", "attributes", "isAuthenticatedBy"], undefined).isObject()) {
                const administratorName = privateParameters.administrator_name;
                const administratorEmail = privateParameters.administrator_email;
                const administratorPassword = privateParameters.administrator_password;
                if (!this.environment.utils.check.that(administratorName).isStringMatchingRegex(/^[A-Za-z0-9\.\-\_]+$/g)) {
                    throw new Error("Parameter «administrator_name» must be a non-empty string based only on letters, numbers, '.', '-' and '_' in order to «create-project»");
                }
                if (!this.environment.utils.check.that(administratorEmail).isStringMatchingRegex(/^[A-Za-z0-9\.\-\_\@]+$/g)) {
                    throw new Error("Parameter «administrator_email» must be a non-empty string based only on letters, numbers, '@', '.', '-' and '_' in order to «create-project»");
                }
                if (!this.environment.utils.check.that(administratorPassword).isStringMatchingRegex(/^[A-Za-z0-9\.\-\_]+$/g)) {
                    throw new Error("Parameter «administrator_password» must be a non-empty string based only on letters, numbers, '.', '-' and '_' in order to «create-project»");
                }
                const sessionsOriginFile = __dirname + "/defaults/sessions.json";
                const usersOriginFile = __dirname + "/defaults/users.json";
                const groupsOriginFile = __dirname + "/defaults/groups.json";
                const privilegesOriginFile = __dirname + "/defaults/privileges.json";
                const sessions = await this.environment.utils.hydrateJSON(sessionsOriginFile);
                const users = await this.environment.utils.hydrateJSON(usersOriginFile);
                const groups = await this.environment.utils.hydrateJSON(groupsOriginFile);
                const privileges = await this.environment.utils.hydrateJSON(privilegesOriginFile);
                users.data[1].name = administratorName;
                users.data[1].email = administratorEmail;
                users.data[1].password = administratorPassword;
                users.data[1].groups = [1];
                users.data[1].privileges = [];
                await this.environment.utils.dehydrateJSON(sessionsDestinationFile, sessions);
                await this.environment.utils.dehydrateJSON(usersDestinationFile, users);
                await this.environment.utils.dehydrateJSON(groupsDestinationFile, groups);
                await this.environment.utils.dehydrateJSON(privilegesDestinationFile, privileges);
            } else {
                delete projectData.schema.tables.users;
                delete projectData.schema.tables.groups;
                delete projectData.schema.tables.privileges;
                delete projectData.schema.tables.sessions;
            }
            const projectDestinationFile = projectDirectory + "/project.json";
            await this.environment.utils.dehydrateJSON(projectDestinationFile, projectData);
            ////////////////////////////////
            // 3. Respond:
            return { message: "Operation «create-project» successfully achieved", project };
        } catch (error) {
            this.environment.utils.debugError("CreateProject.execute", error, true);
        }
    }

}

module.exports = CreateProject;