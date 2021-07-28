import React, { Component } from "react";
import { Container, TabContent, TabPane, Nav, NavItem, NavLink, Card, CardImg, Button, CardTitle, CardText, Row, Col } from 'reactstrap';
//import ClipLoader from "react-spinners/ClipLoader";
import PulseLoader from "react-spinners/PulseLoader";
import "../App.css";
import "../styles/Booking.css";
import Login from './Login';
import Register from './Register';
import { withRouter } from "react-router-dom";
import { observer, inject } from 'mobx-react';

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
//   const [isExpanded, setExpanded] = useState(false);
//   const [active, setActive] = useState(
//     initialActive ? initialActive : "login"
//   );
    constructor(props) {
        super(props);

        // this.changeScreenMode = this.changeScreenMode.bind(this);
        //this.initialActive = this.props.initialActive;
        // this.state = {
        //     active: this.initialActive ? this.initialActive : 'login'
        // }

        //console.log(`Props => ${JSON.stringify(this.props)}`);
        // let flights = this.props.UserStore.SearchResult_Flights.result;
        let selectedFlight = this.props.location.state.selectedFlight;

        // for (let index = 0; index < flights.length; index++) {
        //     const flight = flights[index];
        //     if(flight.id === this.props.location.state.ticketid) {
        //         selectedFlight = flight;
        //         break;
        //     }
        // }

        this.state = {
            selected_flight: selectedFlight,
            price_changed: this.props.UserStore.SearchResult_Flights.processing
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

        let result = await this.props.UserStore.getFareQuote(this.state.selected_flight.id)
        .then(response => {
            console.log(`Search Flight Result : ${JSON.stringify(response)}`);
            this.setState({selected_flight: response.updatedFlightTicket, price_changed: response.priceChanged});
        })
        .catch(error => {
            console.log(error);
        });
    }

//   changeScreenMode = () => {
//       let active = this.state.active;
//       if(active === 'login') {
//         active = 'register';
//       }
//       else if(active === 'register') {
//         active = 'login';
//       }
//       this.setState({
//           active: active
//       })
//   }
    onFlightSelect = (event, ticketid) => {
        // this.setState({
        //     payload: this.state.payload,
        //     selectedTicketId: ticketid,
        //     expandedSection: this.state.expandedSection,
        // })

        this.setState({
            selectedTicketId: ticketid
        });
        //event.stopPropagation();
    }

    initiateBooking = (event, parentFlight) => {
        let flights = this.props.UserStore.SearchResult_Flights.result;
        let innerFlights = parentFlight.innerFlights;
        let selectedFlight = (innerFlights && innerFlights.length>0) ? innerFlights[0] : null;
        
        for (let index = 0; index < innerFlights.length; index++) {
            const flight = innerFlights[index];
            if(this.state.selectedTicketId === flight.id) {
                selectedFlight = flight;
                break;
            }
        }

        // if(selectedFlight) {
        //     //history.push('/flight-search');
        //     this.props.history.push({
        //         pathname: '/search/flight/booking',
        //         state: {payload : selectedFlight}
        //     });
        //     // history.push({
        //     //     pathname: '/search/flight',
        //     //     state: {payload : searchPayload}
        //     // });
        // }
        // else {
        //     this.props.CommonStore.setAlert('Warning!', 'Please select a ticket to proceed for booking', true, false);
        // }
    }

    setToggleExpansion = (event, ticketid) => {
        // if(this.state.expandedSection === -1 || this.state.expandedSection !== ticketid) {
        //     this.setState({expandedSection: ticketid});
        // }
        // else if(this.state.expandedSection === ticketid) {
        //     this.setState({expandedSection: -1});
        //     this.setState({selectedTicketId: -1});
        // }
    }

    getHeader() {
        return (
          <div className="search-header-section">
            <div className="apt-section">
              <div className="container">
                <Row>
                  <Col xs="4" sm="3" className="booking-top-btn no-padding">
                    <div className="apt-common apt-firstep selected">
                      <span className="graycolor">
                        <span>FIRST STEP</span>
                      </span>
                      <h4 className="apt-flightiti">
                        <span>Flight Itinerary</span>
                      </h4>
                    </div>
                  </Col>
                  <Col xs="4" sm="3" className="booking-top-btn no-padding">
                    <div className="apt-common apt-second">
                      <span className="graycolor">
                        <span>SECOND STEP</span>
                      </span>
                      <h4 className="apt-flightiti">
                        <span>Passenger Details</span>
                      </h4>
                    </div>
                  </Col>
                  <Col xs="4" sm="3" className="booking-top-btn no-padding">
                    <div className="apt-common apt-third">
                      <span className="graycolor">
                        <span>THIRD STEP</span>
                      </span>
                      <h4 className="apt-flightiti">
                        <span>Review</span>
                      </h4>
                    </div>
                  </Col>
                  <Col xs="4" sm="3" className="booking-top-btn no-padding">
                    <div className="apt-common apt-forth">
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
                            <div className="flight-rules graycolor">Adult baggage: {segment.baggage} | cabin: {segment.cabinBaggage}</div>
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
        return (
            <div id="selected-ticket-section">
                <div className="booking-header">
                    <h3 className="apt-heading">
                        <span>Flight Details</span>
                    </h3>
                    <div className="booking-header-right">
                        <div className="iterinery-pageback"> 
                            <i className="fa fa-angle-double-left"></i> Back to Search
                        </div>
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
                    <Row className="desktop-bookback">
                        <Col xs="12" sm="4" md={{size: 6}} className="">
                            <Button outline color="primary" className="asr-book">
                                <i className="fa fa-angle-double-left"></i>&nbsp;<span>Back</span>
                            </Button>
                        </Col>
                        <Col xs="12" sm="8" md={{size: 6}} className="text-right confirming--button-price">
                            {!this.props.UserStore.SearchResult_Flights.processing ? 
                                <Button outline color="primary" className="asr-book">
                                    <span>Add Passengers</span>&nbsp;<i className="fa fa-angle-double-right"></i>
                                </Button>
                            : null}
                        </Col>
                    </Row>
                </div>
            </div>
        );
    }

    getFlightPricingInfo(flight) {
        let adult_price = parseFloat(flight.pricing.basePrice) * (parseInt(flight.pricing.adultPAX) + parseInt(flight.pricing.childPAX));
        //console.log(`Infant pricing : ${parseFloat(flight.pricing.infantBasePrice)} | Infant PAX : ${flight.pricing.infantPAX}`);
        let infant_price = (parseFloat(flight.pricing.infantBasePrice)) * (parseInt(flight.pricing.infantPAX));

        let adult_taxes = (flight.pricing.markup + flight.pricing.serviceCharge + flight.pricing.tax - flight.pricing.discount) * (parseInt(flight.pricing.adultPAX) + parseInt(flight.pricing.childPAX));

        let total_price = flight.pricing.totalPerPAX;

        //console.log(`Adult Pricing: ${adult_price} | Infant Pricing: ${infant_price} | Adult Taxes: ${adult_taxes} | Total Price: ${total_price}`);

        return (
            <div id="booking-financial-section">
                <div className="pricing-container">
                    <h4 className="graycolor">FARE SUMMARY</h4>
                    <Row>
                        <Col xs="12" sm="12" md={{size: 7}}>
                            <span className="field-title">Base fare</span>
                        </Col>
                        <Col xs="12" sm="12" md={{size: 5}} className="text-right">
                            <span className="currency-text">₹ {adult_price + infant_price}</span>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs="12" sm="12" md={{size: 7}}>
                            <span className="field-title">Taxes &amp; fees</span>
                        </Col>
                        <Col xs="12" sm="12" md={{size: 5}} className="text-right">
                            <span className="currency-text">₹ {adult_taxes}</span>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs="12" sm="12" md={{size: 7}}>
                            <span className="field-title">Amount to Pay</span>
                        </Col>
                        <Col xs="12" sm="12" md={{size: 5}} className="text-right">
                            <span className="currency-text">₹ {total_price}</span>
                        </Col>
                    </Row>
                </div>
            </div>
        );
    }

    /* <FlightItem flight={flight}></FlightItem> */
    render() {
        console.log(`Is processing ? => ${this.props.UserStore.SearchResult_Flights.processing}`);
        const Header = this.getHeader();
        const FlightDetails = this.getFlightInfo(this.state.selected_flight);
        const PricingInfo = this.getFlightPricingInfo(this.state.selected_flight);

        //console.log(`Final Group Result: ${newFlightList}`);

        return (
            <div id='booking'>
                <Container className="themed-container" fluid={true}>
                    <Row>
                        <Col xs="12" sm="12" md={{size: 12}}>
                            {Header}
                        </Col>
                    </Row>
                    <Row>
                        <Col xs="12" sm="12" md={{size: 9}} className="no-padding-right">
                            {FlightDetails}
                        </Col>
                        <Col xs="12" sm="12" md={{size: 3}} className="no-padding-left">
                            {PricingInfo}
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}

export default inject("CommonStore", "CompanyStore", "UserStore")(withRouter(observer(FlightBooking)));