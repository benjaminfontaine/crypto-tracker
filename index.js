const csvConverter = require("csv-parse/lib/sync");
const fs = require("fs");
const moment = require("moment");
moment.locale("fr");
const request = require("request");
const _ = require("lodash");
const Operation = require("./operation");
const currencies = require("./currencies");
const inputFolder = "./input_files";
const path = require("path");
const nomCsv = 'operations.csv';

generateHistory();

function generateHistory(){
  fs.readdir(inputFolder, (err, files) => {
    let allOperations = loadAllOperations(files);
    exporterFichierCsv(allOperations);
    exporterFichierLisible(allOperations);
  });
}


function loadAllOperations(files) {
    let allOperations = [];
    files.forEach(file => {
      if (file !== ".DS_Store") {
        let operations = loadOperationsInFile(inputFolder + "/" + file);
        allOperations.push(...operations);
      }
    });
    return allOperations;
}

function loadOperationsInFile(file) {
  const data = fs.readFileSync(file);
  const exchangeName = path.basename(file).slice(0, -4);
  const csvObjectLines = csvConverter(data, { columns: true });
  let operations = Operation.convertToOperations(csvObjectLines, exchangeName);
  
  // console.log(exchangeName, operations);  
  return operations;
}

function exporterFichierLisible(allOperations) {
  let contenuExport = exportLisible(allOperations);
  exporterFichier("./res/operations", contenuExport);
}

function exporterFichier(nomFichier, contenu) {
  fs.writeFile(nomFichier, contenu, function(err) {
    if (err) {
      return console.log(err);
    }
    console.log("The file was saved!");
  });
}

function exporterFichierCsv(allOperations) {
  let contenuExport = exportCsv(allOperations);
  exporterFichier("./res/"+nomCsv, contenuExport);
}

function exportLisible(operations) {
  return _(operations)
    .sortBy("date")
    .reduce(function(memo, element) {
      return (
        memo +
        String(element) +
        `
`
      );
    }, "");
}

function exportCsv(operations) {
  let enteteExport=`DATE${Operation.csvSeparator}TYPE_OPERATION${Operation.csvSeparator}QUANTITE_TOKEN_ENTRANT${Operation.csvSeparator}NOM_TOKEN_ENTRANT${Operation.csvSeparator}QUANTITE_TOKEN_SORTANT${Operation.csvSeparator}NOM_TOKEN_SORTANT${Operation.csvSeparator}PRIX_TOKEN_SORTANT${Operation.csvSeparator}EXCHANGE${Operation.csvSeparator}FRAIS
`;
  return _(operations)
    .sortBy("date")
    .reduce(function(memo, element) {
      return (
        memo +
        element.toCsv() +
        `
`
      );
    }, enteteExport);
}
