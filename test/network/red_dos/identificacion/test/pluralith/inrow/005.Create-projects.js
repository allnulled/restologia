module.exports = async function (commonData) {
    const { requester, utils, tester } = commonData;
    try {

        tester.startTest("Create projects");

        const response01 = await requester("POST", "http://127.0.0.1:9980", {
            operation: "create-project",
        }, {
            user: "carlosjimenohernandez",
            password: "Carlos.Jimeno.Hernandez.9876543210",
            project: "Identification",
            administrator_name: "auth_admin",
            administrator_password: "auth_admin",
            administrator_email: "auth_admin@correo.com",
        }, {}, true, true, "Create project «Identification»");

        if (!utils.check.that(response01.response.status).equals("success")) throw new Error(1);

        const response02 = await requester("POST", "http://127.0.0.1:9981", {
            operation: "create-project",
        }, {
            user: "carlosjimenohernandez",
            password: "Carlos.Jimeno.Hernandez.9876543210",
            project: "Products",
            administrator_name: "products_admin",
            administrator_password: "products_admin",
            administrator_email: "products_admin@correo.com",
            schema_attributes: {
                isAuthenticatedBy: {
                    url: "http://127.0.0.1:9980",
                    project: "Identification"
                }
            }
        }, {}, true, true, "Create project «Identification»");

        if (!utils.check.that(response02.response.status).equals("success")) throw new Error(2);

        const response03 = await requester("POST", "http://127.0.0.1:9982", {
            operation: "create-project",
        }, {
            user: "carlosjimenohernandez",
            password: "Carlos.Jimeno.Hernandez.9876543210",
            project: "Charts",
            administrator_name: "charts_admin",
            administrator_password: "charts_admin",
            administrator_email: "charts_admin@correo.com",
            schema_attributes: {
                isAuthenticatedBy: {
                    url: "http://127.0.0.1:9980",
                    project: "Identification"
                }
            }
        }, {}, true, true, "Create project «Charts»");

        if (!utils.check.that(response03.response.status).equals("success")) throw new Error(3);

        const productsProjectJson = JSON.parse(require("fs").readFileSync(commonData.serversPath + "/products/src/data/projects/Products/project.json").toString());
        console.log(productsProjectJson);
        if (!utils.check.that(typeof productsProjectJson.schema.attributes.isAuthenticatedBy).equals("object")) throw new Error("4: isAuthenticatedBy is not an object");
        if (!utils.check.that(productsProjectJson.schema.attributes.isAuthenticatedBy.url).equals("http://127.0.0.1:9980")) throw new Error(5);
        if (!utils.check.that(productsProjectJson.schema.attributes.isAuthenticatedBy.project).equals("Identification")) throw new Error(6);

        const chartsProjectJson = JSON.parse(require("fs").readFileSync(commonData.serversPath + "/charts/src/data/projects/Charts/project.json").toString());
        if (!utils.check.that(typeof chartsProjectJson.schema.attributes.isAuthenticatedBy).equals("object")) throw new Error(7);
        if (!utils.check.that(chartsProjectJson.schema.attributes.isAuthenticatedBy.url).equals("http://127.0.0.1:9980")) throw new Error(8);
        if (!utils.check.that(chartsProjectJson.schema.attributes.isAuthenticatedBy.project).equals("Identification")) throw new Error(9);

        tester.passTest("Create projects");

    } catch (error) {
        tester.failTest("Create projects");
        throw error;
    }
};
