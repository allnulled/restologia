const fs = require("fs");
const path = require("path");
const busboy = require(__dirname + "/dependencies/busboy/lib/index.js");

class MultipartParser {

    constructor(environment) {
        this.environment = environment;
    }

    async parseRequest(originalRequest) {
        try {
            this.environment.utils.trace("MultipartParser.parseRequest");
            const busboyInstance = busboy({ headers: originalRequest.headers });
            //////////////////////
            const fieldsInfo = {};
            let okFieldsPromise = this.environment.utils.noop;
            let failFieldsPromise = this.environment.utils.noop;
            const fieldsPromise = new Promise((ok, fail) => {
                this.environment.utils.trace("MultipartParser.parseRequest:filesPromise");
                okFieldsPromise = ok;
                failFieldsPromise = fail;
            });
            busboyInstance.on("field", (name, value, info) => {
                this.environment.utils.trace("MultipartParser.parseRequest:fieldsPromise:field");
                fieldsInfo[name] = { name, value, info };
            });
            busboyInstance.on("close", () => {
                this.environment.utils.trace("MultipartParser.parseRequest:fieldsPromise:close");
                return okFieldsPromise(fieldsInfo);
            });
            busboyInstance.on("error", error => {
                this.environment.utils.trace("MultipartParser.parseRequest:fieldsPromise:error");
                return failFieldsPromise(error);
            });
            //////////////////////
            const filesInfo = [];
            const onFileWrite = async (name, stream, info) => {
                try {
                    const fileStreamReader = stream;
                    const fileDate = this.environment.utils.fromDateToString(new Date(), true).replace(/[\/ \:]/g, "");
                    if (typeof info.filename === "undefined") {
                        return;
                    }
                    const fileExtensionOriginal = path.extname(info.filename);
                    const fileExtension = fileExtensionOriginal.substr(1);
                    const uid = this.environment.utils.generateRandomString(10).toUpperCase();
                    const filenameSanitized = info.filename.substr(0,100).replace(/[^a-zA-Z0-9\.\-]/g, "x");
                    const filePath = this.environment.utils.resolveFromSrc(`classes/server/uploads/file-upload.on-${fileDate}.uid-${uid}.as-${filenameSanitized}`);
                    const fileStreamWriter = fs.createWriteStream(filePath, { flags: "w" });
                    filesInfo.push({ name, info, temporaryPath: filePath })
                    const promiseForFileWritten = new Promise((ok, fail) => {
                        try {
                            this.environment.utils.trace("MultipartParser.parseRequest:writingFile");
                            let isSuccess = false;
                            fileStreamWriter.on("close", () => {
                                this.environment.utils.trace("MultipartParser.parseRequest:writingFile:close");
                                isSuccess = true;
                                return ok({ filePath });
                            });
                            fileStreamWriter.on("error", error => {
                                this.environment.utils.trace("MultipartParser.parseRequest:writingFile:error");
                                return fail(error);
                            });
                            setTimeout(() => {
                                if (!isSuccess) {
                                    return fail(new Error("Required file upload to take less than 5 seconds"));
                                }
                            }, 5 * 1000);
                        } catch (error) {
                            this.environment.utils.debugError("MultipartParser.parseRequest", error, true);
                            return fail(error);
                        }
                    });
                    fileStreamReader.pipe(fileStreamWriter);
                    await promiseForFileWritten;
                } catch(error) {
                    this.environment.utils.debugError("MultipartParser.parseRequest:onFileWrite", error, true);
                }
            }
            let okFilesPromise = this.environment.utils.noop;
            let failFilesPromise = this.environment.utils.noop;
            const filesPromise = new Promise((ok, fail) => {
                this.environment.utils.trace("MultipartParser.parseRequest:filesPromise");
                okFilesPromise = ok;
                failFilesPromise = fail;
            });
            busboyInstance.on("close", () => {
                this.environment.utils.trace("MultipartParser.parseRequest:filesPromise:close");
                return okFilesPromise(filesInfo);
            });
            busboyInstance.on("error", error => {
                this.environment.utils.trace("MultipartParser.parseRequest:filesPromise:error");
                return failFilesPromise(error);
            });
            busboyInstance.on("file", async (name, stream, info = {}) => {
                try {
                    this.environment.utils.trace("MultipartParser.parseRequest:filesPromise:file");
                    // this.environment.utils.debug({ name, info });
                    stream.on("data", (data) => {
                        this.environment.utils.trace("MultipartParser.parseRequest:filesPromise:file:data");
                    });
                    stream.on("close", () => {
                        this.environment.utils.trace("MultipartParser.parseRequest:filesPromise:file:close");
                    });
                    busboyInstance.on("error", error => {
                        this.environment.utils.trace("MultipartParser.parseRequest:filesPromise:file:error");
                        return failFilesPromise(error);
                    });
                    await onFileWrite(name, stream, info);
                } catch (error) {
                    this.environment.utils.debugError("MultipartParser.parseRequest")
                    return failFilesPromise(error);
                }
            });
            originalRequest.pipe(busboyInstance);
            const [ fields, files ] = await Promise.all([ fieldsPromise, filesPromise ]);
            this.environment.utils.trace("MultipartParser.parseRequet:dataParsed");
            // this.environment.utils.debug({ fields, files });
            return { fields, files };
        } catch(error) {
            this.environment.utils.debugError("MultipartParser.parseRequest", error, true);
        }
    }

}

module.exports = MultipartParser;