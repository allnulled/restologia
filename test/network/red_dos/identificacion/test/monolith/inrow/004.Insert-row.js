module.exports = async function (commonData) {
    const { requester, utils, tester } = commonData;
    try {

        tester.startTest("Insert row");
        
        commonData.insertedData = [];

        const insertResponse01 = await requester("POST", "http://127.0.0.1:9999", {
            project: "Empresa_z",
            operation: "insert",
        }, {
            table: "users", 
            value: JSON.stringify({
                name: "123456",
                password: "123456",
                email: "123456",
                groups: [],
                privileges: []
            }),
        }, {
            authorization: commonData.sessionToken,
        }, true, true, "Insert data into app");

        if(!utils.check.that(insertResponse01.response.status).equals("success")) throw new Error("01");
        commonData.insertedData.push(insertResponse01.response.data.item);

        const insertResponse02 = await requester("POST", "http://127.0.0.1:9999", {
            project: "Empresa_z",
            operation: "insert",
        }, {
            table: "users", 
            value: JSON.stringify({
                name: "234567",
                password: "234567",
                email: "234567",
                groups: [],
                privileges: []
            }),
        }, {
            authorization: commonData.sessionToken,
        }, true, true, "Insert data into app");

        if(!utils.check.that(insertResponse02.response.status).equals("success")) throw new Error("02");
        commonData.insertedData.push(insertResponse02.response.data.item);

        const insertResponse03 = await requester("POST", "http://127.0.0.1:9999", {
            project: "Empresa_z",
            operation: "insert",
        }, {
            table: "users", 
            value: JSON.stringify({
                name: "345678",
                password: "345678",
                email: "345678",
                groups: [],
                privileges: []
            }),
        }, {
            authorization: commonData.sessionToken,
        }, true, true, "Insert data into app");

        if(!utils.check.that(insertResponse03.response.status).equals("success")) throw new Error("03");
        commonData.insertedData.push(insertResponse03.response.data.item);

        const insertResponse04 = await requester("POST", "http://127.0.0.1:9999", {
            project: "Empresa_z",
            operation: "insert",
        }, {
            table: "users", 
            value: JSON.stringify({
                name: "456789",
                password: "456789",
                email: "456789",
                groups: [],
                privileges: []
            }),
        }, {
            authorization: commonData.sessionToken,
        }, true, true, "Insert data into app");

        if(!utils.check.that(insertResponse04.response.status).equals("success")) throw new Error("04");
        commonData.insertedData.push(insertResponse04.response.data.item);

        const insertResponse05 = await requester("POST", "http://127.0.0.1:9999", {
            project: "Empresa_z",
            operation: "insert",
        }, {
            table: "users", 
            value: JSON.stringify({
                name: "567890",
                password: "567890",
                email: "567890",
                groups: [],
                privileges: []
            }),
        }, {
            authorization: commonData.sessionToken,
        }, true, true, "Insert data into app");

        if(!utils.check.that(insertResponse05.response.status).equals("success")) throw new Error("05");
        commonData.insertedData.push(insertResponse05.response.data.item);

        const usersDB = await utils.hydrateJSON(__dirname + "/../../../src/data/projects/Empresa_z/data/users.json");

        const userItem01 = usersDB.data[insertResponse01.response.data.item.id];
        if (!utils.check.that(userItem01.name).equals("123456")) throw new Error(1);
        if (!utils.check.that(userItem01.password).equals("123456")) throw new Error(2);
        if (!utils.check.that(userItem01.email).equals("123456")) throw new Error(3);
        if (!utils.check.that(userItem01.groups).isArray()) throw new Error(4);
        if (!utils.check.that(userItem01.privileges).isArray()) throw new Error(5);

        const userItem02 = usersDB.data[insertResponse02.response.data.item.id];
        if (!utils.check.that(userItem02.name).equals("234567")) throw new Error(1);
        if (!utils.check.that(userItem02.password).equals("234567")) throw new Error(2);
        if (!utils.check.that(userItem02.email).equals("234567")) throw new Error(3);
        if (!utils.check.that(userItem02.groups).isArray()) throw new Error(4);
        if (!utils.check.that(userItem02.privileges).isArray()) throw new Error(5);

        const userItem03 = usersDB.data[insertResponse03.response.data.item.id];
        if (!utils.check.that(userItem03.name).equals("345678")) throw new Error(1);
        if (!utils.check.that(userItem03.password).equals("345678")) throw new Error(2);
        if (!utils.check.that(userItem03.email).equals("345678")) throw new Error(3);
        if (!utils.check.that(userItem03.groups).isArray()) throw new Error(4);
        if (!utils.check.that(userItem03.privileges).isArray()) throw new Error(5);

        const userItem04 = usersDB.data[insertResponse04.response.data.item.id];
        if (!utils.check.that(userItem04.name).equals("456789")) throw new Error(1);
        if (!utils.check.that(userItem04.password).equals("456789")) throw new Error(2);
        if (!utils.check.that(userItem04.email).equals("456789")) throw new Error(3);
        if (!utils.check.that(userItem04.groups).isArray()) throw new Error(4);
        if (!utils.check.that(userItem04.privileges).isArray()) throw new Error(5);

        const userItem05 = usersDB.data[insertResponse05.response.data.item.id];
        if (!utils.check.that(userItem05.name).equals("567890")) throw new Error(1);
        if (!utils.check.that(userItem05.password).equals("567890")) throw new Error(2);
        if (!utils.check.that(userItem05.email).equals("567890")) throw new Error(3);
        if (!utils.check.that(userItem05.groups).isArray()) throw new Error(4);
        if (!utils.check.that(userItem05.privileges).isArray()) throw new Error(5);
        
        tester.passTest("Insert row");

    } catch (error) {
        tester.failTest("Insert row");
        throw error;
    }
};
