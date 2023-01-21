class Authenticator {

    constructor(environment, project) {
        this.environment = environment;
        this.project = project;
    }

    async authenticate(token) {
        try {
            this.environment.utils.trace("Authenticator.authenticate");
            const authentication = new this.environment.auth.Authentication(this.environment, this.project);
            const { projectData } = await this.environment.database.Project.initialize(this.project, "authenticate");
            ////////////////////////////////
            // 1.2.A. Respond by externalized auth system:
            if(this.environment.utils.check.that(projectData).itsProperty(["schema", "attributes", "isAuthenticatedBy"]).isObject()) {
                const { url: authURL, project: authProjectId } = projectData.schema.attributes.isAuthenticatedBy;
                const response = await this.environment.server.Requester.request("GET", authURL, {
                    project: authProjectId,
                    operation: "authenticate"
                }, {}, {
                    authorization: token
                }, false, false);
                if (response.response.status === "error") {
                    throw new Error(response.response.error.message);
                }
                authentication.setSession(response.response.data.authentication.session);
                authentication.setUser(response.response.data.authentication.user);
                authentication.setGroups(response.response.data.authentication.groups);
                authentication.setPrivileges(response.response.data.authentication.privileges);
                return authentication;
            }
            ////////////////////////////////
            // 1.2.B. Respond by self auth system:
            const usersPath = this.environment.utils.resolveFromSrc("data/projects/" + this.project + "/data/users.json");
            const sessionsPath = this.environment.utils.resolveFromSrc("data/projects/" + this.project + "/data/sessions.json");
            const groupsPath = this.environment.utils.resolveFromSrc("data/projects/" + this.project + "/data/groups.json");
            const privilegesPath = this.environment.utils.resolveFromSrc("data/projects/" + this.project + "/data/privileges.json");
            // Sessions:
            const sessions = await this.environment.utils.hydrateJSON(sessionsPath);
            const matchedSessions = Object.values(sessions.data).filter(session => session.token === token);
            if (matchedSessions.length === 0) {
                throw new Error("Authentication token is not valid on authentication process");
            }
            const [matchedSession] = matchedSessions;
            // Users:
            const users = await this.environment.utils.hydrateJSON(usersPath);
            const matchedUsers = Object.values(users.data).filter(user => user.id === matchedSession.user);
            if (matchedUsers.length !== 1) {
                throw new Error("Session token does not correspond to any valid user");
            }
            const [matchedUser] = matchedUsers;
            // Groups:
            const groups = await this.environment.utils.hydrateJSON(groupsPath);
            const matchedGroups = matchedUser.groups.map(groupId => groups.data[groupId]);
            // Privileges:
            const privileges = await this.environment.utils.hydrateJSON(privilegesPath);
            const matchedPrivilegesMap = matchedUser.privileges.reduce((output, privilegeId) => {
                output[privilegeId] = privileges.data[privilegeId];
                return output;
            }, {});
            matchedGroups.forEach(group => {
                group.privileges.forEach(privilegeId => {
                    const matchedPrivilege = privileges.data[privilegeId];
                    matchedPrivilegesMap[privilegeId] = matchedPrivilege;
                });
            });
            const matchedPrivileges = Object.values(matchedPrivilegesMap);
            // Fill authentication:
            authentication.setSession(matchedSession);
            authentication.setUser(matchedUser);
            authentication.setGroups(matchedGroups);
            authentication.setPrivileges(matchedPrivileges);
            // Return authentication:
            return authentication;
        } catch(error) {
            this.environment.utils.debugError("Authenticator.authenticate", error, true);
        }
    }

}

module.exports = Authenticator;