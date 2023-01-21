module.exports = (async function () {
    try {
        return await new Promise(function (ok) {
            const utils = require(__dirname + "/classes/Utils.js");
            const server = require("http").createServer((request, response) => {
                response.writeHead(200, { "Content-type": "text/plain" });
                response.write("This is the endpoint of a chat app for restologia apps");
                response.end();
            });
            const settings = require(__dirname + "/security/settings.json");
            const socketIO = require("socket.io");
            const chatsSocket = new socketIO.Server(server, {
                cors: {
                    origin: ["*"],
                    credentials: false
                }
            });
            chatsSocket.on("connection", emitterSocket => {
                try {
                    emitterSocket.on("disconnect", async () => {
                        try {
                            chatsSocket.emit("nativo:mensaje de chat", {
                                emisor: "!",
                                mensaje: "Identidad con alias «x» se desconectó"
                            });
                        } catch(error) {
                            utils.debugError("emitterSocket.on:disconnect", error, false);
                        }
                    });
                } catch (error) {
                    utils.debugError("chatsSocket.on:connect", error, false);
                }
            });
            server.listen(settings.CHAT_PORT, function () {
                console.log("Chat listening on:");
                console.log("  » " + settings.SERVER_PROTOCOL + "://" + settings.SERVER_HOST + ":" + settings.APPLICATION_PORT);
                return ok({ server, settings, directory: path.resolve(__dirname + "/..") });
            });
        });
    } catch (error) {
        console.log("Error on start:", error.name, error.message, error.stack);
        return error;
    }
})();