module.exports = async function (commonData) {
    const { requester, utils, tester } = commonData;
    try {

        tester.startTest("Start servers");

        commonData.serversPath = require("path").resolve(__dirname + "/../../../../servers");

        commonData.$auth = await require(commonData.serversPath + "/auth/src/start.js");
        commonData.$products = await require(commonData.serversPath + "/products/src/start.js");
        commonData.$charts = await require(commonData.serversPath + "/charts/src/start.js");

        tester.passTest("Start servers");

    } catch (error) {
        tester.failTest("Start servers");
        throw error;
    }
};
