module.exports = async function (commonData) {
    const { requester, utils, tester } = commonData;
    try {

        tester.startTest("Add table");

        const addTableResponse01 = await requester("POST", "http://127.0.0.1:9999", {
            project: "Empresa_z",
            operation: "add-table",
        }, {
            table: "products",
            attributes: JSON.stringify({
                hasDescription: "It represents prototypes of products stored in the database"
            }),
            properties: JSON.stringify({}),
        }, {
            authorization: commonData.sessionToken,
        }, true, true, "Add schema table to app");

        const projectData = await utils.hydrateJSON(__dirname + "/../../../src/data/projects/Empresa_z/project.json");
        if (!utils.check.that(addTableResponse01.response.data.message).equals("Operation «add-table» successfully achieved")) throw new Error(1);
        if (!utils.check.that(projectData.schema.tables.products).isObject()) throw new Error(2);
        if (!utils.check.that(projectData.schema.tables.products.attributes.hasDescription).equals("It represents prototypes of products stored in the database")) throw new Error(3);

        tester.passTest("Add table");

    } catch (error) {
        tester.failTest("Add table");
        throw error;
    }
};