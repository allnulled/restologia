const Viewer = require(__dirname + "/defaults/Viewer.js");

class ForbidFieldsViewer extends Viewer {

    static getDetails() {
        return {
            uid: "ForbidFieldsViewer",
            name: "Forbid fields viewer",
            project: null,
            description: "This viewer forbids users by default to view the fields specified on «Forbid fields» setting.",
            usage: "You need to pass a setting called «Forbid fields» specifying the columns (as comma-separated string) of the targeted table that will be hidden on any select. Optionally, you can set on the «Allowed privileges» setting specifying the privileges (as comma-separated string) that, when acquired, will allow the user to view the hidden fields anyway (by default: 'to administrate').",
            parameters: [{
                name: "Allowed user column",
                type: "String",
                default: null,
                description: "Name of the column that, when matches the «user.id» of the authentication, will allow to view the forbidden fields.",
                required: false,
            }, {
                name: "Allowed privileges",
                type: "String",
                default: "to administrate",
                description: "Name of the privileges, by comma-separated values, that will allow to view the forbidden fields.",
                required: false,
            }, {
                name: "Forbid fields",
                type: "String",
                default: null,
                description: "Name of the columns, by comma-separated values, that will be hidden on every select.",
                required: true,
            }]
        };
    }

    static checkSettings(settings, projectData, table, operation) {
        if (typeof settings !== "object") {
            throw new Error("Required protector settings to be an object in order to apply «ForbidFieldsViewer» protector");
        }
        const allowedProperties = ["Allowed user column", "Allowed privileges", "Forbid fields"];
        const allProperties = Object.keys(settings);
        CheckingProperties:
        for (let indexProperty = 0; indexProperty < allProperties.length; indexProperty++) {
            const oneProperty = allProperties[indexProperty];
            if (allowedProperties.indexOf(oneProperty) === -1) {
                throw new Error("Required protector settings to contain only allowed properties but «" + oneProperty + "» is not allowed");
            }
        }
        const allColumns = Object.keys(projectData.schema.tables[table].columns);
        CheckingAllowedUserColumn:
        if ("Allowed user column" in settings) {
            const userColumn = settings["Allowed user column"];
            if (userColumn === null) {
                break CheckingAllowedUserColumn;
            }
            if (typeof userColumn !== "string") {
                throw new Error("Required protector setting «Allowed user column» to be a string, null or omitted in order to apply «ForbidFieldsViewer» protector");
            }
            if (allColumns.indexOf(userColumn) === -1) {
                throw new Error("Required protector setting «Allowed user column» to be a valid column in order to apply «ForbidFieldsViewer» protector");
            }
        }
        CheckingForbiddenFields:
        if ("Forbid fields" in settings) {
            const forbiddenFieldsText = settings["Forbid fields"];
            if (forbiddenFieldsText === null) {
                break CheckingForbiddenFields;
            }
            if (typeof forbiddenFieldsText !== "string") {
                throw new Error("Required protector setting «Forbid fields» to be a string, null or omitted in order to apply «ForbidFieldsViewer» protector");
            }
            const forbiddenFields = forbiddenFieldsText.split(",");
            for (let indexForbiddenField = 0; indexForbiddenField < forbiddenFields.length; indexForbiddenField++) {
                const forbiddenField = forbiddenFields[indexForbiddenField];
                if (allColumns.indexOf(forbiddenField) === -1) {
                    throw new Error("Required protector setting «Forbid fields» to be a comma-separated string of valid columns in order to apply «ForbidFieldsViewer» protector");
                }
            }
        }
        CheckingAllowedPrivileges:
        if ("Allowed privileges" in settings) {
            const allowedPrivileges = settings["Allowed privileges"];
            if (typeof allowedPrivileges !== "string") {
                throw new Error("Required protector setting «Allowed privileges» to be a string in order to apply «ForbidFieldsViewer» protector");
            }
        }
    }

    constructor(environment, settings) {
        super(environment, settings);
        this.uid = "ForbidFieldsViewer";
    }

    async onBeforeView(publicParameters, privateParameters, configurations, authentication, extra) {
        try {
            this.environment.utils.trace("ForbidFieldsViewer.onBeforeView");
            // @OK!
        } catch (error) {
            this.environment.utils.debugError("ForbidFieldsViewer.onBeforeView", error, true);
        }
    }

    async onAfterView(publicParameters, privateParameters, configurations, authentication, response, extra) {
        try {
            this.environment.utils.trace("ForbidFieldsViewer.onAfterView");
            const { parameters } = this.settings;
            const { protectorErrors = [] } = extra;
            const forbiddenFieldsText = parameters["Forbid fields"] || undefined;
            const forbiddenFields = typeof forbiddenFieldsText === "string" ? forbiddenFieldsText.split(",") : [];
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
            if (!isAllowedByPrivilege) {
                if((typeof userColumn === "string") && userColumn.length) {
                    for(let indexItem = 0; indexItem < response.items.length; indexItem++) {
                        const responseItem = response.items[indexItem];
                        if(responseItem[userColumn] !== authentication.user.id) {
                            for (let indexFields = 0; indexFields < forbiddenFields.length; indexFields++) {
                                const forbiddenField = forbiddenFields[indexFields];
                                delete response.items[indexItem][forbiddenField];
                                // protectorErrors.push({ id: response.items[indexItem].id, field: forbiddenField, error: "Cannot view it" });
                            }
                        }
                    }
                } else if((typeof userColumn !== "string") || (userColumn.length === 0)) {
                    for (let indexItem = 0; indexItem < response.items.length; indexItem++) {
                        const responseItem = response.items[indexItem];
                        for (let indexFields = 0; indexFields < forbiddenFields.length; indexFields++) {
                            const forbiddenField = forbiddenFields[indexFields];
                            delete response.items[indexItem][forbiddenField];
                            // protectorErrors.push({ id: response.items[indexItem].id, field: forbiddenField, error: "Cannot view it" });
                        }
                    }
                }
            }
        } catch (error) {
            this.environment.utils.debugError("ForbidFieldsViewer.onAfterView", error, true);
        }
    }

}

module.exports = ForbidFieldsViewer;