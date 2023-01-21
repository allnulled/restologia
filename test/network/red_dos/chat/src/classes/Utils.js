const fsOriginal = require("fs");
const fs = fsOriginal.promises;
const path = require("path");
const DEFAULT_ALPHABET = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".split("");

class Utils {

    static get fsOriginal() {
        return fsOriginal;
    }

    static get fs() {
        return fs;
    }

    static setEnvironment(environment) {
        this.environment = environment;
    }

    static parseURL(url) {
        return require("url").parse(url);
    }

    static getBaseURL() {
        return `${this.environment.settings.SERVER_PROTOCOL}://${this.environment.settings.SERVER_HOST}:${this.environment.settings.SERVER_PORT}`;
    }

    static getResponsePrototype() {
        return {
            ...this.environment.metadata.RESPONSE_PROTOTYPE,
            app: this.environment.metadata.APPLICATION_NAME,
            version: this.environment.metadata.APPLICATION_VERSION,
        };
    }

    static formatResponse(data, publicParameters) {
        return {
            status: "success",
            ...this.getResponsePrototype(),
            project: publicParameters ? publicParameters.project : undefined,
            data
        };
    }
    
    static debug(...args) {
        console.log("[DEBUG]", ...args);
    }

    static formatErrorResponse(error) {
        return {
            status: "error",
            ...this.getResponsePrototype(),
            error
        };
    }

    static noop() {}

    static log(...args) {
        console.log("[LOG]    ", ...args);
    }

    static trace(id) {
        console.log("[TRACE]   " + id);
    }

    static debugRequest(request) {
        console.log("[REQUEST] Request «" + request.method + " " + request.url + "» from «" + JSON.stringify(request.headers, null, 2) + "»");
    }

    static debugError(id, error, mustPropagate = false) {
        try {
            console.log("[ERROR] Error on «" + id + "»:", error.name, error.message, error.stack);
        } catch(error2) {
            console.log(error);
        }
        if (mustPropagate) {
            throw error;
        }
    }

    static debugSuccess(id) {
        console.log("[SUCCESS] " + id);
    }

    static resolve(...args) {
        return path.resolve(...args);
    }

    static resolveFromSrc(...args) {
        return path.resolve(this.environment.settings.PROJECT_SRC, ...args);
    }

    static async hydrateJSON(file) {
        try {
            const filePath = path.resolve(file);
            const fileContents = await fs.readFile(filePath, "utf8");
            const data = JSON.parse(fileContents);
            return data;
        } catch (error) {
            this.debugError("Utils.hydrateJSON", error, true);
        }
    }

    static async dehydrateJSON(file, data, beautify = false) {
        try {
            const filePath = path.resolve(file);
            const dataJson = beautify ? JSON.stringify(data, null, 2) : JSON.stringify(data);
            await fs.writeFile(filePath, dataJson);
            return true;
        } catch (error) {
            this.debugError("Utils.dehydrateJSON", error, true);
        }
    }

    static async fileExists(file, silenced = false) {
        try {
            const filePath = path.resolve(file);
            await fs.open(filePath);
            return true;
        } catch (error) {
            if (error.message.startsWith("ENOENT: no such file or directory")) {
                return false;
            }
            this.debugError("Utils.fileExists", error, true);
        }
    }

    static async createFile(file, contents, encoding = "utf8") {
        try {
            const filePath = path.resolve(file);
            await fs.writeFile(filePath, contents, encoding);
        } catch (error) {
            this.debugError("Utils.createFile", error, true);
        }
    }

    static async copyFile(origin, destination) {
        try {
            const filePathOrigin = path.resolve(origin);
            const filePathDestination = path.resolve(destination);
            // this.dieStringify( [ filePathOrigin, filePathDestination ] );
            const fileContentsOrigin = await fs.readFile(filePathOrigin);
            await fs.writeFile(filePathDestination, fileContentsOrigin, "utf8");
        } catch (error) {
            this.debugError("Utils.copyFile", error, true);
        }
    }

    static async createDirectory(directory) {
        try {
            const directoryPath = path.resolve(directory);
            await fs.mkdir(directoryPath);
        } catch(error) {
            this.debugError("Utils.createDirectory", error, true);
        }
    }

