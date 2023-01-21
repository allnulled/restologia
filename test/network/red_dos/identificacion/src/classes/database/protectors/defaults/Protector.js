class Protector {

    static getDetails() {
        return {
            uid: "Protector",
            name: "Default protector",
            description: "This protector is the parent of any protector (viewer or persister) and it is not thought to be used as it is.",
            usage: "This protector does nothing but throw errors.",
        };
    }

    constructor(environment, settings = {}) {
        this.environment = environment;
        this.settings = settings;
        this.uid = "defaults/Protector";
    }

    async onBeforeView(publicParameters, privateParameters, configurations, authentication, ...others) {
        try {
            throw new Error("Method «Protector.onBeforeView» must be overriden");
        } catch(error) {
            this.environment.utils.debugError("Protector.onBeforeView", error, true);
        }
    }

    async onAfterView(publicParameters, privateParameters, configurations, authentication, ...others) {
        try {
            throw new Error("Method «Protector.onAfterView» must be overriden");
        } catch(error) {
            this.environment.utils.debugError("Protector.onAfterView", error, true);
        }
    }

    async onBeforePersist(publicParameters, privateParameters, configurations, authentication, ...others) {
        try {
            throw new Error("Method «Protector.onBeforePersist» must be overriden");
        } catch(error) {
            this.environment.utils.debugError("Protector.onBeforePersist", error, true);
        }
    }

    async onAfterPersist(publicParameters, privateParameters, configurations, authentication, ...others) {
        try {
            throw new Error("Method «Protector.onAfterPersist» must be overriden");
        } catch(error) {
            this.environment.utils.debugError("Protector.onAfterPersist", error, true);
        }
    }

}

module.exports = Protector;