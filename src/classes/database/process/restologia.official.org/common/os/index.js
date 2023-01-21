const os = require("os");

module.exports = async function (publicParameters, privateParameters, configurations) {
    try {
        return {
            operation: "restologia.official.org/common/os",
            information: {
                hostname: os.hostname(),
                platform: os.platform(),
                architecture: os.arch(),
                type: os.type(),
                release: os.release(),
                endianness: os.endianness(),
                totalmem: os.totalmem(),
                tmpdir: os.tmpdir(),
                homedir: os.homedir(),
                userInfo: os.userInfo(),
                cpus: os.cpus(),
                networkInterfaces: os.networkInterfaces(),
            }
        }
    } catch (error) {
        throw error;
    }
};