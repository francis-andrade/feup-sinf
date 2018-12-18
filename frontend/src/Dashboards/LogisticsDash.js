import React, { Component } from 'react';
import { Row, Col, Table } from 'reactstrap';
import TimeSelectorComponent from '../components/TimeSelectorComponent';
import GraphComponent from '../components/GraphComponent';
import KPIComponent from '../components/KPIComponent';
import '../App.css';
import '../styles/Common.style.css';

class LogisticsDash extends Component {
    constructor(props) {
        super(props);

        this.state = {
            authentication: {},
            shipments: {},
            year: '',
            month: '0',

            previousInventory: 1000,
            currentInventory: 1645,
            currentInventoryLoading: true,
            previousInventoryPeriod: 1000,
            currentInventoryPeriod: 834,
            currentInventoryPeriodLoading: true,
            previousShipmentsValue: '1000',
            currentShipmentsValue: '2075',
            currentShipmentsValueLoading: true,

            deliveryStatus: {
                labels: ['Delivered', 'Not Delivered'],
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
            deliveryStatusLoading: true,
            destinations: {
                labels: [],
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
            destinationsLoading: true,

            purchasedProducts: [
                {
                    name: 'Produto1',
                    quantity: '10'
                }, 
                {
                    name: 'Produto2',
                    quantity: '12'
                }, 
                {
                    name: 'Produto3',
                    quantity: '14'
                }, 
                {
                    name: 'Produto4',
                    quantity: '17'
                }, 
            ]
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
            year: value
        })

        this.updateYear(value);
    }

    async updateYear(value) {

        await this.updateYearFetch(value);
        this.updateInventory(value);
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
            month: value
        })
    }

    // Update inventory with selected year
    updateInventory(value) {
        this.getInventory();
        this.getInventoryPeriod();
    }

    /*listArticles() {
      fetch('http://localhost:2018/WebApi/Base/Artigos/LstArtigos',
          {
              headers: {
                  'Authorization' : `Bearer ${this.state.authentication['access_token']}`,
                  'Accept': 'application/json'
              }
          })
          .then(response => response.json())
          .then(data => this.setState({ artigos: data }));*/

    getInventory() {
        fetch('http://localhost:5000/api/inventory',
            {

                method: "GET",

            })
            .then(response => response.json())
            .then(data => {
                this.setState({ currentInventory: data.toFixed(0), currentInventoryLoading: false });

            });
    }

    getInventoryPeriod() {
        fetch('http://localhost:5000/api/inventoryPeriod',
            {

                method: "GET",

            })
            .then(response => response.json())
            .then(data => {
                this.setState({ currentInventoryPeriod: data.toFixed(0), currentInventoryPeriodLoading: false });
                console.log(this.state)

            });
    }

    getShipments() {
        fetch('http://localhost:2018/WebApi/Administrador/Consulta',
            {

                method: "POST",
                body: JSON.stringify("SELECT LinhasDoc.Artigo As ArtigoName, CabecDoc.Pais AS Pais, LinhasDocStatus.EstadoTrans AS linhasTrans, CabecDocStatus.Estado AS cabecTrans, CabecDoc.Data As Data, LinhasDoc.PrecUnit, LinhasDoc.DataEntrega, (LinhasDocStatus.Quantidade * LinhasDoc.FactorConv) Quantidade FROM CabecDoc INNER JOIN LinhasDoc ON CabecDoc.Id = LinhasDoc.IdCabecDoc INNER JOIN CabecDocStatus ON CabecDoc.ID=CabecDocStatus.IdCabecDoc INNER JOIN LinhasDocStatus ON LinhasDoc.ID=LinhasDocStatus.IdLinhasDoc INNER JOIN DocumentosVenda ON CabecDoc.TipoDoc=DocumentosVenda.Documento INNER JOIN Artigo ON LinhasDoc.Artigo=Artigo.Artigo WHERE CabecDoc.Filial='000' AND DocumentosVenda.TipoDocumento=2 AND CabecDoc.TipoEntidade='C' AND CabecDoc.TipoDoc IN ('','ECL') AND ((LinhasDoc.TipoLinha>='10' AND LinhasDoc.TipoLinha<='29') OR LinhasDoc.TipoLinha='65' OR LinhasDoc.TipoLinha='91')  AND CabecDocStatus.Anulado=0  ORDER BY LinhasDoc.DataEntrega")
                ,
                headers: {
                    'Authorization': `Bearer ${this.state.authentication['access_token']}`,
                    'Content-Type': 'application/json'
                },
            })
            .then(response => response.json())
            .then(data => {
                this.setState({ shipments: data["DataSet"]["Table"] });
                this.updateShipmentValue(data["DataSet"]["Table"]);
                this.updateDeliveryStatus(data["DataSet"]["Table"]);
                this.updateDeliveriesDestinations(data["DataSet"]["Table"]);
            });
    }

    updateShipmentValue(table) {
        let shipmentsValue = 0
        for (let index = 0; index < table.length; index++) {
            shipmentsValue += table[index]["Quantidade"] * table[index]["PrecUnit"]
        }

        this.setState({ currentShipmentsValue: shipmentsValue.toFixed(0), currentShipmentsValueLoading: false })
    }

    updateDeliveryStatus(table) {
        let delivered = 0
        let notDelivered = 0
        for (let index = 0; index < table.length; index++) {
            if (table[index]['linhasTrans'] === "T" && table[index]['cabecTrans'] === "T") {
                notDelivered++
            }
            else {
                delivered++
            }
        }


        let deliveryStatusState = this.state["deliveryStatus"]
        deliveryStatusState["datasets"][0]["data"] = [delivered, notDelivered]
        this.setState({ deliveryStatus: deliveryStatusState, deliveryStatusLoading: false })
    }

    updateDeliveriesDestinations(table) {
        let countries = []
        let countriesIndex = []
        let countriesCount = []

        for (let index = 0; index < table.length; index++) {
            let country = table[index]["Pais"]
            if (countriesIndex[country] == null) {
                countriesIndex[country] = countries.length
                countries.push(country)
                countriesCount.push(1)
            }
            else {
                countriesCount[countriesIndex[country]]++
            }
        }

        let destinationsState = this.state["destinations"]

        destinationsState["labels"] = countries
        destinationsState["datasets"][0]["data"] = countriesCount

        this.setState({ destinations: destinationsState, destinationsLoading: false })
    }

    componentDidMount() {

        let requestBody = {
            username: 'FEUP',
            password: 'qualquer1',
            company: 'demo',
            instance: 'DEFAULT',
            line: 'professional',
            grant_type: 'password'
        };

        let formData = new URLSearchParams();
        for (var key in requestBody) {
            formData.append(key, requestBody[key]);
        }

        fetch('http://localhost:2018/WebApi/token', {
            method: 'POST',
            body: formData,
        })
            .then(response => response.json())
            .then(data => this.setState({ authentication: data }))
            .then(this.getShipments.bind(this));

        this.updateInventory(this.state.year);
    }

    render() {
        let productsTable = [];

        for(let i = 0; i < this.state.purchasedProducts.length; i++) {
            productsTable.push(<tr key={i}>
                                    <th scope="row">{this.state.purchasedProducts[i].name}</th>
                                    <td>{this.state.purchasedProducts[i].quantity}</td>
                                </tr>)
        }

        console.log(productsTable)

        let purchaseValueTable = 
        <Table hover className='kpiExtraInfo'>
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Quantity</th>
              </tr>
            </thead>
            <tbody>{productsTable}</tbody>
        </Table>

        return(
            <div className='dashboardBackground'>
                <Row>
                    <Col md={{ size: 1 }} lg={{ size: 2 }} xl={{ size: 3 }} />
                    <Col>
                        <TimeSelectorComponent year={this.state.year} month={this.state.month} setYear={this.setYear} updateYear={this.updateYear} changeYear={this.changeYear} changeMonth={this.changeMonth} />
                    </Col>
                    <Col md={{ size: 1 }} lg={{ size: 2 }} xl={{ size: 3 }} />
                </Row>
                <Row style={{ 'marginTop': '5vh' }}>
                    <Col xs={{ size: 1 }} />
                    <Col md={{ size: 5 }} xl className='columnStack'>
                        <KPIComponent title={'Inventory Value'} type={'money'} currentValue={this.state['currentInventory']} previousValue={this.state['previousInventory']} isClickable kpiExtraInfo={purchaseValueTable} loading={this.state.currentInventoryLoading} />
                    </Col>
                    <Col md={{ size: 5 }} xl className='columnStack'>
                        <KPIComponent title={'Average Inventory Period'} type={'none'} unit={' days'} currentValue={this.state['currentInventoryPeriod']} previousValue={this.state['previousInventoryPeriod']} loading={this.state.currentInventoryPeriodLoading} />
                    </Col>
                    <Col xs={{ size: 1 }} className='d-xl-none' />
                    <Col xs={{ size: 1 }} md className='d-xl-none' />
                    <Col md={{ size: 5 }} xl className='columnStack'>
                        <KPIComponent title={'Total Shipments Value'} type={'money'} currentValue={this.state['currentShipmentsValue']} previousValue={this.state['previousShipmentsValue']} loading={this.state.currentShipmentsValueLoading} />
                    </Col>
                    <Col md className='d-xl-none columnStack' />
                    <Col xl={{ size: 1 }} />
                </Row>
                <Row className='rowStack'>
                    <Col xl={{ size: 6 }}>
                        <Row>
                            <Col md={{ size: 1 }} xl={{ size: 2 }} />
                            <Col className='columnStack'>
                                <GraphComponent type={'pie'} data={this.state['deliveryStatus']} title={'Deliveries\' Status'} yearly={false} loading={this.state.deliveryStatusLoading} />
                            </Col>
                            <Col md={{ size: 1 }} className='d-xl-none' />
                        </Row>
                    </Col>
                    <Col xl={{ size: 6 }}>
                        <Row>
                            <Col md={{ size: 1 }} className='d-xl-none' />
                            <Col className='columnStack lastElement'>
                                <GraphComponent type={'pie'} data={this.state['destinations']} title={'Deliveries by Destination'} yearly={false} loading={this.state.destinationsLoading} />
                            </Col>
                            <Col md={{ size: 1 }} xl={{ size: 2 }} />
                        </Row>
                    </Col>
                </Row>

            </div>
        );
    }
}

export default LogisticsDash;