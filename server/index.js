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
// TODO: remove hardcoded SAFT
let xmlFile = fs.readFileSync(path.join(__dirname + '/SAF-T/SAFT_DEMOSINF_01-01-2016_31-12-2016.xml'), 'utf8');
let parsedXML = XmlReader.parseSync(xmlFile);
let inventory = -1;
const company = "DEMO";

// TODO: remove test POST
app.post('/api/testPost', jsonParser, (req, res) =>  {
    console.log("year: " + req.body.year);
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

// TODO: change to POST with body having year and month
app.get('/api/sumLedgerEntries', (req, res) => {

    let xmlFile = fs.readFileSync(path.join(__dirname + '/SAF-T/SAFT_DEMOSINF_01-01-2016_31-12-2016.xml'), 'utf8');
    parsedXML = XmlReader.parseSync(xmlFile);

    let accountIDToSum = req.query.id;
    if (typeof accountIDToSum == 'undefined' && !accountIDToSum) {
        res.send('Missing parameters for account ID!');
    }

    // TODO: receive month / year here from body of POST
    let result = sumLedgerEntries(accountIDToSum, "2016", "0");
    console.log(result[0]);
    console.log(result[1]);

    res.send(result);
});


//TODO: apply date limits


app.post('/api/SalesValue', function(req, res){

    const xq = xmlQuery(parsedXML);

    let result = 0;

    let allInvoices = xq.find('SalesInvoices').first().children().find('Invoice');

    for (let i = 0; i< allInvoices.size(); i++){
        let invoiceType = allInvoices.eq(i).find('InvoiceType').children().text();
        if (invoiceType != 'NC'){ // notas de crédito
            let invoiceTotal = Number(allInvoices.eq(i).find('DocumentTotals').children().find('NetTotal').text());
            result += invoiceTotal;
        }
    }

    console.log(result);
    res.send(result.toString()); 

});

//Gets Backlog Value
app.post('/api/backlogValue', function(req, res) {

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
app.post('/api/SalesByCity', function(req, res) {
    const xq = xmlQuery(parsedXML);

    let allInvoices = xq.find('SalesInvoices').first().children().find('Invoice');

    var result = []; // [City, Quantity]

    for (let i = 0; i < allInvoices.size(); i++){
        let city = allInvoices.eq(i).find('ShipTo').children().find('City').text();
        let amount = Number(allInvoices.eq(i).find('DocumentTotals').children().find('NetTotal').text());

        let j = result.findIndex(function(e) {
            return e[0] == city;
        });

        if (j != -1){
            result[j][1] += amount;
        }
        else{
            result.push([city, amount]);
        }
    }
    
    result.sort(function (a, b) {
        return b[1]-a[1];
    })

    var aux = result.slice(0, 5);

    console.log(aux);

    res.send(aux);
});

app.post('/api/TopProductsSold', function(req, res) {
    const xq = xmlQuery(parsedXML);

    let allInvoices = xq.find('SalesInvoices').first().children().find('Invoice');

    var result = [[], [], []]; // [Code, Description, Amount]

    var result = [];

    for (let i = 0; i < allInvoices.size(); i++){
        let allLines = allInvoices.eq(i).find('Line');
        
        for (let j = 0; j < allLines.size(); j++){
            let code = allLines.eq(j).find('ProductCode').text();
            let description = allLines.eq(j).find('ProductDescription').text();
            let amount = Number(allLines.eq(j).find('CreditAmount').text());

            let k = result.findIndex(function(e) {
                return e[0] == code;
            });

            if (k != -1){
                result[k][2] += amount;
            }
            else{
                result.push([code, description, amount]);
            }
        }
    }

    result.sort(function (a, b){
        return b[2]-a[2];
    })

    aux = result.slice(0, 5);

    console.log(aux);

    res.send(aux);
});

app.post('/api/SalesPerMonth', function(req, res) {
    const xq = xmlQuery(parsedXML);

    let allInvoices = xq.find('SalesInvoices').first().children().find('Invoice');

    let result = []; //[Year-Month, Amount]

    var d = new Date();
    var month = d.getMonth() + 1;
    var year = d.getFullYear() - 1;
    

    for (let i = 0; i < 12; i++){
        var currentDate;
        var aux = month;

        if (month > 12){
            if (month == 13){
              year += 1;
            }
            aux = month - 12;
        }
        var currentDate;
        if (aux < 10){
            currentDate = year + "-" + '0' + aux;
        }
        else{
            currentDate = year + "-" + aux;
        }
        month += 1;

        result.push([currentDate, 0]);
    }


    for (let i = 0; i < allInvoices.size(); i++){
        let day = allInvoices.eq(i).find('InvoiceDate').text();
        let amount = Number(allInvoices.eq(i).find('DocumentTotals').children().find('NetTotal').text());
        let pat = /(\d+-\d+)-\d+/;
        let matcher = pat.exec(day);


        let j = result.findIndex(function(e) {
            return e[0] == matcher[1];
        });

        if (j != -1){
            result[j][1] += amount;
        }
    }

    console.log(result);

    res.send(result);
});

// Parse a SAF-T file read from the file system and store it
app.get('/api/parseXML', (req, res) => {
    
    // TODO: arbitrary SAF-T file
    let xmlFile = fs.readFileSync(path.join(__dirname + '/SAF-T/SAFT_DEMOSINF_01-01-2016_31-12-2016.xml'), 'utf8');
    parsedXML = XmlReader.parseSync(xmlFile);
    res.send('Parsed!');
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