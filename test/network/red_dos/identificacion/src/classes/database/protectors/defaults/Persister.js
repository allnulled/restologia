const Protector = require(__dirname + "/Protector.js");

class Persister extends Protector {

    static getDetails() {
        return {
            uid: "Persister",
            name: "Default persister",
            description: "This persister is the parent of any persister and it is not thought to be used as it is.",
            usage: "This persister does nothing but to throw errors on persist methods.",
        };
    }

    constructor(environment, settings = {}) {
        super(environment, settings);
        this.uid = "defaults/Persister";
    }

    onBeforeView() {
        return undefined;
    }

    onAfterView() {
        return undefined;
    }

}

module.exports = Persister;