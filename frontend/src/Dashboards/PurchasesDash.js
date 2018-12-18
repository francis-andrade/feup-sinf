import React, { Component } from 'react';
import { Row, Col, Table } from 'reactstrap';
import TimeSelectorComponent from '../components/TimeSelectorComponent';
import GraphComponent from '../components/GraphComponent';
import KPIComponent from '../components/KPIComponent';
import '../App.css';
import '../styles/Common.style.css';

class PurchasesDash extends Component {
    constructor(props) {
        super(props);
        this.suppliersNumber = 3;

        this.state = {
            authentication: {},
            year: '',
            month: '0',
            purchases: {},
            items: {},

            previousPurchasesValue: 0,
            currentPurchasesValue: 0,
            currentPurchasesValueLoading: true,
            previousExpectedOrders: 0,
            currentExpectedOrders: 0,
            currentExpectedOrdersLoading: true,

            topSuppliers: {
                labels: ['Supplier1', 'Supplier2', 'Supplier3'],
                datasets: [
                    {
                        label: 'Value',
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
            topSuppliersExtraData: {
                labels: ['Supplier1', 'Supplier2', 'Supplier3'],
                datasets: [
                    {
                        label: 'Value',
                        fill: true,
                        backgroundColor: 'rgba(75,192,192,0.4)',
                        borderColor: 'rgba(75,192,192,1)',
                        pointBorderColor: 'rgba(75,192,192,1)',
                        pointBackgroundColor: '#fff',
                        pointHoverBackgroundColor: 'rgba(75,192,192,1)',
                        pointHoverBorderColor: 'rgba(220,220,220,1)',
                        data: [300, 400, 500]
                    }
                ]
            },
            topCategories: {
                labels: ['Category1', 'Category2', 'Category3'],
                datasets: [
                    {
                        label: 'Value',
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
            
        }
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

    getPurchases(){
        fetch('http://localhost:2018/WebApi/Administrador/Consulta',
          {     

              method: "POST",
              body: JSON.stringify("SELECT CabecCompras.DataDoc As Data, LinhasCompras.Artigo, LinhasCompras.PrecUnit, LinhasCompras.DataEntrega, (LinhasComprasStatus.Quantidade * LinhasCompras.FactorConv) Quantidade, (LinhasComprasStatus.QuantReserv * LinhasCompras.FactorConv) QuantReserv, (LinhasComprasStatus.QuantTrans * LinhasCompras.FactorConv) QuantTrans,CabecCompras.Entidade As ArtEntidade FROM CabecCompras INNER JOIN LinhasCompras ON CabecCompras.Id = LinhasCompras.IdCabecCompras INNER JOIN CabecComprasStatus ON CabecCompras.ID=CabecComprasStatus.IdCabecCompras INNER JOIN LinhasComprasStatus ON LinhasCompras.ID=LinhasComprasStatus.IdLinhasCompras INNER JOIN DocumentosCompra ON CabecCompras.TipoDoc=DocumentosCompra.Documento INNER JOIN Artigo ON LinhasCompras.Artigo=Artigo.Artigo WHERE CabecCompras.Filial='000' AND DocumentosCompra.TipoDocumento=2 AND CabecComprasStatus.Estado<>'T' AND CabecComprasStatus.Estado<>'R' AND abs(LinhasComprasStatus.Quantidade) > Abs(LinhasComprasStatus.QuantTrans) AND CabecCompras.TipoEntidade='F' AND CabecCompras.TipoDoc IN ('','ECF') AND ((LinhasCompras.TipoLinha>='10' AND LinhasCompras.TipoLinha<='29') OR LinhasCompras.TipoLinha='65' OR LinhasCompras.TipoLinha='91') AND LinhasComprasStatus.EstadoTrans<>'T' AND LinhasCompras.Artigo='A0001' AND LinhasComprasStatus.fechado=0  AND CabecComprasStatus.fechado=0  AND CabecComprasStatus.Anulado=0  ORDER BY LinhasCompras.DataEntrega")
              ,
              headers: {
                  'Authorization' : `Bearer ${this.state.authentication['access_token']}`,
                  'Content-Type': 'application/json'
              },             
          })
          .then(response => response.json())
          .then(data =>{ 
              this.setState({ purchases: data["DataSet"]["Table"] }); 
              this.updatePurchasesValue();
              this.updateExpectedOrders(); 
              this.updateTopSuppliers();             
            } ); 
    }

    sort(dict){
        var items = Object.keys(dict).map(function(key) {
            return [key, dict[key]];
          });
          
          // Sort the array based on the second element
        items.sort(function(first, second) {
            return second[1] - first[1];
        });

        return items;
    }

    updatePurchasesValue(){
        let purchasesValue = 0;
        let purchases = this.state['purchases'];
        for(let index = 0; index < purchases.length; index++){
            purchasesValue = purchasesValue + purchases[index]['Quantidade']*purchases[index]['PrecUnit'];
        }
        this.setState({currentPurchasesValue: purchasesValue.toFixed(0), currentPurchasesValueLoading: false})
    }

    updateExpectedOrders(){
        let expectedOrders = 0;
        let purchases = this.state['purchases'];
        for(let index = 0; index < purchases.length; index++){
           
            
            expectedOrders = expectedOrders + (purchases[index]['Quantidade']-purchases[index]['QuantTrans'])*purchases[index]['PrecUnit'];
        }
       
        this.setState({currentExpectedOrders: expectedOrders.toFixed(0), currentExpectedOrdersLoading: false})
    }

    updateTopSuppliers(){
        let suppliersValue = [];
        let purchases = this.state['purchases'];
        for(let index = 0; index < purchases.length; index++){
            let supplier = purchases[index]['ArtEntidade'];
            let purchaseValue = purchases[index]['QuantTrans']*purchases[index]['PrecUnit'];
            if(supplier in suppliersValue){
                suppliersValue[supplier] = suppliersValue[supplier] + purchaseValue;
            }
            else{
                suppliersValue[supplier] = purchaseValue;
            }       
        }
        console.log(suppliersValue);
        let topSuppliers = this.sort(suppliersValue);
        let suppliersData = [];
        let suppliersLabels = [];
        console.log(topSuppliers);
        for(let index = 0; index < this.suppliersNumber && index < topSuppliers.length; index++){
            suppliersData.push(topSuppliers[index][1]);
            suppliersLabels.push(topSuppliers[index][0]);
        }

        let topSuppliersState = this.state['topSuppliers'];
        topSuppliersState['labels'] = suppliersLabels;
        topSuppliersState['datasets']['data'] = suppliersData;
        this.setState({topSuppliers: topSuppliersState})
        console.log(this.state);
        
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
        .then(this.getPurchases.bind(this));   
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
                    <Col md className='columnStack'>
                        <KPIComponent title={'Purchases Value'} type={'money'} currentValue={this.state['currentPurchasesValue']} previousValue={this.state['previousPurchasesValue']} isClickable kpiExtraInfo={purchaseValueTable} loading={this.state.currentPurchasesValueLoading} />
                    </Col>
                    <Col md className='columnStack'>
                        <KPIComponent title={'Expected Orders Cost'} type={'money'} currentValue={this.state['currentExpectedOrders']} previousValue={this.state['previousExpectedOrders']} loading={this.state.currentExpectedOrdersLoading} />
                    </Col>
                    <Col xs={{ size: 1 }} />
                </Row>
                <Row className='rowStack'>
                    <Col xl={{ size: 6 }}>
                        <Row>
                            <Col md={{ size: 1 }} xl={{ size: 2 }} />
                            <Col className='columnStack'>
                                <GraphComponent type={'horizontalBar'} data={this.state['topSuppliers']} title={'Top Suppliers'} yearly={false} isClickable extraData={this.state.topSuppliersExtraData} />
                            </Col>
                            <Col md={{ size: 1 }} className='d-xl-none' />
                        </Row>
                    </Col>
                    <Col xl={{ size: 6 }}>
                        <Row>
                            <Col md={{ size: 1 }} className='d-xl-none' />
                            <Col className='lastElement'>
                                <GraphComponent type={'horizontalBar'} data={this.state['topCategories']} title={'Top Categories'} yearly={false} />
                            </Col>
                            <Col md={{ size: 1 }} xl={{ size: 2 }} />
                        </Row>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default PurchasesDash;