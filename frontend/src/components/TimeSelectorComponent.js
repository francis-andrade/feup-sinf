import React, { Component } from 'react';
import { Row, Col, Container, DropdownItem, DropdownToggle, DropdownMenu, ButtonDropdown } from 'reactstrap';

import '../styles/Common.style.css';
import '../styles/TimeSelector.style.css';

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

class TimeSelectorComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            yearDropdownOpen: false,
            monthDropdownOpen: false
        }

        this.toggleYearDropdown = this.toggleYearDropdown.bind(this);
        this.toggleMonthDropdown = this.toggleMonthDropdown.bind(this);
    }

    toggleYearDropdown() {
        this.setState(prevState => ({
            yearDropdownOpen: !prevState.yearDropdownOpen
        }));
    }

    toggleMonthDropdown() {
        this.setState(prevState => ({
            monthDropdownOpen: !prevState.monthDropdownOpen
        }));
    }

    changeYear = (newValue) => {
        this.props.changeYear(newValue.target.value)
    }

    changeMonth = (newValue) => {
        this.props.changeMonth(newValue.target.value)
    }

    render() {
        return(
            <Container>
                <Row>
                    <Col className='timeSelectorContainer componentBackground'>
                        <Row>
                            <Col xs={{ size: 12 }} md={{ size: 6 }} className='timeSelectorInput align-middle smallScreenStack'>
                                <span className='timeSelectorGroup'>
                                    <span className='timeSelectorText'>Year:</span>
                                    <ButtonDropdown isOpen={this.state.monthDropdownOpen} toggle={this.toggleMonthDropdown}>
                                        <DropdownToggle caret outline color='info' size='lg'>
                                            {this.props.year}
                                        </DropdownToggle>

                                        <DropdownMenu>
                                            <DropdownItem onClick={this.changeYear} value={2017}>
                                                2017
                                            </DropdownItem>
                                            <DropdownItem onClick={this.changeYear} value={2018}>
                                                2018
                                            </DropdownItem>
                                        </DropdownMenu>
                                    </ButtonDropdown>
                                </span>
                            </Col>
                            <Col xs={{ size: 12 }} md={{ size: 6 }} className='timeSelectorInput'>
                                <span className='timeSelectorGroup'>
                                    <span className='timeSelectorText'>Month:</span>
                                    <ButtonDropdown isOpen={this.state.yearDropdownOpen} toggle={this.toggleYearDropdown}>
                                        <DropdownToggle caret outline color='info' size='lg'>
                                            {months[this.props.month - 1]}
                                        </DropdownToggle>

                                        <DropdownMenu>
                                            <DropdownItem onClick={this.changeMonth} value={0}>
                                                ------
                                            </DropdownItem>
                                            <DropdownItem onClick={this.changeMonth} value={1}>
                                                January
                                            </DropdownItem>
                                            <DropdownItem onClick={this.changeMonth} value={2}>
                                                February
                                            </DropdownItem>
                                            <DropdownItem onClick={this.changeMonth} value={3}>
                                                March
                                            </DropdownItem>
                                            <DropdownItem onClick={this.changeMonth} value={4}>
                                                April
                                            </DropdownItem>
                                            <DropdownItem onClick={this.changeMonth} value={5}>
                                                May
                                            </DropdownItem>
                                            <DropdownItem onClick={this.changeMonth} value={6}>
                                                June
                                            </DropdownItem>
                                            <DropdownItem onClick={this.changeMonth} value={7}>
                                                July
                                            </DropdownItem>
                                            <DropdownItem onClick={this.changeMonth} value={8}>
                                                August
                                            </DropdownItem>
                                            <DropdownItem onClick={this.changeMonth} value={9}>
                                                September
                                            </DropdownItem>
                                            <DropdownItem onClick={this.changeMonth} value={10}>
                                                October
                                            </DropdownItem>
                                            <DropdownItem onClick={this.changeMonth} value={11}>
                                                November
                                            </DropdownItem>
                                            <DropdownItem onClick={this.changeMonth} value={12}>
                                                December
                                            </DropdownItem>
                                        </DropdownMenu>
                                    </ButtonDropdown>
                                </span>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default TimeSelectorComponent;