module.exports = async commonData => {
    const { requester, utils, tester } = commonData;
    try {
        tester.startTest("Compile-app");
        // @TODO...
        try {
            require("child_process").execSync("calo ./test/network/red_dos/statics/src/app/app.calo", {
                cwd: __dirname + "/../..",
                stdio: [process.stdin, process.stdout, process.stderr ]
            });
        } catch (error) {
            tester.failTest("Compile-app");
            console.log(error);
            throw error;
        }
        tester.passTest("Compile-app");
    } catch (error) {
        tester.failTest("Compile-app");
        throw error;
    }
};