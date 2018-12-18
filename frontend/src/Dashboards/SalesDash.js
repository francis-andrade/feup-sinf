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
            year: '2018',
            month: '1',
            
            backlogValue : 10,

        
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
            }
        };

        
        this.setYear = this.setYear.bind(this);
        this.changeYear = this.changeYear.bind(this);
        this.changeMonth = this.changeMonth.bind(this);
    }

    setYear(value) {
        this.setState({
            year: value
        })
    }

    changeYear = (value) => {
        this.setState({
            year: value
        })
    }

    changeMonth = (value) => {
        this.setState({
            month: value
        })
    }

    /*setSalesPerRegion(res){
        this.setState(salesPerRegion.labels = res.map(function(a){
            return a[0];
        }));
        this.setState(salesPerRegion.datasets[0].data = res.map(function (a) {
            return a[1];
        }));

    }

    setTopProductsSold(res){
        this.state.topProducts.labels = res.map(function(a){
            return a[1];
        })
        this.state.topProducts.datasets[0].data = res.map(function (a) {
            return a[2];
        });
    }

    setSalesPerMonth(res){
        this.state.sales.labels = res.map(function(a){
            return a[0];
        })
        this.state.sales.datasets[0].data = res.map(function (a) {
            return a[1];
        });
    }*/

    componentDidMount(){

        //Get Backlog Value
        fetch('http://localhost:5000/api/backlogValue', {
            method: 'GET',
        })
            .then(response => response.json())
            .then(data => this.setState({backlogValue : data}))
        
            //Get Sales By City
        fetch('http://localhost:5000/api/SalesByCity',{
            method: 'GET',
        })
            .then(response => response.json())
            .then(data => {
                let newState = Object.assign({}, this.state);
                newState.salesPerRegion.labels = data.map(function(a){
                    return a[0];
                });
                newState.salesPerRegion.datasets[0].data = data.map(function(a){
                    return a[1];
                });
                this.setState(newState);  
                console.log(this.state);        
            });

        //Get top product sales
        fetch('http://localhost:5000/api/TopProductsSold',{
            method: 'GET',
        })
            .then(response => response.json())
            .then(data => {
                let newState = Object.assign({}, this.state);
                newState.topProducts.labels = data.map(function(a){
                    return a[1];
                });
                newState.topProducts.datasets[0].data = data.map(function(a){
                    return a[2];
                });
                this.setState(newState);  
                console.log(this.state);        
            });

        //Get Sales Per Month
        fetch('http://localhost:5000/api/SalesPerMonth',{
            method: 'GET',
        })
            .then(response => response.json())
            .then(data => {
                let newState = Object.assign({}, this.state);
                newState.sales.labels = data.map(function(a){
                    return a[0];
                });
                newState.sales.datasets[0].data = data.map(function(a){
                    return a[1];
                });
                this.setState(newState);  
                console.log(this.state);        
            });
    }


    render(){
        return (
            <div className='dashboardBackground'>
                <Row>
                    <Col md={{ size: 1 }} lg={{ size: 2 }} xl={{ size: 3 }}/>
                    <Col>
                        <TimeSelectorComponent year={this.state.year} month={this.state.month} setYear={this.setYear} changeYear={this.changeYear} changeMonth={this.changeMonth} />
                    </Col>
                    <Col md={{ size: 1 }} lg={{ size: 2 }} xl={{ size: 3 }}/>
                </Row>
                <Row style={{ 'marginTop': '5vh' }}>
                    <Col xs={{ size: 1 }} />
                    <Col md={{ size: 5 }} xl className='columnStack'>
                        <KPIComponent title={'Sales Value'} type={'money'} currentValue={1645} previousValue={1000}/>
                    </Col>
                    <Col md={{ size: 5 }} xl className='columnStack'>
                        <KPIComponent title={'Expected Orders Value'} type={'money'} currentValue={this.state.backlogValue} previousValue={1000}/>
                    </Col>
                    <Col xs={{ size: 1 }} className='d-xl-none'/>
                    <Col xs={{ size: 1 }} md className='d-xl-none'/>
                    {/* <Col md={{ size: 5 }} xl className='columnStack'>
                        <KPIComponent title={'Sales Growth'} type={'percentage'} currentValue={2075} previousValue={1000}/>
                    </Col> */}
                    <Col md className='d-xl-none columnStack' />
                    <Col xl={{ size: 1 }} />
                </Row>
                <Row className='rowStack'>
                    <Col xl={{ size: 6 }}>
                        <Row>
                            <Col md={{ size: 1 }} xl={{ size: 2 }} />
                            <Col className='columnStack'>
                                <GraphComponent type={'pie'} data={this.state.salesPerRegion} title={'Sales per Region'} yearly={false} />
                            </Col>
                            <Col md={{ size: 1 }} className='d-xl-none' />
                        </Row>
                    </Col>
                    <Col xl={{ size: 6 }}>
                        <Row>
                            <Col md={{ size: 1 }} className='d-xl-none' />
                            <Col className='columnStack'>
                                <GraphComponent type={'horizontalBar'} data={this.state.topProducts} title={'Top Best Selling Products'} yearly={false} />
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
                                <GraphComponent type={'line'} data={this.state.sales} title={'Sales History'} yearly={true} />
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