module.exports = async function (commonData) {
    const { requester, utils, tester, $auth, $products } = commonData;
    try {

        tester.startTest("Clean projects");

        // @DONT: Don't clean projects.
        
        /*
        require("fs").rmdirSync(__dirname + "/../../../../servers/auth", { recursive: true });
        require("fs").rmdirSync(__dirname + "/../../../../servers/products", { recursive: true });
        require("fs").rmdirSync(__dirname + "/../../../../servers/charts", { recursive: true });
        //*/
        
        tester.passTest("Clean projects");

    } catch (error) {
        tester.failTest("Clean projects");
        throw error;
    }
};
