class Server {
    
    constructor(environment) {
        this.environment = environment;
        this.environment.utils.trace("Server.constructor");
        this.staticPath = __dirname + "/../../app";
        this.Requester = require(__dirname + "/Requester.js");
        this.Request = require(__dirname + "/Request.js");
        this.Response = require(__dirname + "/Response.js");
        this.MultipartParser = require(__dirname + "/MultipartParser.js");
        this.utils = require(__dirname + "/../Utils.js");
    }

    async dispatchStaticResources(parsedURL, request, response) {
        let relativePath = parsedURL.path.replace("/app", "");
        if ((relativePath === "") || (relativePath === "/")) {
            relativePath = "/index.html";
        }
        this.environment.utils.debugRequest(request);
        if ((relativePath.indexOf("..") !== -1) && (relativePath.indexOf("&") !== -1)) {
            response.setHeader("Content-type", "text/plain");
            response.write("The expression '..' and '&' are never allowed for static requests.");
            return response.end();
        }
        try {
            const stream = this.environment.utils.fsOriginal.createReadStream(this.staticPath + relativePath);
            stream.on("error", function() {
                response.setHeader("Content-type", "text/plain");
                response.write("The file requested was not found.");
                return response.end();
            });
            return stream.pipe(response);
        } catch (error) {
            response.setHeader("Content-type", "text/plain");
            response.write("There were errors con the process: ");
            response.write("[Error:] " + error.name + " [Message:] " + error.message + " [Stack:] " + error.stack);
            return response.end();
        }
    }

    async start() {
        try {
            this.environment.utils.trace("Server.start");
            this.httpServer = require("http").createServer(async (originalRequest, originalResponse) => {
                try {
                    this.environment.utils.trace("Server.start:controller");
                    this.environment.utils.debugRequest(originalRequest);
                    if(this.environment.settings.APPLICATION_ENABLED) {
                        const parsedURL = this.environment.utils.parseURL(originalRequest.url);
                        if (parsedURL.path.startsWith("/app")) {
                            return await this.dispatchStaticResources(parsedURL, originalRequest, originalResponse);
                        }
                    }
                    const request = new this.Request(originalRequest, this.environment);
                    const response = new this.Response(originalResponse, request, this.environment);
                    await response.dispatch();
                } catch (error) {
                    this.environment.utils.debugError("Server.start:controller", error);
                    originalResponse.setHeader("Content-type", "application/json");
                    originalResponse.write(JSON.stringify(this.environment.utils.formatErrorResponse({
                        "name": "Operation failed error",
                        "message": error.message
                    })));
                    originalResponse.end();
                }
            });
            await new Promise((ok, fail) => {
                try {
                    this.httpServer.listen(this.environment.settings.SERVER_PORT, () => {
                        this.environment.utils.debugSuccess("Server is successfully listening on:");
                        const { SERVER_ID, SERVER_PROTOCOL, SERVER_HOST, SERVER_PORT } = this.environment.settings;
                        this.environment.utils.debugSuccess("  » [SERVER ID]  " + SERVER_ID);
                        this.environment.utils.debugSuccess("  » [SERVER URL] " + this.environment.utils.getBaseURL());
                        // this.environment.utils.debugSuccess("  » " + SERVER_PROTOCOL + "://" + SERVER_HOST + ":" + SERVER_PORT + "/app/restologia-app.1.0.0.html");
                        return ok();
                    });
                } catch (error) {
                    return fail(error);
                }
            });
            return this;
        } catch(error) {
            this.environment.utils.debugError("Server.start", error);
        }
    }

    async stop() {
        try {
            if(this.httpServer) {
                this.httpServer.close();
            }
            if(this.httpsServer) {
                this.httpsServer.close();
            }
        } catch(error) {
            this.environment.utils.debugError("Server.stop", error);
        }
    }

}

module.exports = Server;