module.exports = async function (commonData) {
    const { requester, utils, tester } = commonData;
    try {

        tester.startTest("Update column");

        const updateColumnResponse01 = await requester("POST", "http://127.0.0.1:9999", {
            project: "Empresa_z",
            operation: "update-column",
        }, {
            table: "products",
            column: "name",
            attributes: JSON.stringify({
                hasDescription: "It represents the common name of the product in human terms"
            }),
            properties: JSON.stringify({}),
        }, {
            authorization: commonData.sessionToken,
        }, true, true, "Update schema column from app");

        const projectData = await utils.hydrateJSON(__dirname + "/../../../src/data/projects/Empresa_z/project.json");
        
        if (!utils.check.that(updateColumnResponse01.response.data.message).equals("Operation «update-column» successfully achieved")) throw new Error(1);
        if (!utils.check.that(projectData.schema.tables.products.columns.name.attributes.hasDescription).equals("It represents the common name of the product in human terms")) throw new Error(2);

        tester.passTest("Update column");

    } catch (error) {
        tester.failTest("Update column");
        throw error;
    }
};