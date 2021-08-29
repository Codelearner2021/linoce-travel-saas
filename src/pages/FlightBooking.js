import React, { Component } from "react";
import { Collapse, Container, TabContent, TabPane, Nav, NavItem, NavLink, Card, CardBody, CardImg, Input, InputGroup, InputGroupText, 
    InputGroupAddon, InputGroupButtonDropdown, Button, CardTitle, CardText, Row, Col, CustomInput, Label } from 'reactstrap';
import classnames from 'classnames';
//import ClipLoader from "react-spinners/ClipLoader";
import Switch from '../components/custom_components/switch/Switch'
import Datetime from 'react-datetime';
import PulseLoader from "react-spinners/PulseLoader";
import "../App.css";
import "../styles/Booking.css";
import Login from './Login';
import Register from './Register';
import { toJS, reaction } from 'mobx';
import { withRouter } from "react-router-dom";
import { observer, inject } from 'mobx-react';

import PayuMoney from "../components/custom_components/pg_payumoney/PayuMoney";

var moment = require('moment');

const camel2title = (text) => {
    // const text = text;
    //const result = text.replace(/([A-Z])/g, " $1");
    const finalResult = text.trim().charAt(0).toUpperCase() + text.slice(1).toLowerCase();
    //console.log(finalResult);    
    return finalResult;
}

const time_diff = (startdate, enddate) => {
    var duration = moment.duration(enddate.diff(startdate));
    var hours = duration.asHours();    
    var mins = duration.asMinutes()

    //console.log(`Hours: ${hours} | Minuites: ${mins}`);
    var hr = Math.floor(mins / 60);
    var mn = (mins % 60);
    let formatedString = `${hr}h ${mn}m`;
    //console.log(`Hours: ${hr} | Minuites: ${mn}`);
    return formatedString;
}

class FlightBooking extends Component {
    disposer;

    constructor(props) {
        super(props);

        this.formRef = React.createRef();
        this.pref = React.createRef();

        this.disablePastDt = this.disablePastDt.bind(this);
        this.toggleTab = this.toggleTab.bind(this);

        let selectedFlight = this.props.location.state.selectedFlight;

        let adults = [];
        let childs = [];
        let infants = [];
        let adult_count = selectedFlight.pricing.adultPAX;
        let child_count = selectedFlight.pricing.childPAX;
        let infant_count = selectedFlight.pricing.infantPAX;

        //for adult
        for (let index = 0; index < adult_count; index++) {
            adults.push({
                expanded: index == 0,
                title: '',
                firstName: '',
                lastName: '',
                wheelchair: false,
                passportNeeded: false,
                passport: '',
                dobNeeded: false,
                dob: ''
            });
        }

        //for child
        for (let index = 0; index < child_count; index++) {
            childs.push({
                expanded: false,
                title: '',
                firstName: '',
                lastName: '',
                wheelchair: false,
                passportNeeded: false,
                passport: '',
                dobNeeded: false,
                dob: ''
            });
        }

        //for infant
        for (let index = 0; index < infant_count; index++) {
            infants.push({
                expanded: false,
                title: '',
                firstName: '',
                lastName: '',
                passportNeeded: false,
                passport: '',
                dobNeeded: true,
                dob: '',
            });
        }

        this.state = {
            currentUser: toJS(this.props.CompanyStore.LoggedInUser.user),
            wallet: {},
            selected_flight: selectedFlight,
            passengers: {
                adults: adults,
                childs: childs,
                infants: infants,
                contactDetails: {
                    expanded: true,
                    readAgentInfo: false,
                    mobile: '',
                    email: ''
                },
                taxDetails: {
                    expanded: false,
                    enable: false,
                    registration: '',
                    regCompany: '',
                    regEmail: '',
                    regPhone: ''
                }
            },
            price_changed: this.props.UserStore.SearchResult_Flights.processing,
            payment: {
                mode: '',
                billedAmount: 0.00,
                useWallet: false,
                fromWallet: 0.00,
                useCredit: false,
                fromCredit: 0.00,
                useOnline: false,
                fromOnline: 0.00
            },
            paymentInfo: {status: ''},
            step: 1,
            activeTab: '1'
        }

        if(!selectedFlight) {
            this.props.CommonStore.setAlert('Warning!', 'Invalid selected ticket or booking session is not active', true, false);
        }
        else {
            console.log(JSON.stringify(selectedFlight));
        }
    }

    async componentDidMount() {
        console.log(`Booking process initiated for => ${JSON.stringify(this.state.selectedTicket)}`);
        //let user = toJS(this.props.CompanyStore.LoggedInUser.user);
        //console.log(`BOOKING: Loggin User => ${JSON.stringify(this.props.CompanyStore.LoggedInUser)}`);

        this.disposer = reaction(
            () => this.props.CompanyStore.LoggedInUser.user,
            (arg) => {
                this.setState({
                    currentUser: this.props.CompanyStore.LoggedInUser.user
                })
            }
        );

        let result = await this.props.UserStore.getFareQuote(this.state.selected_flight.id)
        .then(response => {
            console.log(`Search Flight Result : ${JSON.stringify(response)}`);
            let payment = this.state.payment;
            payment.billedAmount = response.updatedFlightTicket ? response.updatedFlightTicket.pricing.totalPerPAX :  0.00;
            this.setState(
            {
                selected_flight: response.updatedFlightTicket, 
                price_changed: response.priceChanged,
                payment: payment
            });
        })
        .catch(error => {
            console.log(error);
        });

        let wallet = await this.props.UserStore.getMyWallet()
        .then(response => {
            console.log(`User with Wallet : ${JSON.stringify(response)}`);
            this.setState({currentUser: response, wallet: response.wallet});

            return response.wallet;
        })
        .catch(error => {
            console.log(error);
        });
    }

    componentWillUnmount() {
        this.disposer();
    }

    BackToFlightSearch = (event, searchPayload) => {
        let step = this.state.step;

        if(step>1) {
            this.setState({step: step - 1});
        }
        else if(step === 1) {
            this.props.history.push({
                pathname: '/search/flight',
                state: {payload : toJS(searchPayload)}
            });        
        }
    }

    hasDuplicatePassengers() {
        let flag = false;
        const map = new Map();

        let passengers = this.state.passengers.adults.concat(this.state.passengers.childs);
        passengers = passengers.concat(this.state.passengers.infants);
        
        for (let index = 0; index < passengers.length; index++) {
            const passenger = passengers[index];
            let key = `${passenger.firstName.toLowerCase()}_${passenger.lastName.toLowerCase()}`;
            flag = map.has(key);
            if(!flag) {
                map.set(key, passenger);
            }
            else {
                break;
            }
        }

        return flag;
    }

    //Start of Events
    RedirectToSearch = (event) => {
        this.props.history.push({pathname: '/'});
    }

    toggleSection(event, section, index) {
        let passengers = this.state.passengers;
        
        if(section === 'adult') {
            passengers.adults[index].expanded = !passengers.adults[index].expanded;
        }
        else if(section === 'child') {
            passengers.childs[index].expanded = !passengers.childs[index].expanded;
        }
        else if(section === 'infant') {
            passengers.infants[index].expanded = !passengers.infants[index].expanded;
        }
        else if(section === 'contactDetails') {
            passengers.contactDetails.expanded = !passengers.contactDetails.expanded;
        }

        this.setState({passengers: passengers});
    }

    MoveNext(event, stepnumber=-1) {
        let step = this.state.step;
        console.log(`Passengers: ${JSON.stringify(this.state.passengers)}`);

        if(step === 2) {
            let passengerValid = this.formRef.current.reportValidity();
            let hasDuplicatePassengers = this.hasDuplicatePassengers();
            if(!passengerValid || hasDuplicatePassengers) {
                this.props.CommonStore.setAlert('Warning!', 'Please provide all the passenger details. Passenger names can`t be duplicate', true, true);
                return false;
            }
        }

        if(stepnumber === -1 && step<4) {
            this.setState({step: step+1});
        }
        else if(stepnumber>-1) {
            this.setState({step: stepnumber});
        }
    }

