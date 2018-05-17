const csvConverter = require('csv-parse');
const fs = require('fs');
const moment = require('moment');
moment.locale('fr');
const request = require('request');
const _ = require('lodash');
const Operation = require('./operation');
const currencies = require('./currencies');

fs.readFile('kraken-2017.csv', function (err,data) {
    if (err) {
      return console.log(err);
    }
    csvConverter(data, {columns: true}, (err, output)=>{
        let mergedOperations = Operation.mergeOperations(output);
        mergedOperations.forEach((element) => {
            currencies.getCurrencyPriceAtDate(element.inCurrency, element.date);
        });
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
  
  

 

  

 

