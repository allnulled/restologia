module.exports = async function (commonData) {
    const { requester, utils, tester, $environment } = commonData;
    try {

        tester.startTest("Clean projects");

        if(!commonData.remainStarted) {
            require("fs").rmdirSync(__dirname + "/../../../src/data/projects/Empresa_z", { recursive: true });
        }

        tester.passTest("Clean projects");

    } catch (error) {
        tester.failTest("Clean projects");
        throw error;
    }
};
