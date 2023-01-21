module.exports = async function (commonData) {
    const { requester, utils, tester } = commonData;
    try {

        tester.startTest("Prepare e-shop");

        const addTableResponse01 = await requester("POST", "http://127.0.0.1:9999", {
            project: "Empresa_z",
            operation: "add-table",
        }, {
            table: "charts",
            attributes: JSON.stringify({
                hasDescription: "It represents charts of users"
            }),
            properties: JSON.stringify({}),
        }, {
            authorization: commonData.sessionToken,
        }, true, true, "Prepare e-shop: add «charts» table");

        if (!utils.check.that(addTableResponse01.response.data.message).equals("Operation «add-table» successfully achieved")) throw new Error("1.0");

        const addColumnResponse01 = await requester("POST", "http://127.0.0.1:9999", {
            project: "Empresa_z",
            operation: "add-column",
        }, {
            table: "charts",
            column: "user",
            attributes: JSON.stringify({
                isUnique: true,
                isType: "object",
                isSubtype: null,
                isEncrypted: false,
                isReferenceOf: "users",
                isNullable: false,
                hasDefault: null,
                hasMinimum: false,
                hasMaximum: false,
                hasPattern: false,
                hasPatternErrorMessage: false,
                hasDescription: "It represents charts of users"
            }),
            properties: JSON.stringify({}),
        }, {
            authorization: commonData.sessionToken,
        }, true, true, "Prepare e-shop: add «charts.user» column");

        if (!utils.check.that(addColumnResponse01.response.data.message).equals("Operation «add-column» successfully achieved")) throw new Error("2.0");

        const addColumnResponse02 = await requester("POST", "http://127.0.0.1:9999", {
            project: "Empresa_z",
            operation: "add-column",
        }, {
            table: "charts",
            column: "details",
            attributes: JSON.stringify({
                isUnique: false,
                isType: "string",
                isSubtype: null,
                isEncrypted: false,
                isReferenceOf: null,
                isNullable: true,
                hasDefault: "",
                hasMinimum: false,
                hasMaximum: false,
                hasPattern: false,
                hasPatternErrorMessage: false,
                hasDescription: "It represents notes attached to the charts of users"
            }),
            properties: JSON.stringify({}),
        }, {
            authorization: commonData.sessionToken,
        }, true, true, "Prepare e-shop: add «charts.details» column");

        if (!utils.check.that(addColumnResponse02.response.data.message).equals("Operation «add-column» successfully achieved")) throw new Error("3.0");

        const addTableResponse02 = await requester("POST", "http://127.0.0.1:9999", {
            project: "Empresa_z",
            operation: "add-table",
        }, {
            table: "products_of_charts",
            attributes: JSON.stringify({
                hasDescription: "It represents products assigned to charts of users"
            }),
            properties: JSON.stringify({}),
        }, {
            authorization: commonData.sessionToken,
        }, true, true, "Prepare e-shop: add «products_of_charts» table");

        if (!utils.check.that(addTableResponse02.response.data.message).equals("Operation «add-table» successfully achieved")) throw new Error("4.0");

        const addColumnResponse03 = await requester("POST", "http://127.0.0.1:9999", {
            project: "Empresa_z",
            operation: "add-column",
        }, {
            table: "products_of_charts",
            column: "chart",
            attributes: JSON.stringify({
                isUnique: false,
                isType: "object",
                isSubtype: null,
                isEncrypted: false,
                isReferenceOf: "charts",
                isNullable: false,
                hasDefault: null,
                hasMinimum: false,
                hasMaximum: false,
                hasPattern: false,
                hasPatternErrorMessage: false,
                hasDescription: "It represents the chart to which the product belongs to"
            }),
            properties: JSON.stringify({}),
        }, {
            authorization: commonData.sessionToken,
        }, true, true, "Prepare e-shop: add «products_of_charts.chart» column");

        if (!utils.check.that(addColumnResponse03.response.data.message).equals("Operation «add-column» successfully achieved")) throw new Error("5.0");

        const addColumnResponse04 = await requester("POST", "http://127.0.0.1:9999", {
            project: "Empresa_z",
            operation: "add-column",
        }, {
            table: "products_of_charts",
            column: "product",
            attributes: JSON.stringify({
                isUnique: false,
                isType: "object",
                isSubtype: null,
                isEncrypted: false,
                isReferenceOf: "products",
                isNullable: false,
                hasDefault: null,
                hasMinimum: false,
                hasMaximum: false,
                hasPattern: false,
                hasPatternErrorMessage: false,
                hasDescription: "It represents the product added into the chart"
            }),
            properties: JSON.stringify({}),
        }, {
            authorization: commonData.sessionToken,
        }, true, true, "Prepare e-shop: add «products_of_charts.product» column");

        if (!utils.check.that(addColumnResponse04.response.data.message).equals("Operation «add-column» successfully achieved")) throw new Error("6.0");

        tester.passTest("Prepare e-shop");

    } catch (error) {
        tester.failTest("Prepare e-shop");
        throw error;
    }
};