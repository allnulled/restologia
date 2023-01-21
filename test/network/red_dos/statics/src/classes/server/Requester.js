const url = require("url");
const http = require("http");
const querystring = require("querystring");

class Requester {

    /**
     * @param {String} method HTTP method of the request, so: 'GET', 'POST', 'PUT' or 'DELETE'
     * @param {String} targetURL URL the request is addressed to.
     * @param {Object} publicParameters Querystring parameters.
     * @param {Object} privateParameters Body parameters (only for POST requests)
     * @param {Object} headers HTTP headers of the request
     * @param {Boolean} propagateErrors If true, the error will be propagated. Default: true.
     * @param {Boolean} printResults If true, the results will be logged by console. Default: true.
     * @param {String} debugMessage Message printed by console before sending the request
     * @returns {Promise:Object} response Object representing the response
     */
    static request(method, targetURL, publicParameters = {}, privateParameters = {}, headers = {}, propagateErrors = true, printResults = true, debugMessage = false) {
        return new Promise(function (ok, fail) {
            if (debugMessage) {
                console.log("[REQUEST] " + debugMessage);
            }
            let responseMetadata = {};
            let responseData = undefined;
            const parsedURL = url.parse(targetURL);
            const httpRequest = http.request({
                method: method,
                protocol: parsedURL.protocol,
                hostname: parsedURL.hostname,
                port: parsedURL.port,
                path: parsedURL.pathname + "?" + querystring.encode(publicParameters),
                headers: headers,
            }, function (httpResponse) {
                httpResponse.on("data", function (dataJSON) {
                    const data = JSON.parse(dataJSON.toString());
                    responseData = data;
                });
                httpResponse.on("end", function () {
                    if (printResults) {
                        console.log("[REQUEST] " + JSON.stringify(responseData, null, 2));
                    }
                    return ok({ response: responseData, metadata: responseMetadata });
                });
            });
            if (method.toLowerCase() !== "get") {
                const bodyParameters = JSON.stringify(privateParameters);
                httpRequest.write(bodyParameters);
            }
            httpRequest.on("error", function (error) {
                if (propagateErrors) {
                    if (printResults) {
                        console.error("Error:", error);
                    }
                    return fail(error);
                } else {
                    if (printResults) {
                        console.log("Error (ignored):", error);
                    }
                    return ok(error);
                }
            });
            httpRequest.end();
        });
    }

}

module.exports = Requester;