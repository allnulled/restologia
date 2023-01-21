const url = require("url");
const http = require("http");
const querystring = require("querystring");
const Utils = require(__dirname + "/../src/classes/Utils.js");

const requester = function (method, targetURL, publicParameters = {}, privateParameters = {}, headers = {}, propagateErrors = true, printResults = true, debugMessage = false) {
    return new Promise(function (ok, fail) {
        if (debugMessage) {
            console.log("Proceeding to: " + debugMessage);
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
                    console.log("Success:", JSON.stringify(responseData, null, 2));
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
};

class Tester {

    constructor() {
        this.started = new Date();
        this.tests = {};
    }

    fixId(id) {
        return " " + id + " ";
    }

    startTest(id) {
        this.tests[this.fixId(id)] = {
            successfully: undefined,
            started: new Date(),
            finished: false,
        };
    }

    finishTest(id) {
        this.tests[this.fixId(id)].finished = new Date();
        this.tests[this.fixId(id)].time = this.tests[this.fixId(id)].finished - this.tests[this.fixId(id)].started + " milliseconds";
    }

    passTest(id) {
        this.finishTest(id);
        this.tests[this.fixId(id)].successfully = true;
    }

    failTest(id) {
        this.finishTest(id);
        this.tests[this.fixId(id)].successfully = false;
    }

    printResults() {
        console.log();
        console.log(this.tests);
        const now = new Date();
        console.log();
        console.log("All the tests took: " + (now - this.started) + " milliseconds");
        const notPassedTests = Object.keys(this.tests).filter(testId => this.tests[testId].successfully === false);
        console.log();
        if (notPassedTests.length) {
            console.log("Tests not passed:");
            for(let index = 0; index < notPassedTests.length; index++) {
                const notPassedTest = notPassedTests[index];
                console.log("  -" + notPassedTest);
            }
            console.log();
        } else {
            console.log("All tests were passed successfully.");
            console.log();
        }
    }

}

module.exports = {
    utils: Utils,
    requester,
    tester: new Tester(),
};