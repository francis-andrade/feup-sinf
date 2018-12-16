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
            month: '1'

        };

        this.changeYear = this.changeYear.bind(this);
        this.changeMonth = this.changeMonth.bind(this);

        this.salesPerRegion = {
            labels: ['Portugal', 'Espanha', 'França'],
            datasets: [
                {
                    label: 'Amount',
                    fill: true,
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
                    data: [1593, 1602, 1759]
                }
            ]
        };

        this.topProducts = {
            labels: ['Category1', 'Category2', 'Category3'],
            datasets: [
                {
                    label: 'Quantity',
                    fill: true,
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
                    data: [1843, 1928, 2058]
                }
            ]
        };

        this.sales = {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            datasets: [
                {
                    label: 'Sales',
                    fill: true,
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
                    data: [1843, 1928, 2058, 2185, 1956, 1856, 2075]
                }
            ]
        };
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

    setSalesPerRegion(res){
        this.salesPerRegion.labels = res.map(function(a){
            return a[0];
        })
        this.salesPerRegion.datasets[0].data = res.map(function (a) {
            return a[1];
        });
    }

    setTopProductsSold(res){
        this.topProducts.labels = res.map(function(a){
            return a[1];
        })
        this.topProducts.datasets[0].data = res.map(function (a) {
            return a[2];
        });
    }

    setSalesPerMonth(res){
        this.sales.labels = res.map(function(a){
            return a[0];
        })
        this.sales.datasets[0].data = res.map(function (a) {
            return a[1];
        });
    }


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
            .then(res => this.setSalesPerRegion(res))

        //Get top product sales
        fetch('http://localhost:5000/api/TopProductsSold',{
            method: 'GET',
        })
            .then(response => response.json())
            .then(res => this.setTopProductsSold(res))

        //Get Sales Per Month
        fetch('http://localhost:5000/api/SalesPerMonth',{
            method: 'GET',
        })
            .then(response => response.json())
            .then(res => this.setSalesPerMonth(res))
    }


    render() {
        return (
            <div className='dashboardBackground'>
                <Row>
                    <Col md={{ size: 1 }} lg={{ size: 2 }} xl={{ size: 3 }}/>
                    <Col>
                        <TimeSelectorComponent year={this.state.year} month={this.state.month} changeYear={this.changeYear} changeMonth={this.changeMonth} />
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
                                <GraphComponent type={'pie'} data={this.salesPerRegion} title={'Sales per Region'} />
                            </Col>
                            <Col md={{ size: 1 }} className='d-xl-none' />
                        </Row>
                    </Col>
                    <Col xl={{ size: 6 }}>
                        <Row>
                            <Col md={{ size: 1 }} className='d-xl-none' />
                            <Col className='columnStack'>
                                <GraphComponent type={'horizontalBar'} data={this.topProducts} title={'Top Best Selling Products'} />
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
                                <GraphComponent type={'line'} data={this.sales} title={'Sales History'} />
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