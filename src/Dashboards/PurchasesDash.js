import React, { Component } from 'react';
import '../App.css';
import CalendarSelector from '../components/CalendarSelector'

class PurchasesDash extends Component {
    constructor(props) {
        super(props);

        this.state = {

        };
    }

    render() {
        return (
            <div>
                <CalendarSelector />
            </div>
        );
    }
}

export default PurchasesDash;