import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Dashboard from "./Dashboard.js"

const App = () => (
  <Router>
    <div>
      Try /dashboard
      {/* <Route exact path="/" component={Home} /> */}
      <Route path="/dashboard" component={Dashboard} />
    </div>
  </Router>
);

export default App;