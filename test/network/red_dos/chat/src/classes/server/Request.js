const url = require("url");

class Request {

    constructor(originalRequest, environment) {
        this.originalRequest = originalRequest;
        this.environment = environment;
        this.environment.utils.trace("Request.constructor");
    }

    async digest() {
        try {
            this.environment.utils.trace("Request.digest");
            this.getParameters = url.parse(this.originalRequest.url, true).query;
            if (this.originalRequest.method === "POST") {
                if (this.getParameters.operation === "set-file") {
                    this.postParameters = this.originalRequest.body;
                } else {
                    const bodyData = await new Promise((ok, fail) => {
                        let body = "";
                        this.originalRequest.on("data", chunk => {
                            body += chunk;
                        });
                        this.originalRequest.on("error", error => {
                            return fail(error);
                        });
                        this.originalRequest.on("end", () => {
                            return ok(body);
                        });
                    });
                    this.postParameters = JSON.parse(bodyData);
                }
            } else {
                this.postParameters = this.getParameters;
            }
            this.httpHeaders = this.originalRequest.headers;
            if(!("authorization" in this.httpHeaders)) {
                if ("authorization" in (this.postParameters || {})) {
                    this.httpHeaders.authorization = this.postParameters.authorization;
                } else if("authorization" in this.getParameters) {
                    this.httpHeaders.authorization = this.getParameters.authorization;
                }
            }
        } catch(error) {
            this.environment.utils.debugError("Request.digest", error);
        }
    }

}

module.exports = Request;