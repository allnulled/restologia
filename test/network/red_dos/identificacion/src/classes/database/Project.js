const utils = require(__dirname + "/../Utils.js");

class Project {

    static initialize(...args) {
        return (new this(...args)).initialize();
    }

    constructor(projectId, operation = "initialize-project") {
        this.projectId = projectId;
        this.operation = operation;
        this.projectPath = utils.resolveFromSrc("data/projects/" + this.projectId + "/project.json");
        this.projectData = undefined;
    }

    initialize() {
        if(this.projectData) {
            return this;
        }
        if(!utils.check.that(this.projectId).isStringMatchingRegex(/^[A-Za-z0-9\.\-\_]+$/g)) {
            throw new Error("Parameter «project» must be a non-empty string based only on letters, numbers, '.', '-' and '_' in order to «" + this.operation + "»");
        }
        return utils.hydrateJSON(this.projectPath).then(projectData => {
            this.projectData = projectData;
            return this;
        });
    }

}

module.exports = Project;