class Authentication {

    constructor(environment, project) {
        this.environment = environment;
        this.project = project;
        this.credentials = undefined;
        this.session = undefined;
        this.user = undefined;
        this.groups = undefined;
        this.privileges = undefined;
    }

    setCredentials(userOrEmail, password) {
        this.environment.utils.trace("Authentication.setCredentials");
        this.credentials = [userOrEmail, password ];
    }

    setUser(user) {
        this.environment.utils.trace("Authentication.setUser");
        this.user = user;
    }

    setGroups(groups) {
        this.environment.utils.trace("Authentication.setGroups");
        this.groups = groups;
    }

    setPrivileges(privileges) {
        this.environment.utils.trace("Authentication.setPrivileges");
        this.privileges = privileges;
    }

    setSession(session) {
        this.environment.utils.trace("Authentication.setSession");
        this.session = session;
    }

    toPlainObject() {
        const sanitizedUser = Object.assign({}, this.user);
        const sanitizedSession = Object.assign({}, this.session);
        delete sanitizedUser.password;
        delete sanitizedSession.token;
        return {
            project: this.project,
            session: sanitizedSession,
            user: sanitizedUser,
            groups: this.groups,
            privileges: this.privileges,
        };
    }

}

module.exports = Authentication;