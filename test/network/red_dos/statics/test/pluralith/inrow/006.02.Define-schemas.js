module.exports = async function (commonData) {
    const { requester, utils, tester } = commonData;
    try {

        tester.startTest("Define schemas");

        ////////////////////////////////////////////////////////////////////////////////////////////
        // Define «Products.products» table:

        const response01_00 = await requester("POST", "http://127.0.0.1:9981", {
            project: "Products",
            operation: "add-table",
        }, {
            table: "products",
            attributes: JSON.stringify({}),
            properties: JSON.stringify({}),
        }, {
            authorization: commonData.$authAdminToken,
        }, true, true, "Add «products» table on «Products»");

        if (!utils.check.that(response01_00.response.status).equals("success")) throw new Error("1.0");

        const response01_01 = await requester("POST", "http://127.0.0.1:9981", {
            project: "Products",
            operation: "add-column",
        }, {
            table: "products",
            column: "name",
            attributes: JSON.stringify({
                hasDescription: "The name of the product"
            }),
            properties: JSON.stringify({}),
        }, {
            authorization: commonData.$authAdminToken,
        }, true, true, "Add «products.*» column on «Products»");

        if (!utils.check.that(response01_01.response.status).equals("success")) throw new Error("1.1");

        const response01_02 = await requester("POST", "http://127.0.0.1:9981", {
            project: "Products",
            operation: "add-column",
        }, {
            table: "products",
            column: "price",
            attributes: JSON.stringify({
                hasDescription: "The price of the product"
            }),
            properties: JSON.stringify({}),
        }, {
            authorization: commonData.$authAdminToken,
        }, true, true, "Add «products.*» column on «Products»");

        if (!utils.check.that(response01_02.response.status).equals("success")) throw new Error("1.2");

        const response01_03 = await requester("POST", "http://127.0.0.1:9981", {
            project: "Products",
            operation: "add-column",
        }, {
            table: "products",
            column: "description",
            attributes: JSON.stringify({
                hasDescription: "The description of the product"
            }),
            properties: JSON.stringify({}),
        }, {
            authorization: commonData.$authAdminToken,
        }, true, true, "Add «products.*» column on «Products»");

        if (!utils.check.that(response01_03.response.status).equals("success")) throw new Error("1.3");

        const response01_04 = await requester("POST", "http://127.0.0.1:9981", {
            project: "Products",
            operation: "add-column",
        }, {
            table: "products",
            column: "details",
            attributes: JSON.stringify({
                hasDescription: "The details attached to the product"
            }),
            properties: JSON.stringify({}),
        }, {
            authorization: commonData.$authAdminToken,
        }, true, true, "Add «products.*» column on «Products»");

        if (!utils.check.that(response01_04.response.status).equals("success")) throw new Error("1.4");

        const response01_05 = await requester("POST", "http://127.0.0.1:9981", {
            project: "Products",
            operation: "add-column",
        }, {
            table: "products",
            column: "categories",
            attributes: JSON.stringify({
                hasDescription: "The categories associated to the product"
            }),
            properties: JSON.stringify({}),
        }, {
            authorization: commonData.$authAdminToken,
        }, true, true, "Add «products.*» column on «Products»");

        if (!utils.check.that(response01_05.response.status).equals("success")) throw new Error("1.5");

        // This binding is to keep external consistency with «Charts.charts.products»:

        const response01_06 = await requester("POST", "http://127.0.0.1:9981", {
            project: "Products",
            operation: "add-table",
        }, {
            table: "charts",
            attributes: JSON.stringify({
                isExternalizedBy: {
                    server: "Charts Server",
                    host: "http://127.0.0.1:9982",
                    project: "Charts",
                    table: "charts",
                }
            }),
            properties: JSON.stringify({}),
        }, {
            authorization: commonData.$authAdminToken,
        }, true, true, "Add «charts» table on «Products»");

        if (!utils.check.that(response01_06.response.status).equals("success")) throw new Error("1.6");

        const response01_07 = await requester("POST", "http://127.0.0.1:9981", {
            project: "Products",
            operation: "add-column",
        }, {
            table: "charts",
            column: "products",
            attributes: JSON.stringify({
                isType: "list",
                isReferenceOf: "products"
            }),
            properties: JSON.stringify({}),
        }, {
            authorization: commonData.$authAdminToken,
        }, true, true, "Add «products.*» column on «Products»");

        if (!utils.check.that(response01_07.response.status).equals("success")) throw new Error("1.7");

        ////////////////////////////////////////////////////////////////////////////////////////////
        // Define «Charts.products» table:

        let response02 = await requester("POST", "http://127.0.0.1:9982", {
            project: "Charts",
            operation: "add-table",
        }, {
            table: "products",
            attributes: JSON.stringify({
                isExternalizedBy: {
                    server: "Products Server",
                    host: "http://127.0.0.1:9981",
                    project: "Products",
                    table: "products",
                }
            }),
            properties: JSON.stringify({}),
        }, {
            authorization: commonData.$authAdminToken,
        }, true, true, "Add «products» table on «Charts»");

        if (!utils.check.that(response02.response.status).equals("success")) throw new Error("2.0");

        ////////////////////////////////////////////////////////////////////////////////////////////
        // Define «Charts.users» table:

        const response03 = await requester("POST", "http://127.0.0.1:9982", {
            project: "Charts",
            operation: "add-table",
        }, {
            table: "users",
            attributes: JSON.stringify({
                isExternalizedBy: {
                    host: "http://127.0.0.1:9980",
                    server: "Authentication Server",
                    project: "Identification",
                    table: "users",
                }
            }),
            properties: JSON.stringify({}),
        }, {
            authorization: commonData.$authAdminToken,
        }, true, true, "Add «users» table on «Charts»");

        if (!utils.check.that(response03.response.status).equals("success")) throw new Error("3.0");
        
        ////////////////////////////////////////////////////////////////////////////////////////////
        // Define «Charts.charts» table:

        const response04_01 = await requester("POST", "http://127.0.0.1:9982", {
            project: "Charts",
            operation: "add-table",
        }, {
            table: "charts",
            attributes: JSON.stringify({
                hasMultipleUniqueKeys: []
            }),
            properties: JSON.stringify({}),
        }, {
            authorization: commonData.$authAdminToken,
        }, true, true, "Add «charts» table on «Charts»");

        if (!utils.check.that(response04_01.response.status).equals("success")) throw new Error("4.1");

        const response04_02 = await requester("POST", "http://127.0.0.1:9982", {
            project: "Charts",
            operation: "add-column",
        }, {
            table: "charts",
            column: "products",
            attributes: JSON.stringify({
                isType: "list",
                isReferenceOf: "products",
                hasDescription: "The products added to the chart",
            }),
            properties: JSON.stringify({}),
        }, {
            authorization: commonData.$authAdminToken,
        }, true, true, "Add «charts.*» column on «Charts»");

        if (!utils.check.that(response04_02.response.status).equals("success")) throw new Error("4.2");

        const response04_03 = await requester("POST", "http://127.0.0.1:9982", {
            project: "Charts",
            operation: "add-column",
        }, {
            table: "charts",
            column: "owner",
            attributes: JSON.stringify({
                isType: "object",
                isUnique: true,
                isReferenceOf: "users",
                hasDescription: "The user that owns the chart",
            }),
            properties: JSON.stringify({}),
        }, {
            authorization: commonData.$authAdminToken,
        }, true, true, "Add «charts.*» column on «Charts»");

        if (!utils.check.that(response04_03.response.status).equals("success")) throw new Error("4.3");

        const response04_04 = await requester("POST", "http://127.0.0.1:9982", {
            project: "Charts",
            operation: "add-column",
        }, {
            table: "charts",
            column: "notes",
            attributes: JSON.stringify({
                isType: "text",
                hasDescription: "Notes associated to the chart",
            }),
            properties: JSON.stringify({}),
        }, {
            authorization: commonData.$authAdminToken,
        }, true, true, "Add «charts.*» column on «Charts»");

        if (!utils.check.that(response04_04.response.status).equals("success")) throw new Error("4.4");

        tester.passTest("Define schemas");

    } catch (error) {
        tester.failTest("Define schemas");
        throw error;
    }
};
