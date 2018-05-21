const currencies = require('./currencies');
const moment = require('moment');
moment.locale('fr');
const _ = require('lodash');
const csvSeparator=',';

class Operation{
    constructor(dataObject){
        let sellOperation = dataObject.opType === 'sell';
        let currency1 = currencies.getCurrencyByAcronym(dataObject.currency1Acronyme);
        let currency2 = currencies.getCurrencyByAcronym(dataObject.currency2Acronyme);
        if(sellOperation) {
            this.inCurrency= currency1;
            this.outCurrency= currency2;
            this.inCurrencyAmount= dataObject.currency1Amount;
            this.outCurrencyAmount= dataObject.currency2Amount;            
        } else {
            this.inCurrency= currency2;
            this.outCurrency= currency1;
            this.inCurrencyAmount= dataObject.currency2Amount;
            this.outCurrencyAmount= dataObject.currency1Amount; 
        }
        this.opType = dataObject.opType,
        this.date = dataObject.date;
        this.outCurrencyPrice = dataObject.outCurrencyPrice;
        this.fee = dataObject.fee;
        this.exchange =  dataObject.exchange;
    }

    merge (operation2) {
        this.inCurrencyAmount += operation2.inCurrencyAmount;
        this.outCurrencyAmount += operation2.outCurrencyAmount;
        this.fee += operation2.fee;
    }

    toString() {
        return `Date ${this.date.format('L')} : ${this.opType === 'buy' ? 'Achat ' : 'Vente'} de ${this.outCurrencyAmount} ${this.outCurrency.name} ${this.opType === 'buy' ? 'avec':'pour'} ${this.inCurrencyAmount} ${this.inCurrency.name} au cours de ${this.outCurrencyPrice} ${this.inCurrency.name}/${this.outCurrency.name} sur ${this.exchange}`;
    }

    toCsv() {
        return `${this.date.format('L')}${csvSeparator}${this.opType === 'buy' ? 'ACHAT' : 'VENTE'}${csvSeparator}${this.inCurrencyAmount}${csvSeparator}${this.inCurrency.name}${csvSeparator}${this.outCurrencyAmount}${csvSeparator}${this.outCurrency.name}${csvSeparator}${this.outCurrencyPrice}${csvSeparator}${this.exchange}${csvSeparator}${this.fee}`;
    }

    isSameOperation(operation2){
      let sameDateTreeshold = 60;
      let minuteDifference = this.date.diff(operation2.date, 'minutes');
      let samePair = this.inCurrency === operation2.inCurrency && this.outCurrency === operation2.outCurrency;
      let samePrice = this.outCurrencyPrice ===  operation2.outCurrencyPrice;
      let sameOperation = this.opType === operation2.opType;
      let inAboutTheSameTime = Math.abs(minuteDifference) < sameDateTreeshold;
      return  inAboutTheSameTime && samePair && samePrice && sameOperation;
    }


}

class KrakenOperation extends Operation {
    constructor(dataObject){
        let regExp = /^([A-Z]{4})([A-Z]+)$/;
        let [,currency1Acronyme, currency2Acronyme] = regExp.exec(dataObject.pair);
        
        super({
            opType: dataObject.type,
            currency1Acronyme: currency1Acronyme,
            currency2Acronyme: currency2Acronyme,
            currency1Amount: Number(dataObject.vol),
            currency2Amount: Number(dataObject.cost),
            date: moment(dataObject.time),
            outCurrencyPrice: Number(dataObject.price),
            fee: Number(dataObject.fee),
            exchange: 'Kraken'
        });
    }
}


class BittrexOperation extends Operation {
    constructor(dataObject){
        let regExp = /^([A-Z]+)-([A-Z]+)$/;
        let [,currency2Acronyme, currency1Acronyme] = regExp.exec(dataObject.Exchange);

        super({
            opType: dataObject.Type === 'LIMIT_SELL' ? 'sell': 'buy',
            currency1Acronyme: currency1Acronyme,
            currency2Acronyme: currency2Acronyme,
            currency1Amount: Number(dataObject.Quantity),
            currency2Amount: Number(dataObject.Price),
            date: moment(dataObject.Closed, 'MM/DD/YYYY HH:mm:ss ZZ'),
            outCurrencyPrice: Number(dataObject.Limit),
            fee: Number(dataObject.CommissionPaid),
            exchange: 'Bittrex'
        });
    }
}

