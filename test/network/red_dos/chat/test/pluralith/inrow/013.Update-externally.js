module.exports = async function (commonData) {
    const { requester, utils, tester } = commonData;
    try {

        tester.startTest("Update externally");

        const response01 = await requester("POST", "http://127.0.0.1:9982", {
            operation: "update",
            project: "Charts",
        }, {
            table: "products",
            id: 6,
            value: JSON.stringify({
                details: "These are the UPDATED details of a random product",
            })
        }, {
            authorization: commonData.$chartsAdminToken
        }, true, true, "Update «Charts.products» externally");

        if (!utils.check.that(response01.response.status).equals("success")) throw new Error("1.0");

        const response02 = await requester("GET", "http://127.0.0.1:9982", {
            operation: "select",
            project: "Charts",
            table: "products",
            where: JSON.stringify([[ "id", "=", 6 ]])
        }, {}, {
            authorization: commonData.$chartsAdminToken
        }, true, true, "Select «Charts.products» externally to check update externally worked");

        if (!utils.check.that(response02.response.status).equals("success")) throw new Error("2.0");
        if (!utils.check.that(response02.response.data.items.length).equals(1)) throw new Error("2.1");
        if (!utils.check.that(response02.response.data.items[0].details).equals("These are the UPDATED details of a random product")) throw new Error("2.2");

        tester.passTest("Update externally");

    } catch (error) {
        tester.failTest("Update externally");
        throw error;
    }
};
