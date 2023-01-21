module.exports = async function (commonData) {
    const { requester, utils, tester } = commonData;
    try {

        tester.startTest("Processes");

        const accessProcesses01 = await requester("POST", "http://127.0.0.1:9999", {
            project: "Empresa_z",
            operation: "process",
            process: "restologia.official.org/common/ping"
        }, {}, {
            authorization: commonData.sessionToken,
        }, true, true, "Process is accessible when it is enabled");

        // utils.dieStringify(accessProcesses01.response);

        if (!utils.check.that(accessProcesses01.response.status).equals("success")) throw new Error("01.0");
        if (!utils.check.that(accessProcesses01.response.data.message).equals("Operation «process» successfully achieved")) throw new Error("01.1");
        if (!utils.check.that(accessProcesses01.response.data.operation).equals("restologia.official.org/common/ping")) throw new Error("01.2");

        const accessProcesses02 = await requester("POST", "http://127.0.0.1:9999", {
            project: "Empresa_z",
            operation: "process",
            process: "restologia.official.org/common/os"
        }, {}, {
            authorization: commonData.sessionToken,
        }, true, true, "Process is NOT accessible when it is NOT enabled");

        if (!utils.check.that(accessProcesses02.response.status).equals("error")) throw new Error("02.0");
        if (!utils.check.that(accessProcesses02.response.error.message).equals("Required parameter «process» to refer to an enabled process")) throw new Error("02.1");

        const accessProcesses03 = await requester("POST", "http://127.0.0.1:9999", {
            project: "Empresa_z",
            operation: "process",
            process: "restologia.official.org/common/unexistent"
        }, {}, {
            authorization: commonData.sessionToken,
        }, true, true, "Process is NOT accessible when it is DOES NOT exist");

        if (!utils.check.that(accessProcesses03.response.status).equals("error")) throw new Error("03.0");
        if (!utils.check.that(accessProcesses03.response.error.message).equals("Required parameter «process» to be an identifiable process")) throw new Error("03.1");

        tester.passTest("Processes");

    } catch (error) {
        tester.failTest("Processes");
        throw error;
    }
};