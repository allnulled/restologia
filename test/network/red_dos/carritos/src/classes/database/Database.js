class Database {

    constructor(environment) {
        this.environment = environment;
        this.environment.utils.trace("Database.constructor");
    }

    static get DEFAULT_COLUMN_ATTRIBUTES() {
        return {
            isUnique: false,
            isType: "string",
            isSubtype: null,
            isEncrypted: false,
            isReferenceOf: null,
            isNullable: true,
            hasDefault: null,
            hasMinimum: null,
            hasMaximum: null,
            hasPattern: null,
            hasPatternErrorMessage: null,
            hasDescription: null,
        };
    };

    static get DEFAULT_COLUMN_PROPERTIES() {
        return {};
    };

    static get DEFAULT_TABLE_ATTRIBUTES() {
        return {
            hasDescription: null,
            hasMulitpleUniqueKeys: [],
            hasProtectors: [],
        };
    };

    static get DEFAULT_TABLE_PROPERTIES() {
        return {};
    };

    async start() {
        try {
            this.environment.utils.trace("Database.start");
            ////////////////////////////////////////////////////////////////////////
            // Projects:
            this.Project = require(__dirname + "/Project.js");
            this.CreateProject = require(__dirname + "/CreateProject.js");
            this.DeleteProject = require(__dirname + "/DeleteProject.js");
            // Sessions:
            this.Login = require(__dirname + "/Login.js");
            this.Logout = require(__dirname + "/Logout.js");
            this.Authenticate = require(__dirname + "/Authenticate.js");
            // Data:
            this.SelectRows = require(__dirname + "/SelectRows.js");
            this.InsertRow = require(__dirname + "/InsertRow.js");
            this.UpdateRow = require(__dirname + "/UpdateRow.js");
            this.DeleteRow = require(__dirname + "/DeleteRow.js");
            // Files:
            this.GetFile = require(__dirname + "/GetFile.js");
            this.SetFile = require(__dirname + "/SetFile.js");
            // Schema:
            this.ViewSchema = require(__dirname + "/ViewSchema.js");
            this.AddTable = require(__dirname + "/AddTable.js");
            this.AddColumn = require(__dirname + "/AddColumn.js");
            this.UpdateTable = require(__dirname + "/UpdateTable.js");
            this.UpdateColumn = require(__dirname + "/UpdateColumn.js");
            this.DeleteTable = require(__dirname + "/DeleteTable.js");
            this.DeleteColumn = require(__dirname + "/DeleteColumn.js");
            // Protectors:
            this.AddProtector = require(__dirname + "/AddProtector.js");
            this.UpdateProtector = require(__dirname + "/UpdateProtector.js");
            this.DeleteProtector = require(__dirname + "/DeleteProtector.js");
            // Managers & Handlers:
            this.TransactionManager = require(__dirname + "/TransactionManager.js");
            this.ProtectorHandler = require(__dirname + "/ProtectorHandler.js");
            // Process:
            this.Process = require(__dirname + "/Process.js");
            ////////////////////////////////////////////////////////////////////////
        } catch(error) {
            this.environment.utils.debugError("Database.create", error);
        }
    }

}

module.exports = Database;