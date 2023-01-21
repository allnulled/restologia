module.exports = async function (commonData) {
    const { requester, utils, tester } = commonData;
    try {

        tester.startTest("Create project");

        const response01 = await requester("POST", "http://127.0.0.1:9999", {
            operation: "create-project",
        }, {
            user: "carlosjimenohernandez",
            password: "Carlos.Jimeno.Hernandez.9876543210",
            project: "Empresa_z",
            administrator_name: "pepito",
            administrator_password: "pepito",
            administrator_email: "pepito@correo.com",
        }, {}, true, true, "Create project");

        if (!utils.check.that(response01.response.status).equals("success")) throw new Error(0);

        tester.passTest("Create project");

    } catch (error) {
        tester.failTest("Create project");
        throw error;
    }
};
