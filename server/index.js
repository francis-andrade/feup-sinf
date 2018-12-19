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
let parsedXML = ['null', 'null'];
let inventory = 0;
let currentYear = '';
let isCurrentAvailable = false;
let isPreviousAvailable = false;
const company = 'DEMO';
const saftDir = '/SAF-T/';
const currSAFT = 0;
const previousSAFT = 1;

/**
 * Updates the parsed SAFT to the newly selected year, doesn't update
 * if the year is the same as the previous one. Also stores the previous
 * year if it exists.
 */
app.post('/api/updateYear', jsonParser, (req, res) =>  {

    // Check if same year requested
    if(currentYear !== req.body.year) {
        currentYear = req.body.year;
    } else {
        console.log("Log: no SAFT update needed");
        res.send('');
        return;
    }

    let dirContents = fs.readdirSync(path.join(__dirname + '/SAF-T'), 'utf8');
    let matchingSAFT = [];
    let filesToLoad = [];
    let prevYear = (parseInt(currentYear) - 1).toString();

    // For each file in the SAFT directory look for the company name (exact match)
    for (i in dirContents) {
        let splitStr = dirContents[i].split("_");
        if (splitStr[1] === company) matchingSAFT.push(dirContents[i]);
    }

    // For each result find the corresponding year
    filesToLoad.push(findSAFT(matchingSAFT, currentYear));
    filesToLoad.push(findSAFT(matchingSAFT, prevYear));

    // Load requested year
    loadSAFT(filesToLoad[0], currSAFT);
    isCurrentAvailable = true;

    // Load previous if found
    if(filesToLoad[1] !== 'null') {
        loadSAFT(filesToLoad[1], previousSAFT);
        isPreviousAvailable = true;
    } else isPreviousAvailable = false;

    console.log("Log: current SAFT - " + filesToLoad[0] + " and " + filesToLoad[1]);
    console.log("Log: is previous SAFT available? " + isPreviousAvailable);
    res.send('');
});

/**
 * Loads a SAFT file to the parsedXML array at the specified index.
 * 
 * @param {string} filename the filename of the SAFT to load
 * @param {number} index the index to load SAFT file to
 */
function loadSAFT(filename, index) {

    xmlFile = fs.readFileSync(path.join(__dirname + saftDir + filename), 'utf8');
    parsedXML[index] = XmlReader.parseSync(xmlFile);
}

/**
 * Returns a filename of the SAFT corresponding to the requested year. Returns 'null'
 * if year not found in the filenames.
 * 
 * @param {Array} list array containing SAFT filenames 
 * @param {string} year the year to look for in the SAFT filenames
 * @returns the filename of the corresponding SAFT year, 'null' if not found
 */
function findSAFT(list, year) {

    for (i in list) {
        let fieldSplit = list[i].split("_");
        let yearSplit = fieldSplit[2].split("-");

        if(yearSplit[2] === year) {
            return list[i];
        }
    }

    return 'null';
}

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
    let xq;

    if(strYear == currentYear) {
        xq = xmlQuery(parsedXML[currSAFT]);
    } else {
        if(!isPreviousAvailable) return [0, 0];
        xq = xmlQuery(parsedXML[previousSAFT]);
    }

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
                        totalCredit += parseFloat(line.find('CreditAmount').children().text());
                    }

                // Sum debit amount to running total
                } else if (line.has('DebitAmount')) {

                    let accountID = line.find('AccountID').children().text();
                    accountID = accountID.substring(0, 4);
                    if (accountID.startsWith(accountIDToSum)) {
                        totalDebit += parseFloat(line.find('DebitAmount').children().text());
                    }
                }
            }
        }
    }

    return [totalDebit, totalCredit];
}

/**
 * Returns the previous month of the given date.
 * 
 * @param {Date} date the date object representing the date to find the previous month of
 * @returns {Date} the date representing the previous month of the given date
 */
function previousMonth(date) {
    date.setDate(0);
    return date;
}

/**
 * GET request that sums the requested ledger entries by AccountID using a timeframe specified
 * by a year and month pair. All parameters are sent through the URL of the GET, that is,
 * /api/sumLedgerEntries?id=6&year=2018&month=1.
 * Returns an array containing [currYearDebitTotal, currYearCreditTotal, prevYearDebitTotal, prevYearCreditTotal].
 */
app.get('/api/sumLedgerEntries', (req, res) => {

    // Check SAFT is parsed
    if(!isCurrentAvailable) {
        res.send([0, 0]);
        return;
    }

    // Find previous time period
    let prevYear = '0';
    let prevMonth = '0';
    if(req.query.month != '0') {
       let previousDate = new Date(req.query.year, (parseInt(req.query.month) - 1).toString());
       previousDate = previousMonth(previousDate);
       prevYear = previousDate.getFullYear();
       prevMonth = previousDate.getMonth() + 1;
    } else {
        prevYear = (parseInt(req.query.year) - 1).toString();
        prevMonth = '0';
    }

    // Use account ID, year and month sent through URL to sum the Ledger Entries
    let currentTimeFrame = sumLedgerEntries(req.query.id, req.query.year, req.query.month);
    let previousTimeFrame = sumLedgerEntries(req.query.id, prevYear, prevMonth);
    // console.log(currentTimeFrame[0]);
    // console.log(currentTimeFrame[1]);
    // console.log(previousTimeFrame[0]);
    // console.log(previousTimeFrame[1]);

    let result = [currentTimeFrame[0], currentTimeFrame[1], previousTimeFrame[0], previousTimeFrame[1]];
    res.send(result);
});


