const currencies = require('./currencies');
const moment = require('moment');
moment.locale('fr');
const _ = require('lodash');

class Operation {
    constructor(dataObject){
        this.opType = dataObject.type ;
        let regExp = /^([A-Z]{4})([A-Z]+)$/;
        let [,outCurrencyAcronyme, inCurrencyAcronyme] = regExp.exec(dataObject.pair);
        this.inCurrency = currencies.getCurrencyByTrigram(inCurrencyAcronyme);
        this.outCurrency = currencies.getCurrencyByTrigram(outCurrencyAcronyme);
        this.date = moment(dataObject.time);
        this.outCurrencyPrice = Number(dataObject.price);
        this.inCurrencyAmount = Number(dataObject.cost);
        this.outCurrencyAmount = Number(dataObject.vol);
        this.fee = Number(dataObject.fee);
        this.pair = dataObject.pair;
    }

    merge (operation2) {
        this.inCurrencyAmount += operation2.inCurrencyAmount;
        this.outCurrencyAmount += operation2.outCurrencyAmount;
        this.fee += operation2.fee;
    }

    toString() {
        return `Date ${this.date.format('L')} : ${this.opType === 'buy' ? 'Achat ' : 'Vente'} de ${this.outCurrencyAmount} ${this.outCurrency.name} ${this.opType === 'buy' ? 'avec':'pour'} ${this.inCurrencyAmount} ${this.inCurrency.name} au cours de ${this.outCurrencyPrice} ${this.inCurrency.name}/${this.outCurrency.name}`;
    }

    isSameOperation(operation2){
      let sameDateTreeshold = 5;
      let minuteDifference = this.date.diff(operation2.date, 'minutes');
      return minuteDifference < sameDateTreeshold && minuteDifference > -1 * sameDateTreeshold && this.pair === operation2.pair;
    }
}
exports.Operation = Operation;

exports.mergeOperations = function(operations) {
    let mergedOperations = [];
    operations.forEach(element => {
        let dernierElementMerge = _.last(mergedOperations);
        let newOperation = new Operation(element);
        if( !_.isEmpty(mergedOperations) && dernierElementMerge.isSameOperation(newOperation)) {
            dernierElementMerge.merge(newOperation);
        } else {
            mergedOperations.push(newOperation);
        }
    });
    return mergedOperations;
};
