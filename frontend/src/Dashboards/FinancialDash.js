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
            year: '2018',
            month: '1',
            totalExpenses: 0.0,
            totalAsset: 0.0,
            accPayable: 0.0,
            accReceivable: 0.0
        };

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

    changeYear = (value) => {

        this.setState({
            year: value
        })

        // TODO: adicionar POST request para o server e enviar a data

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
            .then(data => this.setState({ totalExpenses: data[0] - data[1] }))

        // Get total asset value
        fetch('http://localhost:5000/api/sumLedgerEntries?id=4', {
            method: 'GET',
        })
            .then(response => response.json())
            .then(data => this.setState({ totalAsset: data[0] - data[1] }))

        // Get total accounts payable
        fetch('http://localhost:5000/api/sumLedgerEntries?id=22', {
            method: 'GET',
        })
            .then(response => response.json())
            .then(data => this.setState({ accPayable: data[1] - data[0] }))

        // Get total accounts receivable
        fetch('http://localhost:5000/api/sumLedgerEntries?id=21', {
            method: 'GET',
        })
            .then(response => response.json())
            .then(data => this.setState({ accReceivable: data[0] - data[1] }))
    }

    render() {
        return (
            <div className='dashboardBackground'>
                <Row>
                    <Col md={{ size: 1 }} lg={{ size: 2 }} xl={{ size: 3 }} />
                    <Col>
                        <TimeSelectorComponent year={this.state.year} month={this.state.month} changeYear={this.changeYear} changeMonth={this.changeMonth} />
                    </Col>
                    <Col md={{ size: 1 }} lg={{ size: 2 }} xl={{ size: 3 }} />
                </Row>
                <Row style={{ 'marginTop': '5vh' }}>
                    <Col xs={{ size: 1 }} />
                    <Col md={{ size: 5 }} xl className='columnStack'>
                        <KPIComponent title={'Total Income'} type={'money'} currentValue={1645} previousValue={1000} />
                    </Col>
                    <Col md={{ size: 5 }} xl className='columnStack'>
                        <KPIComponent title={'Total Expenses'} type={'money'} currentValue={this.state.totalExpenses} previousValue={1000} />
                    </Col>
                    <Col xs={{ size: 1 }} className='d-xl-none' />
                    <Col xs={{ size: 1 }} className='d-xl-none' />
                    <Col md={{ size: 5 }} xl className='columnStack'>
                        <KPIComponent title={'Total Revenue'} type={'money'} currentValue={2075} previousValue={1000} />
                    </Col>
                    <Col md={{ size: 5 }} xl className='columnStack'>
                        <KPIComponent title={'Total Asset Value'} type={'money'} currentValue={this.state.totalAsset} previousValue={1000} />
                    </Col>
                    <Col xs={{ size: 1 }} />
                </Row>
                <Row className='rowStack'>
                    <Col xl={{ size: 6 }}>
                        <Row>
                            <Col md={{ size: 1 }} xl={{ size: 2 }} />
                            <Col md className='columnStack'>
                                <KPIComponent title={'Accounts Payable'} type={'money'} currentValue={this.state.accPayable} previousValue={1000} />
                            </Col>
                            <Col md className='columnStack'>
                                <KPIComponent title={'Accounts Receivable'} type={'money'} currentValue={this.state.accReceivable} previousValue={1000} />
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