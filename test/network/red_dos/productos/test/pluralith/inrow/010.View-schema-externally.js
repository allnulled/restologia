module.exports = async function (commonData) {
    const { requester, utils, tester } = commonData;
    try {

        tester.startTest("View schema externally");

        const response01 = await requester("POST", "http://127.0.0.1:9980", {
            project: "Identification",
            operation: "view-schema",
        }, {}, {
            authorization: commonData.$authAdminToken
        }, true, true, "View «Identification» schema externally");

        if (!utils.check.that(response01.response.status).equals("success")) throw new Error(1);

        // @NOTHING as it has no external entities.

        const response02 = await requester("POST", "http://127.0.0.1:9981", {
            project: "Products",
            operation: "view-schema",
        }, {}, {
            authorization: commonData.$productsAdminToken
        }, true, true, "View «Products» schema externally");

        if (!utils.check.that(response02.response.status).equals("success")) throw new Error(2);

        // @NOTHING as it has no external entities.

        const response03 = await requester("POST", "http://127.0.0.1:9982", {
            project: "Charts",
            operation: "view-schema",
        }, {}, {
            authorization: commonData.$chartsAdminToken
        }, true, true, "View «Charts» schema externally");

        if (!utils.check.that(response03.response.status).equals("success")) throw new Error(3);

        if (!utils.check.that(response03.response.data.schema.tables.users.attributes.isExternalizedBy).isObject()) throw new Error(4);
        if (!utils.check.that(response03.response.data.schema.tables.products.attributes.isExternalizedBy).isObject()) throw new Error(5);
        if (!utils.check.that(response03.response.data.schema.tables.charts).isObject()) throw new Error(6);

        tester.passTest("View schema externally");

    } catch (error) {
        tester.failTest("View schema externally");
        throw error;
    }
};
