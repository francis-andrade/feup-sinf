import React, { Component } from 'react';
import { Row, Col } from 'reactstrap';
import TimeSelectorComponent from '../components/TimeSelectorComponent';
import GraphComponent from '../components/GraphComponent';
import KPIComponent from '../components/KPIComponent';

import '../App.css';
import '../styles/Common.style.css';
import {retrieveDates} from '../utils.js';

class GenericDash extends Component {
    constructor(props) {
        super(props);

        this.state = {
            year: '',
            month: '0',

            salesValue: '0',
            salesValueLoading: true,

            topProducts : {
                labels: ['Category1', 'Category2', 'Category3'],
                datasets: [
                    {
                        label: 'Quantity',
                        fill: true,
                        backgroundColor: 'rgba(75,192,192,0.4)',
                        borderColor: 'rgba(75,192,192,1)',
                        pointBorderColor: 'rgba(75,192,192,1)',
                        pointBackgroundColor: '#fff',
                        pointHoverBackgroundColor: 'rgba(75,192,192,1)',
                        pointHoverBorderColor: 'rgba(220,220,220,1)',
                        data: []
                    }
                ]
            },
            topProductsLoading : true,
    
            sales : {
                labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                datasets: [
                    {
                        label: 'Income',
                        fill: true,
                        backgroundColor: 'rgba(75,192,192,0.4)',
                        borderColor: 'rgba(75,192,192,1)',
                        pointBorderColor: 'rgba(75,192,192,1)',
                        pointBackgroundColor: '#fff',
                        pointHoverBackgroundColor: 'rgba(75,192,192,1)',
                        pointHoverBorderColor: 'rgba(220,220,220,1)',
                        data: []
                    }
                ]
            },
            salesLoading : true,

            cash : '0',
            cashPrev : '0',
            cashLoading: true,

            profitMargin: '0',
            profitMarginLoading: true,

            purchases: [
                {
                    "Data": "2018-01-18T00:00:00",
                    "Artigo": "MP004",
                    "PrecUnit": 0.3,
                    "DataEntrega": "2018-01-22T00:00:00",
                    "Quantidade": 60,
                    "QuantReserv": 0,
                    "QuantTrans": 60,
                    "ArtEntidade": "F0005"
                },
                {
                    "Data": "2018-01-18T00:00:00",
                    "Artigo": "MP005",
                    "PrecUnit": 0.2,
                    "DataEntrega": "2018-01-22T00:00:00",
                    "Quantidade": 150,
                    "QuantReserv": 0,
                    "QuantTrans": 150,
                    "ArtEntidade": "F0005"
                },
                {
                    "Data": "2018-01-15T00:00:00",
                    "Artigo": "MP001",
                    "PrecUnit": 2.6,
                    "DataEntrega": "2018-01-22T00:00:00",
                    "Quantidade": 103.799995422363,
                    "QuantReserv": 0,
                    "QuantTrans": 103.799995422363,
                    "ArtEntidade": "F0001"
                },
                {
                    "Data": "2018-01-15T00:00:00",
                    "Artigo": "MP002",
                    "PrecUnit": 5,
                    "DataEntrega": "2018-01-22T00:00:00",
                    "Quantidade": 103.799995422363,
                    "QuantReserv": 0,
                    "QuantTrans": 103.799995422363,
                    "ArtEntidade": "F0001"
                },
                {
                    "Data": "2018-01-15T00:00:00",
                    "Artigo": "MP003",
                    "PrecUnit": 4,
                    "DataEntrega": "2018-01-22T00:00:00",
                    "Quantidade": 756,
                    "QuantReserv": 0,
                    "QuantTrans": 756,
                    "ArtEntidade": "F0001"
                },
                {
                    "Data": "2017-03-20T00:00:00",
                    "Artigo": "A0003",
                    "PrecUnit": 1198,
                    "DataEntrega": "2018-01-29T00:00:00",
                    "Quantidade": 7,
                    "QuantReserv": 0,
                    "QuantTrans": 2,
                    "ArtEntidade": "F0003"
                },
                {
                    "Data": "2017-03-20T00:00:00",
                    "Artigo": "CMP-CPU001.MT2200",
                    "PrecUnit": 23,
                    "DataEntrega": "2018-01-29T00:00:00",
                    "Quantidade": 45,
                    "QuantReserv": 0,
                    "QuantTrans": 0,
                    "ArtEntidade": "F0003"
                },
                {
                    "Data": "2017-03-20T00:00:00",
                    "Artigo": "B0001",
                    "PrecUnit": 99,
                    "DataEntrega": "2018-01-29T00:00:00",
                    "Quantidade": 6,
                    "QuantReserv": 0,
                    "QuantTrans": 6,
                    "ArtEntidade": "F0003"
                },
                {
                    "Data": "2017-03-20T00:00:00",
                    "Artigo": "CMP-HDD001.IDE-80",
                    "PrecUnit": 45,
                    "DataEntrega": "2018-01-29T00:00:00",
                    "Quantidade": 6,
                    "QuantReserv": 0,
                    "QuantTrans": 0,
                    "ArtEntidade": "F0003"
                },
                {
                    "Data": "2017-03-20T00:00:00",
                    "Artigo": "A0004",
                    "PrecUnit": 499,
                    "DataEntrega": "2018-01-29T00:00:00",
                    "Quantidade": 3,
                    "QuantReserv": 0,
                    "QuantTrans": 1,
                    "ArtEntidade": "F0003"
                },
                {
                    "Data": "2017-10-30T00:00:00",
                    "Artigo": "C0001",
                    "PrecUnit": 797,
                    "DataEntrega": "2018-01-29T00:00:00",
                    "Quantidade": 1,
                    "QuantReserv": 0,
                    "QuantTrans": 1,
                    "ArtEntidade": "F0001"
                },
                {
                    "Data": "2018-01-23T00:00:00",
                    "Artigo": "MP001",
                    "PrecUnit": 2.6,
                    "DataEntrega": "2018-02-12T00:00:00",
                    "Quantidade": 34.5999984741211,
                    "QuantReserv": 0,
                    "QuantTrans": 0,
                    "ArtEntidade": "F0001"
                },
                {
                    "Data": "2018-01-23T00:00:00",
                    "Artigo": "MP003",
                    "PrecUnit": 4,
                    "DataEntrega": "2018-02-12T00:00:00",
                    "Quantidade": 252,
                    "QuantReserv": 0,
                    "QuantTrans": 0,
                    "ArtEntidade": "F0001"
                },
                {
                    "Data": "2018-01-23T00:00:00",
                    "Artigo": "MP002",
                    "PrecUnit": 5,
                    "DataEntrega": "2018-02-12T00:00:00",
                    "Quantidade": 34.5999984741211,
                    "QuantReserv": 0,
                    "QuantTrans": 0,
                    "ArtEntidade": "F0002"
                },
                {
                    "Data": "2018-01-23T00:00:00",
                    "Artigo": "MP005",
                    "PrecUnit": 0.2,
                    "DataEntrega": "2018-02-13T00:00:00",
                    "Quantidade": 50,
                    "QuantReserv": 0,
                    "QuantTrans": 0,
                    "ArtEntidade": "F0002"
                },
                {
                    "Data": "2018-01-23T00:00:00",
                    "Artigo": "MP004",
                    "PrecUnit": 0.3,
                    "DataEntrega": "2018-02-13T00:00:00",
                    "Quantidade": 20,
                    "QuantReserv": 0,
                    "QuantTrans": 0,
                    "ArtEntidade": "F0003"
                },
                {
                    "Data": "2018-04-24T00:00:00",
                    "Artigo": "A0001",
                    "PrecUnit": 455,
                    "DataEntrega": "2018-04-24T00:00:00",
                    "Quantidade": 10,
                    "QuantReserv": 0,
                    "QuantTrans": 0,
                    "ArtEntidade": "F0001"
                },
                {
                    "Data": "2018-02-24T00:00:00",
                    "Artigo": "A0001",
                    "PrecUnit": 878,
                    "DataEntrega": "2018-11-23T00:00:00",
                    "Quantidade": 20,
                    "QuantReserv": 0,
                    "QuantTrans": 0,
                    "ArtEntidade": "F0003"
                }
            ],

            currentPurchasesValue: 0,
            previousPurchasesValue: 0,
            currentPurchasesValueLoading: true,

        };


        this.setYear = this.setYear.bind(this);
        this.changeYear = this.changeYear.bind(this);
        this.changeMonth = this.changeMonth.bind(this);
        this.updateYear = this.updateYear.bind(this);

        
    }

