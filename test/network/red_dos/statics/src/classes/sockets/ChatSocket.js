class ChatSocket {

    constructor(environment, server) {
        this.environment = environment;
        this.server = server;
        this.nativeSocket = undefined;
    }

    start() {
        this.nativeSocket = 0;
        return this;
    }

    isStarted() {
        return;
    }

    stop() {

    }

}

module.exports = ChatSocket;