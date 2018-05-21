const moment = require('moment');
moment.locale('fr');
const request = require('request');
var _ = require('lodash');

class Currency {
    constructor(name, mainAcronym, acronyms){
      this.name=name;
      this.mainAcronym=mainAcronym;
      this.otherAcronyms=acronyms;
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
const lisk = new Currency('Lisk', 'LSK', ['']);
const qtum = new Currency('Qtum', 'QTUM', ['']);
const neo = new Currency('Neo', 'NEO', ['']);
const civic = new Currency('Civic', 'CVC', ['']);
const enigma = new Currency('Enigma', 'ENG', ['']);
const stratis = new Currency('Stratis', 'STRAT', ['']);
const adex = new Currency('Adex', 'ADX', ['']);
const omiseGo = new Currency('OmiseGo', 'OMG', ['']);
const pay = new Currency('Pay', 'PAY', ['']);
const cardano = new Currency('Cardano', 'ADA', ['']);
const rise = new Currency('Rise', 'RISE', ['']);
const ark =  new Currency('Ark', 'ARK', ['']);
const patientory =  new Currency('Patientory', 'PTOY', ['']);
const viacoin =  new Currency('Viacoin', 'VIA', ['']);
const komodo =  new Currency('Komodo', 'KMD', ['']);
const icon = new Currency('Icon', 'ICX', ['']);
const venchain = new Currency('Venchain', 'VEN', ['']);
const genesisVision = new Currency('GenesisVision', 'GVT', ['']);
const appCoin = new Currency('Appcoin', 'APPC', ['']);
const substratum = new Currency('Substratum', 'SUB', ['']);
const monetha = new Currency('Monetha', 'MTH', ['']);
const decentNetwork = new Currency('Decent', 'DNT', ['']);
const powerledger = new Currency('Powerledger', 'POWR', ['']);
const binanceCoin = new Currency('BinanceCoin', 'BNB', ['']);
const chainlink = new Currency('Chainlink', 'LINK', ['']);
const waltonChain = new Currency('WaltonChain', 'WTC', ['']);
const iota = new Currency('Iota', 'IOTA', ['']);
const ethos = new Currency('Ethos', 'ETHOS', ['']);
const phore = new Currency('Phore', 'PHR', ['']);
const nano = new Currency('Nano', 'NANO', ['']);
const oysterPearl = new Currency('OysterPearl', 'PRL', ['']);
const kucoinShares = new Currency('KucoinShares', 'KCS', ['']);
const oysterShell = new Currency('OysterShell', 'SHL', ['']);
const zilliqa = new Currency('Zilliqa', 'ZIL', ['']);
const dragonChain = new Currency('DragonChain', 'DRGN', ['']);;

const currencies = [bitcoin, euro, dash, ether, ripple, lumens, litecoin, zcash
,lisk, qtum, neo, civic, enigma, stratis, adex, omiseGo, pay, cardano, rise, ark, 
patientory, komodo, viacoin, icon, venchain, genesisVision, 
appCoin, substratum, monetha, decentNetwork, powerledger,
binanceCoin, chainlink, waltonChain, iota, ethos, phore, nano, 
oysterPearl, kucoinShares, oysterShell, zilliqa, dragonChain ];


exports.getCurrencyByAcronym = (acronym) => {
  return _.find(currencies, (element) => {
      return element.mainAcronym === acronym || element.otherAcronyms.includes(acronym);
  }) || {name : 'not found'};
}

exports.getCurrencyPriceAtDate = (currency, date) => {
    request(`https://min-api.cryptocompare.com/data/pricehistorical?fsym=${currency.mainTrigram}&tsyms=EUR&ts=${date.valueOf()}`, { json: true }, (err, res, body) => {
        if (err) { 
            return console.log(err); 
        }
        console.log(res);

    });
}