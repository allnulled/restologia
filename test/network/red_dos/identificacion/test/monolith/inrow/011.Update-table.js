module.exports = async function (commonData) {
    const { requester, utils, tester } = commonData;
    try {

        tester.startTest("Update table");

        const updateTableResponse01 = await requester("POST", "http://127.0.0.1:9999", {
            project: "Empresa_z",
            operation: "update-table",
        }, {
            table: "products",
            attributes: JSON.stringify({
                hasDescription: "It represents prototypes of products"
            }),
            properties: JSON.stringify({}),
        }, {
            authorization: commonData.sessionToken,
        }, true, true, "Update schema table from app");

        const projectData = await utils.hydrateJSON(__dirname + "/../../../src/data/projects/Empresa_z/project.json");

        if (!utils.check.that(updateTableResponse01.response.data.message).equals("Operation «update-table» successfully achieved")) throw new Error(1);
        if (!utils.check.that(projectData.schema.tables.products.attributes.hasDescription).equals("It represents prototypes of products")) throw new Error(2);

        tester.passTest("Update table");

    } catch (error) {
        tester.failTest("Update table");
        throw error;
    }
};