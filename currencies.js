const moment = require('moment');
moment.locale('fr');
const request = require('request');
var _ = require('lodash');

class Currency {
    constructor(name, mainTrig, trigrams){
      this.name=name;
      this.mainTrigram=mainTrig;
      this.otherTrigrams=trigrams;
    }
}

const bitcoin = new Currency('Bitcoin', 'BTC', ['XXBT', 'XBT']);
const euro = new Currency('Euro', 'EUR', ['ZEUR']);
const dash = new Currency('Dash', 'DASH', []);
const ether = new Currency('Ether', 'ETH', ['XETH']);
const ripple = new Currency('Ripple', 'XRP', ['XXRP']);
const lumens = new Currency('Lumens', 'XLM', ['XXLM']);
const litecoin = new Currency('Litecoin', 'LTC', ['XLTC']);
const zcash  = new Currency('ZCash', 'ZEC', ['XZEC']);

const currencies = [bitcoin, euro, dash, ether, ripple, lumens, litecoin, zcash];


exports.getCurrencyByTrigram = (trigram) => {
  return _.find(currencies, (element) => {
      return element.mainTrigram === trigram || element.otherTrigrams.includes(trigram);
  });
}

exports.getCurrencyPriceAtDate = (currency, date) => {
    request(`https://min-api.cryptocompare.com/data/pricehistorical?fsym=${currency.mainTrigram}&tsyms=EUR&ts=${date.valueOf()}`, { json: true }, (err, res, body) => {
        if (err) { 
            return console.log(err); 
        }
        console.log(res);

    });
}