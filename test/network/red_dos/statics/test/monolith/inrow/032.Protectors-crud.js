module.exports = async function (commonData) {
    const { requester, utils, tester } = commonData;
    try {

        tester.startTest("Protectors CRUD");
        ///////////////////////////////////////////////////////////////////////////
        // Add protector Test 
        ///////////////////////////////////////////////////////////////////////////
        const addProtectorResponse01 = await requester("POST", "http://127.0.0.1:9999", {
            project: "Empresa_z",
            operation: "add-protector",
        }, {
            table: "products",
            protector_name: "Only admin updates notes",
            protector_type: "ForbidFieldsPersister",
            parameters: JSON.stringify({
                "Forbid fields": "notes",
                "Allowed user column": null,
                "Allowed privileges": "to administrate"
            })
        }, {
            authorization: commonData.sessionToken,
        }, true, true, "Protectors CRUD test: 1. add «forbid-fields-persister» protector to «products.notes» to allow only admin to alter this column");

        if (!utils.check.that(addProtectorResponse01.response.status).equals("success")) throw new Error("01.0");
        if (!utils.check.that(addProtectorResponse01.response.data.message).equals("Operation «add-protector» successfully achieved")) throw new Error("01.1");

        const insertResponse02 = await requester("POST", "http://127.0.0.1:9999", {
            project: "Empresa_z",
            operation: "insert",
        }, {
            table: "products",
            value: JSON.stringify({
                name: "Random product 001",
                price: "100€",
                notes: "These are some allowed notes made by the admin."
            })
        }, {
            authorization: commonData.sessionToken,
        }, true, true, "Protectors CRUD test: 2. checking «add-protector» worked by allowing persistence");

        if (!utils.check.that(insertResponse02.response.status).equals("success")) throw new Error("02.0");
        
        const insertResponse03 = await requester("POST", "http://127.0.0.1:9999", {
            project: "Empresa_z",
            operation: "insert",
        }, {
            table: "products",
            value: JSON.stringify({
                name: "Random product 002",
                price: "200€",
                notes: "These are some not allowed notes made by some user."
            })
        }, {
            authorization: commonData.userSessionToken,
        }, true, true, "Protectors CRUD test: 3. checking «add-protector» worked by forbiding persistence");
        
        if (!utils.check.that(insertResponse03.response.status).equals("success")) throw new Error("03.0");
        if (!utils.check.that(insertResponse03.response.data.item.name).equals("Random product 002")) throw new Error("03.1");
        if (!utils.check.that(insertResponse03.response.data.item.price).equals("200€")) throw new Error("03.2");
        if (!utils.check.that(insertResponse03.response.data.item.notes).isUndefined()) throw new Error("03.3");

        const productItemId = insertResponse03.response.data.item.id;

        ///////////////////////////////////////////////////////////////////////////
        // Update protector Test 
        ///////////////////////////////////////////////////////////////////////////
        const updateProtectorResponse04 = await requester("POST", "http://127.0.0.1:9999", {
            project: "Empresa_z",
            operation: "update-protector",
        }, {
            table: "products",
            protector_type: "ForbidFieldsPersister",
            protector_name: "Only admin updates notes",
            protector_new_name: "Only admin updates notes and price",
            parameters: JSON.stringify({
                "Forbid fields": "notes,price",
                "Allowed user column": null,
                "Allowed privileges": "to administrate"
            })
        }, {
            authorization: commonData.sessionToken,
        }, true, true, "Protectors CRUD test: 4. update previous protector to also apply to «products.price»");

        if (!utils.check.that(updateProtectorResponse04.response.status).equals("success")) throw new Error("04.0");
        if (!utils.check.that(updateProtectorResponse04.response.data.message).equals("Operation «update-protector» successfully achieved")) throw new Error("04.1");
        
        const updateResponse05 = await requester("POST", "http://127.0.0.1:9999", {
            project: "Empresa_z",
            operation: "update",
        }, {
            table: "products",
            id: productItemId,
            value: JSON.stringify({
                name: "Random product 002 (modified)",
                price: "300€",
                notes: "These are some NOT allowed notes made by some user."
            })
        }, {
            authorization: commonData.userSessionToken,
        }, true, true, "Protectors CRUD test: 5. checking «update-protector» worked by forbiding persistence");

        if (!utils.check.that(updateResponse05.response.status).equals("success")) throw new Error("05.0");
        if (!utils.check.that(updateResponse05.response.data.item.name).equals("Random product 002 (modified)")) throw new Error("05.1");
        if (!utils.check.that(updateResponse05.response.data.item.price).equals("200€")) throw new Error("05.2");
        if (!utils.check.that(updateResponse05.response.data.item.notes).isUndefined()) throw new Error("05.3");
        if (!utils.check.that(updateResponse05.response.data.protectorErrors).isArray()) throw new Error("05.4");
        if (!utils.check.that(updateResponse05.response.data.protectorErrors.length).equals(2)) throw new Error("05.5");

        ///////////////////////////////////////////////////////////////////////////
        // Delete protectors Test 
        ///////////////////////////////////////////////////////////////////////////
        const viewSchemaResponse06 = await requester("POST", "http://127.0.0.1:9999", {
            project: "Empresa_z",
            operation: "view-schema",
        }, {}, {
            authorization: commonData.sessionToken,
        }, true, true, "View app schema");

        const projectData2 = await utils.hydrateJSON(__dirname + "/../../../src/data/projects/Empresa_z/project.json");
        const schemaTablesLength2 = Object.keys(projectData2.schema.tables).length;
        const responseTablesLength2 = Object.keys(viewSchemaResponse06.response.data.schema.tables).length;

        if (!utils.check.that(schemaTablesLength2).equals(responseTablesLength2)) throw new Error("06.0");
        if (!utils.check.that(viewSchemaResponse06.response.data.schema.tables.products.attributes.hasProtectors.length).equals(1)) throw new Error("06.1");

        const deleteProtectorResponse07 = await requester("POST", "http://127.0.0.1:9999", {
            project: "Empresa_z",
            operation: "delete-protector",
        }, {
            table: "products",
            protector_name: "Only admin updates notes and price"
        }, {
            authorization: commonData.sessionToken,
        }, true, true, "Protectors CRUD test: 6. delete previous protector");

        if (!utils.check.that(deleteProtectorResponse07.response.status).equals("success")) throw new Error("04.0");
        if (!utils.check.that(deleteProtectorResponse07.response.data.message).equals("Operation «delete-protector» successfully achieved")) throw new Error("07.1");

        const updateResponse08 = await requester("POST", "http://127.0.0.1:9999", {
            project: "Empresa_z",
            operation: "update",
        }, {
            table: "products",
            id: productItemId,
            value: JSON.stringify({
                name: "Random product 002 (modified again)",
                price: "300€",
                notes: "These are some allowed notes made by some user."
            })
        }, {
            authorization: commonData.userSessionToken,
        }, true, true, "Protectors CRUD test: 7. checking «delete-protector» worked by allowing every persistence");

        if (!utils.check.that(updateResponse08.response.status).equals("success")) throw new Error("08.0");
        if (!utils.check.that(updateResponse08.response.data.item.name).equals("Random product 002 (modified again)")) throw new Error("08.1");
        if (!utils.check.that(updateResponse08.response.data.item.price).equals("300€")) throw new Error("08.2");
        if (!utils.check.that(updateResponse08.response.data.item.notes).equals("These are some allowed notes made by some user.")) throw new Error("08.3");
        
        ///////////////////////////////////////////////////////////////////////////
        // View protectors Test 
        ///////////////////////////////////////////////////////////////////////////


        const viewSchemaResponse09 = await requester("POST", "http://127.0.0.1:9999", {
            project: "Empresa_z",
            operation: "view-schema",
        }, {}, {
            authorization: commonData.sessionToken,
        }, true, true, "View app schema");

        const projectData = await utils.hydrateJSON(__dirname + "/../../../src/data/projects/Empresa_z/project.json");
        const schemaTablesLength = Object.keys(projectData.schema.tables).length;
        const responseTablesLength = Object.keys(viewSchemaResponse09.response.data.schema.tables).length;

        if (!utils.check.that(schemaTablesLength).equals(responseTablesLength)) throw new Error("09.0");
        if (!utils.check.that(viewSchemaResponse09.response.data.schema.tables.products.attributes.hasProtectors.length).equals(0)) throw new Error("09.1");


        tester.passTest("Protectors CRUD");

    } catch (error) {
        tester.failTest("Protectors CRUD");
        throw error;
    }
};