    disablePastDt(currentDate, selectedDate, dept_date, allowedYearFrom = 2, allowedYearTill = -1) {
        const previousDate = moment(dept_date).subtract(allowedYearFrom, 'year');
        const toDate = allowedYearTill === -1 ? moment() : moment(dept_date).subtract(allowedYearTill, 'year');
        //return current.isAfter(yesterday);
        return currentDate.isBefore(toDate) && currentDate.isAfter(previousDate);
    };    

    readAgentContactInfo(event) {
        this.handleInputChange(event, 'contactDetails','readAgentInfo',-1)
        const passengers = this.state.passengers;
        const currentUser = this.state.currentUser;
        const target = event.target;
        const isMoment = event._isAMomentObject;
        const value = target ? (target.type === 'checkbox' ? target.checked : target.value) : (isMoment ? event.format('YYYY-MM-DD') : '');

        if(value) {
            passengers.contactDetails.mobile = this.props.CompanyStore.LoggedInUser.user.mobile;
            passengers.contactDetails.email = this.props.CompanyStore.LoggedInUser.user.email;
        }

        this.setState({passengers});
    }

    toggleTab(tab) {
        if (this.state.activeTab !== tab) {
            this.resetPaymentChoices();

            let payment = this.state.payment;
            if(tab === '1') 
            {
                payment.useOnline = false;
                payment.fromOnline = 0.00;
            }
            else if(tab === '2') {
                payment.useOnline = true;
                payment.fromOnline = this.state.selected_flight ? this.state.selected_flight.pricing.totalPerPAX : 0.00;
            }

            this.setState({
                activeTab: tab,
                payment : payment
            });
        }
    }

    async ProcessPaymentOnline(event) {
        let paymentProcessingData = {
            ticket: toJS(this.state.selected_flight),
            payment: toJS(this.state.payment),
            passengers: toJS(this.state.passengers)
        }
        console.log(`Payment Processing Data ${JSON.stringify(paymentProcessingData)}`);

        let payment_data = await this.props.UserStore.initiatePaymentProcessingOnline(paymentProcessingData)
        .then(response => {
            console.log(`Payment Info : ${JSON.stringify(response)}`);
            this.setState({paymentInfo: response});
            
            console.log(`Initiating payment ...`);
            this.pref.current.processPayment(response);
            this.retryOnlinePaymentStatus = 0;

            if(response.transactionId) {
                this.timeoutHandler = setTimeout((traceid) => {
                    this.checkOnlinePaymentStatus(traceid);
                }, 2000, response.transactionId);
            }

            return response;
        })
        .catch(error => {
            console.log(error);
        });
    }

    async BookNow(event) {
        let paymentProcessingData = {
            ticket: toJS(this.state.selected_flight),
            payment: toJS(this.state.payment),
            passengers: toJS(this.state.passengers)
        }
        console.log(`Payment Processing Data ${JSON.stringify(paymentProcessingData)}`);

        //this os the place to call book now api
        this.props.CommonStore.setAlert('Information!', 'We are about to book your ticket', true, false);

        // this.props.history.push({
        //     pathname: '/search/flight',
        //     state: {payload : toJS(searchPayload)}
        // });

        let payment_data = await this.props.UserStore.initiatePaymentProcessingOnline(paymentProcessingData)
        .then(response => {
            console.log(`Payment Info : ${JSON.stringify(response)}`);
            this.setState({paymentInfo: response});
            
            console.log(`Initiating payment ...`);
            this.pref.current.processPayment(response);
            this.retryOnlinePaymentStatus = 0;

            if(response.transactionId) {
                this.timeoutHandler = setTimeout((traceid) => {
                    this.checkOnlinePaymentStatus(traceid);
                }, 2000, response.transactionId);
            }

            return response;
        })
        .catch(error => {
            console.log(error);
        });
    }
    //End of Events

    async checkOnlinePaymentStatus(traceid) {
        let payment_data = await this.props.UserStore.getOnlinePaymentStatus(traceid)
        .then(response => {
            console.log(`Payment Info : ${JSON.stringify(response)}`);
            if(response.status !== '') {
                clearTimeout(this.timeoutHandler);
                let paymentInfo = this.state.paymentInfo;
                paymentInfo.status = response.status;
                paymentInfo.flag = response.flag;
                paymentInfo.pgTransactionId = response.paymentGatewayTransId;
                paymentInfo.bankTransId = response.bankTransId;
                paymentInfo.bankName = response.bankName;
                paymentInfo.walletTransactionId = response.walletTransactionId;
                paymentInfo.booking = response.booking;
    
                this.setState({paymentInfo: paymentInfo});
                
                console.log(`Payment stauts : ${paymentInfo.status} | Booking Id : ${paymentInfo.booking ? paymentInfo.booking.id : -1}`);

                this.pref.current.processComplete(paymentInfo.status);
            }
            else {
                if(this.retryOnlinePaymentStatus > 1000) {
                    clearTimeout(this.timeoutHandler);
                }
                else {
                    this.retryOnlinePaymentStatus++;
                    this.timeoutHandler = setTimeout((traceid) => {
                        this.checkOnlinePaymentStatus(traceid);
                    }, 500, traceid);
                }
            }
            return response;
        })
        .catch(error => {
            console.log(error);
        });
    }

    resetPaymentChoices() {
        let payment = this.state.payment;
        payment.fromCredit = 0.00;
        payment.useCredit = false;
        payment.fromWallet = 0.00;
        payment.useWallet = false;
        payment.fromOnline = 0.00;
        payment.useOnline = false;

        this.setState({
            payment: payment
        });
    }

    getHeader(stepnumber) {
        return (
          <div className="search-header-section">
            <div className="apt-section">
              <div className="container">
                <Row>
                  <Col xs="4" sm="3" className="booking-top-btn no-padding" onClick={(ev) => this.MoveNext(ev, 1)}>
                    <div className={stepnumber === 1 ? "apt-common apt-firstep selected" : "apt-common apt-firstep"}>
                      <span className="graycolor">
                        <span>FIRST STEP</span>
                      </span>
                      <h4 className="apt-flightiti">
                        <span>Flight Itinerary</span>
                      </h4>
                    </div>
                  </Col>
                  <Col xs="4" sm="3" className="booking-top-btn no-padding" onClick={(ev) => this.MoveNext(ev, 2)}>
                    <div className={stepnumber === 2 ? "apt-common apt-second selected" : "apt-common apt-second"}>
                      <span className="graycolor">
                        <span>SECOND STEP</span>
                      </span>
                      <h4 className="apt-flightiti">
                        <span>Passenger Details</span>
                      </h4>
                    </div>
                  </Col>
                  <Col xs="4" sm="3" className="booking-top-btn no-padding" onClick={(ev) => this.MoveNext(ev, 3)}>
                    <div className={stepnumber === 3 ? "apt-common apt-third selected" : "apt-common apt-third"}>
                      <span className="graycolor">
                        <span>THIRD STEP</span>
                      </span>
                      <h4 className="apt-flightiti">
                        <span>Review</span>
                      </h4>
                    </div>
                  </Col>
                  <Col xs="4" sm="3" className="booking-top-btn no-padding" onClick={(ev) => this.MoveNext(ev, 4)}>
                    <div className={stepnumber === 4 ? "apt-common apt-forth selected" : "apt-common apt-forth"}>
                      <span className="graycolor">
                        <span>FINAL STEP</span>
                      </span>
                      <h4 className="apt-flightiti">
                        <span>Payments</span>
                      </h4>
                    </div>
                  </Col>
                </Row>
              </div>
            </div>
          </div>
        );
    }

    getLayover(previousSegment, currentSegment) {

        let previousFlightCode = `${previousSegment.airline.airlineCode}-${previousSegment.airline.flightNumber}`;
        let currentFlightCode = `${currentSegment.airline.airlineCode}-${currentSegment.airline.flightNumber}`;

        let changeFlight = previousFlightCode === currentFlightCode;

        return (
            <Row>
                <Col xs="12" sm="12" className="center-text">
                    <div className="layover-text">{!changeFlight ? 'Required to change flight' : 'No change of flight'} | Layover Time - {time_diff(moment(previousSegment.destination.arrTime), moment(currentSegment.origin.depTime))}</div>
                </Col>
            </Row>
        );
    }