    setYear(value) {
        this.setState({
            year: value,
            salesValueLoading: true,
            topProductsLoading: true,
            salesLoading: true,
            cashLoading: true,
            profitMarginLoading: true,
        })
    }

    changeYear = (value) => {
        this.setState({
            year: value,
            salesValueLoading: true,
            topProductsLoading: true,
            salesLoading: true,
            cashLoading: true,
            profitMarginLoading: true,
            currentPurchasesValueLoading: true,
        })

        this.updateYear(value);
        setTimeout(
            function() {
                this.updateSales(this.state.month);
                this.updateFinancial(value, this.state.month);
                this.updatePurchases(value, this.state.month);
            }
            .bind(this),
            100
        );
    }

    changeMonth = (value) => {
        this.setState({
            month: value,
            salesValueLoading: true,
            topProductsLoading: true,
            salesLoading: true,
            cashLoading: true,
            profitMarginLoading: true,
            currentPurchasesValueLoading: true,
        })
        
        setTimeout(
            function() {
                this.updateSales(value);
                this.updateFinancial(this.state.year, value);
                this.updatePurchases(this.state.year, value);
            }
            .bind(this),
            100
        );
    }

    async updateYear(value) {
        await this.updateYearFetch(value);
    }

    updateYearFetch(value) {
        return fetch('http://localhost:5000/api/updateYear', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                year: value
            })
        })
    }


    async updateSales(m) {
        let salesVal = await this.requestSales('http://localhost:5000/api/salesValue', m);
        let salesHist = await this.requestSales('http://localhost:5000/api/SalesPerMonth', m);
        let topProd = await this.requestSales('http://localhost:5000/api/TopProductsSold', m);
        
        let newState = Object.assign({}, this.state);
        newState.salesValue = salesVal;
        newState.sales.labels = salesHist.map(function(a){
            return a[0];
        });
        newState.sales.datasets[0].data = salesHist.map(function(a){
            return Math.round(a[1] * 100) /100;
        });
        newState.topProducts.labels = topProd.map(function(a){
            return a[1];
        });
        newState.topProducts.datasets[0].data = topProd.map(function(a){
            return Math.round(a[2] * 100) /100;
        });
        newState.salesValueLoading = false;
        newState.salesLoading = false;
        newState.topProductsLoading = false;
        this.setState(newState);
    }

    async requestSales(URL, m) {
        const response = await fetch(URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                month: m,
            })
        })

        const json = await response.json();
        return json;
    }

    updateFinancial(year, month){
        this.calcCash(year, month);
        this.calcGrossProfitMargin(year, month);
    }

    calcCash(year, month){
        const API = 'http://localhost:5000/api/';
        const funcToUse = 'sumLedgerEntries';
        const parameters = '&year=' + year + '&month=' + month;

        fetch(API + funcToUse + '?id=11' + parameters, {
            method: 'GET',
        })
            .then(response => response.json())
            .then(data => this.setState({ cash: data[0] - data[1], cashPrev: data[2] - data[3], cashLoading: false }))
    }

    async calcGrossProfitMargin(year, month) {

        const API = 'http://localhost:5000/api/';
        const funcToUse = 'sumLedgerEntries';
        const parameters = '&year=' + year + '&month=' + month;

        let account61Sum = await this.syncLedgerSum(API + funcToUse + '?id=61' + parameters);
        let account71Sum = await this.syncLedgerSum(API + funcToUse + '?id=71' + parameters);

        let account61Value = account61Sum[0] - account61Sum[1];
        let account71Value = account71Sum[0] - account71Sum[1];

        let margin;
        if(account71Value !== 0) margin = account61Value / account71Value * 100
        else margin = 0;

        this.setState({
            profitMargin: margin,
            profitMarginLoading: false
        })   
    }

    async syncLedgerSum(URL) {

        const response = await fetch(URL, {
            method: 'GET',
        })

        const json = await response.json();
        return json;
    }

    updatePurchases(year, month){
        this.updatePurchasesValue(year, month);
    }

    updatePurchasesValue(year, month){
        let dates = retrieveDates(year, month);
        let prevStartDate = dates[0][0];
        let prevEndDate = dates[0][1];
        let currStartDate = dates[1][0];
        let currEndDate = dates[1][1];
        let currPurchasesValue = 0;
        let prevPurchasesValue = 0;
        let purchases = this.state['purchases'];
        //console.log(purchases);
        for(let index = 0; index < purchases.length; index++){
            let purchasesDate = new Date(purchases[index]["Data"]);
            if(purchasesDate >= currStartDate && purchasesDate <= currEndDate){
                currPurchasesValue = currPurchasesValue + purchases[index]['Quantidade']*purchases[index]['PrecUnit'];
            }
            else if(purchasesDate >= prevStartDate && purchasesDate <= prevEndDate){
                prevPurchasesValue = prevPurchasesValue + purchases[index]['Quantidade']*purchases[index]['PrecUnit'];
            }
        }
        this.setState({previousPurchasesValue: prevPurchasesValue.toFixed(0)});
        this.setState({currentPurchasesValue: currPurchasesValue.toFixed(0), currentPurchasesValueLoading: false});
    }

    componentDidMount() {
        this.updateYear('2018');
        this.updateSales(this.state.month);
        this.updateFinancial('2018', this.state.month);
        this.updatePurchases('2018', this.state.month);
    }

    render() {

        console.log(this.state);
        return (
            <div className='dashboardBackground'>
                <Row>
                    <Col md={{ size: 1 }} lg={{ size: 2 }} xl={{ size: 3 }}/>
                    <Col>
                        <TimeSelectorComponent year={this.state.year} month={this.state.month} setYear={this.setYear} updateYear={this.updateYear} changeYear={this.changeYear} changeMonth={this.changeMonth} />
                    </Col>
                    <Col md={{ size: 1 }} lg={{ size: 2 }} xl={{ size: 3 }}/>
                </Row>
                <Row style={{ 'marginTop': '5vh' }}>
                    <Col xs={{ size: 1 }} />
                    <Col md={{ size: 5 }} xl className='columnStack'>
                        <KPIComponent title={'Sales Value'} type={'money'} currentValue={this.state.salesValue[0]} previousValue={this.state.salesValue[1]} loading={this.state.salesValueLoading}/>
                    </Col>
                    <Col md={{ size: 5 }} xl className='columnStack'>
                        <KPIComponent title={'Purchases Value'} type={'money'} currentValue={Number(this.state.currentPurchasesValue)} previousValue={Number(this.state.previousPurchasesValue)} loading={this.state.currentPurchasesValueLoading}/>
                    </Col>
                    <Col xs={{ size: 1 }} className='d-xl-none'/>
                    <Col xs={{ size: 1 }} md className='d-xl-none'/>
                    <Col md={{ size: 5 }} xl className='columnStack'>
                        <KPIComponent title={'Cash'} type={'money'} currentValue={this.state.cash} previousValue={this.state.cashPrev} loading={this.state.cashLoading}/>
                    </Col>
                    <Col md className='d-xl-none' />
                    <Col xl={{ size: 1 }} />
                </Row>
                <Row className='rowStack'>
                    <Col xs={{ size: 1 }} />
                    <Col md className='columnStack'>
                        <KPIComponent title={'Gross Profit Margin'} type={'percentage'} currentValue={this.state.profitMargin} previousValue={0} loading={this.state.profitMarginLoading}/>
                    </Col>
                    <Col md className='columnStack'>
                        <KPIComponent title={'Inventory Value'} type={'money'} currentValue={834} previousValue={1000}/>
                    </Col>
                    <Col xs={{ size: 1 }} />
                </Row>
                <Row className='rowStack'>
                    <Col xl={{ size: 6 }}>
                        <Row>
                            <Col md={{ size: 1 }} xl={{ size: 2 }} />
                            <Col className='columnStack'>
                                <GraphComponent type={'line'} data={this.state.sales} title={'Sales History'} yearly={true} loading={this.state.salesLoading} />
                            </Col>
                            <Col md={{ size: 1 }} className='d-xl-none' />
                        </Row>
                    </Col>
                    <Col xl={{ size: 6 }}>
                        <Row>
                            <Col md={{ size: 1 }} className='d-xl-none' />
                            <Col className='lastElement'>
                                <GraphComponent type={'horizontalBar'} data={this.state.topProducts} title={'Top Best Selling Products'} yearly={false} loading={this.state.topProductsLoading} />
                            </Col>
                            <Col md={{ size: 1 }} xl={{ size: 2 }} />
                        </Row>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default GenericDash;