import React, { Component } from 'react';
import { Row, Col } from 'reactstrap';
import '../App.css';
import '../styles/Common.style.css';
import CalendarSelector from '../components/CalendarSelector';
import GraphComponent from '../components/GraphComponent';
import KPIComponent from '../components/KPIComponent';

class FinancialDash extends Component {
    constructor(props) {
        super(props);

        this.state = {

        };

        this.revenue = {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            datasets: [
                {
                    label: 'Revenue',
                    fill: true,
                    lineTension: 0.1,
                    backgroundColor: 'rgba(75,192,192,0.4)',
                    borderColor: 'rgba(75,192,192,1)',
                    borderCapStyle: 'butt',
                    borderDash: [],
                    borderDashOffset: 0.0,
                    borderJoinStyle: 'miter',
                    pointBorderColor: 'rgba(75,192,192,1)',
                    pointBackgroundColor: '#fff',
                    pointBorderWidth: 1,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: 'rgba(75,192,192,1)',
                    pointHoverBorderColor: 'rgba(220,220,220,1)',
                    pointHoverBorderWidth: 2,
                    pointRadius: 1,
                    pointHitRadius: 10,
                    data: [1843, 1928, 2058, 2185, 1956, 1856, 2075]
                }
            ]
        };

        this.costs = {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            datasets: [
                {
                    label: 'Costs',
                    fill: true,
                    lineTension: 0.1,
                    backgroundColor: 'rgba(75,192,192,0.4)',
                    borderColor: 'rgba(75,192,192,1)',
                    borderCapStyle: 'butt',
                    borderDash: [],
                    borderDashOffset: 0.0,
                    borderJoinStyle: 'miter',
                    pointBorderColor: 'rgba(75,192,192,1)',
                    pointBackgroundColor: '#fff',
                    pointBorderWidth: 1,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: 'rgba(75,192,192,1)',
                    pointHoverBorderColor: 'rgba(220,220,220,1)',
                    pointHoverBorderWidth: 2,
                    pointRadius: 1,
                    pointHitRadius: 10,
                    data: [1382, 1258, 1342, 1290, 1392, 1502, 1482]
                }
            ]
        };

        this.income = {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            datasets: [
                {
                    label: 'Income',
                    fill: true,
                    lineTension: 0.1,
                    backgroundColor: 'rgba(75,192,192,0.4)',
                    borderColor: 'rgba(75,192,192,1)',
                    borderCapStyle: 'butt',
                    borderDash: [],
                    borderDashOffset: 0.0,
                    borderJoinStyle: 'miter',
                    pointBorderColor: 'rgba(75,192,192,1)',
                    pointBackgroundColor: '#fff',
                    pointBorderWidth: 1,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: 'rgba(75,192,192,1)',
                    pointHoverBorderColor: 'rgba(220,220,220,1)',
                    pointHoverBorderWidth: 2,
                    pointRadius: 1,
                    pointHitRadius: 10,
                    data: [1593, 1602, 1759, 1857, 1620, 1595, 1645]
                }
            ]
        };
    }

    componentDidMount() {

        // TODO: example fetch from server
        fetch('http://localhost:5000/Api/printXML', {
            method: 'GET',
            mode: 'no-cors'
        })
            .then(response => console.log(response.body))
    }

    render() {
        return(
            <div className='dashboardBackground'>
                <Row>
                    <Col>
                        <CalendarSelector />
                    </Col>
                </Row>
                <Row style={{ 'marginTop': '5vh' }}>
                    <Col lg={{ size: 1 }} />
                    <Col lg={{ size: 5 }} xl className='columnStack'>
                        <KPIComponent title={'Total Income'} type={'money'} currentValue={1645} previousValue={1000}/>
                    </Col>
                    <Col lg={{ size: 5 }} xl className='columnStack'>
                        <KPIComponent title={'Total Expenses'} type={'money'} currentValue={834} previousValue={1000}/>
                    </Col>
                    <Col lg={{ size: 1 }} className='d-xl-none'/>
                    <Col lg={{ size: 1 }} className='d-xl-none'/>
                    <Col lg={{ size: 5 }} xl className='columnStack'>
                        <KPIComponent title={'Total Revenue'} type={'money'} currentValue={2075} previousValue={1000}/>
                    </Col>
                    <Col lg={{ size: 5 }} xl className='columnStack'>
                        <KPIComponent title={'Total Asset Value'} type={'money'} currentValue={3966} previousValue={1000}/>
                    </Col>
                    <Col lg={{ size: 1 }} />
                </Row>
                <Row className='rowStack'>
                    <Col xl={{ size: 6 }}>
                        <Row>
                            <Col lg={{ size: 1 }} xl={{ size: 2 }} />
                            <Col lg className='columnStack'>
                                <KPIComponent title={'Accounts Payable'} type={'money'} currentValue={857} previousValue={1000}/>
                            </Col>
                            <Col lg className='columnStack'>
                                <KPIComponent title={'Accounts Receivable'} type={'money'} currentValue={1672} previousValue={1000}/>
                            </Col>
                            <Col lg={{ size: 1 }} className='d-xl-none' />
                        </Row>
                        <Row className='rowStack'>
                            <Col lg={{ size: 1 }} xl={{ size: 2 }} />
                            <Col lg className='columnStack'>
                                <KPIComponent title={'Financial Autonomy'} type={'percentage'} currentValue={140} previousValue={126}/>
                            </Col >
                            <Col lg className='columnStack'>
                                <KPIComponent title={'General Liquidity'} type={'percentage'} currentValue={106} previousValue={102}/>
                            </Col>
                            <Col lg={{ size: 1 }} className='d-xl-none' />
                        </Row>
                    </Col>
                    <Col xl={{ size: 6 }}>
                        <Row>
                            <Col lg={{ size: 1 }} className='d-xl-none' />
                            <Col className='columnStack'>
                                <GraphComponent type={'line'} data={this.revenue} title={'Revenue History'} />
                            </Col>
                            <Col lg={{ size: 1 }} xl={{ size: 2 }} />
                        </Row>
                    </Col>
                </Row>
                <Row className='rowStack'>
                    <Col xl={{ size: 6 }}>
                        <Row>
                            <Col lg={{ size: 1 }} xl={{ size: 2 }} />
                            <Col className='columnStack'>
                                <GraphComponent type={'line'} data={this.costs} title={'Costs History'} />
                            </Col>
                            <Col lg={{ size: 1 }} className='d-xl-none' />
                        </Row>
                    </Col>
                    <Col xl={{ size: 6 }}>
                        <Row>
                            <Col lg={{ size: 1 }} className='d-xl-none' />
                            <Col className='lastElement'>
                                <GraphComponent type={'line'} data={this.income} title={'Income History'} />
                            </Col>
                            <Col lg={{ size: 1 }} xl={{ size: 2 }} />
                        </Row>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default FinancialDash;