    static async deleteDirectory(directory, recursively = false) {
        try {
            if(recursively) {
                const directoryPath = path.resolve(directory);
                await fs.rmdir(directoryPath, { recursive: true });
            } else {
                const directoryPath = path.resolve(directory);
                await fs.rmdir(directoryPath);
            }
        } catch(error) {
            this.debugError("Utils.deleteDirectory", error, true);
        }
    }

    static async deleteFile(file) {
        try {
            const filePath = path.resolve(file);
            await fs.unlink(filePath);
        } catch (error) {
            this.debugError("Utils.deleteFile", error, true);
        }
    }

    static async listDirectory(directory) {
        try {
            const directoryPath = path.resolve(directory);
            return await fs.readdir(directoryPath);
        } catch(error) {
            this.debugError("Utils.listDirectory", error, true);
        }
    }

    static generateRandomString(len, alphabet = DEFAULT_ALPHABET) {
        let out = "";
        for (let index = 0; index < len; index++) {
            const char = alphabet[Math.floor(Math.random() * alphabet.length)];
            out += char;
        }
        return out;
    }

    static padLeft(text, len, ch = "0") {
        let out = "" + text;
        while(out.length < len) {
            out = ch + out;
        }
        return out;
    }
    
    static fromDateToString(date, untilSeconds = false) {
        if (untilSeconds) {
            return `${this.padLeft(date.getFullYear(), 4, "0")
                }/${this.padLeft(date.getMonth() + 1, 2, "0")
                }/${this.padLeft(date.getDate(), 2, "0")
                } ${this.padLeft(date.getHours(), 2, "0")
                }:${this.padLeft(date.getMinutes(), 2, "0")
                }:${this.padLeft(date.getSeconds(), 2, "0")
                }.${this.padLeft(date.getMilliseconds(), 3, "0")}`;
        } else {
            return `${this.padLeft(date.getFullYear(), 4, "0")
                }/${this.padLeft(date.getMonth() + 1, 2, "0")
                }/${this.padLeft(date.getDate(), 2, "0")
                }`;
        }
    }

    static encrypt(text) {
        return text;
    }

    static decrypt(text) {
        return text;
    }

    static die(...args) {
        console.log(...args);
        process.exit(0);
    }

    static dieStringify(...args) {
        console.log(...args.map(arg => JSON.stringify(arg, null, 2)));
        process.exit(0);
    }

}

class Check {

    static equals(x, y) {
        return x === y;
    }

    static isOneOf(x, y) {
        return y.indexOf(x) !== -1;
    }

    static isBoolean(x) {
        return typeof x === "boolean";
    }

    static isString(x) {
        return typeof x === "string";
    }

    static isNumber(x) {
        return typeof x === "number";
    }

    static isInteger(x) {
        return typeof x === "number" && Number.isInteger(x);
    }

    static isDate(x) {
        return x instanceof Date;
    }

    static isDateString(x) {
        return typeof x === "string" && x.match(/[0-9][0-9][0-9][0-9]\/[0-9][0-9]\/[0-9][0-9]/g);
    }

    static isTimeString(x) {
        return typeof x === "string" && x.match(/[0-9][0-9][0-9][0-9]\/[0-9][0-9]\/[0-9][0-9] [0-9][0-9]:[0-9][0-9]:[0-9][0-9]/g);
    }

    static isFunction(x) {
        return typeof x === "function";
    }

    static isUndefined(x) {
        return typeof x === "undefined";
    }

    static isObject(x) {
        return typeof x === "object";
    }

    static isArray(x) {
        return Array.isArray(x);
    }

    static isStringNotContaining(x, ...args) {
        if (typeof x !== "string") {
            return false;
        }
        for (let i = 0; i < args.length; i++) {
            if (x.indexOf(args[i]) !== -1) {
                return false; a
            }
        }
        return true;
    }

    static isStringMatchingRegex(x, regex) {
        if (typeof x !== "string") {
            return false;
        }
        return x.match(regex);
    }

    static hasLengthOf(x, len) {
        if ((typeof x !== "string") && (!Array.isArray(x))) {
            return false;
        }
        return x.length === len;
    }

