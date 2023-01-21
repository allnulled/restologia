module.exports = async function (commonData) {
    const { requester, utils, tester } = commonData;
    try {
        
        tester.startTest("Login");

        const response01 = await requester("POST", "http://127.0.0.1:9999", {
            project: "Empresa_z",
            operation: "login",
        }, {
            user: "pepito",
            password: "pepito",
        }, {}, true, true, "Login into app");

        if (!utils.check.that(response01.response.status).equals("success")) throw new Error(0);

        commonData.sessionToken = response01.response.data.session.token;

        const sessionsDB = await utils.hydrateJSON(__dirname + "/../../../src/data/projects/Empresa_z/data/sessions.json");
        if(!utils.check.that(Object.values(sessionsDB.data).filter(session => session.token === commonData.sessionToken).length).equals(1)) throw new Error(1);

        tester.passTest("Login");

    } catch (error) {
        tester.failTest("Login");
        throw error;
    }
};