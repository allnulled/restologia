const fs = require("fs");
const url = require("url");
const path = require("path");

const staticPath = __dirname + "/app";
const dispatchStaticResources = function(request, response) {
    const parsedURL = url.parse(request.url, true);
    let relativePath = parsedURL.path.replace("/app", "");
    if ((relativePath === "") || (relativePath === "/")) {
        relativePath = "/index.html";
    }
    if ((relativePath.indexOf("..") !== -1) && (relativePath.indexOf("&") !== -1)) {
        response.setHeader("Content-type", "text/plain");
        response.write("The expression '..' and '&' are never allowed for static requests.");
        return response.end();
    }
    const targetPath = staticPath + relativePath;
    if(targetPath.startsWith("")) {
        
    }
    console.log("Requested file: " + targetPath);
    if(targetPath.endsWith(".json")) {
        response.setHeader("Content-type", "application/json");
    }
    const stream = fs.createReadStream(targetPath);
    stream.on("error", function () {
        response.setHeader("Content-type", "text/plain");
        response.write("The requested file was not found.");
        return response.end();
    });
    return stream.pipe(response);
};

module.exports = (async function () {
    try {
        return await new Promise(function(ok) {
            const server = require("http").createServer(dispatchStaticResources);
            const settings = require(__dirname + "/security/settings.json");
            server.listen(settings.APPLICATION_PORT, function() {
                console.log("App listening on:");
                console.log("  » " + settings.SERVER_PROTOCOL + "://" + settings.SERVER_HOST + ":" + settings.APPLICATION_PORT);
                return ok({ server, settings, directory: path.resolve(__dirname + "/..") });
            });
        });
    } catch (error) {
        console.log("Error on start:", error.name, error.message, error.stack);
        return error;
    }
})();