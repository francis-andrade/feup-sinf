import React, { Component } from 'react';
import { Row, Col } from 'reactstrap';
import TimeSelectorComponent from '../components/TimeSelectorComponent';
import GraphComponent from '../components/GraphComponent';
import KPIComponent from '../components/KPIComponent';
import '../App.css';
import '../styles/Common.style.css';
import {retrieveDates} from '../utils.js';
import { isNull } from 'util';

class PurchasesDash extends Component {
    constructor(props) {
        super(props);
        this.suppliersNumber = 3;
        this.catNumber = 3;

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
                labels: [],
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
            topSuppliersLoading: true,
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
            topCategoriesLoading: true,
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
            }
            
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
        });
        console.log("changeYear");
        this.updatePurchasesValue(value, this.state.month);
        this.updateExpectedOrders(value, this.state.month);
        this.updateTopSuppliers(value, this.state.month);
        this.updateTopCategories(value, this.state.month);
    }

    changeMonth = (value) => {
        this.setState({
            month: value
        });
        this.updatePurchasesValue(this.state.year, value);
        this.updateExpectedOrders(this.state.year, value);
        this.updateTopSuppliers(this.state.year, value);
        this.updateTopCategories(this.state.year, value);
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
              console.log(data["DataSet"]["Table"]); 
              this.updatePurchasesValue(this.state.year, this.state.month);
              this.updateExpectedOrders(this.state.year, this.state.month); 
              this.updateTopSuppliers(this.state.year, this.state.month);             
            } ); 
    }

    getItems(){
        fetch('http://localhost:2018/WebApi/Administrador/Consulta',
        {     

            method: "POST",
            body: JSON.stringify("SELECT [ARTIGO].[ARTIGO] AS [ARTIGO$ARTIGO],[ARTIGO].[DESCRICAO] AS [ARTIGO$DESCRICAO],[ARTIGO].[UNIDADEBASE] AS [ARTIGO$UNIDADEBASE],[ARTIGOMOEDA].[PVP1] AS [ARTIGOMOEDA$PVP1],[ARTIGO].[FAMILIA] AS [ARTIGO$FAMILIA],[ARTIGO].[FORNECEDOR] AS [ARTIGO$FORNECEDOR] FROM [ARTIGO] WITH (NOLOCK) LEFT JOIN [ARTIGOMOEDA] WITH (NOLOCK) ON  [ARTIGO].[ARTIGO] = [ARTIGOMOEDA].[ARTIGO] WHERE ( (([ARTIGO].[UNIDADEBASE] = [ARTIGOMOEDA].[UNIDADE]) AND ([ARTIGOMOEDA].[MOEDA] = 'EUR')) )")
            ,
            headers: {
                'Authorization' : `Bearer ${this.state.authentication['access_token']}`,
                'Content-Type': 'application/json'
            },             
        })
        .then(response => response.json())
        .then(data =>{ 
            this.setState({ items: data["DataSet"]["Table"] }); 
            this.updateTopCategories(this.state.year, this.state.month);             
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

    updatePurchasesValue(year, month){
        let dates = retrieveDates(year, month);
        let prevStartDate = dates[0][0];
        let prevEndDate = dates[0][1];
        let currStartDate = dates[1][0];
        let currEndDate = dates[1][1];
        let currPurchasesValue = 0;
        let prevPurchasesValue = 0;
        let purchases = this.state['purchases'];
        console.log(purchases);
        for(let index = 0; index < purchases.length; index++){
            let purchasesDate = new Date(purchases[index]["Data"]);
            if(purchasesDate >= currStartDate && purchasesDate <= currEndDate){
                currPurchasesValue = currPurchasesValue + purchases[index]['Quantidade']*purchases[index]['PrecUnit'];
            }
            else if(purchasesDate >= prevStartDate && purchasesDate <= prevEndDate){
                prevPurchasesValue = prevPurchasesValue + purchases[index]['Quantidade']*purchases[index]['PrecUnit'];
            }
        }
        this.setState({previousPurchasesValue: prevPurchasesValue.toFixed(0)});
        this.setState({currentPurchasesValue: currPurchasesValue.toFixed(0), currentPurchasesValueLoading: false});

    }

    updateExpectedOrders(year, month){
        let dates = retrieveDates(year, month);
        let prevStartDate = dates[0][0];
        let prevEndDate = dates[0][1];
        let currStartDate = dates[1][0];
        let currEndDate = dates[1][1];
        let currExpectedOrders = 0;
        let prevExpectedOrders = 0;
        let purchases = this.state['purchases'];
        for(let index = 0; index < purchases.length; index++){        
            let purchasesDate = new Date(purchases[index]["Data"]);
            if(purchasesDate >= currStartDate && purchasesDate <= currEndDate){
                currExpectedOrders = currExpectedOrders + (purchases[index]['Quantidade']-purchases[index]['QuantTrans'])*purchases[index]['PrecUnit'];
            }
            else if(purchasesDate >= prevStartDate && purchasesDate <= prevEndDate){
                prevExpectedOrders = prevExpectedOrders + (purchases[index]['Quantidade']-purchases[index]['QuantTrans'])*purchases[index]['PrecUnit'];
            }
        }
        this.setState({previousExpectedOrders: prevExpectedOrders.toFixed(0)});
        this.setState({currentExpectedOrders: currExpectedOrders.toFixed(0), currentExpectedOrdersLoading: false});
    }

    updateTopSuppliers(year, month){
        let dates = retrieveDates(year, month);
        let prevStartDate = dates[0][0];
        let prevEndDate = dates[0][1];
        let currStartDate = dates[1][0];
        let currEndDate = dates[1][1];
        let suppliersValue = [];
        let purchases = this.state['purchases'];
        for(let index = 0; index < purchases.length; index++){
            let purchasesDate = new Date(purchases[index]["Data"]);
            if(purchasesDate >= currStartDate && purchasesDate <= currEndDate){
            let supplier = purchases[index]['ArtEntidade'];
            let purchaseValue = purchases[index]['QuantTrans']*purchases[index]['PrecUnit'];
            if(supplier in suppliersValue){
                suppliersValue[supplier] = suppliersValue[supplier] + purchaseValue;
            }
            else{
                suppliersValue[supplier] = purchaseValue;
            }
            }       
        }

        let topSuppliers = this.sort(suppliersValue);
        let suppliersData = [];
        let suppliersLabels = [];

        for(let index = 0; index < this.suppliersNumber && index < topSuppliers.length; index++){
            suppliersData.push(topSuppliers[index][1]);
            suppliersLabels.push(topSuppliers[index][0]);
        }

        let topSuppliersState = this.state['topSuppliers'];
        topSuppliersState['labels'] = suppliersLabels;
        topSuppliersState['datasets']['data'] = suppliersData;
        this.setState({topSuppliers: topSuppliersState, topSuppliersLoading: false})        
    }

    updateTopCategories(year, month){
        let dates = retrieveDates(year, month);
        let prevStartDate = dates[0][0];
        let prevEndDate = dates[0][1];
        let currStartDate = dates[1][0];
        let currEndDate = dates[1][1];

        let catValue = [];
        let purchases = this.state['purchases'];
        let items = this.state['items'];
        for(let index = 0; index < purchases.length; index++){
            let purchasesDate = new Date(purchases[index]["Data"]);
            if(purchasesDate >= currStartDate && purchasesDate <= currEndDate){
            let name = purchases[index]['ArtigoName'];
            let cat = null;
            for(let item in items){
                if(name == item['ARTIGO$ARTIGO']){
                    cat = item['ARTIGO$FAMILIA'];
                }
            }
            if(cat != null){
            let purchaseValue = purchases[index]['QuantTrans']*purchases[index]['PrecUnit'];
            if(cat in catValue){
                catValue[cat] = catValue[cat] + purchaseValue;
            }
            else{
                catValue[cat] = purchaseValue;
            }
            }
            }       
        }

        let topCat = this.sort(catValue);
        let catData = [];
        let catLabels = [];

        for(let index = 0; index < this.catNumber && index < topCat.length; index++){
            catData.push(topCat[index][1]);
            catLabels.push(topCat[index][0]);
        }

        let topCatState = this.state['topCategories'];
        topCatState['labels'] = catLabels;
        topCatState['datasets']['data'] = catData;
        this.setState({topCategories: topCatState, topCategoriesLoading: false})
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
        .then(this.getPurchases.bind(this))
        .then(this.getItems.bind(this));   
    }

    render() {
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
                        <KPIComponent title={'Purchases Value'} type={'money'} currentValue={this.state['currentPurchasesValue']} previousValue={this.state['previousPurchasesValue']} loading={this.state.currentPurchasesValueLoading} />
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
                                <GraphComponent type={'horizontalBar'} data={this.state['topSuppliers']} title={'Top Suppliers'} yearly={false} isClickable extraData={this.state.topSuppliersExtraData} loading={this.state.topSuppliersLoading} />
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