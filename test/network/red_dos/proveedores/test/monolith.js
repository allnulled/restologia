const main = async function() {
    const commonData = require(__dirname + "/utilities.js");
    const { tester } = commonData;
    try {
        /////////////////////////////////////////////////////////////////////
        // Start server:
        await require(__dirname + "/monolith/inrow/000.Start-server.js")(commonData);
        // Project:
        await require(__dirname + "/monolith/inrow/001.Delete-project.js")(commonData);
        await require(__dirname + "/monolith/inrow/002.Create-project.js")(commonData);
        // Login:
        await require(__dirname + "/monolith/inrow/003.01.Login.js")(commonData);
        await require(__dirname + "/monolith/inrow/003.02.Authenticate.js")(commonData);
        // Data:
        await require(__dirname + "/monolith/inrow/004.Insert-row.js")(commonData);
        await require(__dirname + "/monolith/inrow/005.Update-row.js")(commonData);
        await require(__dirname + "/monolith/inrow/006.Select-rows.js")(commonData);
        await require(__dirname + "/monolith/inrow/007.Delete-row.js")(commonData);
        // Schema:
        await require(__dirname + "/monolith/inrow/008.Add-table.js")(commonData);
        await require(__dirname + "/monolith/inrow/009.Add-column.js")(commonData);
        await require(__dirname + "/monolith/inrow/010.Update-column.js")(commonData);
        await require(__dirname + "/monolith/inrow/011.Update-table.js")(commonData);
        await require(__dirname + "/monolith/inrow/012.Delete-column.js")(commonData);
        await require(__dirname + "/monolith/inrow/013.Delete-table.js")(commonData);
        await require(__dirname + "/monolith/inrow/014.View-schema.js")(commonData);
        await require(__dirname + "/monolith/inrow/015.Set-file.js")(commonData);
        await require(__dirname + "/monolith/inrow/016.Get-file.js")(commonData);
        // Miscelaneous:
        await require(__dirname + "/monolith/inrow/031.Protectors.js")(commonData);
        await require(__dirname + "/monolith/inrow/032.Protectors-crud.js")(commonData);
        await require(__dirname + "/monolith/inrow/033.Authorized-operations.js")(commonData);
        await require(__dirname + "/monolith/inrow/034.Data-safe.js")(commonData);
        await require(__dirname + "/monolith/inrow/035.Core-safe.js")(commonData);
        // Miscelaneous:
        await require(__dirname + "/monolith/inrow/040.Processes.js")(commonData);
        // Examples:
        await require(__dirname + "/monolith/inrow/101.Prepare-e-shop.js")(commonData);
        // Performance:
        await require(__dirname + "/monolith/inrow/200.Performance-on-insert-row.js")(commonData);
        // Logout:
        await require(__dirname + "/monolith/inrow/900.Logout.js")(commonData);
        // Stop server:
        await require(__dirname + "/monolith/inrow/990.Stop-server.js")(commonData);
        // Clean projects:
        await require(__dirname + "/monolith/inrow/991.Clean-projects.js")(commonData);
        /////////////////////////////////////////////////////////////////////
        tester.printResults();
        /////////////////////////////////////////////////////////////////////
    } catch(error) {
        tester.printResults();
        console.log();
        console.log("The error that made tests crash was this one:");
        console.log();
        console.log(error);
        console.log();
    }
};

main();