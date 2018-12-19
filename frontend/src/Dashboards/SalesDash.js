import React, { Component } from 'react';
import { Row, Col } from 'reactstrap';
import TimeSelectorComponent from '../components/TimeSelectorComponent';
import GraphComponent from '../components/GraphComponent';
import KPIComponent from '../components/KPIComponent';
import '../App.css';
import '../styles/Common.style.css';
import { graphBorderColors, graphFillColors } from '../constants/GraphConstants';

class SalesDash extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            year: '',
            month: '0',

            salesValue: [0, 0],
            salesValueLoaded: false,
            backlogValue : [100, 0],
            backlogValueLoaded: false,

        
            salesPerRegion : {
                labels: [],
                datasets: [
                    {
                        label: 'Amount (€)',
                        fill: true,
                        backgroundColor: [],
                        borderColor: [],
                        data: []
                    }
                ]
            },
            salesPerRegionLoaded: false,

            topProducts : {
                labels: [],
                datasets: [
                    {
                        label: 'Amount (€)',
                        fill: true,
                        backgroundColor: graphFillColors[0],
                        borderColor: graphBorderColors[0],
                        data: []
                    }
                ]
            },
            topProductsLoaded: false,

            sales : {
                labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July',  'August', 'September', 'October', 'November', 'December'],
                datasets: [
                    {
                        label: 'Amount (€)',
                        fill: true,
                        backgroundColor: graphFillColors[0],
                        borderColor: graphBorderColors[0],
                        pointBorderColor: graphBorderColors[0],
                        pointBackgroundColor: '#fff',
                        pointHoverBackgroundColor: graphBorderColors[0],
                        pointHoverBorderColor: graphBorderColors[0],
                        data: []
                    }
                ]
            },
            salesLoaded: false,
        };

        
        this.setYear = this.setYear.bind(this);
        this.changeYear = this.changeYear.bind(this);
        this.changeMonth = this.changeMonth.bind(this);
        this.updateYear = this.updateYear.bind(this);
    }

    setYear(value) {
        this.setState({
            year: value,
            salesValueLoaded: false,
            backlogValueLoaded: false,
            salesPerRegionLoaded: false,
            topProductsLoaded: false,
            salesLoaded: false,
        })
    }

    changeYear = (value) => {
        this.setState({
            year: value,
            salesValueLoaded: false,
            backlogValueLoaded: false,
            salesPerRegionLoaded: false,
            topProductsLoaded: false,
            salesLoaded: false,
        })
        this.updateYear(value);

        setTimeout(
            function() {
                this.update(this.state.month);
            }
            .bind(this),
            100
        );

    }

    async updateYear(value){
        await this.updateYearFetch(value);
    }

    updateYearFetch(value) {
        return fetch('http://localhost:5000/api/updateYear', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                year: value
            })
        })
    }

    changeMonth = (value) => {
        this.setState({
            month: value,
            salesValueLoaded: false,
            backlogValueLoaded: false,
            salesPerRegionLoaded: false,
            topProductsLoaded: false,
            salesLoaded: false,
        })

        setTimeout(
            function() {
                this.update(value);
            }
            .bind(this),
            100
        );
    }


    async update(m){

        let salesVal = await this.requestServer('http://localhost:5000/api/salesValue', m);
        let backlogVal = await this.requestServer('http://localhost:5000/api/backlogValue', m);
        let salesByReg = await this.requestServer('http://localhost:5000/api/SalesByCountry', m);
        let topProd = await this.requestServer('http://localhost:5000/api/TopProductsSold', m);
        let salesMon = await this.requestServer('http://localhost:5000/api/SalesPerMonth', m);

        let newState = Object.assign({}, this.state);
        newState.salesValue = salesVal;
        newState.backlogValue = backlogVal;
        newState.salesPerRegion.labels = salesByReg.map(function(a){
            return a[0];
        });
        newState.salesPerRegion.datasets[0].data = salesByReg.map(function(a){
            return Math.round(a[1] * 100) /100;
        });
        newState.topProducts.labels = topProd.map(function(a){
            return a[1];
        });
        newState.topProducts.datasets[0].data = topProd.map(function(a){
            return Math.round(a[2] * 100) /100;
        });
        newState.sales.labels = salesMon.map(function(a){
            return a[0];
        });
        newState.sales.datasets[0].data = salesMon.map(function(a){
            return Math.round(a[1] * 100) /100;
        });

        for(let i = 0; i < newState.salesPerRegion.labels.length; i++){
            newState.salesPerRegion.datasets[0].backgroundColor.push(graphFillColors[i+1])
            newState.salesPerRegion.datasets[0].borderColor.push(graphBorderColors[i+1])
        }

        newState.salesValueLoaded = true;
        newState.backlogValueLoaded = true;
        newState.salesPerRegionLoaded = true;
        newState.topProductsLoaded = true;
        newState.salesLoaded = true;

        this.setState(newState);
    }

    async requestServer(URL, m) {
        const response = await fetch(URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                month: m,
            })
        })

        const json = await response.json();
        return json;
    }

    componentDidMount(){
        this.updateYear('2018');
        this.update(0);
    }


    render() {
        console.log(this.state);
        return (
            <div className='dashboardBackground'>
                <Row>
                    <Col md={{ size: 1 }} lg={{ size: 2 }} xl={{ size: 3 }}/>
                    <Col>
                        <TimeSelectorComponent year={this.state.year} month={this.state.month} setYear={this.setYear} updateYear={this.updateYear} changeYear={this.changeYear} changeMonth={this.changeMonth} />
                    </Col>
                    <Col md={{ size: 1 }} lg={{ size: 2 }} xl={{ size: 3 }}/>
                </Row>
                <Row style={{ 'marginTop': '5vh' }}>
                    <Col xs={{ size: 1 }} />
                    <Col md={{ size: 5 }} xl className='columnStack'>
                        <KPIComponent title={'Sales Value'} type={'money'} currentValue={this.state.salesValue[0]} previousValue={this.state.salesValue[1]} loading={!this.state.salesValueLoaded} />
                    </Col>
                    <Col md={{ size: 5 }} xl className='columnStack'>
                        <KPIComponent title={'Expected Orders Value'} type={'money'} currentValue={this.state.backlogValue[0]} previousValue={this.state.backlogValue[1]} loading={!this.state.backlogValueLoaded} />
                    </Col>
                    <Col xl={{ size: 1 }} />
                </Row>
                <Row className='rowStack'>
                    <Col xl={{ size: 6 }}>
                        <Row>
                            <Col md={{ size: 1 }} xl={{ size: 2 }} />
                            <Col className='columnStack'>
                                <GraphComponent type={'pie'} data={this.state.salesPerRegion} title={'Sales per Region'} yearly={false} loading={!this.state.salesPerRegionLoaded} />
                            </Col>
                            <Col md={{ size: 1 }} className='d-xl-none' />
                        </Row>
                    </Col>
                    <Col xl={{ size: 6 }}>
                        <Row>
                            <Col md={{ size: 1 }} className='d-xl-none' />
                            <Col className='columnStack'>
                                <GraphComponent type={'horizontalBar'} data={this.state.topProducts} title={'Top Best Selling Products'} yearly={false} loading={!this.state.topProductsLoaded} />
                            </Col>
                            <Col md={{ size: 1 }} xl={{ size: 2 }} />
                        </Row>
                    </Col>
                </Row>
                <Row className='rowStack'>
                    <Col>
                        <Row>
                            <Col md={{ size: 1 }} xl={{ size: 2 }} />
                            <Col className='lastElement'>
                                <GraphComponent type={'line'} data={this.state.sales} title={'Sales History'} yearly={true} loading={!this.state.salesLoaded} />
                            </Col>
                            <Col md={{ size: 1 }} xl={{ size: 2 }} />
                        </Row>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default SalesDash;