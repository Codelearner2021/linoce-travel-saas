import React, { Component } from 'react';
import { Row, Col } from 'reactstrap';
import classes from './Ticket.css';
var moment = require('moment');

export class Ticket extends Component {
    constructor(props) {
        super(props);

        this. getStatusValue = this.getStatusValue.bind(this);

        this.state = {
            title: this.props.title,
            bookingid: this.props.bookingid,
            chainbookingid: this.props.chainid,
            error: -1,
            is_processing: true,
            booking: this.props.booking
        };
    }

    getCustomerInfo() {
        let customer = this.state.booking.customerUser;

        return (
            <>
            { (customer) ? 
            <div className="customer-info">
                <div className="customer-name">{customer.name} ({customer.id})</div>
                <div>{customer.address}</div>
                <div>{customer.stateInfo.dataValue}</div>
                <div>{customer.countryInfo.dataValue}</div>
                <div>{customer.mobile} | {customer.email}</div>
            </div>
            : null }
            </>
        );
    }

    getGeneralInfo() {
        let booking = this.state.booking;

        return (
            <>
            { (booking) ? 
            <div className="general-info">
                <div className="document-imp-field">{booking.bookingNumber}</div>
                <div className="document-imp-field">{moment(booking.bookingDate).format("DD-MMM-YYYY")}</div>
                <div className="document-imp-field">PNR: {booking.bookingStatus == 2 ? booking.pnr : "XXXXX"}</div>
            </div>
            : null }
            </>
        );
    }

    getPassengersInfo() {
        let bookingStatus = this.state.booking.bookingStatus;
        let passengers = this.state.booking.bookedPassengerMaps;
        let items = [];

        let header = <Row key={`key-0`} className="passenger-item-header no-margin">
                <Col xs="5" sm="5" md={{size: 5}}>Name</Col>
                <Col xs="5" sm="5" md={{size: 5}}>Ticket #</Col>
                <Col xs="2" sm="2" md={{size: 2}}>General.Info</Col>
            </Row>

        items.push(header);

        passengers.map((psngr, idx) => {
            let passengerDom = <Row key={`key-${idx+1}`} className="passenger-item-info no-margin">
                <Col xs="5" sm="5" md={{size: 5}} key={`key-1-${idx}`}>
                    <div className={psngr.flightBookingPassenger.isLeadPAX ? "document-imp-field lead-passenger" : "document-imp-field"}>{`${idx+1} ${psngr.flightBookingPassenger.prefix} ${psngr.flightBookingPassenger.firstName} ${psngr.flightBookingPassenger.lastName} (${psngr.flightBookingPassenger.gender === 1 ? 'M' : 'F'})`}</div>
                    <div className="passenger-contact-info">{`${psngr.flightBookingPassenger.mobile} | ${psngr.flightBookingPassenger.email}`}</div>
                </Col>
                <Col xs="5" sm="5" md={{size: 5}} key={`key-2-${idx}`}>
                    <div className="document-imp-field">{bookingStatus == 2 ? psngr.flightBookingPassenger.pnr : "XXXXX"}</div>
                </Col>
                <Col xs="2" sm="2" md={{size: 2}} key={`key-3-${idx}`}>
                    <div>{psngr.flightBookingPassenger.dob ? `DOB: ${moment(psngr.flightBookingPassenger.dob).format('DD-MMM-YYYY')}` : '-'}</div>
                </Col>
            </Row>

            items.push(passengerDom);
        });

        return items;
    }

    getStatusValue(status) {
        let statusString = 'Pending';
        switch (status) {
            case 0:
                statusString = 'Pending';
                break;
            case 1:
                statusString = 'Hold';
                break;
            case 2:
                statusString = 'Confirmed';
                break;
            case 4:
                statusString = 'Processing';
                break;
            case 8:
                statusString = 'Rejected';
                break;
            case 16:
                statusString = 'Cancelled';
                break;
            default:
                statusString = 'Pending';
                break;
        }

        return statusString;
    }

