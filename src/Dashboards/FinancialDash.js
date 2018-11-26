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

        this.data = {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            datasets: [
                {
                    label: 'My First dataset',
                    fill: false,
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
                    data: [65, 59, 80, 81, 56, 55, 40]
                }
            ]
        };
    }

    render() {
        return (
            <div className='dashboardBackground'>
                <Row>
                    <Col>
                        <CalendarSelector />
                    </Col>
                </Row>
                <Row style={{ 'marginTop':'5vh' }} >
                    <Col lg={{ size: 5, offset: 1 }} className='columnStack'>
                        <GraphComponent type={'pie'} data={this.data} height={'200'} title={'Graph Title'} />
                    </Col>
                    <Col lg={{ size: 5 }}>
                        <GraphComponent type={'line'} data={this.data} height={'200'} title={'Graph Title1'} />
                    </Col>
                </Row>
                <Row style={{ 'marginTop':'5vh' }} >
                    <Col lg={{ size: 5, offset: 1 }} className='columnStack'>
                        <GraphComponent type={'line'} data={this.data} height={'200'} title={'Graph Title2'} />
                    </Col>
                    <Col lg={{ size: 5 }}>
                        <GraphComponent type={'line'} data={this.data} height={'200'} title={'Graph Title3'} />
                    </Col>
                </Row>
                <Row style={{ 'marginTop':'5vh' }} >
                    <Col lg={{ size: 5, offset: 1 }} className='columnStack'>
                        <KPIComponent title={'KPI Title'} />
                    </Col>
                    <Col lg={{ size: 5 }}>
                        <KPIComponent title={'KPI Title'} />
                    </Col>
                </Row>
            </div>
        );
    }
}

export default FinancialDash;