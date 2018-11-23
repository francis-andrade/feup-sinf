import React, { Component } from 'react';
import { Row, Col, Container } from 'reactstrap';

import '../styles/GraphComponent.style.css';
import '../styles/Common.style.css';

import { Line } from 'react-chartjs-2';

class LineGraphComponent extends Component {
    constructor(props) {
        super(props);

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
        return(
            <Container className='lineGraphContainer componentBackground'>
                <Row>
                    <Col className='lineGraphTitle'>
                        <span>Graph Title</span>
                    </Col>
                </Row>
                <Row>
                    <Col xs={{ size: 12 }} sm={{ size: 10, offset: 1 }} className='lineGraphCanvas'>
                        <Line data={this.data} options={{ maintainAspectRatio: false }} height='200' />
                    </Col>
                </Row>
            </Container>
        )
    }
}

export default LineGraphComponent;