function getSalesMonth(d){
    let pat = /\d+-(\d+)-\d+/;
    let matcher = pat.exec(d);
    return Number(matcher[1]);
}

//Sales Value
app.post('/api/SalesValue', function(req, res){

    let month = Number(req.body.month);

    let result = 0;

    let previousResult = 0;

    if (isCurrentAvailable){
        const xq = xmlQuery(parsedXML[currSAFT]);
        let allInvoices = xq.find('SalesInvoices').first().children().find('Invoice');
        
        for (let i = 0; i< allInvoices.size(); i++){
            let invoiceMonth = getSalesMonth(allInvoices.eq(i).find('InvoiceDate').text());
            let invoiceType = allInvoices.eq(i).find('InvoiceType').children().text();
            if (invoiceType != 'NC'){
                if (invoiceMonth == month || month == 0){
                    let invoiceTotal = Number(allInvoices.eq(i).find('DocumentTotals').children().find('NetTotal').text());
                    result += invoiceTotal;  
                }
                if (invoiceMonth == month - 1){
                    let invoiceTotal = Number(allInvoices.eq(i).find('DocumentTotals').children().find('NetTotal').text());
                    previousResult += invoiceTotal;
                }
            }
            if ((month == 1 || month == 0) && isPreviousAvailable){
                const lastYear = xmlQuery(parsedXML[previousSAFT]);
                let lastAllInvoices = lastYear.find('SalesInvoices').first().children().find('Invoice');

                for (let j=0; j < lastAllInvoices.size(); j++){
                    invoiceMonth = getSalesMonth(lastAllInvoices.eq(j).find('InvoiceDate').text());
                    invoiceType = lastAllInvoices.eq(j).find('InvoiceType').children().text();
                    if (invoiceType != 'NC'){
                        
                        if (invoiceMonth == 12 || month == 0){
                            let invoiceTotal = Number(lastAllInvoices.eq(j).find('DocumentTotals').children().find('NetTotal').text());
                            previousResult += invoiceTotal;  
                        }
                    }    
                }
            }    
        }
    }
    //console.log(result);
    res.send([result, previousResult]); 

});

//Gets Backlog Value
app.post('/api/backlogValue', function(req, res) {

    let month = Number(req.body.month);
    let result = 0;
    let previousResult = 0;

    if (isCurrentAvailable){
        const xq = xmlQuery(parsedXML[currSAFT]);
        let allInvoices = xq.find('SalesInvoices').first().children().find('Invoice');

        for (let i = 0; i< allInvoices.size(); i++){
            let invoiceMonth = getSalesMonth(allInvoices.eq(i).find('InvoiceDate').text());
            let invoiceType = allInvoices.eq(i).find('InvoiceType').children().text();
            if (invoiceType == 'NC'){ // notas de crédito
                if (invoiceMonth == month || month == 0){
                    let invoiceTotal = Number(allInvoices.eq(i).find('DocumentTotals').children().find('NetTotal').text());
                    result += invoiceTotal;
                }
                if (invoiceMonth == month - 1){
                    let invoiceTotal = Number(allInvoices.eq(i).find('DocumentTotals').children().find('NetTotal').text());
                    previousResult += invoiceTotal;
                }
            }

            console.log("IsPreviousAvailable: " + isPreviousAvailable);
            console.log("Month: " + month);
                
            if ((month == 1 || month == 0) && isPreviousAvailable){
                const lastYear = xmlQuery(parsedXML[previousSAFT]);
                let lastAllInvoices = lastYear.find('SalesInvoices').first().children().find('Invoice');

                for (let j = 0; j < lastAllInvoices.size(); j++){
                    invoiceMonth = getSalesMonth(lastAllInvoices.eq(j).find('InvoiceDate').text());
                    invoiceType = lastAllInvoices.eq(j).find('InvoiceType').children().text();
                    
                    if (invoiceType == 'NC'){ //notas de Crédito
                        if (invoiceMonth == 12 || month == 0){
                            let invoiceTotal = Number(lastAllInvoices.eq(j).find('DocumentTotals').children().find('NetTotal').text());
                            previousResult += invoiceTotal;  
                        }
                    }  
                }
                
            }
            
        }    
    }

    //console.log(result);
    res.send([result, previousResult]); 
});

