module.exports = async function (commonData) {
    const { requester, utils, tester } = commonData;
    try {

        tester.startTest("Authenticate externally");

        const response01 = await requester("POST", "http://127.0.0.1:9981", {
            operation: "authenticate",
            project: "Products",
        }, {}, {
            authorization: commonData.$productsAdminToken
        }, true, true, "Authenticate 'products_admin_externally'");

        if (!utils.check.that(response01.response.status).equals("success")) throw new Error(1);

        if (!utils.check.that(typeof response01.response.data.authentication).equals("object")) throw new Error(1);
        if (!utils.check.that(typeof response01.response.data.authentication.user).equals("object")) throw new Error(2);
        if (!utils.check.that(typeof response01.response.data.authentication.groups).equals("object")) throw new Error(3);
        if (!utils.check.that(typeof response01.response.data.authentication.privileges).equals("object")) throw new Error(4);
        if (!utils.check.that(typeof response01.response.data.authentication.session).equals("object")) throw new Error(5);
        if (!utils.check.that(typeof response01.response.data.authentication.project).equals("string")) throw new Error(6);

        tester.passTest("Authenticate externally");

    } catch (error) {
        tester.failTest("Authenticate externally");
        throw error;
    }
};
