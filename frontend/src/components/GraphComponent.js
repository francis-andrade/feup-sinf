import React, { Component } from 'react';
import { Row, Col, Container } from 'reactstrap';

import '../styles/GraphComponent.style.css';
import '../styles/Common.style.css';

import { Line, Bar, Radar, Doughnut, Pie, Polar, Bubble, HorizontalBar, Scatter } from 'react-chartjs-2';

class GraphComponent extends Component {
    constructor(props) {
        super(props);

        this.graph = null;
        this.selectGraph();
    }

    selectGraph() {
        switch(this.props.type){
            case 'line':
                this.graph = <Line data={this.props.data} options={{ maintainAspectRatio: false }} height={this.props.height} />;
                break;
            case 'bar':
                this.graph = <Bar data={this.props.data} options={{ maintainAspectRatio: false }} height={this.props.height} />;
                break;
            case 'radar':
                this.graph = <Radar data={this.props.data} options={{ maintainAspectRatio: false }} height={this.props.height} />;
                break;
            case 'doughnut':
                this.graph = <Doughnut data={this.props.data} options={{ maintainAspectRatio: false }} height={this.props.height} />;
                break;
            case 'pie':
                this.graph = <Pie data={this.props.data} options={{ maintainAspectRatio: false }} height={this.props.height} />;
                break;
            case 'polar':
                this.graph = <Polar data={this.props.data} options={{ maintainAspectRatio: false }} height={this.props.height} />;
                break;
            case 'bubble':
                this.graph = <Bubble data={this.props.data} options={{ maintainAspectRatio: false }} height={this.props.height} />;
                break;
            case 'horizontalBar':
                this.graph = <HorizontalBar data={this.props.data} options={{ maintainAspectRatio: false }} height={this.props.height} />;
                break;
            case 'scatter':
                this.graph = <Scatter data={this.props.data} options={{ maintainAspectRatio: false }} height={this.props.height} />;
                break;
            default:
                break;
        }
    }

    render() {
        return(
            <Container className='graphContainer componentBackground'>
                <Row>
                    <Col className='graphTitle'>
                        <span>{this.props.title}</span>
                    </Col>
                </Row>
                <Row>
                    <Col xs={{ size: 12 }} sm={{ size: 10, offset: 1 }} className='graphCanvas'>
                       {this.graph} 
                    </Col>
                </Row>
            </Container>
        )
    }
}

export default GraphComponent;