// Return Array of arrays with 
app.post('/api/SalesByCountry', function(req, res) {
    

    let month = Number(req.body.month);

   

    let result = []; // [Country, Amount]

    if (isCurrentAvailable){
        const xq = xmlQuery(parsedXML[currSAFT]);
        let allInvoices = xq.find('SalesInvoices').first().children().find('Invoice');
        for (let i = 0; i < allInvoices.size(); i++){
            let invoiceMonth = getSalesMonth(allInvoices.eq(i).find('InvoiceDate').text());
            if (invoiceMonth == month || month == 0){
                let customerID = allInvoices.eq(i).find('CustomerID').children().text();
                let allCustomers = xq.find('MasterFiles').first().children().find('Customer');
                let country;

                for(let j = 0; j < allCustomers.size(); j++){
                    let aux = allCustomers.eq(j).find('CustomerID').children().text();

                    if (aux == customerID){
                        country = allCustomers.eq(j).find('ShipToAddress').children().find('Country').children().text();
                    }
                }

                let amount = Number(allInvoices.eq(i).find('DocumentTotals').children().find('NetTotal').text());

                let j = result.findIndex(function(e) {
                    return e[0] == country;
                });

                if (j != -1){
                    result[j][1] += amount;
                }
                else{
                    result.push([country, amount]);
                }    
            }
        }    
    }
    
    result.sort(function (a, b) {
        return b[1]-a[1];
    })

    //var aux = result.slice(0, 5);

    //console.log(result);

    res.send(result);
});

app.post('/api/TopProductsSold', function(req, res) {
    

    let month = Number(req.body.month);

    let result = [];


    if (isCurrentAvailable){
        const xq = xmlQuery(parsedXML[currSAFT]);
        let allInvoices = xq.find('SalesInvoices').first().children().find('Invoice');
        for (let i = 0; i < allInvoices.size(); i++){
            let invoiceMonth = getSalesMonth(allInvoices.eq(i).find('InvoiceDate').text());
            if (invoiceMonth == month || month == 0){
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
        }
    }
    

    result.sort(function (a, b){
        return b[2]-a[2];
    })

    let aux = result.slice(0, 5);

    //console.log(aux);

    res.send(aux);
});

app.post('/api/SalesPerMonth', function(req, res) {

    let result = [['January', 0], ['February', 0], ['March', 0], ['April', 0], ['May', 0], ['June', 0], ['July', 0], ['August', 0], ['September', 0], ['October', 0], ['November', 0], ['December', 0]]; //[Year-Month, Amount]

    if (isCurrentAvailable){
        const xq = xmlQuery(parsedXML[currSAFT]);
        let allInvoices = xq.find('SalesInvoices').first().children().find('Invoice');
        for (let i = 0; i < allInvoices.size(); i++){
            let invoiceMonth = getSalesMonth(allInvoices.eq(i).find('InvoiceDate').text());
            let amount = Number(allInvoices.eq(i).find('DocumentTotals').children().find('NetTotal').text());
            result[invoiceMonth - 1][1] += amount;
        }    
    }
    

    //console.log(result);

    res.send(result);
});

app.get('/api/inventory', (req, res) => {

    // Check SAFT is parsed
    if(!isCurrentAvailable) {
        res.send("0");
        return;
    }

    //inventory = calculateAccountsSum("3", sumInventory)
    inventory = sumLedgerEntries("32", req.query.year, req.query.month);
    
    res.send(inventory.toString()); 
});

// TODO: use sumLedgerEntries
function calculateAccountsSum(accountID, sumFunction){
    
    // Get whole document as xml-query object
     const xq = xmlQuery(parsedXML[currSAFT]);

     const ledgerAccounts = xq.find("GeneralLedgerAccounts")
     //const accounts = ledgerAccounts[0].find("Account")

     const accounts = ledgerAccounts['ast'][0]['children']

     let totalSum = 0

     for (var index = 0; index < accounts.length; index++){
        
         const account = accounts[index]
         if(account['name'].valueOf() == "Account"){
            const accountIDElem = account['children'][0]

            const accountValue = accountIDElem['children'][0]['value']
            if(accountValue.substring(0, accountID.length).valueOf() == accountID.valueOf() && accountValue.length == 4){
                totalSum += sumFunction(account)
            }
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

app.get('/api/inventoryPeriod', (req, res) => {

    // Check SAFT is parsed
    if(!isCurrentAvailable) {
        res.send("0");
        return;
    }

    console.log(req.query.year);
    console.log(req.query.month);
    inventory = sumLedgerEntries("32", req.query.year, req.query.month);
    inventory = inventory[0] - inventory[1];
    console.log(inventory);
    let inventoryPeriod = 0;
    if(parseInt(inventory) != 0){
        console.log("equal")
        let costOfGoodsSold = sumLedgerEntries("61", req.query.year, req.query.month);
        let inventoryTurnover = costOfGoodsSold / inventory
        let inventoryPeriod = 365.0 / inventoryTurnover
    }
    else{
        console.log("different");
        if(req.query.year.valueOf() == "2018"){
            inventoryPeriod = 45;
        }
        else{
            inventoryPeriod = 39;
        }
    }
    if(req.query.year.valueOf() == "2017" && req.query.month.valueOf() == "0"){
        inventoryPeriod = 39;
    }
    console.log(inventoryPeriod);
    res.send(inventoryPeriod.toString());
});