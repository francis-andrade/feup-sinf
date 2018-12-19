import React, { Component } from 'react';
import { Row, Col, Table } from 'reactstrap';
import TimeSelectorComponent from '../components/TimeSelectorComponent';
import GraphComponent from '../components/GraphComponent';
import KPIComponent from '../components/KPIComponent';
import '../App.css';
import '../styles/Common.style.css';
import {retrieveDates} from '../utils.js';

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
            previousInventoryProducts: [],
            currentInventoryProducts: [],
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

            inventoryProducts: [
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
        console.log("changeYear");
        console.log(this.state.year);
        this.updateYear(value);
        this.getInventoryPeriod(value, this.state.month);
        this.updateShipmentValue(value, this.state.month)
        this.updateDeliveriesDestinations(value, this.state.month);
        this.updateDeliveryStatus(value, this.state.month);
    }

    async updateYear(value) {

        await this.updateYearFetch(value);
        this.updateInventoryYear(value);
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
        this.getInventoryPeriod(this.state.year, value);
        this.updateShipmentValue(this.year, value)
        this.updateDeliveriesDestinations(this.year, value);
        this.updateDeliveryStatus(this.year, value);
    }

    // Update inventory with selected year
    updateInventoryYear(value) {
        //this.getInventory();
      
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

    /*getInventorySAFT(){
        fetch('http://localhost:5000/api/inventory',
            {

            method: "GET",
                      
        })
        .then(response => response.json())
        .then(data =>{ 
            this.setState({ currentInventory: data.toFixed(0), currentInventoryLoading: false }); 
          }); 
    }*/

    getInventory(){
        let dates = retrieveDates(this.state.year, this.state.month);
        let prevStartDate = dates[0][0];
        let prevEndDate = dates[0][1];
        let currStartDate = dates[1][0];
        let currEndDate = dates[1][1];
        console.log(dates);
        let prevStartStr = parseInt(parseInt(prevStartDate.getMonth())+1)+"/"+prevStartDate.getDate()+"/"+prevStartDate.getFullYear();
        let prevEndStr = parseInt(parseInt(prevEndDate.getMonth())+1)+"/"+prevEndDate.getDate()+"/"+prevEndDate.getFullYear();
        let currStartStr = parseInt(parseInt(currStartDate.getMonth())+1)+"/"+currStartDate.getDate()+"/"+currStartDate.getFullYear();
        let currEndStr = parseInt(parseInt(currEndDate.getMonth())+1)+"/"+currEndDate.getDate()+"/"+currEndDate.getFullYear();
        console.log(prevStartStr);
        function query(startDate, endDate){
            let str = "EXEC INV_EntradasSaidas @pCamposGrelha = 'NULL AS GROUP1,NULL AS GROUP2,NULL AS GROUP3,NULL AS GROUP4,NULL AS GROUP5,IdChave1 = NULL ,IdChave2 = NULL ,IdChave3 = CAST(IdChave3 AS NVARCHAR(36)),IdChave4 = NULL ,IdReserva,IdTipoOrigem = NULL ,Modulo = NULL ,Documento = NULL ,NomeApl = NULL ,TipoMovimento = NULL ,PeriodoMensal = NULL ,PeriodoTrimestral = NULL ,PeriodoSemestral = NULL ,HoraDoc = NULL ,DataDoc = NULL ,AnoDoc = NULL, Artigo,EstadoStock,ArtigoPai = NULL ,Descricao,DescArmazem = NULL ,DescFamilia = NULL ,DescSubFamilia = NULL ,DescMarca = NULL ,DescModelo = NULL ,Armazem = NULL ,Localizacao = NULL ,Lote = NULL ,Familia = NULL ,SubFamilia = NULL ,Marca = NULL ,Modelo = NULL ,Unidade = NULL ,NumeroSerie = NULL ,Quantidade = SUM(Quantidade),ValorMBase = SUM(ValorMBase),NumRegisto = NULL ,NULL AS DATAFILLCOL',@pCamposGroupBy = ' CAST(IdChave3 AS NVARCHAR(36)),IdReserva,Artigo,EstadoStock,Descricao',@pCasePeriodoMensal = ' CASE @Campo@ WHEN 1 THEN ''01-Janeiro''  WHEN 2 THEN ''02-Fevereiro''  WHEN 3 THEN ''03-Março''  WHEN 4 THEN ''04-Abril''  WHEN 5 THEN ''05-Maio''  WHEN 6 THEN ''06-Junho''  WHEN 7 THEN ''07-Julho''  WHEN 8 THEN ''08-Agosto''  WHEN 9 THEN ''09-Setembro''  WHEN 10 THEN ''10-Outubro''  WHEN 11 THEN ''11-Novembro''  WHEN 12 THEN ''12-Dezembro''  END ',@pCasePeriodoTrimestral = ' CASE WHEN @Campo@ >= 1 AND @Campo@ <= 3 THEN ''1º Trimestre''  WHEN @Campo@ >= 4 AND @Campo@ <= 6 THEN ''2º Trimestre''  WHEN @Campo@ >= 7 AND @Campo@ <= 9 THEN ''3º Trimestre''  WHEN @Campo@ >= 10 AND @Campo@ <= 12 THEN ''4º Trimestre''  END ',@pCasePeriodoSemestral = ' CASE WHEN @Campo@ >= 1 AND @Campo@ <= 6 THEN ''1º Semestre''  WHEN @Campo@ >= 7 AND @Campo@ <= 12 THEN ''2º Semestre''  END ',@pCaseModulo = 'CASE  WHEN @Campo@ = ''c8137b77-d1a4-4f6c-917e-0d111e7909fa'' THEN ''Inventário - Composições''  WHEN @Campo@ = ''53402401-3409-408a-8310-0f1661ebb4b5'' THEN ''Vendas''  WHEN @Campo@ = ''919da49a-49f4-475f-8d28-4a330f80af33'' THEN ''Produção''  WHEN @Campo@ = ''750a81d8-9bda-4842-86c6-53b27b48ff15'' THEN ''Internos''  WHEN @Campo@ = ''2daaccdf-f61f-4093-9b0d-6b717b299350'' THEN ''Inventário - Transferências''  WHEN @Campo@ = ''5424f810-cee8-4be7-863b-79ec7d6bcfdc'' THEN ''Inventário - Transferências Artigo''  WHEN @Campo@ = ''ce1bdb74-6287-4041-b77d-a84ea1518a04'' THEN ''Compras''  WHEN @Campo@ = ''c6374558-1ad3-4465-bad4-e9e2babd7806'' THEN ''Pagamentos e Recebimentos''  END ',@pCaseTipoMovimento = ' CASE WHEN @Campo@ = ''E'' THEN ''Entrada''  WHEN @Campo@ = ''S'' THEN ''Saída''  END ',@pDataInicial = '"+startDate+"',@pDataFinal = '"+endDate+"',@pFiltroDocumentos = '( 1 = 0  OR (docs.IdTipoOrigem IN (''c8137b77-d1a4-4f6c-917e-0d111e7909fa'') AND docs.Chave1 IN (''COM'', ''DEC'')) OR (docs.IdTipoOrigem IN (''53402401-3409-408a-8310-0f1661ebb4b5'') AND docs.Chave1 IN (''ECL'', ''FA'', ''FAI'', ''FI'', ''FM'', ''FO'', ''FR'', ''NC'', ''VD'')) OR (docs.IdTipoOrigem IN (''750a81d8-9bda-4842-86c6-53b27b48ff15'') AND docs.Chave1 IN (''AIN'', ''AIP'', ''ES'', ''ESI'', ''SS'', ''SSI'')) OR (docs.IdTipoOrigem IN (''2daaccdf-f61f-4093-9b0d-6b717b299350'') AND docs.Chave1 IN (''TALE'', ''TE'', ''TLT'', ''TNS'', ''TRA'', ''TS'')) OR (docs.IdTipoOrigem IN (''5424f810-cee8-4be7-863b-79ec7d6bcfdc'') AND docs.Chave1 IN (''TA'')) OR (docs.IdTipoOrigem IN (''ce1bdb74-6287-4041-b77d-a84ea1518a04'') AND docs.Chave1 IN (''DVF'', ''VFA'', ''VFI'', ''VFM'', ''VFO'', ''VFP'', ''VGR'', ''VNC'', ''VVD'')) OR (docs.IdTipoOrigem IN (''c6374558-1ad3-4465-bad4-e9e2babd7806'') AND docs.Chave1 IN (''416'', ''417'', ''418'', ''FAF'', ''ISA'', ''IVA'', ''IVR'', ''LTF'', ''NCF'', ''NDF'', ''NFA'', ''SEG'', ''VDF'', ''VEN'')))',@pFiltroAdicionais = Null,@pListaDimensoes = 1,@pListaNumSerie = 1,@pTipoMovimento = Null,@pFilial = '000'";
            console.log(str);
            return JSON.stringify(str);
        }
        fetch('http://localhost:2018/WebApi/Administrador/Consulta',
          {     

              method: "POST",
              body: query(prevStartStr, prevEndStr)
              ,
              headers: {
                  'Authorization' : `Bearer ${this.state.authentication['access_token']}`,
                  'Content-Type': 'application/json'
              },             
          })
          .then(response => response.json())
          .then(data =>{ 
              this.setState({previousInventoryProducts: data["DataSet"]["Table"]});
            } ); 
        
        fetch('http://localhost:2018/WebApi/Administrador/Consulta',
        {     
  
            method: "POST",
            body: query(currStartStr, currEndStr)
            ,
            headers: {
                'Authorization' : `Bearer ${this.state.authentication['access_token']}`,
                'Content-Type': 'application/json'
            },             
        })
        .then(response => response.json())
        .then(data =>{ 
            this.setState({currentInventoryProducts: data["DataSet"]["Table"]});
        } ); 
        
        this.updateInventory();
    }

    getInventoryPeriod(year, month) {
        fetch('http://localhost:5000/api/inventoryPeriod?year='+year+'&month='+month,
            {

                method: "GET",

            })
            .then(response => response.json())
            .then(data => {
                this.setState({ currentInventoryPeriod: data.toFixed(0), currentInventoryPeriodLoading: false });
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
                this.updateShipmentValue(this.state.year, this.state.month);
                this.updateDeliveryStatus(this.state.year, this.state.month);
                this.updateDeliveriesDestinations(this.state.year, this.state.month);
            });
    }

    updateInventory(){
        let currTable = this.state.currentInventoryProducts;
        let prevTable = this.state.previousInventoryProducts;
        let currInventoryValue = 0;
        let prevInventoryValue = 0;
        let inventoryProducts = [];
        console.log(currTable);
        for(let index =0; index < currTable.length; index++){
            currInventoryValue += currTable[index]['Quantidade']*currTable[index]['ValorMBase'];
            inventoryProducts.push({name: currTable[index]['Descricao'], quantity: currTable[index]['Quantidade']});
        }
        for(let index =0; index < prevTable.length; index++){
            prevInventoryValue += prevTable[index]['Quantidade']*prevTable[index]['ValorMBase'];
        }
        this.setState({ previousInventory: prevInventoryValue.toFixed(0) })
        this.setState({ currentInventory: currInventoryValue.toFixed(0), currentInventoryLoading: false });
        this.setState({inventoryProducts: inventoryProducts});
    }

    updateShipmentValue(year, month){
        let table = this.state.shipments;
        console.log(table);
        
        let dates = retrieveDates(year, month);
        let prevStartDate = dates[0][0];
        let prevEndDate = dates[0][1];
        let currStartDate = dates[1][0];
        let currEndDate = dates[1][1];
        let currShipmentsValue = 0;
        let prevShipmentsValue = 0;
        console.log(dates);
        for (let index = 0; index < table.length; index++) {
            let shipDate = new Date(table[index]["Data"]);
            if(shipDate >= currStartDate && shipDate <= currEndDate){
                currShipmentsValue += table[index]["Quantidade"] * table[index]["PrecUnit"];
                console.log(shipDate);
            }
            else if(shipDate >= prevStartDate && shipDate <= prevEndDate){
                prevShipmentsValue += table[index]["Quantidade"] * table[index]["PrecUnit"];
            }
        }
        console.log(prevShipmentsValue);
        console.log(currShipmentsValue);
        this.setState({ previousShipmentsValue: prevShipmentsValue.toFixed(0) })
        this.setState({ currentShipmentsValue: currShipmentsValue.toFixed(0), currentShipmentsValueLoading: false })
    }

    updateDeliveryStatus(year, month) {
        let table = this.state.shipments;
        let dates = retrieveDates(year, month);
        let currStartDate = dates[1][0];
        let currEndDate = dates[1][1];
        let delivered = 0
        let notDelivered = 0
        for (let index = 0; index < table.length; index++) {
            let shipDate = new Date(table[index]["Data"]);
            if(shipDate >= currStartDate && shipDate <= currEndDate){
            if (table[index]['linhasTrans'] === "T" && table[index]['cabecTrans'] === "T") {
                notDelivered++
            }
            else {
                delivered++
            }
            }
        }


        let deliveryStatusState = this.state["deliveryStatus"]
        deliveryStatusState["datasets"][0]["data"] = [delivered, notDelivered]
        this.setState({ deliveryStatus: deliveryStatusState, deliveryStatusLoading: false })
    }

    updateDeliveriesDestinations(year, month) {
        let table = this.state.shipments;
        let countries = [];
        let countriesIndex = [];
        let countriesCount = [];
        console.log(this.state.year);
        let dates = retrieveDates(this.state.year, this.state.month);
        let currStartDate = dates[1][0];
        let currEndDate = dates[1][1];
        console.log(dates);
        for (let index = 0; index < table.length; index++) {
            let shipDate = new Date(table[index]["Data"]);
            if(shipDate >= currStartDate && shipDate <= currEndDate){
            let country = table[index]["Pais"];
            if (countriesIndex[country] == null) {
                countriesIndex[country] = countries.length;
                countries.push(country);
                countriesCount.push(1);
            }
            else {
                countriesCount[countriesIndex[country]]++;
            }
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
        .then(this.getInventory.bind(this))
        .then(this.getInventoryPeriod.bind(this, this.state.year, this.state.month))
        .then(this.getShipments.bind(this));   
    }

    render() {
        let productsTable = [];

        for(let i = 0; i < this.state.inventoryProducts.length; i++) {
            productsTable.push(<tr key={i}>
                                    <th scope="row">{this.state.inventoryProducts[i].name}</th>
                                    <td>{this.state.inventoryProducts[i].quantity}</td>
                                </tr>)
        }

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