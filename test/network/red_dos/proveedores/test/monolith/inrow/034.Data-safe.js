module.exports = async function (commonData) {
    const { requester, utils, tester } = commonData;
    try {

        tester.startTest("Data-safe");

        tester.passTest("Data-safe");

    } catch (error) {
        tester.failTest("Data-safe");
        throw error;
    }
};