const express = require('express');
const path = require('path');
const fs = require('fs');

const XmlReader = require('xml-reader');
const Flatted = require('flatted');
const xmlQuery = require('xml-query');

const app = express();
var cors = require('cors')
app.use(cors())


let xmlFile = fs.readFileSync(path.join(__dirname + '/SAF-T/SAFT_DEMOSINF_01-01-2016_31-12-2016.xml'), 'utf8');
parsedXML = XmlReader.parseSync(xmlFile);

let inventory = -1;



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

// Sums the lines relative to the account ID supplied and returns
// an array with [totalDebit, totalCredit]
function sumLedgerEntries(accountIDToSum) {

    // Get whole document as xml-query object
    const xq = xmlQuery(parsedXML);

    let totalDebit = 0.0;
    let totalCredit = 0.0;

    // For each journal entry
    let journalQuery = xq.find('GeneralLedgerEntries').children().find('Journal');
    for(let i = 0; i < journalQuery.size(); i++) {
        let linesQuery = journalQuery.eq(i).find('Transaction').children().find('Lines');

        // For each line entry of the transaction
        for(let i = 0; i < linesQuery.size(); i++) {

            let line = linesQuery.children().eq(i).children();

            // Sum credit amount to running total
            if(line.has('CreditAmount')) {
                
                let accountID = line.find('AccountID').children().text();
                accountID = accountID.substring(0, 4);
                if(accountID.startsWith(accountIDToSum)) {
                    totalCredit = parseFloat(line.find('CreditAmount').children().text());
                }

            // Sum debit amount to running total
            } else if(line.has('DebitAmount')) {

                let accountID = line.find('AccountID').children().text();
                accountID = accountID.substring(0, 4);
                if(accountID.startsWith(accountIDToSum)) {
                    totalDebit = parseFloat(line.find('DebitAmount').children().text());
                }
            }
        }
    }

    return [totalDebit, totalCredit];
}

// TODO:
app.get('/api/sumLedgerEntries', (req, res) => {

    let xmlFile = fs.readFileSync(path.join(__dirname + '/SAF-T/SAFT_DEMOSINF_01-01-2016_31-12-2016.xml'), 'utf8');
    parsedXML = XmlReader.parseSync(xmlFile);

    let accountIDToSum = req.query.id;
    if (typeof accountIDToSum == 'undefined' && !accountIDToSum) {
        res.send('Missing parameters for account ID!');
    }

    let result = sumLedgerEntries(accountIDToSum);
    console.log(result[0]);
    console.log(result[1]);

    res.send(result);
});


//TODO: apply date limits
//Gets Backlog Value
app.get('/api/backlogValue', function(req, res) {

    const xq = xmlQuery(parsedXML);

    let result = 0;

    let allInvoices = xq.find('SalesInvoices').first().children().find('Invoice');

    for (let i = 0; i< allInvoices.size(); i++){
        let invoiceType = allInvoices.eq(i).find('InvoiceType').children().text();
        if (invoiceType == 'NC'){ // notas de crédito
            let invoiceTotal = Number(allInvoices.eq(i).find('DocumentTotals').children().find('NetTotal').text());
            result += invoiceTotal;
        }
    }

    //result = Math.round(result*100)/100;
    console.log(result);
    res.send(result.toString()); 
});

// Return Array of arrays with 
app.get('/api/SalesByCity', function(req, res) {
    const xq = xmlQuery(parsedXML);

    let allInvoices = xq.find('SalesInvoices').first().children().find('Invoice');

    var result = [[], []]; // [City, Quantity]

    for (let i = 0; i < allInvoices.size(); i++){
        let city = allInvoices.eq(i).find('ShipTo').children().find('City').text();

        let j = result[0].findIndex(function(e) {
            return e == city;
        });

        if (j != -1){
            result[1][j] += 1;
        }
        else{
            result[0].push(city);
            result[1].push(1);
        }
    }
    
    console.log(result);

    res.send(result);
});

