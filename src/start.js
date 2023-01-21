module.exports = (function() {
    try {
        const Database = require(__dirname + "/classes/database/Database.js");
        const Server = require(__dirname + "/classes/server/Server.js");
        const Auth = require(__dirname + "/classes/auth/Auth.js");
        const ChatSocket = require(__dirname + "/classes/sockets/ChatSocket.js");
        const Environment = require(__dirname + "/classes/Environment.js");
        const metadata = require(__dirname + "/security/metadata.json");
        const settings = Object.assign({}, require(__dirname + "/security/settings.json"), { PROJECT_SRC: require("path").resolve(__dirname) });
        const environment = new Environment(Database, Server, Auth, ChatSocket, metadata, settings);
        /*
        console.log("[TRACE]     » " + environment.settings.PROJECT_SRC);
        console.log("[TRACE]     » " + environment.utils.getBaseURL());
        //*/
        return environment.start();
    } catch (error) {
        console.log("Error on start:", error.name, error.message, error.stack);
        return error;
    }
})();