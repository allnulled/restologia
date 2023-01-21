module.exports = async function (commonData) {
    const { requester, utils, tester } = commonData;
    try {

        tester.startTest("View schema");

        const viewSchemaResponse01 = await requester("POST", "http://127.0.0.1:9999", {
            project: "Empresa_z",
            operation: "view-schema",
        }, {}, {
            authorization: commonData.sessionToken,
        }, true, true, "View app schema");

        const projectData = await utils.hydrateJSON(__dirname + "/../../../src/data/projects/Empresa_z/project.json");
        const schemaTablesLength = Object.keys(projectData.schema.tables).length;
        const responseTablesLength = Object.keys(viewSchemaResponse01.response.data.schema.tables).length;
        
        if (!utils.check.that(schemaTablesLength).equals(responseTablesLength)) throw new Error(1);

        tester.passTest("View schema");

    } catch (error) {
        tester.failTest("View schema");
        throw error;
    }
};