module.exports = async function (commonData) {
    const { requester, utils, tester } = commonData;
    try {

        tester.startTest("Insert externally");

        const response01 = await requester("POST", "http://127.0.0.1:9982", {
            operation: "insert",
            project: "Charts",
        }, {
            table: "users",
            value: JSON.stringify({
                name: "random_user_1",
                password: "random_user_1",
                email: "random_user_1@correo.com",
                groups: [],
                privileges: []
            })
        }, {
            authorization: commonData.$authAdminToken
        }, true, true, "Insert «Identification» externally");

        if (!utils.check.that(response01.response.status).equals("success")) throw new Error("1.0");
        if (!utils.check.that(response01.response.data.item.id).equals(4)) throw new Error("1.1");

        const response02 = await requester("POST", "http://127.0.0.1:9982", {
            operation: "insert",
            project: "Charts",
        }, {
            table: "products",
            value: JSON.stringify({
                name: "Random Product 1",
                price: "875€",
                description: "This is a random product",
                details: "These are the details of a random product",
                categories: "random; randomness; product",
            })
        }, {
            authorization: commonData.$authAdminToken
        }, true, true, "Insert «Products» externally");

        if (!utils.check.that(response02.response.status).equals("success")) throw new Error("2.0");
        if (!utils.check.that(response02.response.data.item.id).isNumber()) throw new Error("2.1");
        if (!utils.check.that(response02.response.data.item.id).equals(6)) throw new Error("2.2");

        const response03 = await requester("POST", "http://127.0.0.1:9982", {
            operation: "insert",
            project: "Charts",
        }, {
            table: "charts",
            value: JSON.stringify({
                owner: response01.response.data.item.id,
                products: [ 1, 2, 3, 4, 5, response02.response.data.item.id ],
            })
        }, {
            authorization: commonData.$authAdminToken
        }, true, true, "Insert «Charts» locally");

        if (!utils.check.that(response03.response.status).equals("success")) throw new Error("3.0");
        if (!utils.check.that(response03.response.data.item.owner).equals(4)) throw new Error("3.1");
        if (!utils.check.that(response03.response.data.item.products).isArray()) throw new Error("3.1");
        if (!utils.check.that(response03.response.data.item.products.length).equals(6)) throw new Error("3.1");

        commonData.$chartsOwner1Id = response01.response.data.item.id;

        tester.passTest("Insert externally");

    } catch (error) {
        tester.failTest("Insert externally");
        throw error;
    }
};
