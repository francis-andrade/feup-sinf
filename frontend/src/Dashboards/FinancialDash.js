import React, { Component } from 'react';
import { Row, Col } from 'reactstrap';
import TimeSelectorComponent from '../components/TimeSelectorComponent';
import GraphComponent from '../components/GraphComponent';
import KPIComponent from '../components/KPIComponent';
import '../App.css';
import '../styles/Common.style.css';

class FinancialDash extends Component {

    constructor(props) {

        super(props);

        this.state = {
            year: '',
            month: '0',

            accPayable: 0.0,
            accPayableLoading: true,

            accReceivable: 0.0,
            accReceivableLoading: true,

            assets: 0.0,
            assetsLoading: true,

            cash: 0.0,
            cashLoading: true,

            liabilities: 0.0,
            liabilitiesLoading: true,

            profitMargin: 0.0,
            profitMarginLoading: true,

            cashGraph: {
                labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                datasets: [
                    {
                        label: 'Cash',
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
            cashGraphLoading: true
        }

        this.setYear = this.setYear.bind(this);
        this.changeYear = this.changeYear.bind(this);
        this.changeMonth = this.changeMonth.bind(this);
        this.updateYear = this.updateYear.bind(this);
        

    }

    setYear(value) {
        this.setState({
            year: value,
            accPayableLoading: true,
            accReceivableLoading: true,
            assetsLoading: true,
            cashLoading: true,
            liabilitiesLoading: true,
            profitMarginLoading: true,
            cashGraphLoading: true
        })
    }

    changeYear = (value) => {

        this.setState({
            year: value,
            accPayableLoading: true,
            accReceivableLoading: true,
            assetsLoading: true,
            cashLoading: true,
            liabilitiesLoading: true,
            profitMarginLoading: true,
            cashGraphLoading: true
        })

        this.updateYear(value);
    }

    async updateYear(value) {

        await this.updateYearFetch(value);
        this.updateKPI(value, this.state.month, true);
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

    changeMonth = (value) => {

        this.setState({
            month: value,
            accPayableLoading: true,
            accReceivableLoading: true,
            assetsLoading: true,
            cashLoading: true,
            liabilitiesLoading: true,
            profitMarginLoading: true
        })

        this.updateKPI(this.state.year, value, false);
    }

    updateKPI(year, month, updateGraph) {

        if(updateGraph) this.updateCashGraph(year);

        // Calculate gross profit margin
        this.calcGrossProfitMargin(year, month);

        // Calculate total liabilities
        this.calcLiabilities(year, month);

        // Calculate cash available
        this.calcCash(year, month);

        // Calculate accounts receivable and payable
        this.calcAccounts(year, month);

        // Calculate total assets
        this.calcAssets(year, month);

    }

    async updateCashGraph(year) {

        const API = 'http://localhost:5000/api/';
        const funcToUse = 'sumLedgerEntries';
        let dataset = [];

        for(let i = 1; i < 13; i++) {

            const parameters = '&year=' + year + '&month=' + i;

            let result = await this.syncLedgerSum(API + funcToUse + '?id=11' + parameters);
            dataset.push(result[0] - result[1]);
        }

        let cashGraphAux = this.state.cashGraph;
        cashGraphAux.datasets[0].data = [dataset[0], dataset[1], dataset[2], dataset[3], dataset[4], dataset[5], dataset[6], dataset[7], dataset[8], dataset[9], dataset[10], dataset[11]];

        this.setState({
            cashGraph: cashGraphAux,
            cashGraphLoading: false
        })
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

    async calcLiabilities(year, month) {
        
        const API = 'http://localhost:5000/api/';
        const funcToUse = 'sumLedgerEntries';
        const parameters = '&year=' + year + '&month=' + month;

        let account22Sum = await this.syncLedgerSum(API + funcToUse + '?id=22' + parameters);
        let account23Sum = await this.syncLedgerSum(API + funcToUse + '?id=23' + parameters);
        let account24Sum = await this.syncLedgerSum(API + funcToUse + '?id=24' + parameters);
        let account25Sum = await this.syncLedgerSum(API + funcToUse + '?id=25' + parameters);
        let account26Sum = await this.syncLedgerSum(API + funcToUse + '?id=26' + parameters);

        this.setState({
            liabilities: account22Sum[0] + account23Sum[0] + account24Sum[0] + account25Sum[0] + account26Sum[0] -
                account22Sum[1] + account23Sum[1] + account24Sum[1] + account25Sum[1] + account26Sum[1],
            liabilitiesLoading: false
        })
    }

    calcCash(year, month) {

        const API = 'http://localhost:5000/api/';
        const funcToUse = 'sumLedgerEntries';
        const parameters = '&year=' + year + '&month=' + month;

        fetch(API + funcToUse + '?id=11' + parameters, {
            method: 'GET',
        })
            .then(response => response.json())
            .then(data => this.setState({ cash: data[0] - data[1], cashLoading: false }))
    }    

    calcAccounts(year, month) {

        const API = 'http://localhost:5000/api/';
        const funcToUse = 'sumLedgerEntries';
        const parameters = '&year=' + year + '&month=' + month;

        fetch(API + funcToUse + '?id=22' + parameters, {
            method: 'GET',
        })
            .then(response => response.json())
            .then(data => this.setState({ accPayable: data[0] - data[1], accPayableLoading: false }))

        fetch(API + funcToUse + '?id=21' + parameters, {
            method: 'GET',
        })
            .then(response => response.json())
            .then(data => this.setState({ accReceivable: data[0] - data[1], accReceivableLoading: false }))
    }

    async calcAssets(year, month) {

        const API = 'http://localhost:5000/api/';
        const funcToUse = 'sumLedgerEntries';
        const parameters = '&year=' + year + '&month=' + month;

        let account1Sum = await this.syncLedgerSum(API + funcToUse + '?id=1' + parameters);
        let account2Sum = await this.syncLedgerSum(API + funcToUse + '?id=2' + parameters);
        let account3Sum = await this.syncLedgerSum(API + funcToUse + '?id=3' + parameters);

        this.setState({
            assets: account1Sum[0] + account2Sum[0] + account3Sum[0] - account1Sum[1] + account2Sum[1] + account3Sum[1],
            assetsLoading: false
        })
    }

    async syncLedgerSum(URL) {

        const response = await fetch(URL, {
            method: 'GET',
        })

        const json = await response.json();
        return json;
    }

    componentDidMount() {
        this.updateKPI(this.state.year, this.state.month, true);
    }

    render() {

        return (
            <div className='dashboardBackground'>
                <Row>
                    <Col md={{ size: 1 }} lg={{ size: 2 }} xl={{ size: 3 }} />
                    <Col>
                        <TimeSelectorComponent year={this.state.year} month={this.state.month} setYear={this.setYear} updateYear={this.updateYear} changeYear={this.changeYear} changeMonth={this.changeMonth} />
                    </Col>
                    <Col md={{ size: 1 }} lg={{ size: 2 }} xl={{ size: 3 }} />
                </Row>
                <Row style={{ 'marginTop': '5vh' }}>
                    <Col xs={{ size: 1 }} />
                    <Col md={{ size: 5 }} xl className='columnStack'>
                        <KPIComponent title={'Cash'} type={'money'} currentValue={this.state.cash} previousValue={1000} loading={this.state.cashLoading} />
                    </Col>
                    <Col md={{ size: 5 }} xl className='columnStack'>
                        <KPIComponent title={'Total Assets'} type={'money'} currentValue={this.state.assets} previousValue={1000} loading={this.state.assetsLoading} />
                    </Col>
                    <Col xs={{ size: 1 }} className='d-xl-none'/>
                    <Col xs={{ size: 1 }} md className='d-xl-none'/>
                    <Col md={{ size: 5 }} xl >
                        <KPIComponent title={'Total Liabilities'} type={'money'} currentValue={this.state.liabilities} previousValue={1000} loading={this.state.liabilitiesLoading} />
                    </Col>
                    <Col md className='d-xl-none' />
                    <Col xl={{ size: 1 }} />
                </Row>
                <Row style={{ 'marginTop': '5vh' }}>
                    <Col xs={{ size: 1 }} />
                    <Col md={{ size: 5 }} xl className='columnStack'>
                        <KPIComponent title={'Accounts Payable'} type={'money'} currentValue={this.state.accPayable} previousValue={1000} loading={this.state.accPayableLoading} />
                    </Col>
                    <Col md={{ size: 5 }} xl className='columnStack'>
                        <KPIComponent title={'Accounts Receivable'} type={'money'} currentValue={this.state.accReceivable} previousValue={1000} loading={this.state.accReceivableLoading} />
                    </Col>
                    <Col xs={{ size: 1 }} className='d-xl-none'/>
                    <Col xs={{ size: 1 }} md className='d-xl-none'/>
                    <Col md={{ size: 5 }} xl className='columnStack'>
                        <KPIComponent title={'Gross Profit Margin'} type={'percentage'} currentValue={this.state.profitMargin} previousValue={1000} loading={this.state.profitMarginLoading} />
                    </Col>
                    <Col md className='d-xl-none columnStack' />
                    <Col xl={{ size: 1 }} />
                </Row>
                <Row className='rowStack'>
                    <Col>
                        <Row>
                            <Col md={{ size: 1 }} xl={{ size: 2 }} />
                            <Col className='lastElement'>
                                <GraphComponent type={'line'} data={this.state.cashGraph} title={'Cash Graph'} yearly={true} loading={this.state.cashGraphLoading} />
                            </Col>
                            <Col md={{ size: 1 }} xl={{ size: 2 }} />
                        </Row>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default FinancialDash;