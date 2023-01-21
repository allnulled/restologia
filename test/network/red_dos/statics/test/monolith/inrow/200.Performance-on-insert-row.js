module.exports = async function (commonData) {
    const { requester, utils, tester } = commonData;
    try {

        tester.startTest("Performance on insert row");
        
        /*/
        return tester.passTest("Performance on insert row");
        //*/

        const started = new Date();

        console.log("Proceeding to test performance. Please, wait...");
        const insertions = [];
        for(let index = 0; index < (100); index++) {
            await requester("POST", "http://127.0.0.1:9999", {
                project: "Empresa_z",
                operation: "insert",
            }, {
                table: "users",
                value: JSON.stringify({
                    name: "user." + index,
                    password: "user." + index,
                    email: "usermail@" + index + ".org",
                    groups: [],
                    privileges: []
                }),
            }, {
                authorization: commonData.sessionToken,
            }, true, false, false);
        }
        console.log("Performance tested successfully.");

        const tookMilliseconds = new Date() - started;
        const tookSeconds = tookMilliseconds / 100;

        console.log("It took " + tookSeconds + " to insert 100 rows");
        console.log("This means an average speed of " + (tookSeconds / 100) + " seconds per row");
        console.log("This means an average speed of " + Math.round(100 / tookSeconds) + " rows per seconds");

        tester.passTest("Performance on insert row");

    } catch (error) {
        tester.failTest("Performance on insert row");
        throw error;
    }
};