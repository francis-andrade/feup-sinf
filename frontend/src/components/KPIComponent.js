import React, { Component } from 'react';
import { Row, Col, Container } from 'reactstrap';
import { FaRegArrowAltCircleUp, FaRegArrowAltCircleDown, FaRegArrowAltCircleRight } from 'react-icons/fa';
import Loader from 'react-loader-spinner';

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
        if(this.props.isClickable){
            this.setState(() => ({ expanded: !this.state.expanded }))
        }
    }

    formatNumber(number) {
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
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

        if (this.props.loading) {
            return(
                <Container className='kpiContainer componentBackground'>
                    <Row>
                        <Col className='loader'>
                            <Loader type='Oval' color='lightgray' width='40' height='40' />
                        </Col>
                    </Row>
                </Container>
            )
        } else {
            return(
                <Container className='kpiContainer componentBackground' onClick={this.click} style={{ height: this.state.expanded ? '55vh' : '22vh' }}>
                    <Row>
                        <Col>
                            <span className='kpiValue'>{this.props.type === 'money' ? '€' : ''} {this.formatNumber(Number(this.props.currentValue).toFixed(2))}{this.props.type === 'percentage' ? '%' : ' '}{this.props.unit} {icon}</span>
                        </Col>
                    </Row>
                    <hr className='kpiHr'/>
                    <Row>
                        <Col>
                            <span className='kpiTitle'>{this.props.title}</span>
                        </Col>
                    </Row>
                    {this.props.type === 'money' && this.props.previousValue !== 0 &&
                    <Row>
                        <Col>
                            <span className='kpiInfo'>{Number(((this.props.currentValue - this.props.previousValue) / this.props.previousValue * 100).toFixed(1))}% change from previous time frame</span>
                        </Col>
                    </Row>
                    }
                    <Row>
                        <Col sm={{ size: 1 }} className='d-xs-none' />
                        <Col sm>
                            {this.state.expanded && this.props.kpiExtraInfo}
                        </Col>
                        <Col sm={{ size: 1 }} className='d-xs-none' />
                    </Row>
                </Container>
            )
        }
    }
}

export default KPIComponent;