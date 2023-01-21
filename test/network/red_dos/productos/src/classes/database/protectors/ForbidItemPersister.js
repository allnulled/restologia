const Persister = require(__dirname + "/defaults/Persister.js");

class ForbidItemPersister extends Persister {

    static getDetails() {
        return {
            uid: "ForbidItemPersister",
            name: "Forbid item persister",
            project: null,
            description: "This protector forbids users by default to persist items.",
            usage: "You can specify the privileges that will allow the operation (by default: 'to administrate'). You can also specify the columns that, when match the «user.id» of the authentication, will allow the operation.",
            parameters: [{
                name: "Allowed user column",
                type: "String",
                default: null,
                description: "Name of the column that, when matches the «user.id» of the authentication, will allow to persist the item.",
                required: false,
            }, {
                name: "Allowed privileges",
                type: "String",
                default: "to administrate",
                description: "Name of the privileges, by comma-separated values, that will allow to persist the item.",
                required: false,
            }],
        };
    }

    static checkSettings(settings, projectData, table, operation) {
        if (typeof settings !== "object") {
            throw new Error("Required protector settings to be an object in order to apply «ForbidItemPersister» protector");
        }
        const allowedProperties = [ "Allowed user column", "Allowed privileges" ];
        const allProperties = Object.keys(settings);
        CheckingProperties:
        for(let indexProperty = 0; indexProperty < allProperties.length; indexProperty++) {
            const oneProperty = allProperties[indexProperty];
            if(allowedProperties.indexOf(oneProperty) === -1) {
                throw new Error("Required protector settings to contain only allowed properties but «" + oneProperty + "» is not allowed");
            }
        }
        CheckingAllowedUserColumn:
        if ("Allowed user column" in settings) {
            const userColumn = settings["Allowed user column"];
            if (userColumn === null) {
                break CheckingAllowedUserColumn;
            }
            if (typeof userColumn !== "string") {
                throw new Error("Required protector setting «Allowed user column» to be a string, null or omitted in order to apply «ForbidItemPersister» protector");
            }
            const allColumns = Object.keys(projectData.schema.tables[table].columns);
            if(allColumns.indexOf(userColumn) === -1) {
                throw new Error("Required protector setting «Allowed user column» to be a valid column in order to apply «ForbidItemPersister» protector");
            }
        }
        CheckingAllowedPrivileges:
        if ("Allowed privileges" in settings) {
            const allowedPrivileges = settings["Allowed privileges"];
            if(typeof allowedPrivileges !== "string") {
                throw new Error("Required protector setting «Allowed privileges» to be a string in order to apply «ForbidItemPersister» protector");
            }
        }
    }

    constructor(environment, settings) {
        super(environment, settings);
        this.uid = "ForbidItemPersister";
    }

    async onBeforePersist(publicParameters, privateParameters, configurations, authentication, extra) {
        try {
            this.environment.utils.trace("ForbidItemPersister.onBeforePersist");
            const { value } = extra;
            const { parameters } = this.settings;
            const userColumn = parameters["Allowed user column"];
            const allowedPrivileges = parameters["Allowed privileges"];
            let isAllowedByUserColumn = false;
            CheckingByUserColumn:
            if (typeof userColumn === "string") {
                isAllowedByUserColumn = false;
                if ((userColumn in value) && (value[userColumn] === authentication.user.id)) {
                    isAllowedByUserColumn = true;
                    break CheckingByUserColumn;
                }
            }
            let isAllowedByPrivilege = true;
            CheckingByPrivileges:
            if((typeof allowedPrivileges === "string") && allowedPrivileges.length) {
                isAllowedByPrivilege = false;
                const allAllowedPrivileges = allowedPrivileges.split(",");
                const userPrivileges = authentication.privileges;
                for(let indexPrivilege = 0; indexPrivilege < allAllowedPrivileges.length; indexPrivilege++) {
                    const allowedPrivilege = allAllowedPrivileges[indexPrivilege];
                    for(let indexUserPrivileges = 0; indexUserPrivileges < userPrivileges.length; indexUserPrivileges++) {
                        const userPrivilege = userPrivileges[indexUserPrivileges];
                        if(userPrivilege.name === allowedPrivilege) {
                            isAllowedByPrivilege = true;
                            break CheckingByPrivileges;
                        }
                    }
                }
            }
            const isAllowed = isAllowedByUserColumn || isAllowedByPrivilege;
            if(!isAllowed) {
                throw new Error("Persistence is not allowed by some unmet conditions on «" + publicParameters.operation + "» of item «" + value.id + "» of table «" + privateParameters.table + "»");
            }
        } catch (error) {
            this.environment.utils.debugError("ForbidItemPersister.onBeforePersist", error, true);
        }
    }

    async onAfterPersist(publicParameters, privateParameters, configurations, authentication, response, extra) {
        try {
            this.environment.utils.trace("ForbidItemPersister.onAfterPersist");
            // @OK!
        } catch (error) {
            this.environment.utils.debugError("ForbidItemPersister.onAfterPersist", error, true);
        }
    }

}

module.exports = ForbidItemPersister;