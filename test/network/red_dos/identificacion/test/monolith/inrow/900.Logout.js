module.exports = async function (commonData) {
    const { requester, utils, tester } = commonData;
    try {

        tester.startTest("Logout");
        
        if(!commonData.remainStarted) {
            const response01 = await requester("POST", "http://127.0.0.1:9999", {
                project: "Empresa_z",
                operation: "logout",
            }, {}, {
                authorization: commonData.sessionToken,
            }, true, true, "Logout from app");

            if (!utils.check.that(response01.response.status).equals("success")) throw new Error(1);
        }
        

        tester.passTest("Logout");

    } catch (error) {
        tester.failTest("Logout");
        throw error;
    }
};
