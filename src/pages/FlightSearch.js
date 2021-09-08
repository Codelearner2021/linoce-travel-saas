import React, { Component } from "react";
import { Container, TabContent, TabPane, Nav, NavItem, NavLink, Card, CardImg, Button, CardTitle, CardText, Row, Col } from 'reactstrap';
//import ClipLoader from "react-spinners/ClipLoader";
import PulseLoader from "react-spinners/PulseLoader";
import "../App.css";
import Login from './Login';
import Register from './Register';
import { withRouter } from "react-router-dom";
import { toJS } from 'mobx';
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

class FlightSearch extends Component {
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
        this.applyFilter = this.applyFilter.bind(this);

        this.props.location.state && this.props.location.state.payload && console.log(`Props => ${JSON.stringify(this.props.location.state.payload)}`);

        this.state = {
            payload: (this.props.location.state && this.props.location.state.payload) ? this.props.location.state.payload : null,
            selectedTicketId: -1,
            expandedSection: -1,
            departureCity: 'XXXX',
            arrivalCity: 'XXXX',
            filter: {
                stop: [],
                departure: [],
                arrival: []
            }
        }
    }

    async componentDidMount() {
        console.log(`Flight Search => ${JSON.stringify(this.state.payload)}`);

        if(this.state.payload) {
            let result = await this.props.UserStore.searchMyFlights(this.state.payload)
            .then(response => {
                //console.log(`Search Flight Result : ${JSON.stringify(response)}`);
            })
            .catch(error => {
                console.log(error);
            });
        }
        else {
            this.props.history.push({
                pathname: '/',
                state: {}
            });            
        }
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

        if(selectedFlight) {
            //history.push('/flight-search');
            // this.props.history.push({
            //     pathname: '/search/flight/booking',
            //     state: {payload : Object.assign({}, selectedFlight)}
            // });
            this.props.history.push({
                pathname: '/search/flight/booking',
                state: {
                    ticketid: selectedFlight.id,
                    selectedFlight: toJS(selectedFlight)
                }
            });
        }
        else {
            this.props.CommonStore.setAlert('Warning!', 'Please select a ticket to proceed for booking', true, false);
        }
    }

    setToggleExpansion = (event, ticketid) => {
        if(this.state.expandedSection === -1 || this.state.expandedSection !== ticketid) {
            this.setState({expandedSection: ticketid});
        }
        else if(this.state.expandedSection === ticketid) {
            this.setState({expandedSection: -1});
            this.setState({selectedTicketId: -1});
        }
    }

    getHeader() {
        return (
            <div className="search-header-section">
                <Row className="search-header-row">
                    <Col xs="4" sm="3" md={{size: 3}}>
                        <button className="search-button-filter ">Sort By : Duration</button>
                    </Col>
                    <Col xs="2" sm="1" md={{size: 1}}>
                        <button className="search-button-filter ">Departure</button>
                    </Col>
                    <Col xs="1" sm="1" md={{size: 1}}></Col>
                    <Col xs="2" sm="1" md={{size: 1}}>
                        <button className="search-button-filter ">Arrival</button>
                    </Col>
                    <Col xs="2" sm="2" md={{size: 2}}>
                        <button className="search-button-filter search-activefilter">Price<i className="fa fa-caret-up filter-caret"></i></button>
                    </Col>
                    <Col xs="1" sm="4" md={{size: 4}}>

                    </Col>
                </Row>
            </div>
        )
    }

    getFlightItem(flight) { 
        const formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'INR',
        });

        console.log(`Source City: ${flight.sourceLocation.code} | Destination City: ${flight.sourceLocation.code}`);
        let image_path = '';
        try {
            image_path = require(`../img/airlines/${flight.airlineInfo.image}`)
        } catch (error) {
            image_path = require(`../img/airlines/flight.png`);
            console.log(error);
        }

        return (
            <div className="search-item" key={flight.id}>
                <Row className="flight-rowmain">
                    <Col sm="6" md={{size: 6}} className="flight-allview">
                        <Row className="flight-leftresult">
                            <Col xs="4" sm="6" md={{size: 6}} className="no-padding">
                                <ul className="flight-airline">
                                    {/* <li className="sort-detailist"></li> */}
                                    <li className="sort-detailist"><img className="airline-logo " src={image_path}/></li>
                                    <li className="ars-mobcss sort-detailist multiair-lines-list">
                                        {flight.airlineInfo.displayName}
                                        <div className="atls-holdid">
                                            <span className="at-fontweight apt-flightids">{flight.flightNo}</span>
                                            {/* <div className="altsmain">
                                                <div className="alts-content">
                                                    <p className="cancellation-details">{flight.flightNo}</p>
                                                </div>
                                            </div> */}
                                        </div>
                                    </li>
                                </ul>
                            </Col>
                            <Col xs="3" sm="2" md={{size: 2}} className="no-padding">
                                <ul className="search-city-section">
                                    <li className="search-city-section sort-detailist">
                                        <p className="ars-city">{flight.sourceLocation.code}</p>
                                        <span className="dep-timefont">{moment(flight.departureDateTime).format("HH:mm")}</span> <br/>
                                        <span className="at-fontweight dur-timefont">{moment(flight.departureDateTime).format("MMM DD")}</span>
                                    </li>
                                </ul>
                            </Col>
                            <Col xs="2" sm="2" md={{size: 2}} className="no-padding flight-arrow-center-arrow text-center">
                                <div className="atls-holdid">
                                    <span className="ars-arrowsun">{flight.noOfStops === 0 ? `Non-Stop` : `${flight.noOfStops} Stop(s)`}</span>
                                </div>
                                <span className="arrow-allright arrowclass-loader-flight-search"></span>{time_diff(moment(flight.departureDateTime), moment(flight.arrivalDateTime))}
                            </Col>
                            <Col xs="3" sm="2" md={{size: 2}} className="no-padding">
                                <ul className="search-city-section">
                                    <li className="search-city-section sort-detailist">
                                        <p className="ars-city">{flight.destinationLocation.code}</p>
                                        <span className="dep-timefont">{moment(flight.arrivalDateTime).format("HH:mm")}</span> <br/>
                                        <span className="at-fontweight dur-timefont">{moment(flight.arrivalDateTime).format("MMM DD")}</span>
                                    </li>
                                </ul>
                            </Col>
                        </Row>
                        {/* <Row>
                            <Col sm="12" md={{size: 12}} className="view-details-mainbtn">
                                <button type="button" className="btn btn-default asr-viewbtn">View Details <i className="fa fa-plus"></i></button>
                            </Col>
                        </Row>
                        <Row>
                            <Col sm="12" md={{size: 12}} className="clearfix">
                                <p className="indicator-content">
                                    <span className="handbag-icons" style={{'color': "rgb(248, 172, 33)"}}> Seats left: {flight.noOfPerson}</span>
                                </p>
                            </Col>
                        </Row> */}
                    </Col>
                    <Col sm="6" md={{size: 6}} className="flightrightview">
                        <Row>
                            <Col sm="9" md={{size: 9}}>
                                <div className={flight.innerFlights.length>2 ? (this.state.expandedSection === flight.id ? "collapsed-flight-list transform expanded-flight-list" : "collapsed-flight-list transform") : "default-flight-list"}>
                                    <ul className="ars-radiolist transform">
                                        {flight.innerFlights.map((flt, idx) => {
                                            return (
                                                <li className="main-radiolist" onClick={(ev) => this.onFlightSelect(ev, flt.id) } key={`li_key_${flt.id}`}>
                                                    <p className="ars-specialfare">
                                                        <span>{flt.id}</span> 
                                                    </p>
                                                    <input type="radio" className="radio-input-invisible" id={`rdoflight_choice_${flt.id}`} data-type="false" name={`rdoflight_choice_${flight.flightNo}`} value={`rdoflight_choice_${flt.id}`} 
                                                            msri="" checked={this.state.selectedTicketId === flt.id || idx === 0} readOnly={true}/>
                                                    <div className="check"></div>
                                                    <label htmlFor="rdoflight_choice" className="sort-labelfill">
                                                        <div>
                                                            <span id={`price-${flt.id}`} data-price={flt.pricing.totalPerPAX} data-markup="0">{formatter.format(flt.pricing.totalPerPAX)}</span>
                                                        </div>
                                                    </label>
                                                    <div className="atls-holder">
                                                        <span className={`label label-${flt.inventorySourceName} ars-flightlabel ars-refunsleft`}>{flt.inventorySourceName}</span>
                                                        <span className="ars-refunsleft ars-lastre">
                                                            {camel2title(flt.class)}
                                                            <span className="nonrefund-type">, {flt.refundable === 'YES' ? 'Refundable' : 'Non Refundable'}</span>
                                                        </span>
                                                        <span className="handbag-icons" style={{'color': "#2149da"}}> Seats left: {flt.noOfPerson}</span>
                                                    </div>
                                                </li>
                                            )
                                        })}
                                    </ul>
                                    {   
                                        flight.innerFlights.length>2 ? <i className="fa fa-arrow-right exp-icon" aria-hidden="true" onClick={(ev) => this.setToggleExpansion(ev, flight.id)}></i>
                                        :
                                        <></>
                                    }
                                </div>
                            </Col>
                            <Col sm="3" md={{size: 3}} className="">
                                <Button outline color="primary" onClick={(ev) => this.initiateBooking(ev, flight)} disabled={!this.props.UserStore.isLoggedIn()}> Book <i className="fa fa-arrow-right" aria-hidden="true"></i></Button>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </div>
        )
    }

    getGroupedFlights(flights) {
        let flight_list = [];
        let lastFlight = null;
        for (let idx = 0; flights && flights.length>0 && idx < flights.length; idx++) {
            const flight = flights[idx];
            if(!lastFlight || lastFlight.flightNo !== flight.flightNo) {
                //last scanned flight is not same as current one
                let newFlight = Object.assign({}, flight);
                newFlight.innerFlights = [];
                newFlight.innerFlights.push(flight);
                flight_list.push(newFlight);
                lastFlight = newFlight;
            }
            else {
                lastFlight.innerFlights.push(flight);
            }
        }

        //console.log(`Grouped flights : ${JSON.stringify(flight_list)}`);
        return flight_list;
    }

    applyFilter(field, value) {
        let stops = this.state.filter.stop;
        let departure = this.state.filter.departure;
        let arrival = this.state.filter.arrival;

        if(field == 'stop') {
            let present = false;
            stops = stops.filter((val, idx) => {
                if(val == value) {
                    present = true;
                }
                return (val !== value);
            });

            if(!present) {
                stops.push(value);
            }
        }


        if(field == 'departure') {
            let present = false;
            departure = departure.filter((val, idx) => {
                if(val == value) {
                    present = true;
                }
                return (val !== value);
            });

            if(!present) {
                departure.push(value);
            }
        }


        if(field == 'arrival') {
            let present = false;
            arrival = arrival.filter((val, idx) => {
                if(val == value) {
                    present = true;
                }
                return (val !== value);
            });

            if(!present) {
                arrival.push(value);
            }
        }        

        this.setState({
            filter: {
                stop: stops,
                departure: departure,
                arrival: arrival
            }
        })

        this.props.UserStore.applyFilter2SearchResult({stop: stops, departure: departure, arrival: arrival});
    }

    getFilters(flights) {
        let departureCity = 'XXXX';
        let arrivalCity = 'XXXX';

        if(flights && flights.length>0) {
            let flight = flights[0];
            departureCity = flight.sourceLocation.code;
            arrivalCity = flight.destinationLocation.code;
        }
        let stops = this.state.filter.stop || [];
        let departures = this.state.filter.departure || [];
        let arrivals = this.state.filter.arrival || [];

        return (
            <>
            <Row className="filter-item">
                <Col xs="12" sm="12" md={{size: 12}}>
                    <div className="filter-title">Stops</div>
                    <ul className="stop-item">
                        <li className={stops.includes(0) ? 'selected' : ''} onClick={(ev) => this.applyFilter('stop', 0) }><a href>0</a></li>
                        <li className={stops.includes(1) ? 'selected' : ''} onClick={(ev) => this.applyFilter('stop', 1) }><a href>1</a></li>
                        <li className={stops.includes(2) ? 'selected' : ''} onClick={(ev) => this.applyFilter('stop', 2) }><a href>2</a></li>
                        <li className={stops.includes(3) ? 'selected' : ''} onClick={(ev) => this.applyFilter('stop', 3) }><a href>3+</a></li>
                    </ul>
                </Col>
            </Row>
            <Row className="filter-item">
                <Col xs="12" sm="12" md={{size: 12}}>
                    <div className="filter-title">Departure from {departureCity}</div>
                    <ul className="time-item">
                        <li className="time-item-morning" className={departures.includes(0) ? 'selected' : ''} onClick={(ev) => this.applyFilter('departure', 0)}>
                            <a href className="depselect-list"><span className="icon_sort icon-morning"></span><span className="icon_aftsort">00-06</span></a>
                        </li>
                        <li className="time-item-noon" className={departures.includes(1) ? 'selected' : ''} onClick={(ev) => this.applyFilter('departure', 1)}>
                            <a href className="depselect-list"><span className="icon_sort icon-noon"></span><span className="icon_aftsort">06-12</span></a>
                        </li>
                        <li className="time-item-afternoon" className={departures.includes(2) ? 'selected' : ''} onClick={(ev) => this.applyFilter('departure', 2)}>
                            <a href className="depselect-list"><span className="icon_sort icon-evening"></span><span className="icon_aftsort">12-18</span></a>
                        </li>
                        <li className="time-item-evening" className={departures.includes(3) ? 'selected' : ''} onClick={(ev) => this.applyFilter('departure', 3)}>
                            <a href className="depselect-list"><span className="icon_sort icon-night"></span><span className="icon_aftsort">18-00</span></a>
                        </li>
                    </ul>
                </Col>
            </Row>
            <Row className="filter-item">
                <Col xs="12" sm="12" md={{size: 12}}>
                    <div className="filter-title">Arrival to {arrivalCity}</div>
                    <ul className="time-item">
                        <li className="time-item-morning" className={arrivals.includes(0) ? 'selected' : ''} onClick={(ev) => this.applyFilter('arrival', 0)}>
                            <a href className="depselect-list"><span className="icon_sort icon-morning"></span><span className="icon_aftsort">00-06</span></a>
                        </li>
                        <li className="time-item-noon" className={arrivals.includes(1) ? 'selected' : ''} onClick={(ev) => this.applyFilter('arrival', 1)}>
                            <a href className="depselect-list"><span className="icon_sort icon-noon"></span><span className="icon_aftsort">06-12</span></a>
                        </li>
                        <li className="time-item-afternoon" className={arrivals.includes(2) ? 'selected' : ''} onClick={(ev) => this.applyFilter('arrival', 2)}>
                            <a href className="depselect-list"><span className="icon_sort icon-evening"></span><span className="icon_aftsort">12-18</span></a>
                        </li>
                        <li className="time-item-evening" className={arrivals.includes(3) ? 'selected' : ''} onClick={(ev) => this.applyFilter('arrival', 3)}>
                            <a href className="depselect-list"><span className="icon_sort icon-night"></span><span className="icon_aftsort">18-00</span></a>
                        </li>
                    </ul>
                </Col>
            </Row>
            </>
        )
    }

    /* <FlightItem flight={flight}></FlightItem> */
    render() {
        console.log(`Is processing ? => ${this.props.UserStore.SearchResult_Flights.processing}`);
        //const newFlightList = this.getGroupedFlights(this.props.UserStore.SearchResult_Flights.result);
        const Header = this.getHeader();
        const Filter = this.props.UserStore.SearchResult_Flights.processing ? null : this.getFilters(this.props.UserStore.SearchResult_Flights.result);

        //console.log(`Final Group Result: ${newFlightList}`);

        return (
            <div id='landing'>
                <Container className="themed-container" fluid={true}>
                    <Row>
                        <Col xs="12" sm="12" md={{size: 2}} className="filter-section">
                            {Filter}
                        </Col>
                        <Col xs="12" sm="12" md={{size: 10}}>
                            <div id="search-result-container">
                                {Header}
                                {(this.props.UserStore.SearchResult_Flights.result && 
                                        this.props.UserStore.SearchResult_Flights.result.length>0) ? 
                                        this.getGroupedFlights(this.props.UserStore.SearchResult_Flights.result).map(flight => {
                                            const flightItemDom = this.getFlightItem(flight)
                                            return flightItemDom;
                                    })
                                    : (
                                        this.props.UserStore.SearchResult_Flights.processing ? 
                                            <div className="progressSection">
                                                <PulseLoader color="#ffffff" loading={this.props.UserStore.SearchResult_Flights.processing} size={30} />
                                            </div>
                                        :
                                            <span className="process-status">No records found</span>
                                    )
                                }
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}

export default inject("CommonStore", "CompanyStore", "UserStore")(withRouter(observer(FlightSearch)));