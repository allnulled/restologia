const main = async function () {
    const commonData = require(__dirname + "/utilities.js");
    const { tester } = commonData;
    try {
        /////////////////////////////////////////////////////////////////////
        // Re-install multiple servers:
        await require(__dirname + "/pluralith/inrow/001.Delete-servers.js")(commonData);
        await require(__dirname + "/pluralith/inrow/002.Install-multiple-servers.js")(commonData);
        await require(__dirname + "/pluralith/inrow/003.Configure-servers.js")(commonData);
        await require(__dirname + "/pluralith/inrow/004.Start-servers.js")(commonData);
        ////////////////////////////////////////////////////////////////////
        // Set up projects:
        await require(__dirname + "/pluralith/inrow/005.Create-projects.js")(commonData);
        await require(__dirname + "/pluralith/inrow/006.01.Login-externally.js")(commonData);
        await require(__dirname + "/pluralith/inrow/006.02.Define-schemas.js")(commonData);
        await require(__dirname + "/pluralith/inrow/006.03.Fill-schemas.js")(commonData);
        await require(__dirname + "/pluralith/inrow/007.Authenticate-externally.js")(commonData);
        ////////////////////////////////////////////////////////////////////
        // Test CRUD of data:
        await require(__dirname + "/pluralith/inrow/010.View-schema-externally.js")(commonData);
        await require(__dirname + "/pluralith/inrow/011.Select-externally.js")(commonData);
        await require(__dirname + "/pluralith/inrow/012.Insert-externally.js")(commonData);
        await require(__dirname + "/pluralith/inrow/013.Update-externally.js")(commonData);
        await require(__dirname + "/pluralith/inrow/014.Delete-externally.js")(commonData);
        await require(__dirname + "/pluralith/inrow/101.Table-attribute-hasMultipleUniquekeys-externally.js")(commonData);
        ////////////////////////////////////////////////////////////////////
        // Set down projects:
        await require(__dirname + "/pluralith/inrow/900.Logout-externally.js")(commonData);
        await require(__dirname + "/pluralith/inrow/990.Stop-servers.js")(commonData);
        ////////////////////////////////////////////////////////////////////
        // Clean projects:
        // @DONT: Don't clean projects.
        await require(__dirname + "/pluralith/inrow/991.Clean-projects.js")(commonData);
        
        /////////////////////////////////////////////////////////////////////
        tester.printResults();
        /////////////////////////////////////////////////////////////////////
    } catch (error) {
        tester.printResults();
        console.log();
        console.log("The error that made tests crash was this one:");
        console.log();
        console.log(error);
        console.log();
    }
};

main();