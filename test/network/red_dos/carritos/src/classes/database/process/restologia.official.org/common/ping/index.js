module.exports = async function(publicParameters, privateParameters, configurations) {
    try {
        return {
            operation: "restologia.official.org/common/ping",
            ping: true,
            pong: true
        };
    } catch(error) {
        throw error;
    }
};