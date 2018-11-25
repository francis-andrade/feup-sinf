import React, { Component } from 'react';
import { Row, Col, Container } from 'reactstrap';
import { FaRegArrowAltCircleUp, FaRegArrowAltCircleDown } from 'react-icons/fa';

import '../styles/KPIComponent.style.css';
import '../styles/Common.style.css';

class KPIComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            growing: false,
        };
    }

    render() {
        return(
            <Container className='componentBackground'>
                <Row>
                    <Col>
                        <span className='kpiValue'>teste {this.state.growing? <FaRegArrowAltCircleUp style={{ color: 'green' }} /> : <FaRegArrowAltCircleDown style={{ color: 'red' }} />}</span>
                    </Col>
                </Row>
                <hr className='kpiHr'/>
                <Row>
                    <Col>
                        <span className='kpiTitle'>Sales Value</span>
                    </Col>
                </Row>
            </Container>
        )
    }
}

export default KPIComponent;