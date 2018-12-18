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

            totalExpenses: 0.0,
            totalExpensesLoading: true,

            totalAsset: 0.0,
            totalAssetLoading: true,

            accPayable: 0.0,
            accPayableLoading: true,

            accReceivable: 0.0,
            accReceivableLoading: true

        };

        this.setYear = this.setYear.bind(this);
        this.changeYear = this.changeYear.bind(this);
        this.changeMonth = this.changeMonth.bind(this);

        this.revenue = {
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
        };

        this.costs = {
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
        };

        this.income = {
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
        };
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

        fetch('http://localhost:5000/api/testPost', {
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
    }

    componentDidMount() {

        // Get total revenue
        fetch('http://localhost:5000/api/sumLedgerEntries?id=6', {
            method: 'GET',
        })
            .then(response => response.json())
            .then(data => this.setState({ totalExpenses: data[0] - data[1], totalExpensesLoading: false }))

        // Get total asset value
        fetch('http://localhost:5000/api/sumLedgerEntries?id=4', {
            method: 'GET',
        })
            .then(response => response.json())
            .then(data => this.setState({ totalAsset: data[0] - data[1], totalAssetLoading: false }))

        // Get total accounts payable
        fetch('http://localhost:5000/api/sumLedgerEntries?id=22', {
            method: 'GET',
        })
            .then(response => response.json())
            .then(data => this.setState({ accPayable: data[1] - data[0], accPayableLoading: false }))

        // Get total accounts receivable
        fetch('http://localhost:5000/api/sumLedgerEntries?id=21', {
            method: 'GET',
        })
            .then(response => response.json())
            .then(data => this.setState({ accReceivable: data[0] - data[1], accReceivableLoading: false }))
        
    }

    render() {
        console.log(this.state.year)
        return (
            <div className='dashboardBackground'>
                <Row>
                    <Col md={{ size: 1 }} lg={{ size: 2 }} xl={{ size: 3 }} />
                    <Col>
                        <TimeSelectorComponent year={this.state.year} month={this.state.month} setYear={this.setYear} changeYear={this.changeYear} changeMonth={this.changeMonth} />
                    </Col>
                    <Col md={{ size: 1 }} lg={{ size: 2 }} xl={{ size: 3 }} />
                </Row>
                <Row style={{ 'marginTop': '5vh' }}>
                    <Col xs={{ size: 1 }} />
                    <Col md={{ size: 5 }} xl className='columnStack'>
                        <KPIComponent title={'Total Income'} type={'money'} currentValue={1645} previousValue={1000} />
                    </Col>
                    <Col md={{ size: 5 }} xl className='columnStack'>
                        <KPIComponent title={'Total Expenses'} type={'money'} currentValue={this.state.totalExpenses} previousValue={1000} loading={this.state.totalExpensesLoading} />
                    </Col>
                    <Col xs={{ size: 1 }} className='d-xl-none' />
                    <Col xs={{ size: 1 }} className='d-xl-none' />
                    <Col md={{ size: 5 }} xl className='columnStack'>
                        <KPIComponent title={'Total Revenue'} type={'money'} currentValue={2075} previousValue={1000} />
                    </Col>
                    <Col md={{ size: 5 }} xl className='columnStack'>
                        <KPIComponent title={'Total Asset Value'} type={'money'} currentValue={this.state.totalAsset} previousValue={1000} loading={this.state.totalAssetLoading} />
                    </Col>
                    <Col xs={{ size: 1 }} />
                </Row>
                <Row className='rowStack'>
                    <Col xl={{ size: 6 }}>
                        <Row>
                            <Col md={{ size: 1 }} xl={{ size: 2 }} />
                            <Col md className='columnStack'>
                                <KPIComponent title={'Accounts Payable'} type={'money'} currentValue={this.state.accPayable} previousValue={1000} loading={this.state.accPayableLoading} />
                            </Col>
                            <Col md className='columnStack'>
                                <KPIComponent title={'Accounts Receivable'} type={'money'} currentValue={this.state.accReceivable} previousValue={1000} loading={this.state.accReceivableLoading} />
                            </Col>
                            <Col md={{ size: 1 }} className='d-xl-none' />
                        </Row>
                        <Row className='rowStack'>
                            <Col md={{ size: 1 }} xl={{ size: 2 }} />
                            <Col md className='columnStack'>
                                <KPIComponent title={'Financial Autonomy'} type={'percentage'} currentValue={140} previousValue={126} />
                            </Col >
                            <Col md className='columnStack'>
                                <KPIComponent title={'General Liquidity'} type={'percentage'} currentValue={106} previousValue={102} />
                            </Col>
                            <Col md={{ size: 1 }} className='d-xl-none' />
                        </Row>
                    </Col>
                    <Col xl={{ size: 6 }}>
                        <Row>
                            <Col md={{ size: 1 }} className='d-xl-none' />
                            <Col className='columnStack'>
                                <GraphComponent type={'line'} data={this.revenue} title={'Revenue History'} yearly={true} />
                            </Col>
                            <Col md={{ size: 1 }} xl={{ size: 2 }} />
                        </Row>
                    </Col>
                </Row>
                <Row className='rowStack'>
                    <Col xl={{ size: 6 }}>
                        <Row>
                            <Col md={{ size: 1 }} xl={{ size: 2 }} />
                            <Col className='columnStack'>
                                <GraphComponent type={'line'} data={this.costs} title={'Costs History'} yearly={true} />
                            </Col>
                            <Col md={{ size: 1 }} className='d-xl-none' />
                        </Row>
                    </Col>
                    <Col xl={{ size: 6 }}>
                        <Row>
                            <Col md={{ size: 1 }} className='d-xl-none' />
                            <Col className='lastElement'>
                                <GraphComponent type={'line'} data={this.income} title={'Income History'} yearly={true} />
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