    getSelectedFlightDetails(flight) {
        let image_path = '';
        try {
            image_path = require(`../img/airlines/${flight.airlineInfo.image}.jpg`)
        } catch (error) {
            image_path = require(`../img/airlines/flight.png`);
            console.log(error);
        }

        return (
            <Row className="mt-10 media-print-flightview" key="row-1">
                <Col xs="12" sm="3" className="no-paddmobile media__print-logoname">
                    <ul className="apt-ullist">
                        <li>
                            <img className="airline-logo reviewbox__airlineLogo" src={image_path}/>
                        </li>
                        <li className="apt-listspan">
                            {flight.airlineInfo.displayName}<span className="apt-gridspan at-fontweight graycolor">{flight.flightNo}</span>
                            <span className="ticketid graycolor">{flight.id}</span>
                            <span className="label label-purple ars-flightlabel ars-refunsleft">{flight.inventorySourceName}</span>
                        </li>
                    </ul>
                    <div className="text-right farerule-mobile hidden">
                        <button type="button" className="btn btn-default farerule-button">Fare Rules</button>
                    </div>
                </Col>
                <Col xs="12" sm="7" className="no-paddmobile">
                    <ul className="apt-namelist">
                        <li>{moment(flight.departureDateTime).format('MMM Do, ddd, HH:mm')}
                            <span className="apt-airportname at-fontweight graycolor">{flight.sourceLocation.name}</span> 
                            {/* <span className="apt-airport graycolor">Delhi Indira Gandhi Intl</span> */}
                            <span className="apt-airterminal graycolor">{`Terminal ${flight.terminal}`}</span>
                        </li>
                        <li className="">
                            <span className="stop-text">{flight.noOfStops>0 ? `${flight.noOfStops} Stop(s)` : 'Non-Stop'}</span>
                            {/* <center> */}
                                <span className="flight-arrow-itinenry-page"></span>
                                {/* <img className="media__right-arrow-image" src={image_path}/> */}
                            {/* </center> */}
                            <span className="via-city-codes"></span>
                        </li>
                        <li>{moment(flight.arrivalDateTime).format('MMM Do, ddd, HH:mm')}
                            <span className="apt-airportname at-fontweight graycolor">{flight.destinationLocation.name}</span> 
                            {/* <span className="apt-airport graycolor">Delhi Indira Gandhi Intl</span> */}
                            <span className="apt-airterminal graycolor"></span>
                        </li>
                    </ul>
                </Col>
                <Col xs="12" sm="2" className="col-sm-2 col-xs-12 no-paddmobile">
                    <p className="apt-lasthour">{time_diff(moment(flight.departureDateTime), moment(flight.arrivalDateTime))}
                        <span className="at-fontweight graycolor apt-classname">{flight.class} | {flight.refundable === 'YES' ? 'Refundable' : 'Non-Refundable'}</span>
                    </p>
                </Col>
            </Row>
        );
    }

    getClass(cabinClass) {
        let className = 'Economy';
        switch (cabinClass) {
            case 2:
            case 3:
            case 4:
                className = 'Economy';
                break;
            case 4:
                className = 'Business';
                break;        
            default:
                break;
        }

        return className;
    }

    getSegments(flight) {
        let segments = flight.segments;
        if(!segments || segments.length===0) return null;

        let previousSegment = null;

        let segmentsDOM = segments.map((segment, idx) => {
            let image_path = '';
            try {
                image_path = require(`../img/airlines/${segment.airline.airlineCode}.jpg`)
            } catch (error) {
                image_path = require(`../img/airlines/flight.png`);
                console.log(error);
            }

            let Layover = previousSegment ? this.getLayover(previousSegment, segment) : null;

            previousSegment = segment;
            return (
                <div key={`divkey-${idx}`}>
                    {Layover}
                    <Row className="mt-10 media-print-flightview" key={`rowkey-${idx}`}>
                        <Col xs="12" sm="3" className="no-paddmobile media__print-logoname">
                            <ul className="apt-ullist">
                                <li>
                                    <img className="airline-logo reviewbox__airlineLogo" src={image_path}/>
                                </li>
                                <li className="apt-listspan">
                                    {segment.airline.airlineName}<span className="apt-gridspan at-fontweight graycolor">{`${segment.airline.airlineCode}-${segment.airline.flightNumber} | Fare Class: ${segment.airline.fareClass}`}</span>
                                    <span className="ticketid graycolor">{flight.id}</span>
                                    <span className="label label-purple ars-flightlabel ars-refunsleft">{flight.inventorySourceName}</span>
                                </li>
                            </ul>
                            <div className="flight-rules graycolor">(Adult) Check-in: {segment.baggage} | cabin: {segment.cabinBaggage}</div>
                        </Col>
                        <Col xs="12" sm="7" className="no-paddmobile">
                            <ul className="apt-namelist">
                                <li>{moment(segment.origin.depTime).format('MMM Do, ddd, HH:mm')}
                                    <span className="apt-airportname at-fontweight">{`${segment.origin.airport.cityName}-(${segment.origin.airport.countryName})`}</span> 
                                    <span className="apt-airport">{segment.origin.airport.airportName}</span>
                                    <span className="apt-airterminal">{`Terminal ${segment.origin.airport.terminal}`}</span>
                                </li>
                                <li className="">
                                    <span className="stop-text">{segment.stopOver ? `${segments.length-1} Stop(s)` : 'Non-Stop'}</span>
                                    {/* <center> */}
                                        <span className="flight-arrow-itinenry-page"></span>
                                        {/* <img className="media__right-arrow-image" src={image_path}/> */}
                                    {/* </center> */}
                                    <span className="via-city-codes"></span>
                                </li>
                                <li>{moment(segment.destination.arrTime).format('MMM Do, ddd, HH:mm')}
                                    <span className="apt-airportname at-fontweight">{`${segment.destination.airport.cityName}-(${segment.destination.airport.countryName})`}</span> 
                                    <span className="apt-airport ">{segment.destination.airport.airportName}</span>
                                    <span className="apt-airterminal">{`Terminal ${segment.destination.airport.terminal}`}</span>
                                </li>
                            </ul>
                        </Col>
                        <Col xs="12" sm="2" className="col-sm-2 col-xs-12 no-paddmobile">
                            <p className="apt-lasthour">{time_diff(moment(segment.origin.depTime), moment(segment.destination.arrTime))}
                                <span className="at-fontweight graycolor apt-classname">{this.getClass(segment.cabinClass)} | {flight.refundable === 'YES' ? 'Refundable' : 'Non-Refundable'}</span>
                            </p>
                        </Col>
                    </Row>
                </div>
            );
        });

        return segmentsDOM;
    }

    getFlightInfo(flight) {
        let actionSection = this.getActionSection();

        return (
            <div id="selected-ticket-section">
                <div className="booking-header">
                    <h3 className="apt-heading">
                        <span>Flight Details</span>
                    </h3>
                    <div className="booking-header-right" onClick={(ev) => this.RedirectToSearch(ev)}>
                        <Button outline color="primary" className="asr-book">
                            <i className="fa fa-angle-double-left"></i>&nbsp;<span>Back to Search</span>
                        </Button>
                    </div>
                </div>
                <div className="scrollable  wrapper-mainclass">
                    <div className="apt-btmborder">
                        <p className="apt-firstpr">
                            {flight.sourceLocation.code}
                            <span className="apt-arrowpr">{flight.tripType === 'ONE' ? ' → ' : ' ↔ '}</span>
                            {flight.destinationLocation.code}&nbsp;
                            <span className="graycolor at-fontweight">
                                <span>on</span> &nbsp;{moment(flight.departureDateTime).format('ddd, MMM Do YYYY')}
                            </span>
                            <span className="apt-redpr at-fontweight hidden">
                                <i className="fa fa-info-circle"></i>
                                <span>Arrives next day</span>
                            </span>
                            <span className="pull-right">
                                <i className="fa fa-clock-o"></i> {time_diff(moment(flight.departureDateTime), moment(flight.arrivalDateTime))}
                            </span>
                        </p>
                        <div>
                            {flight.segments && flight.segments.length>0 ? this.getSegments(flight) : this.getSelectedFlightDetails(flight)}
                        </div>
                        <Button outline color="secondary" className="asr-viewbtn">
                            <span>Fare Rules</span>&nbsp;<i className="fa fa-plus"></i>
                        </Button>
                    </div>
                    {actionSection}
                </div>
            </div>
        );
    }

