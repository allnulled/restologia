module.exports = async function (commonData) {
    const { requester, utils, tester } = commonData;
    try {

        tester.startTest("Update row");

        const updateResponse = await requester("POST", "http://127.0.0.1:9999", {
            project: "Empresa_z",
            operation: "update",
        }, {
            table: "users",
            id: commonData.insertedData[0].id,
            value: JSON.stringify({
                name: "654321",
                password: "654321",
                email: "654321",
                groups: [],
                privileges: []
            }),
        }, {
            authorization: commonData.sessionToken,
        }, true, true, "Update data into app");

        const usersDB = await utils.hydrateJSON(__dirname + "/../../../src/data/projects/Empresa_z/data/users.json");
        const userItem = usersDB.data[updateResponse.response.data.item.id];
        if(!utils.check.that(userItem.name).equals("654321")) throw new Error(1);
        if(!utils.check.that(userItem.password).equals("654321")) throw new Error(2);
        if(!utils.check.that(userItem.email).equals("654321")) throw new Error(3);
        if(!utils.check.that(userItem.groups).isArray()) throw new Error(4);
        if(!utils.check.that(userItem.privileges).isArray()) throw new Error(5);

        tester.passTest("Update row");

    } catch (error) {
        tester.failTest("Update row");
        throw error;
    }
};