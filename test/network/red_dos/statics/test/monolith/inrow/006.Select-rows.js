module.exports = async function (commonData) {
    const { requester, utils, tester } = commonData;
    try {

        tester.startTest("Select rows");

        const selectResponse01 = await requester("GET", "http://127.0.0.1:9999", {
            project: "Empresa_z",
            operation: "select",
            table: "users",
            where: "[]",
            sort: "[]",
            paginate: "[]",
        }, {}, {
            authorization: commonData.sessionToken,
        }, true, true, "Select data from app");

        if (!utils.check.that(selectResponse01.response.status).equals("success")) throw new Error("01");
        if (!utils.check.that(selectResponse01.response.data.items.length).equals(6)) throw new Error(1);

        const selectResponse02 = await requester("GET", "http://127.0.0.1:9999", {
            project: "Empresa_z",
            operation: "select",
            table: "users",
            where: JSON.stringify([
                ["name", "=", "234567"]
            ]),
            sort: "[]",
            paginate: "[]",
        }, {}, {
            authorization: commonData.sessionToken,
        }, true, true, "Select data from app using «where» with operator « = »");

        if (!utils.check.that(selectResponse02.response.status).equals("success")) throw new Error("02");
        if (!utils.check.that(selectResponse02.response.data.items.length).equals(1)) throw new Error(2);

        const selectResponse03 = await requester("GET", "http://127.0.0.1:9999", {
            project: "Empresa_z",
            operation: "select",
            table: "users",
            where: JSON.stringify([
                ["name", "in", ["234567", "345678", "456789"]]
            ]),
            sort: "[]",
            paginate: "[]",
        }, {}, {
            authorization: commonData.sessionToken,
        }, true, true, "Select data from app using «where» with operator « in »");

        if (!utils.check.that(selectResponse03.response.status).equals("success")) throw new Error("03");
        if (!utils.check.that(selectResponse03.response.data.items.length).equals(3)) throw new Error(3);

        const selectResponse04 = await requester("GET", "http://127.0.0.1:9999", {
            project: "Empresa_z",
            operation: "select",
            table: "users",
            where: JSON.stringify([
                ["name", "in", ["234567", "345678", "456789"]]
            ]),
            sort: JSON.stringify(["!name"]),
            paginate: "[]",
        }, {}, {
            authorization: commonData.sessionToken,
        }, true, true, "Select data from app using «sort»");

        if (!utils.check.that(selectResponse04.response.data.items[0].name).equals("456789")) throw new Error(4);

        const selectResponse05 = await requester("GET", "http://127.0.0.1:9999", {
            project: "Empresa_z",
            operation: "select",
            table: "users",
            where: JSON.stringify([
                ["name", "in", ["234567", "345678", "456789"]]
            ]),
            sort: JSON.stringify(["!name"]),
            paginate: JSON.stringify([ 3, 1 ]),
        }, {}, {
            authorization: commonData.sessionToken,
        }, true, true, "Select data from app using «paginate»");

        if (!utils.check.that(selectResponse05.response.data.items[0].name).equals("234567")) throw new Error(5);
        if (!utils.check.that(selectResponse05.response.data.structure).isObject()) throw new Error(6);
        

        tester.passTest("Select rows");

    } catch (error) {
        tester.failTest("Select rows");
        throw error;
    }
};