    getFlightPricingInfo(flight) {
        let pax = (parseInt(flight.pricing.adultPAX) + parseInt(flight.pricing.childPAX));
        let adult_price = parseFloat(flight.pricing.basePrice) * pax;
        //console.log(`Infant pricing : ${parseFloat(flight.pricing.infantBasePrice)} | Infant PAX : ${flight.pricing.infantPAX}`);
        let infant_price = (parseFloat(flight.pricing.infantBasePrice)) * (parseInt(flight.pricing.infantPAX));

        let adult_markup = parseFloat(flight.pricing.markup) * pax;
        let adult_taxes = (flight.pricing.serviceCharge + flight.pricing.tax - flight.pricing.discount) * (parseInt(flight.pricing.adultPAX) + parseInt(flight.pricing.childPAX));

        let total_price = flight.pricing.totalPerPAX;

        //console.log(`Adult Pricing: ${adult_price} | Infant Pricing: ${infant_price} | Adult Taxes: ${adult_taxes} | Total Price: ${total_price}`);

        return (
            <div id="booking-financial-section">
                <div className="pricing-container">
                    <h4 className="graycolor">FARE SUMMARY</h4>
                    <Row>
                        <Col xs="7" sm="7" md={{size: 7}}>
                            <span className="field-title">Base fare</span>
                        </Col>
                        <Col xs="5" sm="5" md={{size: 5}} className="text-right">
                            <span className="currency-text">₹ {adult_price + infant_price + adult_markup}</span>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs="7" sm="7" md={{size: 7}}>
                            <span className="field-title">Taxes &amp; fees</span>
                        </Col>
                        <Col xs="5" sm="5" md={{size: 5}} className="text-right">
                            <span className="currency-text">₹ {adult_taxes}</span>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs="7" sm="7" md={{size: 7}}>
                            <span className="field-title">Amount to Pay</span>
                        </Col>
                        <Col xs="5" sm="5" md={{size: 5}} className="text-right">
                            <span className="currency-text">₹ {total_price}</span>
                        </Col>
                    </Row>
                    
                    { this.state.payment && this.state.payment.useWallet && this.state.payment.fromWallet>0 ?
                    <Row>
                        <Col xs="7" sm="7" md={{size: 7}}>
                            <span className="field-title">Pay from wallet</span>
                        </Col>
                        <Col xs="5" sm="5" md={{size: 5}} className="text-right">
                            <span className="currency-text">₹ {this.state.payment.fromWallet}</span>
                        </Col>
                    </Row>
                    : null }

                    {this.state.payment && this.state.payment.useCredit && this.state.currentUser.allowCredit && this.state.payment.fromCredit>0 ?
                    <Row>
                        <Col xs="7" sm="7" md={{size: 7}}>
                            <span className="field-title">Pay by credit limit</span>
                        </Col>
                        <Col xs="5" sm="5" md={{size: 5}} className="text-right">
                            <span className="currency-text">₹ {this.state.payment.fromCredit}</span>
                        </Col>
                    </Row>
                    : null }
                </div>
            </div>
        );
    }

    handleInputChange(event, objectType, fieldName, objectIndex) {
        const payment = this.state.payment;
        const passengers = this.state.passengers;
        const target = event.target;
        const isMoment = event._isAMomentObject;
        const value = target ? (target.type === 'checkbox' ? target.checked : target.value) : (isMoment ? event.format('YYYY-MM-DD') : '');

        if(objectType === 'adult')
            passengers.adults[objectIndex][fieldName] = value;
        else if(objectType === 'child')
            passengers.childs[objectIndex][fieldName] = value;
        else if(objectType === 'infant')
            passengers.infants[objectIndex][fieldName] = value;
        else if(objectType === 'contactDetails')
            passengers.contactDetails[fieldName] = value;
        else if(objectType === 'payment') {
            payment['billedAmount'] = this.state.selected_flight.pricing.totalPerPAX;
            payment[fieldName] = value;
            if(fieldName === 'useWallet') {
                if(value) {
                    payment['fromWallet'] = this.state.selected_flight.pricing.totalPerPAX > this.state.currentUser.wallet.balance ? this.state.currentUser.wallet.balance : this.state.selected_flight.pricing.totalPerPAX;
                }
                else {
                    payment['fromWallet'] = 0.00;
                }
                payment['fromCredit'] = this.state.currentUser.allowCredit && ((payment['billedAmount'] - payment['fromWallet'])<=this.state.currentUser.creditLimit || this.state.currentUser.creditLimit<=0) ? (payment['billedAmount'] - payment['fromWallet']) : 0.00;
                payment['useCredit'] = payment['fromCredit'] > 0;
            }
            else if(fieldName === 'useCredit') {
                if(value) {
                    //payment['fromCredit'] = this.state.currentUser.allowCredit && ((payment['billedAmount'] - payment['fromWallet'])<=this.state.currentUser.creditLimit || this.state.currentUser.creditLimit<=0) ? (payment['billedAmount'] - payment['fromWallet']) : 0.00;
                    payment['fromCredit'] = this.state.currentUser.allowCredit && (payment['billedAmount'] <= this.state.currentUser.creditLimit || this.state.currentUser.creditLimit <= 0) ? payment['billedAmount'] : 0.00;
                    payment['fromWallet'] = (payment['billedAmount'] - payment['fromCredit']) >= this.state.currentUser.wallet.balance ? this.state.currentUser.wallet.balance : (payment['billedAmount'] - payment['fromCredit']);
                }
                else {
                    payment['fromCredit'] = 0.00
                    payment['fromWallet'] = (payment['billedAmount'] - payment['fromCredit']) >= this.state.currentUser.wallet.balance ? this.state.currentUser.wallet.balance : (payment['billedAmount'] - payment['fromCredit']);
                    //payment['fromWallet'] = this.state.selected_flight.pricing.totalPerPAX > this.state.currentUser.wallet.balance ? this.state.currentUser.wallet.balance : this.state.selected_flight.pricing.totalPerPAX;
                    //payment['fromCredit'] = this.state.currentUser.allowCredit && ((payment['billedAmount'] - payment['fromWallet'])<=this.state.currentUser.creditLimit || this.state.currentUser.creditLimit<=0) ? (payment['billedAmount'] - payment['fromWallet']) : 0.00;
                }
                payment['useWallet'] = payment['fromWallet'] > 0;

                payment['useCredit'] = payment['fromCredit'] > 0;
                if(value && payment['fromCredit'] < (payment['billedAmount'] - payment['fromWallet'])) {
                    this.props.CommonStore.setAlert('Warning!', 'Either you are not allowed for credit or already exhausted all your credit', true, true);
                }
            }
        }

        if(objectType === 'payment') {
            this.setState({payment});
        }
        else {
            this.setState({passengers});
        }
    }

