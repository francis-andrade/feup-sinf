import React, { Component } from 'react';
import { Row, Col } from 'reactstrap';
import TimeSelectorComponent from '../components/TimeSelectorComponent';
import GraphComponent from '../components/GraphComponent';
import KPIComponent from '../components/KPIComponent';
import '../App.css';
import '../styles/Common.style.css';

class SalesDash extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            year: '',
            month: '0',

            salesValue: [0, 0],
            salesValueLoaded: false,
            
            backlogValue : [0, 0],
            backlogValueLoaded: false,

        
            salesPerRegion : {
                labels: ['Portugal', 'Espanha', 'França'],
                datasets: [
                    {
                        label: 'Amount',
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
            salesPerRegionLoaded: false,

            topProducts : {
                labels: ['Product1', 'Product2', 'Product3'],
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
            topProductsLoaded: false,

            sales : {
                labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July',  'August', 'September', 'October', 'November', 'December'],
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
            salesLoaded: false,
        };

        
        this.setYear = this.setYear.bind(this);
        this.changeYear = this.changeYear.bind(this);
        this.changeMonth = this.changeMonth.bind(this);
        this.updateYear = this.updateYear.bind(this);
    }

    setYear(value) {
        this.setState({
            year: value
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
        this.update();

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
        })

        this.update();
    }

    update(){
        //Get Sales Value
        if (!this.state.salesValueLoaded){
            fetch('http://localhost:5000/api/salesValue', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    month: this.state.month,
                })
            })
                .then(response => response.json())
                .then(data => this.setState({
                    salesValue : data,
                    salesValueLoaded : true,
                }))
        }
        
        //Get Backlog Value
        if (!this.state.backlogValueLoaded){
          fetch('http://localhost:5000/api/backlogValue', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                month: this.state.month,
            })
        })
            .then(response => response.json())
            .then(data => this.setState({
                backlogValue : data,
                backlogValueLoaded : true,
            }))  
        }

         //Get Sales By Country
         if (!this.state.salesPerRegionLoaded){
            fetch('http://localhost:5000/api/SalesByCountry',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    month: this.state.month,
                })
            })
                .then(response => response.json())
                .then(data => {
                    let newState = Object.assign({}, this.state);
                    newState.salesPerRegion.labels = data.map(function(a){
                        return a[0];
                    });
                    newState.salesPerRegion.datasets[0].data = data.map(function(a){
                        return Math.round(a[1] * 100) /100;
                    });
                    newState.salesPerRegionLoaded = true;
                    this.setState(newState);        
                });    
         }
         

        //Get top product sales
        if (!this.state.topProductsLoaded){
            fetch('http://localhost:5000/api/TopProductsSold',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    month: this.state.month,
                })
            })
                .then(response => response.json())
                .then(data => {
                    let newState = Object.assign({}, this.state);
                    newState.topProducts.labels = data.map(function(a){
                        return a[1];
                    });
                    newState.topProducts.datasets[0].data = data.map(function(a){
                        return Math.round(a[2] * 100) /100;
                    });
                    newState.topProductsLoaded = true;
                    this.setState(newState);          
                });    
        }
        

        //Get Sales Per Month
        if (!this.state.salesLoaded){
            fetch('http://localhost:5000/api/SalesPerMonth',{
                method: 'POST',
            })
                .then(response => response.json())
                .then(data => {
                    let newState = Object.assign({}, this.state);
                    newState.sales.labels = data.map(function(a){
                        return a[0];
                    });
                    newState.sales.datasets[0].data = data.map(function(a){
                        return Math.round(a[1] * 100) /100;
                    });
                    newState.salesLoaded = true;
                    this.setState(newState);         
                });    
        }
        
    }

    componentDidMount(){
        this.update();
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
                        <KPIComponent title={'Sales Value'} type={'money'} currentValue={this.state.salesValue[0]} previousValue={this.state.salesValue[1]} loading={!this.state.salesLoaded} />
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