module.exports = async function (commonData) {
    const { requester, utils, tester } = commonData;
    try {

        tester.startTest("Add column");

        const addColumnResponse01 = await requester("POST", "http://127.0.0.1:9999", {
            project: "Empresa_z",
            operation: "add-column",
        }, {
            table: "products",
            column: "name",
            attributes: JSON.stringify({
                hasDescription: "It represents the common name of the product"
            }),
            properties: JSON.stringify({}),
        }, {
            authorization: commonData.sessionToken,
        }, true, true, "Add schema column to app");

        if (!utils.check.that(addColumnResponse01.response.data.message).equals("Operation «add-column» successfully achieved")) throw new Error(1);

        const addColumnResponse02 = await requester("POST", "http://127.0.0.1:9999", {
            project: "Empresa_z",
            operation: "add-column",
        }, {
            table: "products",
            column: "uid",
            attributes: JSON.stringify({
                hasDescription: "It represents the unique identifier of the product"
            }),
            properties: JSON.stringify({}),
        }, {
            authorization: commonData.sessionToken,
        }, true, true, "Add schema column to app");

        if (!utils.check.that(addColumnResponse02.response.data.message).equals("Operation «add-column» successfully achieved")) throw new Error(2);

        const addColumnResponse03 = await requester("POST", "http://127.0.0.1:9999", {
            project: "Empresa_z",
            operation: "add-column",
        }, {
            table: "products",
            column: "price",
            attributes: JSON.stringify({
                hasDescription: "It represents the base price of the product"
            }),
            properties: JSON.stringify({}),
        }, {
            authorization: commonData.sessionToken,
        }, true, true, "Add schema column to app");

        if (!utils.check.that(addColumnResponse03.response.data.message).equals("Operation «add-column» successfully achieved")) throw new Error(3);

        const addColumnResponse04 = await requester("POST", "http://127.0.0.1:9999", {
            project: "Empresa_z",
            operation: "add-column",
        }, {
            table: "products",
            column: "notes",
            attributes: JSON.stringify({
                hasDescription: "It represents notes that the administrator wants to keep about each product"
            }),
            properties: JSON.stringify({}),
        }, {
            authorization: commonData.sessionToken,
        }, true, true, "Add schema column to app");

        if (!utils.check.that(addColumnResponse04.response.data.message).equals("Operation «add-column» successfully achieved")) throw new Error(4);

        const projectData = await utils.hydrateJSON(__dirname + "/../../../src/data/projects/Empresa_z/project.json");
        
        if (!utils.check.that(projectData.schema.tables.products.columns.name.attributes.hasDescription).equals("It represents the common name of the product")) throw new Error(2);
        if (!utils.check.that(projectData.schema.tables.products.columns.uid.attributes.hasDescription).equals("It represents the unique identifier of the product")) throw new Error(3);
        if (!utils.check.that(projectData.schema.tables.products.columns.price.attributes.hasDescription).equals("It represents the base price of the product")) throw new Error(4);

        tester.passTest("Add column");

    } catch (error) {
        tester.failTest("Add column");
        throw error;
    }
};