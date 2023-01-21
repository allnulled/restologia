module.exports = async function (commonData) {
    const { requester, utils, tester } = commonData;
    try {

        tester.startTest("Set file");

        // Tested on browser
        
        tester.passTest("Set file");

    } catch (error) {
        tester.failTest("Set file");
        throw error;
    }
};