app.get('/api/TopProductsSold', function(req, res) {
    const xq = xmlQuery(parsedXML);

    let allInvoices = xq.find('SalesInvoices').first().children().find('Invoice');

    var result = [[], [], []]; // [Code, Description, Amount]

    for (let i = 0; i < allInvoices.size(); i++){
        let allLines = allInvoices.eq(i).find('Line');
        
        for (let j = 0; j < allLines.size(); j++){
            let code = allLines.eq(j).find('ProductCode').text();
            let description = allLines.eq(j).find('ProductDescription').text();
            let amount = Number(allLines.eq(j).find('CreditAmount').text());

            let k = result[0].findIndex(function(e) {
                return e == code;
            });

            if (k != -1){
                result[2][k] += Math.round(amount * 100) / 100;
            }
            else{
                result[0].push(code);
                result[1].push(description);
                let amountRound = Math.round(amount * 100) / 100;
                result[2].push(amountRound);
            }
        }
    }

    res.send([result[1], result[2]]);
});

app.get('/api/SalesPerMonthLastYear', function(req, res) {
    const xq = xmlQuery(parsedXML);

    let allInvoices = xq.find('SalesInvoices').first().children().find('Invoice');

    let result = [[], []]; //[Year-Month, Amount]

    var d = new Date();
    var month = d.getMonth() + 1;
    var year = d.getFullYear();
    

    for (let i = 0; i < 12; i++){
        var currentMonth = month + i;
        var currentYear = year;
        if (currentMonth >= month){
            currentYear -= 1;
        }
        if (currentMonth < 10){
            currentMonth = '0' + currentMonth;
        }
        
        var currentDate = currentYear + "-" + currentMonth;

        result[0].push(currentDate);
        result[1].push(0);
    }


    for (let i = 0; i < allInvoices.size(); i++){
        let day = allInvoices.eq(i).find('InvoiceDate').text();
        let amount = Number(allInvoices.eq(i).find('DocumentTotals').children().find('NetTotal').text());
        let pat = /(\d+-\d+)-\d+/;
        let matcher = pat.exec(day);


        let j = result[0].findIndex(function(e) {
            return e == matcher[1];
        });

        if (j != -1){
            result[1][j] += amount;
        }
    }

    res.send(result);
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

    if(inventory == -1)
        inventory = calculateAccountsSum("3", sumInventory)
    
    res.send(inventory.toString())
    
});

function calculateAccountsSum(accountID, sumFunction){
    
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

     let totalSum = 0

     for (var index = 0; index < accounts.length; index++){
        
         const account = accounts[index]
         if(account['name'].valueOf() == "Account"){
            const accountIDElem = account['children'][0]

            const accountValue = accountIDElem['children'][0]['value']
            if(accountValue.substring(0, accountID.length).valueOf() == accountID.valueOf() && accountValue.length == 4){
                totalSum += sumFunction(account)
            }
            /*else{
                console.log(accountID['children'][0]['value'].substring(0, inventoryAccID.length))
            }*/
         }
     }
     return totalSum
}

function sumInventory(account){
    const openingDebit = account['children'][2]['children'][0]['value']
    const openingCredit = account['children'][3]['children'][0]['value']
    const closingDebit = account['children'][4]['children'][0]['value']
    const closingCredit = account['children'][5]['children'][0]['value']
    
    console.log(closingDebit)
    return (closingDebit - openingDebit) - (closingCredit - openingCredit)
}



app.get('/api/inventoryPeriod', (req, res)=>{
    if(inventory == -1)
    inventory = calculateAccountsSum("3", sumInventory)

    let costOfGoodsSold = calculateAccountsSum("6", sumInventory)
    console.log(costOfGoodsSold)
    let inventoryTurnover = costOfGoodsSold / inventory
    let inventoryPeriod = 365.0 / inventoryTurnover
    
    res.send(inventoryPeriod.toString())
    
});

const port = process.env.PORT || 5000;
app.listen(port);

console.log('App is listening on port ' + port);