class Logout {

    constructor(environment) {
        this.environment = environment;
    }

    async execute(publicParameters, privateParameters, configurations) {
        try {
            this.environment.utils.trace("Logout.execute");
            ////////////////////////////////
            // 1. Execute operation:
            ////////////////////////////////
            // 1.1. Validate parameters
            const { project } = publicParameters;
            const { authorization: token } = configurations;
            if (!this.environment.utils.check.that(project).isStringMatchingRegex(/^[A-Za-z0-9\.\-\_]+$/g)) {
                throw new Error("Parameter «project» must follow the proper format in order to «logout»");
            }
            if (!this.environment.utils.check.that(token).hasLengthOf(100)) {
                throw new Error("Parameter «token» is not correct in order to «logout»");
            }
            ////////////////////////////////
            // 1.2. Destroy session
            ////////////////////////////////
            // 1.2.A. Respond by externalized auth system:
            const { projectData } = await this.environment.database.Project.initialize(project, "login");
            if (this.environment.utils.check.that(projectData).itsProperty(["schema", "attributes", "isAuthenticatedBy"], undefined).isObject()) {
                const { url: authURL, project: authProjectId } = projectData.schema.attributes.isAuthenticatedBy;
                const response = await this.environment.server.Requester.request("POST", authURL, {
                    project: authProjectId,
                    operation: "logout"
                }, {}, {
                    authorization: token
                }, false, false);
                if (response.response.status === "error") {
                    throw new Error(response.response.error.message);
                }
                return response.response.data;
            }
            ////////////////////////////////
            // 1.2.B. Respond by self auth system:
            await this.environment.database.TransactionManager.block(project + "/sessions.json", async (unblock, unblockFailing) => {
                try {
                    const sessionsPath = this.environment.utils.resolveFromSrc("data/projects/" + project + "/data/sessions.json");
                    const sessions = await this.environment.utils.hydrateJSON(sessionsPath);
                    const matchedSessions = Object.values(sessions.data).filter(session => session.token === token);
                    if (matchedSessions.length === 0) {
                        throw new Error("Session was not found in order to «logout»");
                    }
                    delete sessions.data[matchedSessions[0].id];
                    await this.environment.utils.dehydrateJSON(sessionsPath, sessions);
                    unblock();
                } catch (error) {
                    unblockFailing(error);
                }
            });
            ////////////////////////////////
            // 2. Respond:
            return { message: "Operation «logout» successfully achieved" };
        } catch (error) {
            this.environment.utils.debugError("Logout.execute", error, true);
        }
    }

}

module.exports = Logout;