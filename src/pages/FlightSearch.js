import React, { Component } from "react";
import { Container, TabContent, TabPane, Nav, NavItem, NavLink, Card, CardImg, Button, CardTitle, CardText, Row, Col } from 'reactstrap';
import "../App.css";
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

        console.log(`Props => ${JSON.stringify(this.props.location.state.payload)}`);

        this.state = {
            payload: this.props.location.state.payload,
            selectedTicketId: -1,
        }
    }

    async componentDidMount() {
        console.log(`Flight Search => ${JSON.stringify(this.state.payload)}`);

        let result = await this.props.UserStore.searchMyFlights(this.state.payload)
        .then(response => {
            console.log(`Search Flight Result : ${JSON.stringify(response)}`);
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
    onFlightSelect = (ticketid) => {
        this.setState({
            payload: this.state.payload,
            selectedTicketId: ticketid
        })
    }

    getHeader() {
        return (
            <div className="search-header-section">
                <Row className="search-header-row">
                    <Col sm="3" md={{size: 3}}>
                        <button className="search-button-filter ">Sort By : Duration</button>
                    </Col>
                    <Col sm="1" md={{size: 1}}>
                        <button className="search-button-filter ">Departure</button>
                    </Col>
                    <Col sm="1" md={{size: 1}}></Col>
                    <Col sm="1" md={{size: 1}}>
                        <button className="search-button-filter ">Arrival</button>
                    </Col>
                    <Col sm="2" md={{size: 2}}>
                        <button className="search-button-filter search-activefilter">Price<i className="fa fa-caret-up filter-caret"></i></button>
                    </Col>
                    <Col sm="4" md={{size: 4}}>

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

        return (
            <div className="search-item" key={flight.id}>
                <Row className="flight-rowmain">
                    <Col sm="6" md={{size: 6}} className="flight-allview">
                        <Row className="flight-leftresult">
                            <Col sm="6" md={{size: 6}} className="no-padding">
                                <ul className="flight-airline">
                                    {/* <li className="sort-detailist"></li> */}
                                    <li className="sort-detailist"><img className="airline-logo " src={require(`../img/airlines/${flight.airlineInfo.image}`)}/></li>
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
                            <Col sm="2" md={{size: 2}} className="no-padding">
                                <ul className="search-city-section">
                                    <li className="search-city-section sort-detailist">
                                        <p className="ars-city">{flight.sourceLocation.code}</p>
                                        <span className="dep-timefont">{moment(flight.departureDateTime).format("HH:mm")}</span> <br/>
                                        <span className="at-fontweight dur-timefont">{moment(flight.departureDateTime).format("MMM DD")}</span>
                                    </li>
                                </ul>
                            </Col>
                            <Col sm="2" md={{size: 2}} className="no-padding flight-arrow-center-arrow text-center">
                                <div className="atls-holdid">
                                    <span className="ars-arrowsun">Non-Stop</span>
                                </div>
                                <span className="arrow-allright arrowclass-loader-flight-search"></span>2h 5m
                            </Col>
                            <Col sm="2" md={{size: 2}} className="no-padding">
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
                                <div className={flight.innerFlights.length>2 ? "collapsed-flight-list transform" : "default-flight-list"}>
                                    <ul className="ars-radiolist transform">
                                        {flight.innerFlights.map(flt => {
                                            return (
                                                <li className="main-radiolist" onClick={(ev) => this.onFlightSelect(flt.id) }>
                                                    <p className="ars-specialfare">
                                                        <span>{flt.id}</span> 
                                                    </p>
                                                    <input type="radio" className="radio-input-invisible" id={`rdoflight_choice_${flt.id}`} data-type="false" name="rdoflight_choice" value={`rdoflight_choice_${flt.id}`} msri="" checked={this.state.selectedTicketId === flt.id} readOnly={true}/>
                                                    <div className="check"></div>
                                                    <label htmlFor="rdoflight_choice" className="sort-labelfill">
                                                        <div>
                                                            <span id={`price-${flt.id}`} data-price={flt.pricing.totalPerPAX} data-markup="0">{formatter.format(flt.pricing.totalPerPAX)}</span>
                                                        </div>
                                                    </label>
                                                    <div className="atls-holder">
                                                        <span className="label label-purple ars-flightlabel ars-refunsleft">Offer Fare</span>
                                                        <span className="ars-refunsleft ars-lastre">
                                                            {camel2title(flt.class)}
                                                            <span className="nonrefund-type">, Non Refundable</span>
                                                        </span>
                                                        <span className="handbag-icons" style={{'color': "#2149da"}}> Seats left: {flt.noOfPerson}</span>
                                                    </div>
                                                </li>
                                            )
                                        })}
                                    </ul>
                                    {   
                                        flight.innerFlights.length>2 ? <i className="fa fa-arrow-right exp-icon" aria-hidden="true"></i>
                                        :
                                        <></>
                                    }
                                </div>
                            </Col>
                            <Col sm="3" md={{size: 3}} className="">
                                <Button outline color="primary" onClick={(ev) => this.props.CommonStore.setAlert('Confirmation', 'Feature coming coon!!', true, false)} disabled={!this.props.UserStore.isLoggedIn()}> Book <i className="fa fa-arrow-right" aria-hidden="true"></i></Button>
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

        console.log(`Grouped flights : ${JSON.stringify(flight_list)}`);
        return flight_list;
    }

    /* <FlightItem flight={flight}></FlightItem> */
    render() {
        //const newFlightList = this.getGroupedFlights(this.props.UserStore.SearchResult_Flights.result);
        const Header = this.getHeader();

        //console.log(`Final Group Result: ${newFlightList}`);

        return (
            <div id='landing'>
                <Container className="themed-container" fluid={true}>
                    <Row>
                        <Col xs="12" sm="12" md={{size: 3}}>
                            <span></span>
                        </Col>
                        <Col xs="12" sm="12" md={{size: 9}}>
                            <div id="search-result-container">
                                {Header}
                                {(!this.props.UserStore.processing && 
                                    this.props.UserStore.SearchResult_Flights.result && 
                                        this.props.UserStore.SearchResult_Flights.result.length>0) ? 
                                        this.getGroupedFlights(this.props.UserStore.SearchResult_Flights.result).map(flight => {
                                            const flightItemDom = this.getFlightItem(flight)
                                            return flightItemDom;
                                    })
                                    : (
                                        <span>No records found</span>
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