    getAdultPassengerSection(adultIndex) {
        return (
            <div key={`adultkey-${adultIndex}`} className="bk-passenger-section">
                <div className="bk-section-heading pax-box-arrow" onClick={(ev) => this.toggleSection(ev, 'adult', adultIndex)}>
                    <h5 className="section-title">
                        <span>Adult {`${adultIndex+1} : ${this.state.passengers.adults[adultIndex].title} ${this.state.passengers.adults[adultIndex].firstName} ${this.state.passengers.adults[adultIndex].lastName}`}</span>: (12 + yrs)
                        <span className="pull-right paxdetails-accordian-arrow">
                            <i className={this.state.passengers.adults[adultIndex].expanded ? 'fa fa-angle-down' : 'fa fa-angle-up'}/>
                        </span>
                    </h5>
                </div>
                <Collapse isOpen={this.state.passengers.adults[adultIndex].expanded}>
                    <Card>
                        <CardBody>
                            <Row>
                                <Col xs="12" sm="6" md={{size: 4}} className="">
                                    <InputGroup>
                                        <InputGroupAddon addonType="prepend">
                                            <InputGroupText><i className="fa fa-user-o" aria-hidden="true"></i></InputGroupText>
                                        </InputGroupAddon>
                                        <select value={this.state.passengers.adults[adultIndex].title} onChange={(ev) => this.handleInputChange(ev, 'adult','title',adultIndex)} className="name_title" required>
                                            <option value="">Title</option>
                                            <option value="Mr">Mr</option>
                                            <option value="Mrs">Mrs</option>
                                            <option value="Ms">Ms</option>
                                        </select>
                                        <Input placeholder="First Name" type="text" value={this.state.passengers.adults[adultIndex].firstName} onChange={(ev) => this.handleInputChange(ev, 'adult','firstName',adultIndex)} required={true}/>
                                        <Input placeholder="Last Name" type="text" value={this.state.passengers.adults[adultIndex].lastName} onChange={(ev) => this.handleInputChange(ev, 'adult','lastName',adultIndex)} required={true}/>
                                    </InputGroup>
                                </Col>
                                <Col xs="12" sm="6" md={{size: 4}} className="">
                                    <InputGroup>
                                        <InputGroupAddon addonType="prepend">
                                            <InputGroupText><i className="fa fa-wheelchair" aria-hidden="true"></i></InputGroupText>
                                        </InputGroupAddon>
                                        <Switch id={`adult_wheelChair-${adultIndex}`} name={`adult_wheelChair-${adultIndex}`} value={this.state.passengers.adults[adultIndex].wheelchair} onChange={(ev) => this.handleInputChange(ev, 'adult','wheelchair',adultIndex)}>Wheelchair needed ?</Switch>
                                    </InputGroup>
                                </Col>
                                {this.state.passengers.adults[adultIndex].dobNeeded ?                                 
                                    <Col xs="12" sm="6" md={{size: 4}} className="">
                                        <InputGroup>
                                            <InputGroupAddon addonType="prepend">
                                                <InputGroupText><i className="fa fa-calendar-o" aria-hidden="true"></i></InputGroupText>
                                            </InputGroupAddon>
                                            <Datetime className="dob-picker" dateFormat="YYYY-MM-DD" timeFormat={false} value={this.state.passengers.adults[adultIndex].dob} onChange={(ev) => this.handleInputChange(ev, 'adult','dob',adultIndex)} closeOnSelect={true} closeOnTab={true} 
                                                    isValidDate={(currentDate, selectedDate) => this.disablePastDt(currentDate, selectedDate, this.state.selected_flight.departureDateTime, 100, 12)} inputProps={{required: true}}/>
                                        </InputGroup>
                                    </Col>
                                : null }
                            </Row>
                        </CardBody>
                    </Card>
                </Collapse>
            </div>            
        );
    }

    getChildPassengerSection(childIndex) {
        return (
            <div key={`childkey-${childIndex}`} className="bk-passenger-section">
                <div className="bk-section-heading pax-box-arrow" onClick={(ev) => this.toggleSection(ev, 'child', childIndex)}>
                    <h5 className="section-title">
                        <span>Child {`${childIndex+1} : ${this.state.passengers.childs[childIndex].title} ${this.state.passengers.childs[childIndex].firstName} ${this.state.passengers.childs[childIndex].lastName}`}</span>: (2 + yrs)
                        <span className="pull-right paxdetails-accordian-arrow">
                            <i className={this.state.passengers.childs[childIndex].expanded ? 'fa fa-angle-down' : 'fa fa-angle-up'}/>
                        </span>
                    </h5>
                </div>
                <Collapse isOpen={this.state.passengers.childs[childIndex].expanded}>
                    <Card>
                        <CardBody>
                            <Row>
                                <Col xs="12" sm="6" md={{size: 4}} className="">
                                    <InputGroup>
                                        <InputGroupAddon addonType="prepend">
                                            <InputGroupText><i className="fa fa-user-o" aria-hidden="true"></i></InputGroupText>
                                        </InputGroupAddon>
                                        <select value={this.state.passengers.childs[childIndex].title} onChange={(ev) => this.handleInputChange(ev, 'child','title',childIndex)} className="name_title" required={true}>
                                            <option value="">Title</option>
                                            <option value="Ms">Ms</option>
                                            <option value="Master">Master</option>
                                        </select>
                                        <Input placeholder="First Name" type="text" value={this.state.passengers.childs[childIndex].firstName} onChange={(ev) => this.handleInputChange(ev, 'child','firstName',childIndex)} required={true}/>
                                        <Input placeholder="Last Name" type="text" value={this.state.passengers.childs[childIndex].lastName} onChange={(ev) => this.handleInputChange(ev, 'child','lastName',childIndex)} required={true}/>
                                    </InputGroup>
                                </Col>
                                <Col xs="12" sm="6" md={{size: 4}} className="">
                                    <InputGroup>
                                        <InputGroupAddon addonType="prepend">
                                            <InputGroupText><i className="fa fa-wheelchair" aria-hidden="true"></i></InputGroupText>
                                        </InputGroupAddon>
                                        <Switch id={`child_wheelChair-${childIndex}`} name={`child_wheelChair-${childIndex}`} value={this.state.passengers.childs[childIndex].wheelchair} onChange={(ev) => this.handleInputChange(ev, 'child','wheelchair',childIndex)}>Wheelchair needed ?</Switch>
                                    </InputGroup>
                                </Col>
                                {this.state.passengers.childs[childIndex].dobNeeded ?                                 
                                    <Col xs="12" sm="6" md={{size: 4}} className="">
                                        <InputGroup>
                                            <InputGroupAddon addonType="prepend">
                                                <InputGroupText><i className="fa fa-calendar-o" aria-hidden="true"></i></InputGroupText>
                                            </InputGroupAddon>
                                            <Datetime className="dob-picker" dateFormat="YYYY-MM-DD" timeFormat={false} value={this.state.passengers.childs[childIndex].dob} onChange={(ev) => this.handleInputChange(ev, 'child','dob',childIndex)} closeOnSelect={true} closeOnTab={true} 
                                                    isValidDate={(currentDate, selectedDate) => this.disablePastDt(currentDate, selectedDate, this.state.selected_flight.departureDateTime, 12, 2)} inputProps={{required: true}}/>
                                        </InputGroup>
                                    </Col>
                                : null }                                
                            </Row>
                        </CardBody>
                    </Card>
                </Collapse>
            </div>            
        );
    }

