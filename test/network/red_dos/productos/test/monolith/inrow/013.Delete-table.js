module.exports = async function (commonData) {
    const { requester, utils, tester } = commonData;
    try {

        tester.startTest("Delete table");

        const addTableResponse01 = await requester("POST", "http://127.0.0.1:9999", {
            project: "Empresa_z",
            operation: "add-table",
        }, {
            table: "products2",
            attributes: JSON.stringify({
                hasDescription: "It represents prototypes of products2 stored in the database"
            }),
            properties: JSON.stringify({}),
        }, {
            authorization: commonData.sessionToken,
        }, true, true, "Add schema table to app");

        if (!utils.check.that(addTableResponse01.response.data.message).equals("Operation «add-table» successfully achieved")) throw new Error("01.0");
        let projectData = await utils.hydrateJSON(__dirname + "/../../../src/data/projects/Empresa_z/project.json");
        if (!utils.check.that("products2" in projectData.schema.tables).equals(true)) throw new Error("01.1");

        const deleteTableResponse02 = await requester("POST", "http://127.0.0.1:9999", {
            project: "Empresa_z",
            operation: "delete-table",
        }, {
            table: "products2",
        }, {
            authorization: commonData.sessionToken,
        }, true, true, "Delete schema table from app");


        if (!utils.check.that(deleteTableResponse02.response.data.message).equals("Operation «delete-table» successfully achieved")) throw new Error("02.0");
        projectData = await utils.hydrateJSON(__dirname + "/../../../src/data/projects/Empresa_z/project.json");
        if (!utils.check.that("products2" in projectData.schema.tables).equals(false)) throw new Error("02.1");

        tester.passTest("Delete table");

    } catch (error) {
        tester.failTest("Delete table");
        throw error;
    }
};