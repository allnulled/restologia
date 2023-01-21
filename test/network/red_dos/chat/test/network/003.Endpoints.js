module.exports = async commonData => {
    const { requester, utils, tester } = commonData;
    try {
        tester.startTest("Endpoints");
        // @TODO...
        const settingsJson = JSON.parse(require("fs").readFileSync(__dirname + "/red_dos/statics/src/security/settings.json").toString());
        const appUrl = `${settingsJson.SERVER_PROTOCOL}://${settingsJson.SERVER_HOST}:${settingsJson.APPLICATION_PORT}/restologia-app.1.0.0.html`;
        require("child_process").exec("firefox " + JSON.stringify(appUrl));
        setTimeout(() => console.log(appUrl), 1000 * 1);
        tester.passTest("Endpoints");
    } catch (error) {
        tester.failTest("Endpoints");
        throw error;
    }
};