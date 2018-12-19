import React, { Component } from 'react';
import { Row, Col, Container } from 'reactstrap';
import Loader from 'react-loader-spinner';

import '../styles/GraphComponent.style.css';
import '../styles/Common.style.css';

import { Line, Bar, Radar, Doughnut, Pie, Polar, Bubble, HorizontalBar, Scatter } from 'react-chartjs-2';

class GraphComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            expanded: false
        }

        this.graph = null;
        this.click = this.click.bind(this);
        this.selectGraph = this.selectGraph.bind(this);
        this.selectGraph(this.props.data);
    }

    selectGraph(data) {
        switch(this.props.type){
            case 'line':
                this.graph = <Line data={data} options={{ maintainAspectRatio: false }} height={this.props.height} />;
                break;
            case 'bar':
                this.graph = <Bar data={data} options={{ maintainAspectRatio: false }} height={this.props.height} />;
                break;
            case 'radar':
                this.graph = <Radar data={data} options={{ maintainAspectRatio: false }} height={this.props.height} />;
                break;
            case 'doughnut':
                this.graph = <Doughnut data={data} options={{ maintainAspectRatio: false }} height={this.props.height} />;
                break;
            case 'pie':
                this.graph = <Pie data={data} options={{ maintainAspectRatio: false }} height={this.props.height} />;
                break;
            case 'polar':
                this.graph = <Polar data={data} options={{ maintainAspectRatio: false }} height={this.props.height} />;
                break;
            case 'bubble':
                this.graph = <Bubble data={data} options={{ maintainAspectRatio: false }} height={this.props.height} />;
                break;
            case 'horizontalBar':
                this.graph = <HorizontalBar data={data} options={{ maintainAspectRatio: false }} height={this.props.height} />;
                break;
            case 'scatter':
                this.graph = <Scatter data={data} options={{ maintainAspectRatio: false }} height={this.props.height} />;
                break;
            default:
                break;
        }
        console.log(data)
    }

    click = () => {
        if(this.props.isClickable){
            this.setState(() => ({ expanded: !this.state.expanded }), function() {
                if(this.state.expanded){
                    this.selectGraph(this.props.extraData)
                    this.setState(() => this.state)
                } else {
                    this.selectGraph(this.props.data)
                    this.setState(() => this.state)
                }
            })
        }
    }

    render() {
        if(this.props.loading){
            return(
                <Container className='graphContainer componentBackground' onClick={this.click}>
                    <Row>
                        <Col className='graphTitle'>
                            <span>{this.props.title}</span>
                        </Col>
                    </Row>
                    <Row>
                        <Col className='graphSubtitle'>
                            <span>{this.props.yearly ? 'Yearly' : 'Periodic'} Analysis</span>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={{ size: 12 }} sm={{ size: 10, offset: 1 }} className='graphLoader'>
                            <Loader type='Oval' color='lightgray' width='40' height='40' /> 
                        </Col>
                    </Row>
                </Container>
            )
        } else {
            return(
                <Container className='graphContainer componentBackground' onClick={this.click}>
                    <Row>
                        <Col className='graphTitle'>
                            <span>{this.props.title}</span>
                        </Col>
                    </Row>
                    <Row>
                        <Col className='graphSubtitle'>
                            <span>{this.props.yearly ? 'Yearly' : 'Periodic'} Analysis</span>
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
}

export default GraphComponent;