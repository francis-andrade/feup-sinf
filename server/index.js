const express = require('express');
const path = require('path');
const fs = require('fs');

const XmlReader = require('xml-reader');
const Flatted = require('flatted');
const xmlQuery = require('xml-query');

const app = express();

let parsedXML;

// Sums the given balance nodes read from a SAF-T file
function sumBalance(query) {

    let sum = 0;
    query.each(node => {
        sum += parseFloat(node['children'][0]['value']);
    });
    
    return sum;
}

// TODO: return the value, only console logging for now
// TODO: fix start point of query to GeneralLedgerAccounts
// Sums the General Ledger Accounts' balances
app.get('/api/sumLedgerBalances', (req, res) => {

    // Get whole document as xml-query object
    const xq = xmlQuery(parsedXML);

    // Calc sum for each relevant balance
    let openingDebitBalanceSum = sumBalance(xq.find('OpeningDebitBalance'));
    let closingDebitBalanceSum = sumBalance(xq.find('ClosingDebitBalance'));
    let openingCreditBalanceSum = sumBalance(xq.find('OpeningCreditBalance'));
    let closingCreditBalanceSum = sumBalance(xq.find('ClosingCreditBalance'));

    console.log("openDebit: " + openingDebitBalanceSum);
    console.log("closeDebit: " + closingDebitBalanceSum);
    console.log("openCredit: " + openingCreditBalanceSum);
    console.log("closeCredit: " + closingCreditBalanceSum);

    // res.send(closingDebitSum + '');
});

// TODO: return the value, only console logging for now
// Gets the debit and credit totals of the sales
app.get('/api/salesTotals', (req, res) => {

    // Get whole document as xml-query object
    const xq = xmlQuery(parsedXML);

    // Get sales totals
    let salesInvoiceQuery = xq.find('SalesInvoices');
    let salesDebitTotal = parseFloat(salesInvoiceQuery.children().find('TotalDebit').children().text());
    let salesCreditTotal = parseFloat(salesInvoiceQuery.children().find('TotalCredit').children().text());

    console.log("salesDebit: " + salesDebitTotal);
    console.log("salesCredit: " + salesCreditTotal);

    // res.send(closingDebitSum + '');
});

// TODO:
app.get('/api/testQuery', (req, res) => {

    let xmlFile = fs.readFileSync(path.join(__dirname + '/SAF-T/SAFT_DEMOSINF_01-01-2016_31-12-2016.xml'), 'utf8');
    parsedXML = XmlReader.parseSync(xmlFile);

    // Get whole document as xml-query object
    const xq = xmlQuery(parsedXML);

    // Get sales totals
    let journalQuery = xq.find('GeneralLedgerEntries').children().find('Journal');

    // For each journal entry
    for(let i = 0; i < journalQuery.size(); i++) {
        let linesQuery = journalQuery.eq(i).find('Transaction').children().find('Lines');

        // For each line entry of the transaction
        for(let i = 0; i < linesQuery.size(); i++) {
            console.log(linesQuery.children().eq(i).children().find('AccountID').text());
        }
    }

    // res.send();
});


//TODO: apply date limits
app.get('/api/backlogValue', function(req, res) {

    const xq = xmlQuery(parsedXML);

    let result = 0;

    //Get SalesInvoices 
    let allInvoices = xq.find('SalesInvoices').first().children().find('Invoice');

    for (let i = 0; i< allInvoices.size(); i++){
        let invoiceType = allInvoices.eq(i).find('InvoiceType').children().text();
        if (invoiceType == 'NC'){ // notas de crédito
            console.log(invoiceType);
            let invoiceTotal = parseFloat(allInvoices.eq(i).find('DocumentTotals').children().find('NetTotal').text());
            result += invoiceTotal;
        }
    }
    console.log(result);
    res.send(result.toString()); 
});

// Parse a SAF-T file read from the file system and store it
app.get('/api/parseXML', (req, res) => {
    
    // TODO: arbitrary SAF-T file
    let xmlFile = fs.readFileSync(path.join(__dirname + '/SAF-T/SAFT_DEMOSINF_01-01-2016_31-12-2016.xml'), 'utf8');
    parsedXML = XmlReader.parseSync(xmlFile);
    res.send('Parsed!');
});

// Print a previously parsed SAF-T file
app.get('/api/printXML', (req, res) => {

    if (typeof parsedXML !== 'undefined' && parsedXML) {
        res.send(Flatted.stringify(parsedXML));
    } else {
        res.send('No SAF-T file parsed!')
    }
});

const port = process.env.PORT || 5000;
app.listen(port);

console.log('App is listening on port ' + port);