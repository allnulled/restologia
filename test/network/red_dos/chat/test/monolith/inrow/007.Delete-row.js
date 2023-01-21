module.exports = async function (commonData) {
    const { requester, utils, tester } = commonData;
    try {

        tester.startTest("Delete row");

        const deleteResponse = await requester("POST", "http://127.0.0.1:9999", {
            project: "Empresa_z",
            operation: "delete",
        }, {
            table: "users",
            id: commonData.insertedData[0].id,
        }, {
            authorization: commonData.sessionToken,
        }, true, true, "Delete data from app");

        const usersDB = await utils.hydrateJSON(__dirname + "/../../../src/data/projects/Empresa_z/data/users.json");
        if(!utils.check.that(deleteResponse.response.data.item.id in usersDB.data).equals(false)) throw new Error(1);

        tester.passTest("Delete row");

    } catch (error) {
        tester.failTest("Delete row");
        throw error;
    }
};