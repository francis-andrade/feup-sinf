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
            assetsLoading: true
        }

        this.setYear = this.setYear.bind(this);
        this.changeYear = this.changeYear.bind(this);
        this.changeMonth = this.changeMonth.bind(this);
        this.updateYear = this.updateYear.bind(this);
        
        this.cash = {
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
        }
    }

    setYear(value) {
        this.setState({
            year: value
        })
    }

    changeYear = (value) => {

        this.setState({
            year: value
        })

        this.updateYear(value);
    }

    async updateYear(value) {

        await this.updateYearFetch(value);
        this.updateKPI(value, this.state.month);
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
            month: value
        })

        this.updateKPI(this.state.year, value);
    }

    updateKPI(year, month) {

        const API = 'http://localhost:5000/api/';
        const funcToUse = 'sumLedgerEntries';
        const parameters = '&year=' + year + '&month=' + month;

        // Get total accounts payable
        fetch(API + funcToUse + '?id=22' + parameters, {
            method: 'GET',
        })
            .then(response => response.json())
            .then(data => this.setState({ accPayable: data[0] - data[1], accPayableLoading: false }))

        // Get total accounts receivable
        fetch(API + funcToUse + '?id=21' + parameters, {
            method: 'GET',
        })
            .then(response => response.json())
            .then(data => this.setState({ accReceivable: data[0] - data[1], accReceivableLoading: false }))

        // Calculate total assets
        this.calcAssets(year, month);
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
        this.updateKPI(this.state.year, this.state.month);
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
                        <KPIComponent title={'Cash'} type={'money'} currentValue={1645} previousValue={1000}/>
                    </Col>
                    <Col md={{ size: 5 }} xl className='columnStack'>
                        <KPIComponent title={'Total Assets'} type={'money'} currentValue={this.state.assets} previousValue={1000} loading={this.state.assetsLoading} />
                    </Col>
                    <Col xs={{ size: 1 }} className='d-xl-none'/>
                    <Col xs={{ size: 1 }} md className='d-xl-none'/>
                    <Col md={{ size: 5 }} xl >
                        <KPIComponent title={'Total Liabilities'} type={'money'} currentValue={2075} previousValue={1000}/>
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
                        <KPIComponent title={'Gross Profit Margin'} type={'money'} currentValue={2075} previousValue={1000}/>
                    </Col>
                    <Col md className='d-xl-none columnStack' />
                    <Col xl={{ size: 1 }} />
                </Row>
                <Row className='rowStack'>
                    <Col>
                        <Row>
                            <Col md={{ size: 1 }} xl={{ size: 2 }} />
                            <Col className='lastElement'>
                                <GraphComponent type={'line'} data={this.cash} title={'Cash Graph'} yearly={true} />
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