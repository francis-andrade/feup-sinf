import React, { Component } from 'react';
import { Row, Col } from 'reactstrap';
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
            destinationsLoading: true
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

    getInventorySAFT(){
        fetch('http://localhost:5000/api/inventory',
        {     

            method: "GET",
                      
        })
        .then(response => response.json())
        .then(data =>{ 
            this.setState({ currentInventory: data.toFixed(0), currentInventoryLoading: false }); 
          }); 
    }

    getInventory(){
        fetch('http://localhost:2018/WebApi/Administrador/Consulta',
          {     

              method: "POST",
              body: JSON.stringify("EXEC INV_EntradasSaidas @pCamposGrelha = 'NULL AS GROUP1,NULL AS GROUP2,NULL AS GROUP3,NULL AS GROUP4,NULL AS GROUP5,IdChave1 = NULL ,IdChave2 = NULL ,IdChave3 = CAST(IdChave3 AS NVARCHAR(36)),IdChave4 = NULL ,IdReserva,IdTipoOrigem = NULL ,Modulo = NULL ,Documento = NULL ,NomeApl = NULL ,TipoMovimento = NULL ,PeriodoMensal = NULL ,PeriodoTrimestral = NULL ,PeriodoSemestral = NULL ,HoraDoc = NULL ,DataDoc = NULL ,AnoDoc = NULL, Artigo,EstadoStock,ArtigoPai = NULL ,Descricao,DescArmazem = NULL ,DescFamilia = NULL ,DescSubFamilia = NULL ,DescMarca = NULL ,DescModelo = NULL ,Armazem = NULL ,Localizacao = NULL ,Lote = NULL ,Familia = NULL ,SubFamilia = NULL ,Marca = NULL ,Modelo = NULL ,Unidade = NULL ,NumeroSerie = NULL ,Quantidade = SUM(Quantidade),ValorMBase = SUM(ValorMBase),NumRegisto = NULL ,NULL AS DATAFILLCOL',@pCamposGroupBy = ' CAST(IdChave3 AS NVARCHAR(36)),IdReserva,Artigo,EstadoStock,Descricao',@pCasePeriodoMensal = ' CASE @Campo@ WHEN 1 THEN ''01-Janeiro''  WHEN 2 THEN ''02-Fevereiro''  WHEN 3 THEN ''03-Março''  WHEN 4 THEN ''04-Abril''  WHEN 5 THEN ''05-Maio''  WHEN 6 THEN ''06-Junho''  WHEN 7 THEN ''07-Julho''  WHEN 8 THEN ''08-Agosto''  WHEN 9 THEN ''09-Setembro''  WHEN 10 THEN ''10-Outubro''  WHEN 11 THEN ''11-Novembro''  WHEN 12 THEN ''12-Dezembro''  END ',@pCasePeriodoTrimestral = ' CASE WHEN @Campo@ >= 1 AND @Campo@ <= 3 THEN ''1º Trimestre''  WHEN @Campo@ >= 4 AND @Campo@ <= 6 THEN ''2º Trimestre''  WHEN @Campo@ >= 7 AND @Campo@ <= 9 THEN ''3º Trimestre''  WHEN @Campo@ >= 10 AND @Campo@ <= 12 THEN ''4º Trimestre''  END ',@pCasePeriodoSemestral = ' CASE WHEN @Campo@ >= 1 AND @Campo@ <= 6 THEN ''1º Semestre''  WHEN @Campo@ >= 7 AND @Campo@ <= 12 THEN ''2º Semestre''  END ',@pCaseModulo = 'CASE  WHEN @Campo@ = ''c8137b77-d1a4-4f6c-917e-0d111e7909fa'' THEN ''Inventário - Composições''  WHEN @Campo@ = ''53402401-3409-408a-8310-0f1661ebb4b5'' THEN ''Vendas''  WHEN @Campo@ = ''919da49a-49f4-475f-8d28-4a330f80af33'' THEN ''Produção''  WHEN @Campo@ = ''750a81d8-9bda-4842-86c6-53b27b48ff15'' THEN ''Internos''  WHEN @Campo@ = ''2daaccdf-f61f-4093-9b0d-6b717b299350'' THEN ''Inventário - Transferências''  WHEN @Campo@ = ''5424f810-cee8-4be7-863b-79ec7d6bcfdc'' THEN ''Inventário - Transferências Artigo''  WHEN @Campo@ = ''ce1bdb74-6287-4041-b77d-a84ea1518a04'' THEN ''Compras''  WHEN @Campo@ = ''c6374558-1ad3-4465-bad4-e9e2babd7806'' THEN ''Pagamentos e Recebimentos''  END ',@pCaseTipoMovimento = ' CASE WHEN @Campo@ = ''E'' THEN ''Entrada''  WHEN @Campo@ = ''S'' THEN ''Saída''  END ',@pDataInicial = '1/1/2018',@pDataFinal = '12/18/2018',@pFiltroDocumentos = '( 1 = 0  OR (docs.IdTipoOrigem IN (''c8137b77-d1a4-4f6c-917e-0d111e7909fa'') AND docs.Chave1 IN (''COM'', ''DEC'')) OR (docs.IdTipoOrigem IN (''53402401-3409-408a-8310-0f1661ebb4b5'') AND docs.Chave1 IN (''ECL'', ''FA'', ''FAI'', ''FI'', ''FM'', ''FO'', ''FR'', ''NC'', ''VD'')) OR (docs.IdTipoOrigem IN (''750a81d8-9bda-4842-86c6-53b27b48ff15'') AND docs.Chave1 IN (''AIN'', ''AIP'', ''ES'', ''ESI'', ''SS'', ''SSI'')) OR (docs.IdTipoOrigem IN (''2daaccdf-f61f-4093-9b0d-6b717b299350'') AND docs.Chave1 IN (''TALE'', ''TE'', ''TLT'', ''TNS'', ''TRA'', ''TS'')) OR (docs.IdTipoOrigem IN (''5424f810-cee8-4be7-863b-79ec7d6bcfdc'') AND docs.Chave1 IN (''TA'')) OR (docs.IdTipoOrigem IN (''ce1bdb74-6287-4041-b77d-a84ea1518a04'') AND docs.Chave1 IN (''DVF'', ''VFA'', ''VFI'', ''VFM'', ''VFO'', ''VFP'', ''VGR'', ''VNC'', ''VVD'')) OR (docs.IdTipoOrigem IN (''c6374558-1ad3-4465-bad4-e9e2babd7806'') AND docs.Chave1 IN (''416'', ''417'', ''418'', ''FAF'', ''ISA'', ''IVA'', ''IVR'', ''LTF'', ''NCF'', ''NDF'', ''NFA'', ''SEG'', ''VDF'', ''VEN'')))',@pFiltroAdicionais = Null,@pListaDimensoes = 1,@pListaNumSerie = 1,@pTipoMovimento = Null,@pFilial = '000'")
              ,
              headers: {
                  'Authorization' : `Bearer ${this.state.authentication['access_token']}`,
                  'Content-Type': 'application/json'
              },             
          })
          .then(response => response.json())
          .then(data =>{ 
              this.setState({shipments: data["DataSet"]["Table"] }); 
              this.updateShipmentValue(data["DataSet"]["Table"]); 
              this.updateDeliveryStatus(data["DataSet"]["Table"]);
              this.updateDeliveriesDestinations(data["DataSet"]["Table"]);
            } ); 
    }

    getInventoryPeriod(){
        fetch('http://localhost:5000/api/inventoryPeriod',
        {     

            method: "GET",
                      
        })
        .then(response => response.json())
        .then(data =>{ 
            this.setState({ currentInventoryPeriod: data.toFixed(0), currentInventoryPeriodLoading: false }); 
            console.log(this.state)
            
          } ); 
    }
    getShipments(){
        fetch('http://localhost:2018/WebApi/Administrador/Consulta',
          {     

              method: "POST",
              body: JSON.stringify("SELECT LinhasDoc.Artigo As ArtigoName, CabecDoc.Pais AS Pais, LinhasDocStatus.EstadoTrans AS linhasTrans, CabecDocStatus.Estado AS cabecTrans, CabecDoc.Data As Data, LinhasDoc.PrecUnit, LinhasDoc.DataEntrega, (LinhasDocStatus.Quantidade * LinhasDoc.FactorConv) Quantidade FROM CabecDoc INNER JOIN LinhasDoc ON CabecDoc.Id = LinhasDoc.IdCabecDoc INNER JOIN CabecDocStatus ON CabecDoc.ID=CabecDocStatus.IdCabecDoc INNER JOIN LinhasDocStatus ON LinhasDoc.ID=LinhasDocStatus.IdLinhasDoc INNER JOIN DocumentosVenda ON CabecDoc.TipoDoc=DocumentosVenda.Documento INNER JOIN Artigo ON LinhasDoc.Artigo=Artigo.Artigo WHERE CabecDoc.Filial='000' AND DocumentosVenda.TipoDocumento=2 AND CabecDoc.TipoEntidade='C' AND CabecDoc.TipoDoc IN ('','ECL') AND ((LinhasDoc.TipoLinha>='10' AND LinhasDoc.TipoLinha<='29') OR LinhasDoc.TipoLinha='65' OR LinhasDoc.TipoLinha='91')  AND CabecDocStatus.Anulado=0  ORDER BY LinhasDoc.DataEntrega")
              ,
              headers: {
                  'Authorization' : `Bearer ${this.state.authentication['access_token']}`,
                  'Content-Type': 'application/json'
              },             
          })
          .then(response => response.json())
          .then(data =>{ 
              this.setState({shipments: data["DataSet"]["Table"] }); 
              this.updateShipmentValue(data["DataSet"]["Table"]); 
              this.updateDeliveryStatus(data["DataSet"]["Table"]);
              this.updateDeliveriesDestinations(data["DataSet"]["Table"]);
            } ); 
    }

    updateInventory(table){
        let inventoryValue = 0
        let products = []
        let quantity = []
        for(let index =0; index < table.length; index++){
            inventoryValue += table[index]['Quantidade']*table[index]['ValorMBase']
            products.push(table[index]['Descricao'])
            quantity.push(table[index]['ValorMBase'])
        }
    }

    updateShipmentValue(table){
        let shipmentsValue = 0
        for(let index = 0; index < table.length; index++){
            shipmentsValue += table[index]["Quantidade"]*table[index]["PrecUnit"]
        }
        
        this.setState({currentShipmentsValue: shipmentsValue.toFixed(0), currentShipmentsValueLoading: false})
    }

    updateDeliveryStatus(table){
        let delivered = 0
        let notDelivered = 0
        for(let index = 0; index < table.length; index++){
           if(table[index]['linhasTrans'] === "T" && table[index]['cabecTrans'] === "T"){
               notDelivered++
           }
           else{
               delivered++
           }
        }
       

        let deliveryStatusState = this.state["deliveryStatus"]
        deliveryStatusState["datasets"][0]["data"] = [delivered, notDelivered]
        this.setState({deliveryStatus:  deliveryStatusState, deliveryStatusLoading: false})
    }

    updateDeliveriesDestinations(table){
        let countries = []
        let countriesIndex = []
        let countriesCount = []

        for(let index = 0; index < table.length; index++){
            let country = table[index]["Pais"]
            if(countriesIndex[country] == null){
                countriesIndex[country] = countries.length
                countries.push(country)
                countriesCount.push(1)
            }
            else{
               countriesCount[countriesIndex[country]]++
            }
        }

        let destinationsState = this.state["destinations"]

        destinationsState["labels"] = countries
        destinationsState["datasets"][0]["data"] = countriesCount

        this.setState({destinations: destinationsState, destinationsLoading: false})
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
        .then(this.getInventorySAFT.bind(this))
        .then(this.getInventoryPeriod.bind(this))
        .then(this.getShipments.bind(this));   
    }

    render() {
        return(
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
                        <KPIComponent title={'Inventory Value'} type={'money'} currentValue={this.state['currentInventory']} previousValue={this.state['previousInventory']} loading={this.state.currentInventoryLoading} />
                    </Col>
                    <Col md={{ size: 5 }} xl className='columnStack'>
                        <KPIComponent title={'Average Inventory Period'} type={'none'} unit={' days'} currentValue={this.state['currentInventoryPeriod']} previousValue={this.state['previousInventoryPeriod']} loading={this.state.currentInventoryPeriodLoading} />
                    </Col>
                    <Col xs={{ size: 1 }} className='d-xl-none'/>
                    <Col xs={{ size: 1 }} md className='d-xl-none'/>
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