module.exports = async function (commonData) {
    const { requester, utils, tester, $auth, $products, $charts } = commonData;
    try {

        tester.startTest("Stop server");

        await $products.server.stop();
        await $auth.server.stop();
        await $charts.server.stop();

        tester.passTest("Stop server");

    } catch (error) {
        tester.failTest("Stop server");
        throw error;
    }
};
