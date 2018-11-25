import React, { Component } from 'react';
import { Row, Col } from 'reactstrap';
import '../App.css';
import '../styles/Common.style.css';
import CalendarSelector from '../components/CalendarSelector'
import LineGraphComponent from '../components/LineGraphComponent';
import KPIComponent from '../components/KPIComponent';

class FinancialDash extends Component {
    constructor(props) {
        super(props);

        this.state = {

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
                        <LineGraphComponent />
                    </Col>
                    <Col lg={{ size: 5 }}>
                        <LineGraphComponent />
                    </Col>
                </Row>
                <Row style={{ 'marginTop':'5vh' }} >
                    <Col lg={{ size: 5, offset: 1 }} className='columnStack'>
                        <LineGraphComponent />
                    </Col>
                    <Col lg={{ size: 5 }}>
                        <LineGraphComponent />
                    </Col>
                </Row>
                <Row style={{ 'marginTop':'5vh' }} >
                    <Col lg={{ size: 5, offset: 1 }} className='columnStack'>
                        <KPIComponent />
                    </Col>
                    <Col lg={{ size: 5 }}>
                        <KPIComponent />
                    </Col>
                </Row>
            </div>
        );
    }
}

export default FinancialDash;