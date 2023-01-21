class Login {

    constructor(environment) {
        this.environment = environment;
    }

    async execute(publicParameters, privateParameters, configurations) {
        try {
            this.environment.utils.trace("Login.execute");
            ////////////////////////////////
            // 1. Execute operation:
            ////////////////////////////////
            // 1.1. Validate parameters
            const { project } = publicParameters;
            const { user: userOrEmail, password } = privateParameters;
            if (!this.environment.utils.check.that(project).isStringMatchingRegex(/^[A-Za-z0-9\.\-\_]+$/g)) {
                throw new Error("Parameter «project» must follow the proper format in order to «login»");
            }
            ////////////////////////////////
            // 1.2. Create session (or return current)
            ////////////////////////////////
            // 1.2.A. Respond by externalized auth system:
            const { projectData } = await this.environment.database.Project.initialize(project, "login");
            if (this.environment.utils.check.that(projectData).itsProperty(["schema", "attributes", "isAuthenticatedBy"], undefined).isObject()) {
                const { url: authURL, project: authProjectId } = projectData.schema.attributes.isAuthenticatedBy;
                const response = await this.environment.server.Requester.request("POST", authURL, {
                    project: authProjectId,
                    operation: "login"
                }, {
                    user: userOrEmail,
                    password
                }, {}, false, false);
                if(response.response.status === "error") {
                    throw new Error(response.response.error.message);
                }
                return response.response.data;
            }
            ////////////////////////////////
            // 1.2.B. Respond by self auth system:
            const usersPath = this.environment.utils.resolveFromSrc("data/projects/" + project + "/data/users.json");
            const sessionsPath = this.environment.utils.resolveFromSrc("data/projects/" + project + "/data/sessions.json");
            const users = await this.environment.utils.hydrateJSON(usersPath);
            const matchedUsers = Object.values(users.data).filter(user => ((user.name === userOrEmail) || (user.email === userOrEmail)));
            if(matchedUsers.length === 0) {
                throw new Error("User was not found in order to «login»");
            }
            const bypasswordedUsers = matchedUsers.filter(user => user.password === password);
            if(bypasswordedUsers.length === 0) {
                throw new Error("Password is not correct in order to «login»");
            }
            const matchedUser = bypasswordedUsers[0];
            let session = undefined;
            let isRetaken = false;
            await this.environment.database.TransactionManager.block(project + "/sessions.json", async (unblock, unblockFailing) => {
                try {
                    const sessions = await this.environment.utils.hydrateJSON(sessionsPath);
                    const matchedSessions = Object.values(sessions.data).filter(session => session.user === matchedUser.id);
                    const isRetaken = matchedSessions.length !== 0;
                    const sessionToken = isRetaken ? matchedSessions[0].token : this.environment.utils.generateRandomString(100);
                    const id = isRetaken ? matchedSessions[0].id : sessions.id++;
                    session = { id, user: matchedUser.id, token: sessionToken };
                    sessions.data[id] = session;
                    await this.environment.utils.dehydrateJSON(sessionsPath, sessions);
                    const authenticator = new this.environment.auth.Authenticator(this.environment, project);
                    const authentication = await authenticator.authenticate(sessionToken);
                    delete authentication.user.password;
                    delete authentication.user.created_at;
                    delete authentication.user.updated_at;
                    session.authentication = {
                        user: authentication.user,
                        groups: authentication.groups,
                        privileges: authentication.privileges
                    };
                    unblock();
                } catch(error) {
                    unblockFailing(error);
                }
            });
            ////////////////////////////////
            // 2. Respond:
            return { message: "Operation «login» successfully achieved", session, taken: isRetaken };
        } catch (error) {
            this.environment.utils.debugError("Login.execute", error, true);
        }
    }

}

module.exports = Login;