module.exports = async function (commonData) {
    const { requester, utils, tester } = commonData;
    try {

        tester.startTest("Delete externally");

        const response01 = await requester("POST", "http://127.0.0.1:9982", {
            operation: "delete",
            project: "Charts",
        }, {
            table: "products",
            id: 6,
        }, {
            authorization: commonData.$chartsAdminToken
        }, true, true, "Delete «Products.products#6» should be blocked because there are charts with (external) references to it");

        if (!utils.check.that(response01.response.status).equals("error")) throw new Error("1.0");

        const response02 = await requester("POST", "http://127.0.0.1:9982", {
            operation: "select",
            project: "Charts",
            table: "charts",
            where: JSON.stringify([[ "owner", "=", commonData.$chartsOwner1Id ]])
        }, {}, {
            authorization: commonData.$chartsAdminToken
        }, true, true, "Select «Charts.charts» where have externally referenced products");

        if (!utils.check.that(response02.response.status).equals("success")) throw new Error("2.0");
        if (!utils.check.that(response02.response.data.items.length).equals(1)) throw new Error("2.1");

        const chartId = response02.response.data.items[0].id;

        const response03 = await requester("POST", "http://127.0.0.1:9982", {
            operation: "delete",
            project: "Charts",
        }, {
            table: "charts",
            id: chartId,
        }, {
            authorization: commonData.$chartsAdminToken
        }, true, true, "Delete the only «Charts.chart» that have references to «Products.products#6»");

        if (!utils.check.that(response03.response.status).equals("success")) throw new Error("3.0");

        const response04 = await requester("POST", "http://127.0.0.1:9982", {
            operation: "delete",
            project: "Charts",
        }, {
            table: "products",
            id: 6,
        }, {
            authorization: commonData.$chartsAdminToken
        }, true, true, "Delete «Products.products#6» should not be blocked now");

        if (!utils.check.that(response04.response.status).equals("success")) throw new Error("4.0");
        
        tester.passTest("Delete externally");

    } catch (error) {
        tester.failTest("Delete externally");
        throw error;
    }
};
