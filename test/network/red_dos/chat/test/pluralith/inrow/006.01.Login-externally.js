module.exports = async function (commonData) {
    const { requester, utils, tester } = commonData;
    try {

        tester.startTest("Login externally");

        /////////////////////////////////////////////////////////////////////////////////////////
        // Login auth admin:

        const response01 = await requester("POST", "http://127.0.0.1:9980", {
            operation: "login",
            project: "Identification",
        }, {
            user: "auth_admin",
            password: "auth_admin",
        }, {}, true, true, "Login 'auth_admin'");

        if (!utils.check.that(response01.response.status).equals("success")) throw new Error(1);

        commonData.$authAdminToken = response01.response.data.session.token;

        /////////////////////////////////////////////////////////////////////////////////////////
        // Create products admin user on auth system:

        const response02_1 = await requester("POST", "http://127.0.0.1:9980", {
            operation: "insert",
            project: "Identification",
        }, {
            table: "users",
            value: JSON.stringify({
                name: "products_admin_external",
                password: "products_admin_external",
                email: "products_admin@correo.com",
                groups: [],
                privileges: []
            })
        }, {
            authorization: commonData.$authAdminToken
        }, true, true, "Add 'products_admin' using 'auth_admin' authentication");

        if (!utils.check.that(response02_1.response.status).equals("success")) throw new Error("2.1");

        /////////////////////////////////////////////////////////////////////////////////////////
        // Create charts admin user on auth system:

        const response02_2 = await requester("POST", "http://127.0.0.1:9980", {
            operation: "insert",
            project: "Identification",
        }, {
            table: "users",
            value: JSON.stringify({
                name: "charts_admin_external",
                password: "charts_admin_external",
                email: "charts_admin@correo.com",
                groups: [],
                privileges: []
            })
        }, {
            authorization: commonData.$authAdminToken
        }, true, true, "Add 'products_admin' using 'auth_admin' authentication");

        if (!utils.check.that(response02_2.response.status).equals("success")) throw new Error("2.2");

        /////////////////////////////////////////////////////////////////////////////////////////
        // Login with products admin on Products (so, externally):

        const response03 = await requester("POST", "http://127.0.0.1:9981", {
            operation: "login",
            project: "Products",
        }, {
            user: "products_admin_external",
            password: "products_admin_external",
        }, {}, true, true, "Login 'products_admin' (externally)");

        if (!utils.check.that(response03.response.status).equals("success")) throw new Error(3);

        commonData.$productsAdminToken = response03.response.data.session.token;

        /////////////////////////////////////////////////////////////////////////////////////////
        // Login with products admin on Products (so, externally):

        const response04 = await requester("POST", "http://127.0.0.1:9982", {
            operation: "login",
            project: "Charts",
        }, {
            user: "charts_admin_external",
            password: "charts_admin_external",
        }, {}, true, true, "Login 'charts_admin' (externally)");

        if (!utils.check.that(response04.response.status).equals("success")) throw new Error(4);

        commonData.$chartsAdminToken = response04.response.data.session.token;

        tester.passTest("Login externally");

    } catch (error) {
        tester.failTest("Login externally");
        throw error;
    }
};
