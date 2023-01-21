module.exports = async function (commonData) {
    const { requester, utils, tester } = commonData;
    try {

        tester.startTest("Delete column");

        const deleteColumnResponse01 = await requester("POST", "http://127.0.0.1:9999", {
            project: "Empresa_z",
            operation: "delete-column",
        }, {
            table: "products",
            column: "uid",
        }, {
            authorization: commonData.sessionToken,
        }, true, true, "Delete schema column from app");

        const projectData = await utils.hydrateJSON(__dirname + "/../../../src/data/projects/Empresa_z/project.json");

        if (!utils.check.that(deleteColumnResponse01.response.data.message).equals("Operation «delete-column» successfully achieved")) throw new Error(1);
        if (!utils.check.that("uid" in projectData.schema.tables.products.columns).equals(false)) throw new Error(2);

        tester.passTest("Delete column");

    } catch (error) {
        tester.failTest("Delete column");
        throw error;
    }
};