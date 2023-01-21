module.exports = async function (commonData) {
    const { requester, utils, tester } = commonData;
    try {

        tester.startTest("Install multiple servers");
        
        const generatorDeProyectos = require(__dirname + "/../../../generator.js");

        generatorDeProyectos(__dirname + "/../../../../servers/auth");
        generatorDeProyectos(__dirname + "/../../../../servers/products");
        generatorDeProyectos(__dirname + "/../../../../servers/charts");

        if(!utils.check.that(require("fs").existsSync(__dirname + "/../../../../servers/auth/package.json")).equals(true)) throw new Error(1);
        if(!utils.check.that(require("fs").existsSync(__dirname + "/../../../../servers/products/package.json")).equals(true)) throw new Error(2);
        if(!utils.check.that(require("fs").existsSync(__dirname + "/../../../../servers/charts/package.json")).equals(true)) throw new Error(3);

        tester.passTest("Install multiple servers");

    } catch (error) {
        tester.failTest("Install multiple servers");
        throw error;
    }
};