class BinanceOperation extends Operation {
    constructor(dataObject){
        // console.log(dataObject);
        let regExp = /^([A-Z]+)(BTC)$/;
        let [,currency1Acronyme, currency2Acronyme] = regExp.exec(dataObject.Market);
        let isSellOperation = dataObject.Type === 'SELL';
        super({
            opType: isSellOperation ? 'sell':'buy',
            currency1Acronyme: currency1Acronyme,
            currency2Acronyme: currency2Acronyme,
            currency1Amount: Number(dataObject.Amount),
            currency2Amount: Number(dataObject.Total),
            date: moment(dataObject['Date(UTC)']),
            outCurrencyPrice: Number(dataObject.Price),
            fee: Number(dataObject.Fee),
            exchange: 'Binance'
        });
    }
}
class BitfinexOperation extends Operation {
    constructor(dataObject){
        // console.log(dataObject);
        let regExp = /^([A-Z]+)([A-Z]{3})$/;
        let [,currency1Acronyme, currency2Acronyme] = regExp.exec(dataObject.Market);
        let isSellOperation = dataObject.Type === 'SELL';
        super({
            opType: isSellOperation ? 'sell':'buy',
            currency1Acronyme: currency1Acronyme,
            currency2Acronyme: currency2Acronyme,
            currency1Amount: Number(dataObject.Amount),
            currency2Amount: Number(dataObject.Total),
            date: moment(dataObject['Date(UTC)']),
            outCurrencyPrice: Number(dataObject.Price),
            fee: Number(dataObject.Fee),
            exchange: 'Bifinex'
        });
    }
}

class CoinbaseOperation extends Operation {
    constructor(dataObject){
        // console.log(dataObject);
        let regExp = /^([A-Z]+)([A-Z]{3})$/;
        let [,currency1Acronyme, currency2Acronyme] = regExp.exec(dataObject.Market);
        let isSellOperation = dataObject.Type === 'SELL';
        super({
            opType: isSellOperation ? 'sell':'buy',
            currency1Acronyme: currency1Acronyme,
            currency2Acronyme: currency2Acronyme,
            currency1Amount: Number(dataObject.Amount),
            currency2Amount: Number(dataObject.Total),
            date: moment(dataObject['Date(UTC)']),
            outCurrencyPrice: Number(dataObject.Price),
            fee: Number(dataObject.Fee),
            exchange: 'Coinbase'
        });
    }
}

class CoinexchangeOperation extends Operation {
    constructor(dataObject){
        // console.log(dataObject);
        let regExp = /^([A-Z]+)-([A-Z]+)$/;
        let [,currency1Acronyme, currency2Acronyme] = regExp.exec(dataObject.Market);
        let isSellOperation = dataObject.Type === 'SELL';
        super({
            opType: isSellOperation ? 'sell':'buy',
            currency1Acronyme: currency1Acronyme,
            currency2Acronyme: currency2Acronyme,
            currency1Amount: Number(dataObject.Amount),
            currency2Amount: Number(dataObject.Total),
            date: moment(dataObject['Date(UTC)']),
            outCurrencyPrice: Number(dataObject.Price),
            fee: Number(dataObject.Fee),
            exchange: 'CoinExchange'
        });
    }
}

class AllcoinOperation extends Operation {
    constructor(dataObject){
        // console.log(dataObject);
        let regExp = /^([A-Z]+)(BTC)$/;
        let [,currency1Acronyme, currency2Acronyme] = regExp.exec(dataObject.Market);
        let isSellOperation = dataObject.Type === 'SELL';
        super({
            opType: isSellOperation ? 'sell':'buy',
            currency1Acronyme: currency1Acronyme,
            currency2Acronyme: currency2Acronyme,
            currency1Amount: Number(dataObject.Amount),
            currency2Amount: Number(dataObject.Total),
            date: moment(dataObject['Date(UTC)']),
            outCurrencyPrice: Number(dataObject.Price),
            fee: Number(dataObject.Fee),
            exchange: 'Allcoin'
        });
    }
}

