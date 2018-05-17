let csvConverter = require('csv-parse');
let fs = require('fs');
let moment = require('moment');
moment.locale('fr');

var _ = require('lodash');
let csv = fs.readFile('kraken-2017.csv', function (err,data) {
    if (err) {
      return console.log(err);
    }
    csvConverter(data, {columns: true}, (err, output)=>{
        let mergedOperations = mergeOperations(output);
        console.log(mergedOperations);
        let contenuExport= _(mergedOperations).reduce(function(memo, element){
            return memo + String(element) + `
`;
        }, '');
        fs.writeFile("./res/operations", contenuExport, function(err) {
            if(err) {
                return console.log(err);
            }
        
            console.log("The file was saved!");
        }); 
    });
  });
  
  class Operation {
      constructor(dataObject){
          this.opType = dataObject.type ;
          let regExp = /^([A-Z]{4})([A-Z]+)$/;
          let [,outCurrencyAcronyme, inCurrencyAcronyme] = regExp.exec(dataObject.pair);
          console.log(dataObject.pair + ' out: ' + outCurrencyAcronyme + ' in: '+ inCurrencyAcronyme);
          this.inCurrency = matchCurrencyAcronyme(inCurrencyAcronyme);
          this.outCurrency = matchCurrencyAcronyme(outCurrencyAcronyme);
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
          return `Date ${this.date.format('L')} : ${this.opType === 'buy' ? 'Achat ' : 'Vente'} de ${this.outCurrencyAmount} ${this.outCurrency} ${this.opType === 'buy' ? 'avec':'pour'} ${this.inCurrencyAmount} ${this.inCurrency} au cours de ${this.outCurrencyPrice} ${this.inCurrency}/${this.outCurrency}`;
      }
  }

  function matchCurrencyAcronyme(acronyme){
    switch(acronyme) {
        case 'XXBT' :
        case 'XBT' :
            return 'Bitcoin';
        case 'ZEUR':
        case 'EUR':
            return 'euro';
        case 'DASH':
            return 'dash';
        case 'XETH':
            return 'Ether';
        case 'XXRP':
            return 'Ripple';
        case 'XXLM':
            return 'Lumens';
        case 'XLTC':
            return 'Litecoin';
        case 'XZEC':
            return 'ZCash';
        default :
            console.log(acronyme + 'inconnu !');
            return 'no match';
    }
  }

  function mergeOperations(operations) {
    let mergedOperations = [];
    operations.forEach(element => {
        let dernierElementMerge = _.last(mergedOperations);
        let newOperation = new Operation(element);
        if( !_.isEmpty(mergedOperations) && isSameOperation(dernierElementMerge, newOperation)) {
            dernierElementMerge.merge(newOperation);
        } else {
            mergedOperations.push(newOperation);
        }
    });
    return mergedOperations;
  }

  function isSameOperation(operation1, operation2){
      return operation1.date.diff(operation2.date, 'minutes') <2 && operation1.pair === operation2.pair;
  }

 

