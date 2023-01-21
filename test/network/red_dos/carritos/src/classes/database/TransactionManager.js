class TransactionsList {

    constructor() {
        this.operations = [];
    }

    push(transaction) {
        let wasEmpty = this.operations.length === 0;
        this.operations.push(transaction);
        if(wasEmpty) this.dispatching();
    }

    dispatching() {
        if(this.operations.length !== 0) {
            const transaction = this.operations[0];
            const [callback, dispatchedOk, dispatchedFailed ] = transaction;
            callback((data) => {
                this.operations.shift();
                dispatchedOk(data);
                this.dispatching();
            }, (error) => {
                this.operations.shift();
                dispatchedFailed(error);
                this.dispatching();
            });
        }
    }

}

class Transactor {

    constructor() {
        this.transactions = new TransactionsList();
    }

    block(callback) {
        return new Promise((ok, fail) => {
            this.transactions.push([
                callback,
                ok,
                fail,
            ]);
        });
    }

}

class TransactionManager {

    static get Transactor() {
        return Transactor;
    }

    static get TransactionsList() {
        return TransactionsList;
    }

    constructor() {
        this.resources = {};
    }

    block(resourceId, callback) {
        if(!(resourceId in this.resources)) {
            this.resources[resourceId] = new Transactor();
        }
        return this.resources[resourceId].block(callback);
    }

}

module.exports = new TransactionManager();