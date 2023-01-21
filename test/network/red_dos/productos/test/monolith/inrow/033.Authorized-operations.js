module.exports = async function (commonData) {
    const { requester, utils, tester } = commonData;
    try {

        tester.startTest("Authorized operations");

        tester.passTest("Authorized operations");

    } catch (error) {
        tester.failTest("Authorized operations");
        throw error;
    }
};