    getInfantPassengerSection(infantIndex, isViewOnly = false) {
        return (
            <div key={`infantkey-${infantIndex}`} className="bk-passenger-section">
                <div className="bk-section-heading pax-box-arrow" onClick={(ev) => this.toggleSection(ev, 'infant', infantIndex)}>
                    <h5 className="section-title">
                        <span>Infant {`${infantIndex+1} : ${this.state.passengers.infants[infantIndex].title} ${this.state.passengers.infants[infantIndex].firstName} ${this.state.passengers.infants[infantIndex].lastName}`}</span>: (0 - 2 yrs)
                        <span className="pull-right paxdetails-accordian-arrow">
                            <i className={this.state.passengers.infants[infantIndex].expanded ? 'fa fa-angle-down' : 'fa fa-angle-up'}/>
                        </span>
                    </h5>
                </div>
                <Collapse isOpen={this.state.passengers.infants[infantIndex].expanded}>
                    <Card>
                        <CardBody>
                            <Row>
                                <Col xs="12" sm="6" md={{size: 6}} className="">
                                    <InputGroup>
                                        <InputGroupAddon addonType="prepend">
                                            <InputGroupText><i className="fa fa-user-o" aria-hidden="true"></i></InputGroupText>
                                        </InputGroupAddon>
                                        <select value={this.state.passengers.infants[infantIndex].title} onChange={(ev) => this.handleInputChange(ev, 'infant','title',infantIndex)} className="name_title" required={true}>
                                            <option value="">Title</option>
                                            <option value="Ms">Ms</option>
                                            <option value="Master">Master</option>
                                        </select>
                                        <Input placeholder="First Name" type="text" value={this.state.passengers.infants[infantIndex].firstName} onChange={(ev) => this.handleInputChange(ev, 'infant','firstName',infantIndex)}/>
                                        <Input placeholder="Last Name" type="text" value={this.state.passengers.infants[infantIndex].lastName} onChange={(ev) => this.handleInputChange(ev, 'infant','lastName',infantIndex)}/>
                                    </InputGroup>
                                </Col>
                                {this.state.passengers.infants[infantIndex].dobNeeded ?                                 
                                    <Col xs="12" sm="6" md={{size: 6}} className="">
                                        <InputGroup>
                                            <InputGroupAddon addonType="prepend">
                                                <InputGroupText><i className="fa fa-calendar-o" aria-hidden="true"></i></InputGroupText>
                                            </InputGroupAddon>
                                            <Datetime className="dob-picker" dateFormat="YYYY-MM-DD" timeFormat={false} placeholder="Date of birth" value={this.state.passengers.infants[infantIndex].dob} onChange={(ev) => this.handleInputChange(ev, 'infant','dob',infantIndex)} closeOnSelect={true} closeOnTab={true} 
                                                    isValidDate={(currentDate, selectedDate) => this.disablePastDt(currentDate, selectedDate, this.state.selected_flight.departureDateTime, 2, -1)} inputProps={{required: true}}/>
                                        </InputGroup>
                                    </Col>
                                : null }
                            </Row>
                        </CardBody>
                    </Card>
                </Collapse>
            </div>            
        );
    }

    getContactDetailsSection(isViewOnly = false) {
        return (
            <div key={`contactkey-0`} className="bk-passenger-section">
                <div className="bk-section-heading pax-box-arrow" onClick={(ev) => this.toggleSection(ev, 'contactDetails', -1)}>
                    <h5 className="section-title">
                        <span>Contact Details : <i className="fa fa-mobile" aria-hidden="true"></i>&nbsp;{this.state.passengers.contactDetails.mobile} | <i className="fa fa-envelope-o" aria-hidden="true"></i>&nbsp;{this.state.passengers.contactDetails.email}</span>
                        <span className="pull-right paxdetails-accordian-arrow">
                            <i className={this.state.passengers.contactDetails.expanded ? 'fa fa-angle-down' : 'fa fa-angle-up'}/>
                        </span>
                    </h5>
                </div>
                <Collapse isOpen={this.state.passengers.contactDetails.expanded}>
                    <Card>
                        <CardBody>
                        {!isViewOnly ?
                            <Row>
                                <Col xs="12" sm="6" md="6" style={{marginBottom: "5px"}}>
                                    <InputGroup>
                                        <InputGroupAddon addonType="prepend">
                                            <InputGroupText><i className="fa fa-address-card-o" aria-hidden="true"></i></InputGroupText>
                                        </InputGroupAddon>
                                        <Switch id={`contact_allowagentdata-0`} name={`contact_allowagentdata-0`} value={this.state.passengers.contactDetails.readAgentInfo} onChange={(ev) => this.readAgentContactInfo(ev)}>Read my company info</Switch>
                                    </InputGroup>
                                </Col>
                            </Row>
                        : null}
                            <Row>
                            {isViewOnly ?
                                <>
                                    <Col xs="12" sm="5" md={{size: 4}} className="">
                                        <div className="psngr-contact-mobile">
                                            <i className="fa fa-mobile" aria-hidden="true"></i>&nbsp;
                                            <span>{this.state.passengers.contactDetails.mobile}</span>
                                        </div>
                                    </Col>
                                    <Col xs="12" sm="5" md={{size: 4}} className="">
                                        <div className="psngr-contact-email">
                                            <i className="fa fa-envelope-o" aria-hidden="true"></i>&nbsp;
                                            <span>{this.state.passengers.contactDetails.email}</span>
                                        </div>
                                    </Col>
                                </>
                            :
                                <>
                                    <Col xs="12" sm="5" md={{size: 4}} className="">
                                        <InputGroup>
                                            <InputGroupAddon addonType="prepend">
                                                <InputGroupText><i className="fa fa-mobile" aria-hidden="true"></i></InputGroupText>
                                            </InputGroupAddon>
                                            <Input placeholder="Mobile" type="tel" pattern="[0-9]{11}|[0-9]{10}" value={this.state.passengers.contactDetails.mobile} onChange={(ev) => this.handleInputChange(ev, 'contactDetails','mobile',-1)} required={true}/>
                                        </InputGroup>
                                    </Col>
                                    <Col xs="12" sm="5" md={{size: 4}} className="">
                                        <InputGroup>
                                            <InputGroupAddon addonType="prepend">
                                                <InputGroupText><i className="fa fa-envelope-o" aria-hidden="true"></i></InputGroupText>
                                            </InputGroupAddon>
                                            <Input placeholder="Email" type="email" value={this.state.passengers.contactDetails.email} onChange={(ev) => this.handleInputChange(ev, 'contactDetails','email',-1)} required={true}/>
                                        </InputGroup>
                                    </Col>
                                </>
                            }
                            </Row>
                        </CardBody>
                    </Card>
                </Collapse>
            </div>            
        );
    }

    getAdultsView(adultCount) {
        const items = [];

        for (let index = 0; index < adultCount; index++) {
            // items.push(<div key={`key-${index}`}>Testing - {index}</div>);
            items.push(this.getAdultPassengerSection(index));
        }

        return (
            <>
                {items}
            </>
        )
    }

    getChildsView(childCount) {
        const items = [];

        for (let index = 0; index < childCount; index++) {
            // items.push(<div key={`key-${index}`}>Testing - {index}</div>);
            items.push(this.getChildPassengerSection(index));
        }

        return (
            <>
                {items}
            </>
        )
    }    

    getInfantsView(infantCount) {
        const items = [];

        for (let index = 0; index < infantCount; index++) {
            // items.push(<div key={`key-${index}`}>Testing - {index}</div>);
            items.push(this.getInfantPassengerSection(index));
        }

        return (
            <>
                {items}
            </>
        )
    }    

    getPassengersInfo(flight, isViewOnly = false) {
        let adult = flight.pricing.adultPAX;
        let child = flight.pricing.childPAX;
        let infant = flight.pricing.infantPAX;

        let adultsView = this.getAdultsView(adult, isViewOnly);
        let childsView = this.getChildsView(child, isViewOnly);
        let infantsView = this.getInfantsView(infant, isViewOnly);

        let actionSection = this.getActionSection();

        let contactDetailsSection = this.getContactDetailsSection(isViewOnly);

        return (
            <div id="passenger-section">
                <div className="booking-header">
                    <h3 className="apt-heading">
                        <span>Passenger Details</span>
                    </h3>
                </div>
                <div className="wrapper-mainclass">
                    {contactDetailsSection}
                    {adult > 0 ? adultsView : null}
                    {child > 0 ? childsView : null}
                    {infant > 0 ? infantsView : null}
                    {actionSection}
                </div>
            </div>
        );
    }

    getActionSection() {
        let buttonText = "Add Passengers";

        if(this.state.step === 2) {
            buttonText = "Review Bookings";
        } 
        else if(this.state.step === 3) {
            buttonText = "Pay & Book";
        }


        return (
            <Row className="desktop-bookback">
                <Col xs="6" sm="4" md={{size: 6}} className="">
                    <Button outline color="primary" className="asr-book" onClick={(ev) => this.BackToFlightSearch(ev, this.props.UserStore.SearchResult_Flights.payload)}>
                        <i className="fa fa-angle-double-left"></i>&nbsp;<span>Back</span>
                    </Button>
                </Col>
                <Col xs="6" sm="8" md={{size: 6}} className="text-right confirming--button-price">
                    <Button outline color="primary" className="asr-book" disabled={this.props.UserStore.SearchResult_Flights.processing} onClick={(ev) => this.MoveNext(ev)}>
                        {!this.props.UserStore.SearchResult_Flights.processing ? 
                            <>
                                <span>{buttonText}</span>&nbsp;<i className="fa fa-angle-double-right"></i>
                            </>
                        :
                            <>
                                <span>{buttonText}</span>&nbsp;<i className="fa fa-angle-double-right"></i>&nbsp;<PulseLoader color="#ffffff" loading={this.props.UserStore.SearchResult_Flights.processing} size={10} />
                            </>
                        }
                    </Button>
                </Col>
            </Row>
        );
    }

