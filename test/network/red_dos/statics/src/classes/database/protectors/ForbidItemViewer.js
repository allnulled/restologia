const Viewer = require(__dirname + "/defaults/Viewer.js");

class ForbidItemViewer extends Viewer {

    static getDetails() {
        return {
            uid: "ForbidItemViewer",
            name: "Forbid item viewer",
            project: null,
            description: "This protector forbids users by default to view items.",
            usage: "You can specify the privileges that will allow the operation (by default: 'to administrate'). You can also specify the columns that, when match the «user.id» of the authentication, will allow the operation.",
            parameters: [{
                name: "Allowed user column",
                type: "String",
                default: null,
                description: "Name of the column that, when matches the «user.id» of the authentication, will allow to view the item.",
                required: false,
            }, {
                name: "Allowed privileges",
                type: "String",
                default: "to administrate",
                description: "Name of the privileges, by comma-separated values, that will allow to view any items.",
                required: false,
            }],
        };
    }

    static checkSettings(settings, projectData, table, operation) {
        if (typeof settings !== "object") {
            throw new Error("Required protector settings to be an object in order to apply «ForbidItemViewer» protector");
        }
        const allowedProperties = ["Allowed user column", "Allowed privileges"];
        const allProperties = Object.keys(settings);
        CheckingProperties:
        for (let indexProperty = 0; indexProperty < allProperties.length; indexProperty++) {
            const oneProperty = allProperties[indexProperty];
            if (allowedProperties.indexOf(oneProperty) === -1) {
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
                throw new Error("Required protector setting «Allowed user column» to be a string, null or omitted in order to apply «ForbidItemViewer» protector");
            }
            const allColumns = Object.keys(projectData.schema.tables[table].columns);
            if (allColumns.indexOf(userColumn) === -1) {
                throw new Error("Required protector setting «Allowed user column» to be a valid column in order to apply «ForbidItemViewer» protector");
            }
        }
        CheckingAllowedPrivileges:
        if ("Allowed privileges" in settings) {
            const allowedPrivileges = settings["Allowed privileges"];
            if (typeof allowedPrivileges !== "string") {
                throw new Error("Required protector setting «Allowed privileges» to be a string in order to apply «ForbidItemViewer» protector");
            }
        }
    }

    constructor(environment, settings) {
        super(environment, settings);
        this.uid = "ForbidItemViewer";
    }

    async onBeforeView(publicParameters, privateParameters, configurations, authentication, extra) {
        try {
            this.environment.utils.trace("ForbidItemViewer.onBeforeView");
            const { value } = extra;
            const { parameters } = this.settings;
            const userColumn = parameters["Allowed user column"] || undefined;
            const allowedPrivileges = parameters["Allowed privileges"] || undefined;
            let isAllowedByPrivilege = false;
            CheckingByPrivileges:
            if ((typeof allowedPrivileges === "string") && allowedPrivileges.length) {
                isAllowedByPrivilege = false;
                const allAllowedPrivileges = allowedPrivileges.split(",");
                const userPrivileges = authentication.privileges;
                for (let indexPrivilege = 0; indexPrivilege < allAllowedPrivileges.length; indexPrivilege++) {
                    const allowedPrivilege = allAllowedPrivileges[indexPrivilege];
                    for (let indexUserPrivileges = 0; indexUserPrivileges < userPrivileges.length; indexUserPrivileges++) {
                        const userPrivilege = userPrivileges[indexUserPrivileges];
                        if (userPrivilege.name === allowedPrivilege) {
                            isAllowedByPrivilege = true;
                            break CheckingByPrivileges;
                        }
                    }
                }
            }
            CheckingByUserColumn:
            if ((!isAllowedByPrivilege) && (typeof userColumn === "string") && userColumn.length) {
                if (!("where" in publicParameters)) {
                    Object.assign(publicParameters, { where: JSON.stringify([[userColumn, "=", authentication.user.id]]) });
                } else if (Array.isArray(publicParameters.where)) {
                    publicParameters.where.push([userColumn, "=", authentication.user.id]);
                    Object.assign(publicParameters, { where: JSON.stringify(publicParameters.where) });
                } else if (typeof publicParameters.where === "string") {
                    const where = JSON.parse(publicParameters.where);
                    if (!Array.isArray(where)) {
                        throw new Error("Parameter «where» must be a JSON array in order to apply «forbid-item-viewer» protector on table «" + publicParameters.table + "»");
                    }
                    where.push([userColumn, "=", authentication.user.id]);
                    Object.assign(publicParameters, { where: JSON.stringify(where) });
                }
            }
        } catch (error) {
            this.environment.utils.debugError("ForbidItemViewer.onBeforeView", error, true);
        }
    }

    async onAfterView(publicParameters, privateParameters, configurations, authentication, response, extra) {
        try {
            this.environment.utils.trace("ForbidItemViewer.onAfterView");
            // @OK!
        } catch (error) {
            this.environment.utils.debugError("ForbidItemViewer.onAfterView", error, true);
        }
    }

}

module.exports = ForbidItemViewer;