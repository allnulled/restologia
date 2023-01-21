module.exports = async function (commonData) {
    const { requester, utils, tester } = commonData;
    try {

        tester.startTest("Get file");



        tester.passTest("Get file");

    } catch (error) {
        tester.failTest("Get file");
        throw error;
    }
};