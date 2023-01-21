module.exports = async function (commonData) {
    const { requester, utils, tester } = commonData;
    try {

        tester.startTest("Start server");

        commonData.$environment = await require(__dirname + "/../../../src/start.js");
        commonData.remainStarted = true;

        tester.passTest("Start server");

    } catch (error) {
        tester.failTest("Start server");
        throw error;
    }
};