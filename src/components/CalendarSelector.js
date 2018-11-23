import React, { Component } from 'react';
import { Row, Col, Container } from 'reactstrap';
import { FaCalendarAlt } from 'react-icons/fa';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import moment from 'moment';
import Helmet from 'react-helmet';

import 'react-day-picker/lib/style.css';
import '../style/CalendarSelector.css';

import { formatDate, parseDate } from 'react-day-picker/moment';

class CalendarSelector extends Component {
    constructor(props) {
        super(props);
        this.handleFromChange = this.handleFromChange.bind(this);
        this.handleToChange = this.handleToChange.bind(this);
        this.state = {
          from: undefined,
          to: undefined,
        };
    }

    showFromMonth() {
        const { from, to } = this.state;
        if (!from) {
            return;
        }
        if (moment(to).diff(moment(from), 'months') < 2) {
            this.to.getDayPicker().showMonth(from);
        }
    }

    handleFromChange(from) {
        // Change the from date and focus the "to" input field
        this.setState({ from });
    }
    
    handleToChange(to) {
        this.setState({ to }, this.showFromMonth);
    }

    render() {
        const { from, to } = this.state;
        const modifiers = { start: from, end: to };

        return (
            <Container>
                <Row>
                    <Col xs={{ size: 10, offset: 1 }} lg={{ size: 8, offset: 2 }} xl={{ size: 10, offset: 1 }} className="calendarSelectorContainer">
                        <Row>
                            <Col className="calendarInput">
                                <span>Start Date: </span>
                                <DayPickerInput
                                    value={from}
                                    placeholder="Select a starting date"
                                    format="LL"
                                    formatDate={formatDate}
                                    parseDate={parseDate}
                                    dayPickerProps={{
                                        selectedDays: [from, { from, to }],
                                        disabledDays: { after: to },
                                        toMonth: to,
                                        modifiers,
                                        numberOfMonths: 2,
                                        onDayClick: () => this.to.getInput().focus(),
                                    }}
                                    onDayChange={this.handleFromChange}
                                />
                                <span> <FaCalendarAlt /></span>
                            </Col>
                            <Col className="calendarInput">
                                <span>End Date: </span>
                                <DayPickerInput
                                    ref={el => (this.to = el)}
                                    value={to}
                                    placeholder="Select an ending date"
                                    format="LL"
                                    formatDate={formatDate}
                                    parseDate={parseDate}
                                    dayPickerProps={{
                                        selectedDays: [from, { from, to }],
                                        disabledDays: { before: from },
                                        modifiers,
                                        month: from,
                                        fromMonth: from,
                                        numberOfMonths: 2,
                                    }}
                                    onDayChange={this.handleToChange}
                                />
                                <span> <FaCalendarAlt /></span>
                            </Col>
                            <Helmet>
                                <style>{`
                                    .InputFromTo .DayPicker-Day--selected:not(.DayPicker-Day--start):not(.DayPicker-Day--end):not(.DayPicker-Day--outside) {
                                        background-color: #f0f8ff !important;
                                        color: #4a90e2;
                                    }
                                    .InputFromTo .DayPicker-Day {
                                        border-radius: 0 !important;
                                    }
                                    .InputFromTo .DayPicker-Day--start {
                                        border-top-left-radius: 50% !important;
                                        border-bottom-left-radius: 50% !important;
                                    }
                                    .InputFromTo .DayPicker-Day--end {
                                        border-top-right-radius: 50% !important;
                                        border-bottom-right-radius: 50% !important;
                                    }
                                    .InputFromTo .DayPickerInput-Overlay {
                                        width: 550px;
                                    }
                                    .InputFromTo-to .DayPickerInput-Overlay {
                                        margin-left: -198px;
                                    }
                                `}</style>
                            </Helmet>
                        </Row>
                    </Col>
                </Row>
            </Container>
        )
    }
}

export default CalendarSelector;