import React, { Component } from 'react';
import '../App.css';

class LogisticsDash extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
          authentication: {},
          artigos: {}
        };
      }
    
      loadArtigos() {
        fetch('http://localhost:2018/WebApi/Base/Artigos/LstArtigos',
            {
              headers: {
                'Authorization' : `Bearer ${this.state.authentication['access_token']}`,
                'Accept': 'application/json'
              }
            })
            .then(response => response.json())
            .then(data => this.setState({ artigos: data }));
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
          .then(this.loadArtigos.bind(this));   
      }

      render() {
        return <div>{JSON.stringify(this.state)}</div>;
      }
}

export default LogisticsDash;