import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Header from "./Header.js";
import GenericDash from "./Dashboards/GenericDash";
import SalesDash from "./Dashboards/SalesDash";
import PurchasesDash from "./Dashboards/PurchasesDash";
import FinancialDash from "./Dashboards/FinancialDash";
import LogisticsDash from "./Dashboards/LogisticsDash";
import HRDash from "./Dashboards/HumanResourcesDash";

const App = () => (
  <Router>
    <div>
      <Header />

      <Switch>
        {/* <Route exact path='/' component={Home}/> */}
        <Route path='/general' component={GenericDash} />
        <Route path='/sales' component={SalesDash} />
        <Route path='/purchases' component={PurchasesDash} />
        <Route path='/financial' component={FinancialDash} />
        <Route path='/logistics' component={LogisticsDash} />
        <Route path='/humanresources' component={HRDash} />
      </Switch>
    </div>
  </Router>
);

export default App;