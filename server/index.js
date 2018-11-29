const express = require('express');
const path = require('path');
const fs = require('fs');

const XmlReader = require('xml-reader');
const Flatted = require('flatted');
const xmlQuery = require('xml-query');

const app = express();

let parsedXML;

// TODO: temporary test query for reading fields in SAF-T
app.get('/api/testQuery', (req, res) => {
    
    let xmlFile = fs.readFileSync(path.join(__dirname + '/SAF-T/SAFT_DEMOSINF_01-01-2016_31-12-2016.xml'), 'utf8');
    parsedXML = XmlReader.parseSync(xmlFile);

    const xq = xmlQuery(parsedXML);

    let query = xq.find('ClosingDebitBalance')

    // Iterate over ClosingDebitBalance
    let closingDebitSum = 0;
    for (let o of query['ast']) {
        closingDebitSum += parseInt(o['children'][0]['value']);
        //console.log(o['children'][0]['value']);
    }
    console.log(closingDebitSum);
    res.send(closingDebitSum + '');
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