module.exports = async function (commonData) {
    const { requester, utils, tester } = commonData;
    try {

        tester.startTest("Table attribute: hasMultipleUniqueKeys externally");

        // @TODO: insert charts externally.

        tester.passTest("Table attribute: hasMultipleUniqueKeys externally");

    } catch (error) {
        tester.failTest("Table attribute: hasMultipleUniqueKeys externally");
        throw error;
    }
};
