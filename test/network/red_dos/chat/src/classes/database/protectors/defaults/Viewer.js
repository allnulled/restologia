const Protector = require(__dirname + "/Protector.js");

class Viewer extends Protector {

    static getDetails() {
        return {
            uid: "Viewer",
            name: "Default viewer",
            description: "This viewer is the parent of any viewer and it is not thought to be used as it is.",
            usage: "This viewer does nothing but to throw errors on view methods.",
        };
    }

    constructor(environment, settings = {}) {
        super(environment, settings);
        this.uid = "defaults/Viewer";
    }

    onBeforePersist() {
        return undefined;
    }

    onAfterPersist() {
        return undefined;
    }

}

module.exports = Viewer;