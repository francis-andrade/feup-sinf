import React, { Component } from 'react';
import { Row, Col, Container } from 'reactstrap';
import { FaRegArrowAltCircleUp, FaRegArrowAltCircleDown, FaRegArrowAltCircleRight } from 'react-icons/fa';

import '../styles/KPIComponent.style.css';
import '../styles/Common.style.css';

class KPIComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            expanded: false
        };

        this.click = this.click.bind(this)

    }

    click() {
        this.setState(() => ({ expanded: !this.state.expanded }))
    }

    render() {
        let icon;
        if (this.props.currentValue === this.props.previousValue) {
            icon = <FaRegArrowAltCircleRight style={{ color: 'orange' }} />
        } else if (this.props.currentValue > this.props.previousValue) {
            icon = <FaRegArrowAltCircleUp style={{ color: 'green' }} />
        } else if (this.props.currentValue < this.props.previousValue) {
            icon = <FaRegArrowAltCircleDown style={{ color: 'red' }} />
        }

        return(
            <Container className='kpiContainer componentBackground' onClick={this.click} style={{ height: this.state.expanded ? '55vh' : '22vh' }}>
                <Row>
                    <Col>
                        <span className='kpiValue'>{this.props.type === 'money' ? '€' : ''} {this.props.currentValue}{this.props.type === 'percentage' ? '%' : ''}{this.props.unit} {icon}</span>
                    </Col>
                </Row>
                <hr className='kpiHr'/>
                <Row>
                    <Col>
                        <span className='kpiTitle'>{this.props.title}</span>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <span className='kpiInfo'>{Number(((this.props.currentValue - this.props.previousValue) / this.props.previousValue * 100).toFixed(1))}% change from previous time frame</span>
                    </Col>
                </Row>
                {this.state.expanded && 'aaaaaa'}
            </Container>
        )
    }
}

export default KPIComponent;