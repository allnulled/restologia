module.exports = async function (commonData) {
    const { requester, utils, tester } = commonData;
    try {

        tester.startTest("Fill schemas");

        ////////////////////////////////////////////////////////////////////////////////////////////
        // Define «Products.products» table:

        const products = [{
            name: "Product one",
            price: "100€",
            description: "The «Product one» is awesome.",
            details: "It is the one.",
            categories: "numbers;one"
        }, {
            name: "Product two",
            price: "200€",
            description: "The «Product two» is awesome.",
            details: "It is the two.",
            categories: "numbers;two"
        }, {
            name: "Product three",
            price: "300€",
            description: "The «Product three» is awesome.",
            details: "It is the three.",
            categories: "numbers;three"
        }, {
            name: "Product four",
            price: "400€",
            description: "The «Product four is awesome.",
            details: "It is the four.",
            categories: "numbers;four"
        }, {
            name: "Product five",
            price: "500€",
            description: "The «Product five» is awesome.",
            details: "It is the five.",
            categories: "numbers;five"
        }];

        for(let index = 0; index < products.length; index++) {
            const product = products[index];

            const productResponse = await requester("POST", "http://127.0.0.1:9981", {
                project: "Products",
                operation: "insert",
            }, {
                table: "products",
                value: JSON.stringify(product)
            }, {
                authorization: commonData.$productsAdminToken,
            }, true, true, "Add «products» to «Products.products»");
    
            if (!utils.check.that(productResponse.response.status).equals("success")) throw new Error("1.1");
            
        }


        tester.passTest("Fill schemas");

    } catch (error) {
        tester.failTest("Fill schemas");
        throw error;
    }
};
