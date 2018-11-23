import React, { Component } from 'react';
import { Row, Col } from 'reactstrap';
import '../App.css';
import '../styles/Common.style.css';
import CalendarSelector from '../components/CalendarSelector'
import LineGraphComponent from '../components/LineGraphComponent';

class FinancialDash extends Component {
    constructor(props) {
        super(props);

        this.state = {

        };
    }

    render() {
        return (
            <div>
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
            </div>
        );
    }
}

export default FinancialDash;