module.exports = async function (commonData) {
    const { requester, utils, tester } = commonData;
    try {

        tester.startTest("Core-safe");

        tester.passTest("Core-safe");

    } catch (error) {
        tester.failTest("Core-safe");
        throw error;
    }
};