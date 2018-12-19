import React, { Component } from 'react';
import { Row, Col } from 'reactstrap';
import TimeSelectorComponent from '../components/TimeSelectorComponent';
import GraphComponent from '../components/GraphComponent';
import KPIComponent from '../components/KPIComponent';

import '../App.css';
import '../styles/Common.style.css';

class GenericDash extends Component {
    constructor(props) {
        super(props);

        this.state = {
            year: '',
            month: '0',
            topProducts : {
                labels: ['Category1', 'Category2', 'Category3'],
                datasets: [
                    {
                        label: 'Quantity',
                        fill: true,
                        backgroundColor: 'rgba(75,192,192,0.4)',
                        borderColor: 'rgba(75,192,192,1)',
                        pointBorderColor: 'rgba(75,192,192,1)',
                        pointBackgroundColor: '#fff',
                        pointHoverBackgroundColor: 'rgba(75,192,192,1)',
                        pointHoverBorderColor: 'rgba(220,220,220,1)',
                        data: []
                    }
                ]
            },
            topProductsLoading : true,
    
            sales : {
                labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                datasets: [
                    {
                        label: 'Income',
                        fill: true,
                        backgroundColor: 'rgba(75,192,192,0.4)',
                        borderColor: 'rgba(75,192,192,1)',
                        pointBorderColor: 'rgba(75,192,192,1)',
                        pointBackgroundColor: '#fff',
                        pointHoverBackgroundColor: 'rgba(75,192,192,1)',
                        pointHoverBorderColor: 'rgba(220,220,220,1)',
                        data: []
                    }
                ]
            },
            salesLoading : true,



        };

        this.setYear = this.setYear.bind(this);
        this.changeYear = this.changeYear.bind(this);
        this.changeMonth = this.changeMonth.bind(this);
        this.updateYear = this.updateYear.bind(this);

        
    }

    setYear(value) {
        this.setState({
            year: value,
            topProductsLoading: false,
            salesLoading: false,
        })

        this.updateYear(value);
        this.updateSales(this.state.month);
    }

    changeYear = (value) => {
        this.setState({
            year: value,
            topProductsLoading: false,
            salesLoading: false,
        })

        this.updateYear(value);
        this.updateSales(this.state.month);
    }

    changeMonth = (value) => {
        this.setState({
            month: value,
            topProductsLoading: false,
            salesLoading: false,
        })

        this.updateSales(value);
    }

    async updateYear() {
        await this.updateYearFetch(value);
    }

    async updateSales(m) {
        let salesHist = await this.requestServer('http://localhost:5000/api/SalesPerMonth', m);
        let topProd = await this.requestSales('http://localhost:5000/api/TopProductsSold', m);
        
        let newState = Object.assign({}, this.state);
        newState.sales.labels = salesMon.map(function(a){
            return a[0];
        });
        newState.sales.datasets[0].data = salesMon.map(function(a){
            return Math.round(a[1] * 100) /100;
        });
        newState.topProducts.labels = topProd.map(function(a){
            return a[1];
        });
        newState.topProducts.datasets[0].data = topProd.map(function(a){
            return Math.round(a[2] * 100) /100;
        });
        newState.salesLoading = false;
        newState.topProductsLoading = false;
        this.setState(newState);
    }

    async requestSales(URL) {
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

    render() {
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
                        <KPIComponent title={'Sales Value'} type={'money'} currentValue={1645} previousValue={1000}/>
                    </Col>
                    <Col md={{ size: 5 }} xl className='columnStack'>
                        <KPIComponent title={'Purchases Value'} type={'money'} currentValue={834} previousValue={1000}/>
                    </Col>
                    <Col xs={{ size: 1 }} className='d-xl-none'/>
                    <Col xs={{ size: 1 }} md className='d-xl-none'/>
                    <Col md={{ size: 5 }} xl className='columnStack'>
                        <KPIComponent title={'Total Revenue'} type={'money'} currentValue={2075} previousValue={1000}/>
                    </Col>
                    <Col md className='d-xl-none' />
                    <Col xl={{ size: 1 }} />
                </Row>
                <Row className='rowStack'>
                    <Col xs={{ size: 1 }} />
                    <Col md className='columnStack'>
                        <KPIComponent title={'Financial Autonomy'} type={'percentage'} currentValue={1645} previousValue={1000}/>
                    </Col>
                    <Col md className='columnStack'>
                        <KPIComponent title={'Inventory Value'} type={'money'} currentValue={834} previousValue={1000}/>
                    </Col>
                    <Col xs={{ size: 1 }} />
                </Row>
                <Row className='rowStack'>
                    <Col xl={{ size: 6 }}>
                        <Row>
                            <Col md={{ size: 1 }} xl={{ size: 2 }} />
                            <Col className='columnStack'>
                                <GraphComponent type={'line'} data={this.sales} title={'Sales History'} yearly={true} loading={this.state.salesLoading} />
                            </Col>
                            <Col md={{ size: 1 }} className='d-xl-none' />
                        </Row>
                    </Col>
                    <Col xl={{ size: 6 }}>
                        <Row>
                            <Col md={{ size: 1 }} className='d-xl-none' />
                            <Col className='lastElement'>
                                <GraphComponent type={'horizontalBar'} data={this.topProducts} title={'Top Best Selling Products'} yearly={false} loading={this.state.topProductsLoading} />
                            </Col>
                            <Col md={{ size: 1 }} xl={{ size: 2 }} />
                        </Row>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default GenericDash;