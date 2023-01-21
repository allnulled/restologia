module.exports = async function (commonData) {
    const { requester, utils, tester } = commonData;
    try {

        tester.startTest("Select externally");

        const response01 = await requester("POST", "http://127.0.0.1:9982", {
            operation: "select",
            project: "Charts",
            table: "users",
        }, {}, {
            authorization: commonData.$chartsAdminToken
        }, true, true, "Select «Identification» externally");

        if (!utils.check.that(response01.response.status).equals("success")) throw new Error("1.0");
        if (!utils.check.that(response01.response.data.items.length).equals(1)) throw new Error("1.1");

        const response02 = await requester("POST", "http://127.0.0.1:9982", {
            operation: "select",
            project: "Charts",
            table: "products",
        }, {}, {
            authorization: commonData.$chartsAdminToken
        }, true, true, "Select «Products» externally");

        if (!utils.check.that(response02.response.status).equals("success")) throw new Error("2.0");
        if (!utils.check.that(response02.response.data.items.length).equals(5)) throw new Error("2.1");

        const response03 = await requester("POST", "http://127.0.0.1:9982", {
            operation: "select",
            project: "Charts",
            table: "charts",
        }, {}, {
            authorization: commonData.$chartsAdminToken
        }, true, true, "Select «Charts» externally");

        if (!utils.check.that(response03.response.status).equals("success")) throw new Error("3.0");
        if (!utils.check.that(response03.response.data.items.length).equals(0)) throw new Error("3.1");

        tester.passTest("Select externally");

    } catch (error) {
        tester.failTest("Select externally");
        throw error;
    }
};
