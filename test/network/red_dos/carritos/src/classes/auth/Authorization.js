class Authorization {

    constructor(environment, project, authentication) {
        this.environment = environment;
        this.project = project;
        this.authentication = authentication;
    }

    isAuthorizedToSelect(operation, table, ...parameters) {
        // @TOCUSTOMIZE:
        return true;
    }

    isAuthorizedToInsert(operation, table, ...parameters) {
        // @TOCUSTOMIZE:
        return true;
    }

    isAuthorizedToUpdate(operation, table, ...parameters) {
        // @TOCUSTOMIZE:
        return true;
    }

    isAuthorizedToDelete(operation, table, ...parameters) {
        // @TOCUSTOMIZE:
        return true;
    }

    isAuthorizedToAddTable(operation, table, ...parameters) {
        // @TOCUSTOMIZE:
        return this.authentication.privileges.filter(privilege => privilege.name === "to administrate").length > 0;
    }

    isAuthorizedToAddColumn(operation, table, ...parameters) {
        // @TOCUSTOMIZE:
        return this.authentication.privileges.filter(privilege => privilege.name === "to administrate").length > 0;
    }

    isAuthorizedToAddProtector(operation, table, ...parameters) {
        // @TOCUSTOMIZE:
        return this.authentication.privileges.filter(privilege => privilege.name === "to administrate").length > 0;
    }

    isAuthorizedToUpdateTable(operation, table, ...parameters) {
        // @TOCUSTOMIZE:
        return this.authentication.privileges.filter(privilege => privilege.name === "to administrate").length > 0;
    }

    isAuthorizedToUpdateColumn(operation, table, ...parameters) {
        // @TOCUSTOMIZE:
        return this.authentication.privileges.filter(privilege => privilege.name === "to administrate").length > 0;
    }

    isAuthorizedToUpdateProtector(operation, table, ...parameters) {
        // @TOCUSTOMIZE:
        return this.authentication.privileges.filter(privilege => privilege.name === "to administrate").length > 0;
    }

    isAuthorizedToDeleteTable(operation, table, ...parameters) {
        // @TOCUSTOMIZE:
        return this.authentication.privileges.filter(privilege => privilege.name === "to administrate").length > 0;
    }

    isAuthorizedToDeleteColumn(operation, table, ...parameters) {
        // @TOCUSTOMIZE:
        return this.authentication.privileges.filter(privilege => privilege.name === "to administrate").length > 0;
    }

    isAuthorizedToDeleteProtector(operation, table, ...parameters) {
        // @TOCUSTOMIZE:
        return this.authentication.privileges.filter(privilege => privilege.name === "to administrate").length > 0;
    }

    isAuthorizedToLogin(operation, table, ...parameters) {
        // @TOCUSTOMIZE:
        return true;
    }

    isAuthorizedToLogout(operation, table, ...parameters) {
        // @TOCUSTOMIZE:
        return true;
    }

    isAuthorizedToViewSchema(operation, table, ...parameters) {
        // @TOCUSTOMIZE:
        return true;
    }

    isAuthorizedToViewProtectors(operation, table, ...parameters) {
        // @TOCUSTOMIZE:
        return true;
    }

    
    async forOperation(operation, table, ...parameters) {
        try {
            this.environment.utils.trace("Authorization.forOperation");
            switch(operation) {
                case "select": return this.isAuthorizedToSelect(operation, table, ...parameters);
                case "insert": return this.isAuthorizedToInsert(operation, table, ...parameters);
                case "update": return this.isAuthorizedToUpdate(operation, table, ...parameters);
                case "delete": return this.isAuthorizedToDelete(operation, table, ...parameters);
                case "add-table": return this.isAuthorizedToAddTable(operation, table, ...parameters);
                case "add-column": return this.isAuthorizedToAddColumn(operation, table, ...parameters);
                case "add-protector": return this.isAuthorizedToAddProtector(operation, table, ...parameters);
                case "update-table": return this.isAuthorizedToUpdateTable(operation, table, ...parameters);
                case "update-column": return this.isAuthorizedToUpdateColumn(operation, table, ...parameters);
                case "update-protector": return this.isAuthorizedToUpdateProtector(operation, table, ...parameters);
                case "delete-table": return this.isAuthorizedToDeleteTable(operation, table, ...parameters);
                case "delete-column": return this.isAuthorizedToDeleteColumn(operation, table, ...parameters);
                case "delete-protector": return this.isAuthorizedToDeleteProtector(operation, table, ...parameters);
                case "login": return this.isAuthorizedToLogin(operation, table, ...parameters);
                case "logout": return this.isAuthorizedToLogout(operation, table, ...parameters);
                case "view-schema": return this.isAuthorizedToViewSchema(operation, table, ...parameters);
                case "view-protectors": return this.isAuthorizedToViewProtectors(operation, table, ...parameters);
                default: return true;
            }
        } catch(error) {
            this.environment.utils.debugError("Authorization.forOperation", error, true);
        }
    }
}

module.exports = Authorization;