    getPassengerRows(passengers, type) {
        if(!passengers) return null;
        let items = [];

        passengers.map((passenger, idx) => {
            let passengerDom = <Row key={`${type}-key-${idx}`} className="passenger-item-info">
                <Col xs="2" sm="2" md={{size: 1}} className="">
                    <span>{idx+1}</span>
                </Col>
                <Col xs="9" sm="9" md={{size: 5}} className="">
                    <div>{`${passenger.title} ${passenger.firstName.toUpperCase()} ${passenger.lastName.toUpperCase()} (${type})`}</div>
                    <div>
                        {passenger.dobNeeded ?
                            <span className="aux-value-dob">{passenger.dobNeeded ? moment(passenger.dob).format('DD-MMM-YYYY') : ''}</span>
                        : null}
                        
                        {passenger.passportNeeded ?
                            <span className="aux-value-passport">{passenger.passportNeeded ? passenger.passport.toUpperCase() : ''}</span>
                        : null}

                        {type === 'I' ?
                            null
                            :
                            <span className="aux-value-wheelchair">{passenger.wheelchair ? <i className="fa fa-check service-taken" aria-hidden="true"></i> : <i className="fa fa-times service-not-taken" aria-hidden="true"></i>}</span>
                        }
                    </div>
                </Col>
                <Col xs="1" sm="1" md={{size: 1}} className="">
                    <span>NA</span>
                </Col>
                <Col xs="1" sm="1" md={{size: 1}} className="">
                    <span>NA</span>
                </Col>
            </Row>

            items.push(passengerDom);
        });

        return items;
    }

    getPassengerInfoView() {
        return (
            <>
            <Row className="desktop-bookback">
                <Col xs="12" sm="12" md={{size: 12}} className="">
                    <h5>Passenger Details ({this.state.passengers.adults.length + this.state.passengers.childs.length}{this.state.passengers.infants.length>0 ? ` + ${this.state.passengers.infants.length}` : ''})</h5>
               </Col>
            </Row>
            <Row className="row-heading bottom-border">
                <Col xs="1" sm="1" md={{size: 1}} className="">
                    <span>Sr.</span>
                </Col>
                <Col xs="9" sm="9" md={{size: 5}} className="">
                    <span>Name, DOB, Passport &amp; Wheelchair</span>
                </Col>
                <Col xs="1" sm="1" md={{size: 1}} className="">
                    <span>Seat</span>
                </Col>
                <Col xs="1" sm="1" md={{size: 2}} className="">
                    <span>Meals &amp; Baggage</span>
                </Col>
            </Row>
            {this.getPassengerRows(this.state.passengers.adults, 'A')}
            {this.getPassengerRows(this.state.passengers.childs, 'C')}
            {this.getPassengerRows(this.state.passengers.infants, 'I')}
            </>
        );
    }

    getContactInfoView() {
        return (
            <>
                <Row className="desktop-bookback">
                    <Col xs="12" sm="12" md={{size: 12}} className="">
                        <h5>Contact Details</h5>
                    </Col>
                </Row>
                <Row className="bottom-border">
                    <Col xs="12" sm="12" md={{size: 4}} className="">
                        <div className="psngr-contactinfo-email"><i className="fa fa-envelope-o service-taken" aria-hidden="true"></i>&nbsp;{this.state.passengers.contactDetails.email}</div>
                    </Col>
                    <Col xs="12" sm="12" md={{size: 4}} className="">
                        <div className="psngr-contactinfo-mobile"><i className="fa fa-mobile service-taken" aria-hidden="true"></i>&nbsp;{this.state.passengers.contactDetails.mobile}</div>
                    </Col>
                </Row>
            </>
        )
    }

    getFlightDetailsInfoWithPassengerView(flight) {
        const PassengersInfo = this.getPassengerInfoView();
        const ContactInfo = this.getContactInfoView();
        let actionSection = this.getActionSection();

        return (
            <div id="selected-ticket-section">
                <div className="booking-header">
                    <h3 className="apt-heading">
                        <span>Review</span>
                    </h3>
                    <div className="booking-header-right" onClick={(ev) => this.RedirectToSearch(ev)}>
                        <Button outline color="primary" className="asr-book">
                            <i className="fa fa-angle-double-left"></i>&nbsp;<span>Back to Search</span>
                        </Button>
                    </div>
                </div>
                <div className="scrollable  wrapper-mainclass">
                    <div className="apt-btmborder">
                        <p className="apt-firstpr">
                            {flight.sourceLocation.code}
                            <span className="apt-arrowpr">{flight.tripType === 'ONE' ? ' → ' : ' ↔ '}</span>
                            {flight.destinationLocation.code}&nbsp;
                            <span className="graycolor at-fontweight">
                                <span>on</span> &nbsp;{moment(flight.departureDateTime).format('ddd, MMM Do YYYY')}
                            </span>
                            <span className="apt-redpr at-fontweight hidden">
                                <i className="fa fa-info-circle"></i>
                                <span>Arrives next day</span>
                            </span>
                            <span className="pull-right">
                                <i className="fa fa-clock-o"></i> {time_diff(moment(flight.departureDateTime), moment(flight.arrivalDateTime))}
                            </span>
                        </p>
                        <div>
                            {flight.segments && flight.segments.length>0 ? this.getSegments(flight) : this.getSelectedFlightDetails(flight)}
                        </div>
                    </div>
                    <div className="passenger-section">
                        {PassengersInfo}
                    </div>
                    <div className="passenger-contact-section">
                        {ContactInfo}
                    </div>
                    {actionSection}
                </div>
            </div>
        );
    }

    getPayByWalletSection() {
        console.log(JSON.stringify(this.state.currentUser));

        return (
            <div className="payment-choices">
                <Card>
                    <CardBody>
                        <Row>
                            <Col xs="12" sm="12" md={{size: 12}} className="">
                                <InputGroup>
                                    <InputGroupAddon addonType="prepend">
                                        <InputGroupText><i className="fa fa-money" aria-hidden="true"></i></InputGroupText>
                                    </InputGroupAddon>
                                    <Switch id={`wallet-0`} name={`wallet-0`} value={this.state.payment.useWallet} onChange={(ev) => this.handleInputChange(ev, 'payment','useWallet',-1)}>&nbsp;Use Wallet to pay [Balance : <i className="fa fa-inr" aria-hidden="true"></i>&nbsp;{this.state.wallet.balance}]</Switch>
                                </InputGroup>
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
                <Card>
                    <CardBody>
                        <Row>
                        {this.state.currentUser.allowCredit ? 
                            <Col xs="12" sm="12" md={{size: 12}} className="">
                                <InputGroup>
                                    <InputGroupAddon addonType="prepend">
                                        <InputGroupText><i className="fa fa-money" aria-hidden="true"></i></InputGroupText>
                                    </InputGroupAddon>
                                    <Switch id={`wallet-1`} name={`wallet-1`} value={this.state.payment.useCredit} onChange={(ev) => this.handleInputChange(ev, 'payment','useCredit',-1)}>&nbsp;Use Credit Limit to pay [Cr.Limit : {this.state.currentUser.allowCredit ? (this.state.currentUser.creditLimit <= 0 ? 'No Limit' : `₹ ${this.state.currentUser.creditLimit}`) : 'NA'}]</Switch>
                                </InputGroup>
                            </Col>
                        : null }
                        </Row>
                    </CardBody>
                </Card>
                <Card>
                    <CardBody>
                        <Row>
                            <Col xs="12" sm="12" md={{size: 12}} className="">
                                <Button outline color="primary" className="asr-book" onClick={(ev) => this.BookNow(ev)} disabled={!this.state.payment.useWallet && !this.state.payment.useCredit}>
                                    <i className="fa fa-credit-card" aria-hidden="true"></i>&nbsp;<span>Pay &amp; Book Now ₹{this.state.selected_flight.pricing.totalPerPAX}</span>
                                </Button>
                            </Col>
                        </Row>                
                    </CardBody>
                </Card>
            </div>
        )
    }

