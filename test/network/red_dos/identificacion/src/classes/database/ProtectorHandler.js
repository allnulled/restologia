class ProtectorHandler {

    static initialize(environment, ...args) {
        const protectorHandler = new this(environment);
        return protectorHandler.initializeProtectors(...args);
    }

    constructor(environment) {
        this.environment = environment;
        this.protectors = undefined;
        this.projectId = undefined;
        this.projectData = undefined;
        this.publicParameters = undefined;
        this.privateParameters = undefined;
        this.configurations = undefined;
    }
    
    async initializeProtectors(publicParameters, privateParameters, configurations, authentication, projectData) {
        try {
            /////////////////////////////////////////////////////
            this.authentication = authentication;
            this.publicParameters = publicParameters;
            this.privateParameters = privateParameters;
            this.configurations = configurations;
            this.authentication = authentication;
            this.projectData = projectData;
            const project = publicParameters.project;
            if (!this.environment.utils.check.that(project).isStringMatchingRegex(/^[A-Za-z0-9\.\-\_]+$/g)) {
                throw new Error("Parameter «project» must be a non-empty string based only on letters, numbers, '.', '-' and '_' in order to «getProtectors»");
            }
            const operation = publicParameters.operation;
            this.projectId = project;
            this.projectData = projectData;
            let protectorsDefinitions = [];
            switch (operation) {
                case "select": {
                    const table = publicParameters.table;
                    const tableAttributes = projectData.schema.tables[table].attributes;
                    if ("hasProtectors" in tableAttributes) {
                        protectorsDefinitions = tableAttributes.hasProtectors;
                    }
                    break;
                }
                case "insert":
                case "update":
                case "delete": {
                    const table = privateParameters.table;
                    const tableAttributes = projectData.schema.tables[table].attributes;
                    if ("hasProtectors" in tableAttributes) {
                        protectorsDefinitions = tableAttributes.hasProtectors;
                    }
                    break;
                }
                case "add-table":
                case "add-column":
                case "add-protector":
                case "update-table":
                case "update-column":
                case "update-protector":
                case "delete-table":
                case "delete-column":
                case "delete-protector": {
                    protectorsDefinitions = projectData.schema.operations.alterSchema.hasProtectors;
                    break;
                }
            }
            /////////////////////////////////////////////////////
            const protectors = [];
            for (let indexProtectors = 0; indexProtectors < protectorsDefinitions.length; indexProtectors++) {
                const protectorDefinition = protectorsDefinitions[indexProtectors];
                if (!this.environment.utils.check.that(protectorDefinition.id).isStringMatchingRegex(/^[A-Za-z0-9\.\-\_]+$/g)) {
                    throw new Error("Setting «protector.id» must be a non-empty string based only on letters, numbers, '.', '-' and '_' in order to «getProtectors»");
                }
                const ProtectorClass = require(__dirname + "/protectors/" + protectorDefinition.id);
                const protector = new ProtectorClass(this.environment, protectorDefinition);
                protectors.push(protector);
            }
            this.protectors = protectors;
            return this;
        } catch(error) {
            this.environment.utils.debugError("ProtectorHandler.applyProtectors", error, true);
        }
    }
    
    async applyOnBeforeViewProtectors(extra = {}, ...others) {
        try {
            for(let indexProtector = 0; indexProtector < this.protectors.length; indexProtector++) {
                const protector = this.protectors[indexProtector];
                await protector.onBeforeView(this.publicParameters, this.privateParameters, this.configurations, this.authentication, extra, ...others);
            }
        } catch(error) {
            this.environment.utils.debugError("ProtectorHandler.applyOnBeforeViewProtectors", error, true);
        }    
    }
    
    async applyOnBeforePersistProtectors(extra = {}, ...others) {
        try {
            for (let indexProtector = 0; indexProtector < this.protectors.length; indexProtector++) {
                const protector = this.protectors[indexProtector];
                await protector.onBeforePersist(this.publicParameters, this.privateParameters, this.configurations, this.authentication, extra, ...others);
            }
        } catch(error) {
            this.environment.utils.debugError("ProtectorHandler.applyOnBeforePersistProtectors", error, true);
        }
    }
    
    async applyOnAfterViewProtectors(extra = {}, ...others) {
        try {
            for (let indexProtector = 0; indexProtector < this.protectors.length; indexProtector++) {
                const protector = this.protectors[indexProtector];
                await protector.onAfterView(this.publicParameters, this.privateParameters, this.configurations, this.authentication, extra, ...others);
            }
        } catch(error) {
            this.environment.utils.debugError("ProtectorHandler.applyOnAfterViewProtectors", error, true);
        }    
    }
    
    async applyOnAfterPersistProtectors(extra = {}, ...others) {
        try {
            for (let indexProtector = 0; indexProtector < this.protectors.length; indexProtector++) {
                const protector = this.protectors[indexProtector];
                await protector.onAfterPersist(this.publicParameters, this.privateParameters, this.configurations, this.authentication, extra, ...others);
            }
        } catch(error) {
            this.environment.utils.debugError("ProtectorHandler.applyOnAfterPersistProtectors", error, true);
        }
    }

}

module.exports = ProtectorHandler;