    static that(target) {
        return new this(target);
    }

    constructor(target) {
        this.target = target;
    }

    equals(x) {
        return this.target === x;
    }

    isOneOf(x) {
        return x.indexOf(this.target) !== -1;
    }

    itsProperty(propertyPath, defaultValue = undefined) {
        let targetProperty = this.target;
        for(let indexProperty = 0; indexProperty < propertyPath.length; indexProperty++) {
            const propertyId = propertyPath[indexProperty];
            if(["object", "string", "function"].indexOf(typeof targetProperty) === -1) {
                return new this.constructor(defaultValue);
            }
            targetProperty = targetProperty[propertyId];
        }
        return new this.constructor(targetProperty);
    }

    isBoolean() {
        return typeof this.target === "boolean";
    }

    isString() {
        return typeof this.target === "string";
    }

    isNumber() {
        return typeof this.target === "number";
    }

    isInteger() {
        return typeof this.target === "number" && Number.isInteger(this.target);
    }

    isDate() {
        return this.target instanceof Date;
    }

    isDateString() {
        return typeof this.target === "string" && this.target.match(/[0-9][0-9][0-9][0-9]\/[0-9][0-9]\/[0-9][0-9]/g);
    }

    isTimeString() {
        return typeof this.target === "string" && this.target.match(/[0-9][0-9][0-9][0-9]\/[0-9][0-9]\/[0-9][0-9] [0-9][0-9]:[0-9][0-9]:[0-9][0-9]/g);
    }

    isFunction() {
        return typeof this.target === "function";
    }

    isUndefined() {
        return typeof this.target === "undefined";
    }

    isObject() {
        return typeof this.target === "object";
    }

    isArray() {
        return Array.isArray(this.target);
    }

    isStringNotContaining(...args) {
        if(typeof this.target !== "string") {
            return false;
        }
        for(let i=0; i<args.length; i++) {
            if(this.target.indexOf(args[i]) !== -1) {
                return false;a
            }
        }
        return true;
    }

    isStringMatchingRegex(regex) {
        if(typeof this.target !== "string") {
            return false;
        }
        return this.target.match(regex);
    }

    hasLengthOf(len) {
        if((typeof this.target !== "string") && (!Array.isArray(this.target))) {
            return false;
        }
        return this.target.length === len;
    }
    
