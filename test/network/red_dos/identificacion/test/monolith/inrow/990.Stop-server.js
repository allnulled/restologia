const querystring = require("querystring");

module.exports = async function (commonData) {
    const { requester, utils, tester, $environment } = commonData;
    try {

        tester.startTest("Stop server");

        if(!commonData.remainStarted) {
            await $environment.server.stop();
        } else {
            setTimeout(() => {
                const urlParameters = querystring.encode({
                    project: "Empresa_z",
                    authorization: commonData.sessionToken,
                    operation: "process",
                    process: "restologia.official.org/common/os"
                }).toString();
                console.log($environment.utils.getBaseURL() + "?" + urlParameters);
            }, 1000 * 0.5);
        }

        tester.passTest("Stop server");

    } catch (error) {
        tester.failTest("Stop server");
        throw error;
    }
};