class CryptopiaOperation extends Operation {
    constructor(dataObject){
        // console.log(dataObject);
        let regExp = /^([A-Z]+)\/([A-Z]+)$/;
        let [,currency1Acronyme, currency2Acronyme] = regExp.exec(dataObject.Market);
        let isSellOperation = dataObject.Type === 'Sell';
        super({
            opType: isSellOperation ? 'sell':'buy',
            currency1Acronyme: currency1Acronyme,
            currency2Acronyme: currency2Acronyme,
            currency1Amount: Number(dataObject.Amount),
            currency2Amount: Number(dataObject.Total),
            date: moment(dataObject['Timestamp'],'DD/MM/YYYY HH:mm:ss ZZ'),
            outCurrencyPrice: Number(dataObject.Rate),
            fee: Number(dataObject.Fee),
            exchange: 'Cryptopia'
        });
    }
}

class KucoinOperation extends Operation {
    constructor(dataObject){
        console.log(dataObject);
        let regExp = /^([A-Z]+)\/([A-Z]+)$/;
        let [,currency1Acronyme, currency2Acronyme] = regExp.exec(dataObject.Coins);
        let isSellOperation = dataObject['Sell/Buy'] === 'SELL';
        super({
            opType: isSellOperation ? 'sell':'buy',
            currency1Acronyme: currency1Acronyme,
            currency2Acronyme: currency2Acronyme,
            currency1Amount: Number(dataObject.Amount),
            currency2Amount: Number(dataObject.Volume),
            date: moment(dataObject.Time),
            outCurrencyPrice: Number(dataObject['Filled Price']),
            fee: Number(dataObject.Fee),
            exchange: 'Kucoin'
        });
    }
}

class ManoOperation extends Operation {
    constructor(dataObject){
        // console.log(dataObject);
        let regExp = /^([A-Z]+)-([A-Z]+)$/;
        let [,currency1Acronyme, currency2Acronyme] = regExp.exec(dataObject.Market);
        let isSellOperation = dataObject.Type === 'SELL';
        super({
            opType: isSellOperation ? 'sell':'buy',
            currency1Acronyme: currency1Acronyme,
            currency2Acronyme: currency2Acronyme,
            currency1Amount: Number(dataObject.Amount),
            currency2Amount: Number(dataObject.Total),
            date: moment(dataObject['Date(UTC)']),
            outCurrencyPrice: Number(dataObject.Price),
            fee: Number(dataObject.Fee),
            exchange: dataObject.Exchange
        });
    }
}

 function mergeOperations (operations) {
    let mergedOperations = [];
    operations.forEach(operation => {
        let dernierElementMerge = _.last(mergedOperations);
        if( !_.isEmpty(mergedOperations) && dernierElementMerge.isSameOperation(operation)) {
            dernierElementMerge.merge(operation);
        } else {
            mergedOperations.push(operation);
        }
    });
    // mergedOperations.forEach((element) => {
    //     currencies.getCurrencyPriceAtDate(element.inCurrency, element.date);
    // });
    return mergedOperations;
};

const converters = [
    {exchange:'kraken', constructor : KrakenOperation}, 
    {exchange:'bittrex', constructor : BittrexOperation},
    {exchange:'binance', constructor : BinanceOperation},
    {exchange:'allcoin', constructor : AllcoinOperation},
    {exchange:'bitfinex', constructor : BitfinexOperation},
    {exchange:'coinbase', constructor : CoinbaseOperation},
    {exchange:'coinexchange', constructor : CoinexchangeOperation},
    {exchange:'cryptopia', constructor : CryptopiaOperation},
    {exchange:'kucoin', constructor : KucoinOperation},
    {exchange:'mano', constructor : ManoOperation},
];

exports.convertToOperations = function(csvOutput, exchange) {
    let operations = [];
    let converter = _.find(converters, ['exchange', exchange]).constructor;
    csvOutput.forEach((output) => {
        operations.push(new converter(output));
    });
    return mergeOperations(operations);
};

exports.csvSeparator = csvSeparator;
