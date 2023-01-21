const Utils = require(__dirname + "/Utils.js");

class Environment {

    constructor(Database, Server, Auth, ChatSocket, metadata, settings) {
        try {
            this.utils = Utils;
            this.utils.setEnvironment(this);
            this.database = new Database(this);
            this.server = new Server(this);
            this.auth = new Auth(this);
            this.chatSocket = new ChatSocket(this);
            this.metadata = metadata;
            this.settings = settings;
        } catch(error) {
            Utils.debugError("Environment.constructor", error);
        }
    }
    
    async start() {
        try {
            await this.auth.start();
            await this.database.start();
            await this.server.start();
            await this.chatSocket.start();
            return this;
        } catch(error) {
            Utils.debugError("Environment.start", error);
        }
    }

}

module.exports = Environment;