    getPayByOnlineSection() {
        console.log(JSON.stringify(this.state.currentUser));

        return (
            <div className="payment-choices">
                <Card>
                    <CardBody>
                        {(!this.state.paymentInfo.status ||  this.state.paymentInfo.status==='') ? 
                        <>
                        <Row>
                            <Col xs="12" sm="12" md={{size: 12}} className="">
                                <span><i className="fa fa-inr" aria-hidden="true"></i>&nbsp;{this.state.selected_flight.pricing.totalPerPAX} would be collected online</span>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs="12" sm="12" md={{size: 12}} className="">
                                <Button outline color="primary" className="asr-book" onClick={(ev) => this.ProcessPaymentOnline(ev)}>
                                    <i className="fa fa-credit-card" aria-hidden="true"></i>&nbsp;<span>Pay &amp; Book Now ₹{this.state.selected_flight.pricing.totalPerPAX}</span>
                                </Button>
                            </Col>
                        </Row>
                        </>
                        : null }
                        <Row>
                            <Col xs="12" sm="12" md={{size: 12}} className="">
                                <PayuMoney PaymentData={this.state.paymentInfo} ref={this.pref}/>
                            </Col>
                        </Row>
                        {(this.state.paymentInfo.status && this.state.paymentInfo.status!=='') ? 
                        <Row>
                            <Col xs="12" sm="12" md={{size: 12}} className="">
                                Booking # {this.state.paymentInfo.booking.bookingNumber}
                            </Col>
                        </Row>
                        : null }
                    </CardBody>
                </Card>
            </div>
        )
    }

    getPaymentInfo(flight) {
        const PayByWallet = this.getPayByWalletSection();
        const PayByOnline = this.getPayByOnlineSection();

        return (
            <div id="selected-ticket-payment-section">
                <div className="booking-header">
                    <h3 className="apt-heading">
                        <span>Payments</span>
                    </h3>
                    <div className="booking-header-right" onClick={(ev) => this.RedirectToSearch(ev)}>
                        <Button outline color="primary" className="asr-book">
                            <i className="fa fa-angle-double-left"></i>&nbsp;<span>Back to Search</span>
                        </Button>
                    </div>
                </div>
                <div className="scrollable wrapper-payment-mainclass">
                    <div className="payment-section">
                        <Row className="no-margin">
                            <Col xs="6" sm="4" md="3" className="tab-section no-padding">
                                <Nav tabs vertical pills>
                                    <NavItem>
                                        <NavLink className={classnames({active: this.state.activeTab === '1'})} onClick={() => { this.toggleTab('1'); }}>
                                            Pay from wallet
                                        </NavLink>
                                    </NavItem>
                                    <NavItem>
                                        <NavLink className={classnames({active: this.state.activeTab === '2'})} onClick={() => {this.toggleTab('2'); }}>
                                            Pay online
                                        </NavLink>
                                    </NavItem>
                                </Nav>
                            </Col>
                            <Col xs="6" sm="6" md="9">
                                <TabContent activeTab={this.state.activeTab}>
                                    <TabPane tabId="1">
                                        <div className="bookbypay-section">
                                            <i className="fa fa-credit-card" aria-hidden="true"></i>&nbsp;<span><span className="disclaimer">Please Note:</span> You may be redirected to bank page to complete your transaction. By making this booking, you agree to our Terms of Use and Privacy Policy</span>                                            
                                        </div>
                                        {PayByWallet}
                                    </TabPane>
                                    <TabPane tabId="2">
                                        <div className="bookbypay-section">
                                            <i className="fa fa-credit-card" aria-hidden="true"></i>&nbsp;<span><span className="disclaimer">Please Note:</span> You may be redirected to bank page to complete your transaction. By making this booking, you agree to our Terms of Use and Privacy Policy</span>
                                        </div>
                                        {PayByOnline}
                                    </TabPane>
                                </TabContent>
                            </Col>
                        </Row>
                    </div>
                </div>
            </div>
        )
    }

    getFirstStepView() {
        const FlightDetails = this.getFlightInfo(this.state.selected_flight);
        const PricingInfo = this.getFlightPricingInfo(this.state.selected_flight);

        return (
            <Row>
                <Col xs="12" sm="12" md={{size: 9}} className="no-padding-right">
                    {FlightDetails}
                </Col>
                <Col xs="12" sm="12" md={{size: 3}} className="no-padding-left">
                    {PricingInfo}
                </Col>
            </Row>
        )
    }

    getSecondStepView() {
        const PassengersInfo = this.getPassengersInfo(this.state.selected_flight);
        const PricingInfo = this.getFlightPricingInfo(this.state.selected_flight);

        return (
            <Row>
                <Col xs="12" sm="12" md={{size: 9}} className="no-padding-right">
                    <form ref={this.formRef} onSubmit={e => e.preventDefault()}>
                        {PassengersInfo}
                    </form>
                </Col>
                <Col xs="12" sm="12" md={{size: 3}} className="no-padding-left">
                    {PricingInfo}
                </Col>
            </Row>
        )
    }

    getThirdStepView() {
        const FlightDetails = this.getFlightDetailsInfoWithPassengerView(this.state.selected_flight);
        
        const PricingInfo = this.getFlightPricingInfo(this.state.selected_flight);

        return (
            <Row>
                <Col xs="12" sm="12" md={{size: 9}} className="no-padding-right">
                    {FlightDetails}
                </Col>
                <Col xs="12" sm="12" md={{size: 3}} className="no-padding-left">
                    {PricingInfo}
                </Col>
            </Row>
        )
    }

    getFinalStepView() {
        const PaymentInfo = this.getPaymentInfo(this.state.selected_flight);
        const PricingInfo = this.getFlightPricingInfo(this.state.selected_flight);

        return (
            <Row>
                <Col xs="12" sm="12" md={{size: 9}} className="no-padding-right">
                    {PaymentInfo}
                </Col>
                <Col xs="12" sm="12" md={{size: 3}} className="no-padding-left">
                    {PricingInfo}
                </Col>
            </Row>
        )
    }

    render() {
        console.log(`Is processing ? => ${this.props.UserStore.SearchResult_Flights.processing}`);
        const Header = this.getHeader(this.state.step);
        let StepView = null;

        //const StepView = (this.state.step === 1 ? this.getFirstStepView() : (this.state.step === 2 ? this.getSecondStepView() : (this.state.step === 3 ? this.getThirdStepView() : (this.state.step === 3 ? this.getThirdStepView() : null))));
        if(!this.state.selected_flight) {
            this.setState({
                step: 4
            });

            this.BackToFlightSearch(null, this.props.UserStore.SearchResult_Flights.payload);
        }

        switch (this.state.step) {
            case 1:
                StepView = this.getFirstStepView();
                break;
            case 2:
                StepView = this.getSecondStepView();
                break;
            case 3:
                StepView = this.getThirdStepView();
                break;
            case 4:
                StepView = this.getFinalStepView();
                break;
            default:
                break;
        }

        //console.log(`Final Group Result: ${newFlightList}`);

        return (
            <div id='booking'>
                <Container className="themed-container" fluid={true}>
                    <Row>
                        <Col xs="12" sm="12" md={{size: 12}}>
                            {Header}
                        </Col>
                    </Row>
                    {StepView}
                </Container>
            </div>
        );
    }
}

export default inject("CommonStore", "CompanyStore", "UserStore")(withRouter(observer(FlightBooking, { forwardRef: true })));