import React from 'react';
import {
    Navbar,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink
} from 'reactstrap';

export default class Header extends React.Component {

    constructor(props) {
        super(props);

        this.state = {

        };
    }

    render() {
        return (
            <div>
                <Navbar color="light" light expand="md">
                    <NavbarBrand href="/">360º Dash</NavbarBrand>
                        <Nav className="ml-auto" navbar>
                            <NavItem>
                                <NavLink href="/generic">Generic Dash</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink href="/sales">Sales Dash</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink href="/purchases">Purchases Dash</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink href="/financial">Financial Dash</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink href="/logistics">Logistics Dash</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink href="/humanresources">Human Resources Dash</NavLink>
                            </NavItem>
                        </Nav>
                </Navbar>
            </div>
        );
    }
}