module.exports = async function(commonData) {
    const { requester, utils, tester } = commonData;
    try {

        tester.startTest("Delete project");
        
        const response01 = await requester("POST", "http://127.0.0.1:9999", {
            operation: "delete-project",
        }, {
            user: "carlosjimenohernandez",
            password: "Carlos.Jimeno.Hernandez.9876543210",
            project: "Empresa_z",
        }, {}, true, true, "Delete project");

        // if(!utils.check.that(response01.response.status).equals("success")) throw new Error(0);

        tester.passTest("Delete project");

    } catch(error) {
        tester.failTest("Delete project");
        throw error;
    }
};