const main = async function () {
    const commonData = require(__dirname + "/utilities.js");
    const { tester } = commonData;
    try {
        /////////////////////////////////////////////////////////////////////
        // Start servers network:
        await require(__dirname + "/network/001.Deployment.js")(commonData);
        await require(__dirname + "/network/002.Compile-app.js")(commonData);
        await require(__dirname + "/network/003.Endpoints.js")(commonData);
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