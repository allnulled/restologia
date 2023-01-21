module.exports = async function (commonData) {
    const { requester, utils, tester } = commonData;
    try {

        tester.startTest("Delete servers");

        try {
            const authPath = require("path").resolve(__dirname + "/../../../../servers/auth");
            require("fs").rmdirSync(authPath, { recursive: true });
        } catch(error) {}

        try {
            const productsPath = require("path").resolve(__dirname + "/../../../../servers/products");
            require("fs").rmdirSync(productsPath, { recursive: true });
        } catch (error) { }

        try {
            const chartsPath = require("path").resolve(__dirname + "/../../../../servers/charts");
            require("fs").rmdirSync(chartsPath, { recursive: true });
        } catch (error) { }

        tester.passTest("Delete servers");

    } catch (error) {
        tester.failTest("Delete servers");
        throw error;
    }
};
