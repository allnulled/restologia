module.exports = async function (commonData) {
    const { requester, utils, tester } = commonData;
    try {

        tester.startTest("Logout externally");

        const response01 = await requester("POST", "http://127.0.0.1:9981", {
            operation: "logout",
            project: "Products",
        }, {}, {
            authorization: commonData.$productsAdminToken
        }, true, true, "Logout 'products_admin' (externally)");

        if (!utils.check.that(response01.response.status).equals("success")) throw new Error(1);

        delete commonData.$productsAdminToken;

        tester.passTest("Logout externally");

    } catch (error) {
        tester.failTest("Logout externally");
        throw error;
    }
};
