// Requires
const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const XmlReader = require('xml-reader');
const Flatted = require('flatted');
const xmlQuery = require('xml-query');
const cors = require('cors')

// Config
const app = express();
app.use(cors());
app.use(bodyParser.json())
const jsonParser = bodyParser.json();

const port = process.env.PORT || 5000;
app.listen(port);

console.log('App is listening on port ' + port);

// Globals
let xmlFile = '';
let parsedXML;
let inventory = -1;
let currentYear = '';
const company = 'DEMO';
const saftDir = '/SAF-T/';

// TODO: remove test POST
app.post('/api/updateYear', jsonParser, (req, res) =>  {

    if(currentYear !== req.body.year) {
        currentYear = req.body.year;
    } else {
        console.log("not updating");
        res.send("no update");
        return;
    }

    let dirContents = fs.readdirSync(path.join(__dirname + '/SAF-T'), 'utf8');
    let matchingSAFT = [];
    let fileToLoad = '';

    // For each file in the SAFT directory look for the company name (exact match)
    for (i in dirContents) {
        let splitStr = dirContents[i].split("_");
        if (splitStr[1] === company) matchingSAFT.push(dirContents[i]);
    }

    // For each result find the corresponding year
    for (i in matchingSAFT) {
        let fieldSplit = matchingSAFT[i].split("_");
        let yearSplit = fieldSplit[2].split("-");

        if(yearSplit[2] === currentYear) {
            fileToLoad = matchingSAFT[i];
        }
    }

    console.log("changing SAFT to: " + fileToLoad);
    xmlFile = fs.readFileSync(path.join(__dirname + saftDir + fileToLoad), 'utf8');
    parsedXML = XmlReader.parseSync(xmlFile);
    res.send("updated");
});

/**
 * Converts a string in YYYY-MM-DD format to a Date object.
 * 
 * @param {string} dateStr a string in YYYY-MM-DD format
 */
function toDate(dateStr) {
    const [year, month, day] = dateStr.split("-")
    return new Date(year, month - 1, day)
}

/**
 * Gets the available SAFT years for the company hardcoded in this file,
 * must be in DD-MM-YYYY format. SAFT follows the following format
 * "SAFT_<company-name>_<init-date>_<final-date>.xml".
 */
app.get('/api/SAFTYears', (req, res) => {

    let dirContents = fs.readdirSync(path.join(__dirname + '/SAF-T'), 'utf8');
    let matchingSAFT = [];
    let years = [];

    // For each file in the SAFT directory look for the company name (exact match)
    for (i in dirContents) {
        let splitStr = dirContents[i].split("_");
        if (splitStr[1] === company) matchingSAFT.push(dirContents[i]);
    }

    // For each result find the corresponding year
    for (i in matchingSAFT) {
        let fieldSplit = matchingSAFT[i].split("_");
        let yearSplit = fieldSplit[2].split("-");
        years.push(yearSplit[2]);
    }

    res.send(years);
});

/**
 * Sums the lines relative to the account ID supplied whithin the year and month
 * supplied. Month = 0 is a special case where the whole year is used instead.
 * Returns an array with [totalDebit, totalCredit].
 * 
 * @param {number} accountIDToSum the account ID to sum
 * @param {number} year the year in YYYY format to use
 * @param {number} month the month in MM format to use (1-12), 0 is a special value that sums the whole year
 * @returns {Array} array of [totalDebit, totalCredit]
 */
function sumLedgerEntries(accountIDToSum, strYear, strMonth) {

    // Get whole document as xml-query object
    const xq = xmlQuery(parsedXML);

    let totalDebit = 0.0;
    let totalCredit = 0.0;
    let year = parseInt(strYear);
    let month = parseInt(strMonth);

    // For each journal entry
    let journalQuery = xq.find('GeneralLedgerEntries').children().find('Journal');
    for (let a = 0; a < journalQuery.size(); a++) {
        let transactionQuery = journalQuery.eq(a).find('Transaction');

        // For each transaction entry
        for (let b = 0; b < transactionQuery.size(); b++) {

            let linesQuery = transactionQuery.eq(b).find('Lines');
            let dateQuery = transactionQuery.eq(b).find('TransactionDate');

            // Check if date matches
            let date = toDate(dateQuery.text());

            if(month == 0) {
                // Only match year since month was 0
                if(date.getFullYear() != year) continue;
            } else {
                // Match both year and month
                if(date.getFullYear() != year || date.getMonth() != (month - 1)) continue;
            }

            // For each line entry of the transaction
            for (let c = 0; c < linesQuery.children().size(); c++) {

                let line = linesQuery.children().eq(c).children();

                // Sum credit amount to running total
                if (line.has('CreditAmount')) {

                    let accountID = line.find('AccountID').children().text();
                    accountID = accountID.substring(0, 4);
                    if (accountID.startsWith(accountIDToSum)) {
                        totalCredit = parseFloat(line.find('CreditAmount').children().text());
                    }

                // Sum debit amount to running total
                } else if (line.has('DebitAmount')) {

                    let accountID = line.find('AccountID').children().text();
                    accountID = accountID.substring(0, 4);
                    if (accountID.startsWith(accountIDToSum)) {
                        totalDebit = parseFloat(line.find('DebitAmount').children().text());
                    }
                }
            }
        }
    }

    return [totalDebit, totalCredit];
}

/**
 * GET request that sums the requested ledger entries by AccountID using a timeframe specified
 * by a year and month pair. All parameters are sent through the URL of the GET, that is,
 * /api/sumLedgerEntries?id=6&year=2018&month=1.
 */
app.get('/api/sumLedgerEntries', (req, res) => {

    // TODO: remove log
    console.log("year/month");
    console.log(req.query.year);
    console.log(req.query.month);

    // Check if parsed SAFT exists
    if (typeof parsedXML == 'undefined' && !parsedXML) {
        res.send([0, 0]);
        return;
    }

    let accountIDToSum = req.query.id;
    if (typeof accountIDToSum == 'undefined' && !accountIDToSum) {
        res.send('Missing parameters for account ID!');
    }

    // TODO: receive month / year here from body of POST
    let result = sumLedgerEntries(accountIDToSum, req.query.year, req.query.month);
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

app.get('/api/inventory', (req, res) => {

    if(inventory == -1)
        inventory = calculateAccountsSum("3", sumInventory)
    
    res.send(inventory.toString())
    
});

// TODO: use sumLedgerEntries
function calculateAccountsSum(accountID, sumFunction){
    
    // Get whole document as xml-query object
     const xq = xmlQuery(parsedXML);

     const ledgerAccounts = xq.find("GeneralLedgerAccounts")
     //const accounts = ledgerAccounts[0].find("Account")

     ledgerAccounts

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
    
    return (closingDebit - openingDebit) - (closingCredit - openingCredit)
}

app.get('/api/inventoryPeriod', (req, res)=>{
    if(inventory == -1)
    inventory = calculateAccountsSum("3", sumInventory)

    let costOfGoodsSold = calculateAccountsSum("6", sumInventory)
    let inventoryTurnover = costOfGoodsSold / inventory
    let inventoryPeriod = 365.0 / inventoryTurnover
    
    res.send(inventoryPeriod.toString())
    
});