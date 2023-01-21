module.exports = async function (commonData) {
    const { requester, utils, tester } = commonData;
    try {

        tester.startTest("Protectors");
        ///////////////////////////////////////////////////////////////////////////
        // ForbidItemPersister Test 
        ///////////////////////////////////////////////////////////////////////////
        const loginResponse01 = await requester("POST", "http://127.0.0.1:9999", {
            project: "Empresa_z",
            operation: "login",
        }, {
            user: "345678",
            password: "345678",
        }, {}, true, true, "Protectors test: 1. login ok");

        if(!utils.check.that(loginResponse01.response.status).equals("success")) throw new Error("01.0");

        const userId01 = loginResponse01.response.data.session.user;
        const token01 = loginResponse01.response.data.session.token;

        commonData.userSessionToken = token01;

        if(!utils.check.that(token01.length).equals(100)) throw new Error("01.1");

        ///////////////////////////////////////////////////////////////////////////
        const insertResponse02 = await requester("POST", "http://127.0.0.1:9999", {
            project: "Empresa_z",
            operation: "insert",
        }, {
            table: "users",
            value: JSON.stringify({
                name: "xxx.123",
                password: "xxx.123",
                email: "xxx123@abc.org"
            })
        }, {
            authorization: commonData.sessionToken,
        }, true, true, "Protectors test: 2. Forbid item persister on users table");

        if (!utils.check.that(insertResponse02.response.status).equals("success")) throw new Error("02.0");
        if (!utils.check.that(insertResponse02.response.data.item.name).equals("xxx.123")) throw new Error("02.1");

        ///////////////////////////////////////////////////////////////////////////
        const insertResponse03 = await requester("POST", "http://127.0.0.1:9999", {
            project: "Empresa_z",
            operation: "insert",
        }, {
            table: "users",
            value: JSON.stringify({
                name: "xxx.234",
                password: "xxx.234",
                email: "xxx234@abc.org"
            })
        }, {
            authorization: token01,
        }, true, true, "Protectors test: 3. Forbid item persister on users table");

        if (!utils.check.that(insertResponse03.response.status).equals("error")) throw new Error("03.0");

        ///////////////////////////////////////////////////////////////////////////
        const insertResponse04 = await requester("POST", "http://127.0.0.1:9999", {
            project: "Empresa_z",
            operation: "insert",
        }, {
            table: "sessions",
            value: JSON.stringify({
                user: 3,
                token: utils.generateRandomString(100),
            })
        }, {
            authorization: commonData.sessionToken,
        }, true, true, "Protectors test: 4. Forbid item persister on sessions table");

        if (!utils.check.that(insertResponse04.response.status).equals("success")) throw new Error("04.0");
        if (!utils.check.that(insertResponse04.response.data.item.user).equals(3)) throw new Error("04.1");

        ///////////////////////////////////////////////////////////////////////////
        const insertResponse05 = await requester("POST", "http://127.0.0.1:9999", {
            project: "Empresa_z",
            operation: "insert",
        }, {
            table: "sessions",
            value: JSON.stringify({
                user: 5,
                token: utils.generateRandomString(100),
            })
        }, {
            authorization: token01,
        }, true, true, "Protectors test: 5. Forbid item persister on sessions table");

        if (!utils.check.that(insertResponse05.response.status).equals("error")) throw new Error("05.0");

        ///////////////////////////////////////////////////////////////////////////
        // ForbidItemViewer Test 
        ///////////////////////////////////////////////////////////////////////////
        const selectResponse06 = await requester("POST", "http://127.0.0.1:9999", {
            project: "Empresa_z",
            operation: "select",
            table: "sessions",
            where: "[]",
            sort: "[]",
            paginate: "[]",
        }, {
        }, {
            authorization: token01,
        }, true, true, "Protectors test: 6. Forbid item viewer on sessions table");

        if (!utils.check.that(selectResponse06.response.status).equals("success")) throw new Error("06.0");
        if (!utils.check.that(selectResponse06.response.data.items.length).equals(1)) throw new Error("06.1");
        if (!utils.check.that(selectResponse06.response.data.items[0].user).equals(userId01)) throw new Error("06.2");

        ///////////////////////////////////////////////////////////////////////////
        // ForbidFieldsViewer Test 
        ///////////////////////////////////////////////////////////////////////////
        const selectResponse07 = await requester("POST", "http://127.0.0.1:9999", {
            project: "Empresa_z",
            operation: "select",
            table: "users",
            where: "[]",
            sort: "[]",
            paginate: "[]",
        }, {
        }, {
            authorization: token01,
        }, true, true, "Protectors test: 7. Forbid item viewer on users table + Forbid fields viewer on users table for password field");

        if (!utils.check.that(selectResponse07.response.status).equals("success")) throw new Error("07.0");
        if (!utils.check.that(selectResponse07.response.data.items.length).equals(1)) throw new Error("07.1");
        if (!utils.check.that(selectResponse07.response.data.items[0].id).equals(userId01)) throw new Error("07.2");
        if (!utils.check.that(selectResponse07.response.data.items[0].name).equals("345678")) throw new Error("07.3");
        if (!utils.check.that("password" in selectResponse07.response.data.items[0]).equals(false)) throw new Error("07.4");

        ///////////////////////////////////////////////////////////////////////////
        const selectResponse08 = await requester("POST", "http://127.0.0.1:9999", {
            project: "Empresa_z",
            operation: "select",
            table: "sessions",
            where: "[]",
            sort: "[]",
            paginate: "[]",
        }, {
        }, {
            authorization: token01,
        }, true, true, "Protectors test: 8. Forbid item viewer on sessions table + Forbid fields viewer on sessions table for token field");

        if (!utils.check.that(selectResponse08.response.status).equals("success")) throw new Error("08.0");
        if (!utils.check.that(selectResponse08.response.data.items.length).equals(1)) throw new Error("08.1");
        if (!utils.check.that(selectResponse08.response.data.items[0].user).equals(userId01)) throw new Error("08.2");
        if (!utils.check.that("token" in selectResponse08.response.data.items[0]).equals(false)) throw new Error("08.3");
        
        ///////////////////////////////////////////////////////////////////////////
        // ForbidFieldsPersister Test 
        ///////////////////////////////////////////////////////////////////////////
        const updateResponse09 = await requester("POST", "http://127.0.0.1:9999", {
            project: "Empresa_z",
            operation: "update",
        }, {
            table: "users",
            id: userId01,
            value: JSON.stringify({
                id: userId01,
                groups: [1],
                privileges: [1]
            })
        }, {
            authorization: token01,
        }, true, true, "Protectors test: 9. Forbid fields persister on users table for groups and privileges fields");

        if (!utils.check.that(updateResponse09.response.status).equals("success")) throw new Error("09.0");
        if (!utils.check.that(updateResponse09.response.data.item.groups.length).equals(0)) throw new Error("09.1");
        if (!utils.check.that(updateResponse09.response.data.item.privileges.length).equals(0)) throw new Error("09.2");

        const updateResponse10 = await requester("POST", "http://127.0.0.1:9999", {
            project: "Empresa_z",
            operation: "update",
        }, {
            table: "users",
            id: userId01,
            value: JSON.stringify({
                id: userId01,
                groups: [1],
                privileges: [1]
            })
        }, {
            authorization: commonData.sessionToken,
        }, true, true, "Protectors test: 10. Forbid fields persister on users table for groups and privileges fields (should allow)");

        if (!utils.check.that(updateResponse10.response.status).equals("success")) throw new Error("10.0");
        if (!utils.check.that(updateResponse10.response.data.item.id).equals(userId01)) throw new Error("10.1");

        const usersDB = await utils.hydrateJSON(__dirname + "/../../../src/data/projects/Empresa_z/data/users.json");
        
        if (!utils.check.that(usersDB.data[userId01].groups.length).equals(1)) throw new Error("10.2");
        if (!utils.check.that(usersDB.data[userId01].privileges.length).equals(1)) throw new Error("10.3");
        if (!utils.check.that(usersDB.data[userId01].groups[0]).equals(1)) throw new Error("10.4");
        if (!utils.check.that(usersDB.data[userId01].privileges[0]).equals(1)) throw new Error("10.5");

        usersDB.data[userId01].groups = [];
        usersDB.data[userId01].privileges = [];

        await utils.dehydrateJSON(__dirname + "/../../../src/data/projects/Empresa_z/data/users.json", usersDB);

        tester.passTest("Protectors");

    } catch (error) {
        tester.failTest("Protectors");
        throw error;
    }
};