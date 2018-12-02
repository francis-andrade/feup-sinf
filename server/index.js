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

app.get('/api/inventory', (req, res) => {
    
    const inventoryAccID = "3"
    
    // Get whole document as xml-query object
     const xq = xmlQuery(parsedXML);

     const ledgerAccounts = xq.find("GeneralLedgerAccounts")
     //const accounts = ledgerAccounts[0].find("Account")

     ledgerAccounts
     console.log(ledgerAccounts)

     const accounts = ledgerAccounts['ast'][0]['children']
     //console.log(accounts)
     //console.log(accounts[1])
     //console.log(accounts[1]['children'][0])

     let totalInventory = 0

     for (var index = 0; index < accounts.length; index++){
        
         const account = accounts[index]
         if(account['name'].valueOf() == "Account"){
            const accountID = account['children'][0]

            if(accountID['children'][0]['value'].substring(0, inventoryAccID.length).valueOf() == inventoryAccID.valueOf()){
                totalInventory += sumInventory(account)
            }
            /*else{
                console.log(accountID['children'][0]['value'].substring(0, inventoryAccID.length))
            }*/
         }
     }
     console.log(totalInventory)
     res.send(totalInventory.toString())
});

function sumInventory(account){
    const openingDebit = account['children'][2]['children'][0]['value']
    const openingCredit = account['children'][3]['children'][0]['value']
    const closingDebit = account['children'][4]['children'][0]['value']
    const closingCredit = account['children'][5]['children'][0]['value']
    
    console.log(closingDebit)
    return (closingDebit - openingDebit) - (closingCredit - openingCredit)
}

const port = process.env.PORT || 5000;
app.listen(port);

console.log('App is listening on port ' + port);