    async followsSchemaOf(projectData, table, tableData, operation, project, sessionToken, authentication, environment) {
        try {
            const schemaColumns = projectData.schema.tables[table].columns;
            const allColumns = Object.keys(schemaColumns);
            CheckingColumns:
            for (let columnIndex = 0; columnIndex < allColumns.length; columnIndex++) {
                const columnId = allColumns[columnIndex];
                const schemaColumn = schemaColumns[columnId].attributes;
                let isNullified = false;
                IsSelfUserId:
                if (schemaColumn.isSelfUserId) {
                    this.target[columnId] = authentication.user.id;
                    continue CheckingColumns;
                }
                HasDefaultCheck:
                if (schemaColumn.hasDefault) {
                    if ((!(columnId in this.target)) || (this.target[columnId] === null) || (typeof this.target[columnId] === "undefined")) {
                        this.target[columnId] = schemaColumn.hasDefault;
                        isNullified = false;
                    }
                }
                IsSubtypeOnCreated:
                if (schemaColumn.isType === "date") {
                    if ((operation === "insert") && (schemaColumn.isSubtype === "on_created")) {
                        this.target[columnId] = Utils.fromDateToString(new Date(), false);
                        isNullified = false;
                    } else if ((operation === "insert") && (schemaColumn.isSubtype === "on_updated")) {
                        this.target[columnId] = Utils.fromDateToString(new Date(), false);
                        isNullified = false;
                    } else if ((operation === "update") && (schemaColumn.isSubtype === "on_updated")) {
                        this.target[columnId] = Utils.fromDateToString(new Date(), false);
                        isNullified = false;
                    }
                }
                IsSubtypeOnUpdated:
                if (schemaColumn.isType === "time") {
                    if ((operation === "insert") && (schemaColumn.isSubtype === "on_created")) {
                        this.target[columnId] = Utils.fromDateToString(new Date(), true);
                        isNullified = false;
                    } else if ((operation === "insert") && (schemaColumn.isSubtype === "on_updated")) {
                        this.target[columnId] = Utils.fromDateToString(new Date(), true);
                        isNullified = false;
                    } else if ((operation === "update") && (schemaColumn.isSubtype === "on_updated")) {
                        this.target[columnId] = Utils.fromDateToString(new Date(), true);
                        isNullified = false;
                    }
                }
                IsNullableCheck:
                if (!schemaColumn.isNullable) {
                    if (!(columnId in this.target)) {
                        throw new Error("Parameter «" + table + "." + columnId + "» cannot be empty [Schema constraints error nº 0002]");
                    } else if (this.target[columnId] === null) {
                        throw new Error("Parameter «" + table + "." + columnId + "» cannot be null [Schema constraints error nº 0003]");
                    } else if (typeof this.target[columnId] === "undefined") {
                        throw new Error("Parameter «" + table + "." + columnId + "» cannot be undefined [Schema constraints error nº 0004]");
                    }
                } else {
                    if (!(columnId in this.target)) {
                        isNullified = true;
                    } else if (this.target[columnId] === null) {
                        isNullified = true;
                    } else if (typeof this.target[columnId] === "undefined") {
                        isNullified = true;
                    }
                }
                IsUniqueCheck:
                if(schemaColumn.isUnique === true) {
                    if (isNullified) {
                        break IsUniqueCheck;
                    }
                    for(let rowId in tableData) {
                        const row = tableData[rowId];
                        if(row[columnId] === this.target[columnId]) {
                            if(row.id && (row.id === this.target.id)) {
                                // @OK!
                            } else {
                                throw new Error("Parameter «" + table + "." + columnId + "» is duplicated in «" + table + "» table and it must be unique [Schema constraints error nº 0005]");
                            }
                        }
                    }
                }
                IsTypeCheck:
                if(schemaColumn.isType) {
                    if(isNullified) {
                        break IsTypeCheck;
                    }
                    switch (schemaColumn.isType) {
                        case "text": 
                        case "string": {
                            if(!this.constructor.isString(this.target[columnId])) {
                                console.log(this.target, columnId);
                                throw new Error("Parameter «" + table + "." + columnId + "» must be a string [Schema constraints error nº 0006]");
                            }
                            break;
                        }
                        case "number": {

                            this.target[columnId] = typeof this.target[columnId] === "string" ? parseFloat(this.target[columnId]) : this.target[columnId];
                            if(!this.constructor.isNumber(this.target[columnId])) {
                                throw new Error("Parameter «" + table + "." + columnId + "» must be a number [Schema constraints error nº 0007]");
                            }
                            break;
                        }
                        case "integer": {
                            this.target[columnId] = typeof this.target[columnId] === "string" ? parseInt(this.target[columnId]) : this.target[columnId];
                            if(!this.constructor.isInteger(this.target[columnId])) {
                                throw new Error("Parameter «" + table + "." + columnId + "» must be an integer [Schema constraints error nº 0008]");
                            }
                            break;
                        }
                        case "date": {
                            if (!this.constructor.isDateString(this.target[columnId])) {
                                console.log(this.target[columnId]);
                                throw new Error("Parameter «" + table + "." + columnId + "» must be a date (as string) [Schema constraints error nº 0009]");
                            }
                            break;
                        }
                        case "time": {
                            if (!this.constructor.isTimeString(this.target[columnId])) {
                                console.log(this.target[columnId]);
                                throw new Error("Parameter «" + table + "." + columnId + "» must be a time (as string) [Schema constraints error nº 0010]");
                            }
                            break;
                        }
                        case "object": {
                            const referencedTable = schemaColumn.isReferenceOf;
                            const referencedTableSchema = projectData.schema.tables[referencedTable];
                            // @STEP: A) if table is external table:
                            if(typeof referencedTableSchema.attributes.isExternalizedBy === "object") {
                                const { host: externalHost, project: externalProject, table: externalTable } = referencedTableSchema.attributes.isExternalizedBy;
                                const temporaryResponse = await environment.server.Requester.request("GET", externalHost, {
                                    project: externalProject,
                                    operation: "select",
                                    table: externalTable,
                                    where: JSON.stringify([[ "id", "=", this.target[columnId] ]])
                                }, {}, {
                                    authorization: sessionToken
                                }, false, false);
                                if(temporaryResponse.response.data.items.length === 0) {
                                    throw new Error("Parameter «" + columnId + "» does not match any external reference id from «" + schemaColumn.isReferenceOf + "» [Schema constraints error nº 0012.0001]");
                                }
                                break;
                            }
                            // @STEP: B) if table is local table:
                            const referencedDBPath = environment.utils.resolveFromSrc("data/projects/" + project + "/data/" + schemaColumn.isReferenceOf + ".json");
                            const referencedDB = await environment.utils.hydrateJSON(referencedDBPath);
                            const isValidReference = this.target[columnId] in referencedDB.data;
                            if (!isValidReference) {
                                throw new Error("Parameter «" + columnId + "» does not match any external reference id from «" + schemaColumn.isReferenceOf + "» [Schema constraints error nº 0012]");
                            }
                            break;
                        }
                        case "list": {
                            const items = Array.isArray(this.target[columnId]) ? this.target[columnId] : JSON.parse(this.target[columnId]);
                            const referencedTable = schemaColumn.isReferenceOf;
                            const referencedTableSchema = projectData.schema.tables[referencedTable];
                            // @STEP: A) if table is external table:
                            if (typeof referencedTableSchema.attributes.isExternalizedBy === "object") {
                                const { host: externalHost, project: externalProject, table: externalTable } = referencedTableSchema.attributes.isExternalizedBy;
                                const temporaryResponse = await environment.server.Requester.request("GET", externalHost, {
                                    project: externalProject,
                                    operation: "select",
                                    table: externalTable,
                                    suboperation: "hasIds",
                                    ids: items.join(","),
                                }, {}, {
                                    authorization: sessionToken
                                }, false, false);
                                if (temporaryResponse.response.data.missingIds.length !== 0) {
                                    throw new Error("Parameter «" + table + "." + columnId + "» misses indexes «" + temporaryResponse.response.data.missingIds + "» as external reference ids from «" + schemaColumn.isReferenceOf + "» [Schema constraints error nº 0013]");
                                }
                                break;
                            }
                            // @STEP: B) if table is local table:
                            const referencedDBPath = environment.utils.resolveFromSrc("data/projects/" + project + "/data/" + schemaColumn.isReferenceOf + ".json");
                            const referencedDB = await environment.utils.hydrateJSON(referencedDBPath);
                            for(let indexItem = 0; indexItem < items.length; indexItem++) {
                                const item = items[indexItem];
                                const isValidReference = item in referencedDB.data;
                                if (!isValidReference) {
                                    throw new Error("Parameter «" + table + "." + columnId + "» on index «" + indexItem + "» does not match any external reference id from «" + schemaColumn.isReferenceOf + "» [Schema constraints error nº 0013]");
                                }
                            }
                            break;
                        }
                        case "json": {
                            if (!this.constructor.isString(this.target[columnId])) {
                                throw new Error("Parameter «" + table + "." + columnId + "» must be a JSON (as string) [Schema constraints error nº 0014]");
                            }
                            try {
                                JSON.parse(this.target[columnId]);
                            } catch(error) {
                                throw new Error("Parameter «" + table + "." + columnId + "» must be a valid JSON [Schema constraints error nº 0015]");
                            }
                            break;
                        }
                        case "boolean": {
                            if (!this.constructor.isBoolean(this.target[columnId])) {
                                throw new Error("Parameter «" + table + "." + columnId + "» must be a boolean [Schema constraints error nº 0016]");
                            }
                            break;
                        }
                        case "file": {
                            if (!this.constructor.isString(this.target[columnId])) {
                                throw new Error("Parameter «" + table + "." + columnId + "» must be a string [Schema constraints error nº 0018]");
                            }
                            break;
                        }
                        case "image": {
                            if (!this.constructor.isString(this.target[columnId])) {
                                throw new Error("Parameter «" + table + "." + columnId + "» must be a string [Schema constraints error nº 0019]");
                            }
                            break;
                        }
                        case "option": {
                            if (!this.constructor.isString(this.target[columnId])) {
                                throw new Error("Parameter «" + table + "." + columnId + "» must be a string [Schema constraints error nº 0020]");
                            }
                            break;
                        }
                        default: {
                            throw new Error("Schema type on «" + table + "." + columnId + "» is not identified [Schema constraints error nº 4001]");
                        }
                    }
                }
                IsEncryptedCheck:
                if (schemaColumn.isEncrypted) {
                    if (isNullified) {
                        break IsEncryptedCheck;
                    }
                    this.target[columnId] = await environment.utils.encrypt(this.target[columnId]);
                }
                IsReferenceOfCheck:
                if (schemaColumn.isReferenceOf) {
                    if (isNullified) {
                        break IsReferenceOfCheck;
                    }
                    if(schemaColumn.isType === "object") {
                        break IsReferenceOfCheck;
                    }
                    if (schemaColumn.isType === "list") {
                        break IsReferenceOfCheck;
                    }
                    const referencedDBPath = environment.utils.resolveFromSrc("data/projects/" + project + "/data/" + schemaColumn.isReferenceOf + ".json");
                    const referencedDB = await environment.utils.hydrateJSON(referencedDBPath);
                    const isValidReference = this.target[columnId] in referencedDB.data;
                    if(!isValidReference) {
                        throw new Error("Parameter «" + columnId + "» does not match any external reference id from «" + schemaColumn.isReferenceOf + "» [Schema constraints error nº 0018]");
                    }
                }
                HasMinimumCheck:
                if (schemaColumn.hasMinimum) {
                    if (isNullified) {
                        break HasMinimumCheck;
                    }
                    if(schemaColumn.isType === "string") {
                        if(this.target[columnId].length < schemaColumn.hasMinimum) {
                            throw new Error("Parameter «" + table + "." + columnId + "» must have minimum «" + schemaColumn.hasMinimum + "» characters [Schema constraints error nº 0019]");
                        }
                    } else if ((schemaColumn.isType === "number") || (schemaColumn.isType === "integer")) {
                        if (this.target[columnId] < schemaColumn.hasMinimum) {
                            throw new Error("Parameter «" + table + "." + columnId + "» must be minimum «" + schemaColumn.hasMinimum + "» [Schema constraints error nº 0020]");
                        }
                    }
                }
                HasMaximumCheck:
                if (schemaColumn.hasMaximum) {
                    if (isNullified) {
                        break HasMaximumCheck;
                    }
                    if (schemaColumn.isType === "string") {
                        if (this.target[columnId].length > schemaColumn.hasMaximum) {
                            throw new Error("Parameter «" + table + "." + columnId + "» must have minimum «" + schemaColumn.hasMaximum + "» characters [Schema constraints error nº 0021]");
                        }
                    } else if ((schemaColumn.isType === "number") || (schemaColumn.isType === "integer")) {
                        if (this.target[columnId] > schemaColumn.hasMaximum) {
                            throw new Error("Parameter «" + table + "." + columnId + "» must be maximum «" + schemaColumn.hasMaximum + "» [Schema constraints error nº 0022]");
                        }
                    }
                }
                HasPatternCheck:
                if (schemaColumn.hasPattern) {
                    if (isNullified) {
                        break HasPatternCheck;
                    }
                    if (schemaColumn.isType === "string" && typeof this.target[columnId] === "string") {
                        if (this.target[columnId].match(new RegExp(schemaColumn.hasPattern, "g"))) {
                            if(schemaColumn.hasPatternErrorMessage) {
                                throw schemaColumn.hasPatternErrorMessage;
                            }
                            throw new Error("Parameter «" + table + "." + columnId + "» must follow pattern «" + schemaColumn.hasPattern + "» [Schema constraints error nº 0023]");
                        }
                    }
                }
            }
            return this.target;
        } catch (error) {
            environment.utils.debugError("Check.followsSchemaOf", error, true);
        }
    }

}

Utils.check = Check;

module.exports = Utils;