    getTicketInfo() {
        let bookingStatus = this.state.booking.bookingStatus;
        let tickets = this.state.booking.bookedFlightMaps;
        let items = [];

        let header = <Row key={`key-0`} className="passenger-item-header no-margin">
                <Col xs="3" sm="3" md={{size: 3}}>Flight</Col>
                <Col xs="3" sm="3" md={{size: 3}}>Departure</Col>
                <Col xs="3" sm="3" md={{size: 3}}>Arrival</Col>
                <Col xs="3" sm="3" md={{size: 3}}>Status</Col>
            </Row>

        items.push(header);

        tickets.map((tkt, idx) => {
            let ticket = tkt.bookedFlight;
            let image_path = '';
            try {
                image_path = require(`../../../img/airlines/${ticket.airline.airCode}.jpg`)
            } catch (error) {
                image_path = require(`../../../img/airlines/flight.png`);
                //console.log(error);
            }            

            let ticketDom = <Row key={`key-${idx+1}`} className="passenger-item-info no-margin">
                <Col xs="3" sm="3" md={{size: 3}} key={`key-1-${idx}`}>
                    <ul className="apt-ullist">
                        <li>
                            <img className="airline-logo reviewbox__airlineLogo" src={image_path}/>
                        </li>
                        <li className="apt-listspan">
                            {ticket.airline.displayName}<span className="apt-gridspan at-fontweight graycolor">{`${ticket.airline.airCode}-${ticket.flightNo} | Fare Class: ${ticket.passengerClass}`}</span>
                            <span className="ticketid graycolor">{ticket.refundable == 'Y' ? 'Refundable' : 'Non-Refundable'}</span>
                            {/* <span className="label label-purple ars-flightlabel ars-refunsleft">{ticket.dataCollectedFrom}</span> */}
                        </li>
                    </ul>
                </Col>
                <Col xs="3" sm="3" md={{size: 3}} key={`key-2-${idx}`}>
                    <div>{ticket.sourceCity.name} ({ticket.sourceCity.code})</div>
                    <div>Terminal - {ticket.departingTerminal}</div>
                    <div>{moment(ticket.departureDateTime).format('DD-MMM-YYYY HH:mm')}</div>
                </Col>
                <Col xs="3" sm="3" md={{size: 3}} key={`key-3-${idx}`}>
                    <div>{ticket.destinationCity.name} ({ticket.destinationCity.code})</div>
                    <div>Terminal - {ticket.arrivingTerminal}</div>
                    <div>{moment(ticket.arrivalDateTime).format('DD-MMM-YYYY HH:mm')}</div>
                </Col>
                <Col xs="3" sm="3" md={{size: 3}} key={`key-4-${idx}`}>
                    <div>{this.getStatusValue(bookingStatus)}</div>
                    <div>{ticket.noOfStops == 0 ? 'Non-Stop' : `${ticket.noOfStops} Stop(s)`}</div>
                </Col>
            </Row>

            items.push(ticketDom);
        });

        return items;
    }

    getFinancialInfo() {
        let booking = this.state.booking;
        let price = ((booking.price + booking.markup + booking.adminMarkup) * (booking.adultCount + booking.childCount)) + (booking.infantPrice * booking.infantCount);
        let taxes = (booking.serviceCharge + booking.cgst + booking.sgst - booking.discount) * (booking.adultCount + booking.childCount);

        let header = <Row key={`key-0`} className="passenger-item-header no-margin">
                <Col xs="12" sm="12" md={{size: 12}}>Financial Details</Col>
            </Row>

        return (
            <>
            { (booking) ? 
            <div className="financial-section">
                {header}
                <Row key={`key-1`} className="passenger-item-info no-margin">
                    <Col xs="12" sm="12" md={{size: 12}} className="warning center-align">Transaction Fee/Discount amount will be equally divided on all the pax except infant and cancelled ticket</Col>
                </Row>
                <Row key={`key-2`} className="passenger-item-info no-margin">
                    <Col xs="7" sm="7" md={{size: 7}} className="">This is an Electronic ticket. Please carry a positive identification for Check in.</Col>
                    <Col xs="3" sm="3" md={{size: 3}} className="">
                        <Row className="">
                            <Col xs="7" sm="7" md={{size: 7}} className="document-field-title">Fare</Col>
                            <Col xs="3" sm="3" md={{size: 3}} className="document-field-value">{price}</Col>
                        </Row>
                        <Row className="">
                            <Col xs="7" sm="7" md={{size: 7}} className="document-field-title">Taxes &amp; Charges</Col>
                            <Col xs="3" sm="3" md={{size: 3}} className="document-field-value">{taxes}</Col>
                        </Row>
                        <Row className="document-total">
                            <Col xs="7" sm="7" md={{size: 7}} className="document-field-title">Total Amount</Col>
                            <Col xs="3" sm="3" md={{size: 3}} className="document-field-value">{booking.total}</Col>
                        </Row>
                    </Col>
                </Row>
            </div>
            : null }
            </>
        );        
    }

    render () {
        let random = Math.random();
        let id = this.props.id ? this.props.id : `ticket-${random}`;
        let name = this.props.name ? this.props.name : `ticket-${random}`;

        let customer = this.getCustomerInfo();
        let generalInfo = this.getGeneralInfo();
        let passengersInfo = this.getPassengersInfo();
        let ticketInfo = this.getTicketInfo();
        let financialInfo = this.getFinancialInfo();

        return (
            <div id={id} name={name} className="ticket-view custom_control">
                <Row className="no-margin">
                    <Col xs="5" sm="5" md={{size: 5}}>
                        {customer}
                    </Col>
                    <Col xs="2" sm="2" md={{size: 2}}>
                        <span className="document-imp-field">{this.state.title}</span>
                    </Col>
                    <Col xs="5" sm="5" md={{size: 5}}>
                        {generalInfo}
                    </Col>
                </Row>
                {passengersInfo}
                {ticketInfo}
                {financialInfo}
                <div style={{padding: "5px 10px"}}>Printing of ticket or download in PDF feature is about to come</div>
            </div>
        );
    }
}

export default Ticket;