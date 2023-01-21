module.exports = async function (commonData) {
    const { requester, utils, tester } = commonData;
    try {

        tester.startTest("Configure servers");

        const fs = require("fs");

        commonData.serversPath = require("path").resolve(__dirname + "/../../../../servers");

        const authSettingsPath = commonData.serversPath + "/auth/src/security/settings.json";
        const productsSettingsPath = commonData.serversPath + "/products/src/security/settings.json";
        const chartsSettingsPath = commonData.serversPath + "/charts/src/security/settings.json";

        const authSettings = JSON.parse(fs.readFileSync(authSettingsPath).toString());
        const productsSettings = JSON.parse(fs.readFileSync(productsSettingsPath).toString());
        const chartsSettings = JSON.parse(fs.readFileSync(chartsSettingsPath).toString());

        const authSettings2 = Object.assign({}, authSettings, {
            SERVER_ID: "Authentication Server",
            SERVER_PORT: 9980
        });
        const productsSettings2 = Object.assign({}, productsSettings, {
            SERVER_ID: "Products Server",
            SERVER_PORT: 9981
        });
        const chartsSettings2 = Object.assign({}, chartsSettings, {
            SERVER_ID: "Charts Server",
            SERVER_PORT: 9982
        });

        require("fs").writeFileSync(authSettingsPath, JSON.stringify(authSettings2), "utf8");
        require("fs").writeFileSync(productsSettingsPath, JSON.stringify(productsSettings2), "utf8");
        require("fs").writeFileSync(chartsSettingsPath, JSON.stringify(chartsSettings2), "utf8");

        // await new Promise((ok, fail) => { setTimeout(ok, 3000); });

        const authSettings3 = JSON.parse(fs.readFileSync(authSettingsPath).toString());
        const productsSettings3 = JSON.parse(fs.readFileSync(productsSettingsPath).toString());
        const chartsSettings3 = JSON.parse(fs.readFileSync(chartsSettingsPath).toString());

        if (!utils.check.that(authSettings3.SERVER_ID).equals("Authentication Server")) throw new Error(1);
        if (!utils.check.that(productsSettings3.SERVER_ID).equals("Products Server")) throw new Error(2);
        if (!utils.check.that(chartsSettings3.SERVER_ID).equals("Charts Server")) throw new Error(3);

        tester.passTest("Configure servers");

    } catch (error) {
        tester.failTest("Configure servers");
        throw error;
    }
};
