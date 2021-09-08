import React, { Component } from "react";
import { Collapse, Container, TabContent, TabPane, Nav, NavItem, NavLink, Card, CardBody, CardImg, Input, InputGroup, InputGroupText, 
    InputGroupAddon, InputGroupButtonDropdown, Button, CardTitle, CardText, Row, Col, CustomInput, Label } from 'reactstrap';
import classnames from 'classnames';
//import ClipLoader from "react-spinners/ClipLoader";
import Switch from '../components/custom_components/switch/Switch'
import Ticket from '../components/custom_components/view/Ticket'
import Datetime from 'react-datetime';
import PulseLoader from "react-spinners/PulseLoader";
import "../App.css";
import "../styles/TicketView.css";
import html2pdf from 'html2pdf.js';
import Login from './Login';
import Register from './Register';
import { toJS, reaction } from 'mobx';
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

class TicketView extends Component {
    disposer;

    constructor(props) {
        super(props);

        //this.showTicket = this.showTicket.bind(this);
        //this.props.location.state.booking
        this.GeneratePDF =  this.GeneratePDF.bind(this);

        this.state = {
            currentUser: toJS(this.props.CompanyStore.LoggedInUser.user),
            booking: null,
            bookingid: this.props.match.params.id, // this.props.location.state.booking.id,
            chainBookingId: this.props.match.params.chainid,  //this.props.location.state.booking.chainBookingId,
            processing: false
        }

        if(!this.state.bookingid) {
            this.props.CommonStore.setAlert('Warning!', 'Invalid selected ticket or booking session is not active', true, false);
        }
        else {
            console.log(JSON.stringify(this.state.booking));
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
                });
            }
        );

        this.setState({processing: true});

        let result = await this.props.UserStore.getBookingById(this.state.bookingid, this.state.chainBookingId)
        .then(response => {
            console.log(`Booking : ${JSON.stringify(response)}`);
            if(response && !response.Failed) {
                let booking = response;
                if(booking && booking.length>0) {
                    this.setState(
                    {
                        booking: booking[0],
                        processing: false
                    });
                }
            }
            else {
                this.props.CommonStore.setAlert('Error!', response.Message, true, true);
            }
        })
        .catch(error => {
            console.log(error);
        });

        let wallet = await this.props.UserStore.getMyWallet()
        .then(response => {
            //console.log(`User with Wallet : ${JSON.stringify(response)}`);
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

    GeneratePDF = (event, elementid, filename) => {
        let element = document.getElementById(elementid);
        var opt = {
            margin:       [1,1,1,1],
            filename:     filename,
            image:        { type: 'jpeg', quality: 1 },
            html2canvas:  { dpi: 192, scale: 1},
            jsPDF:        { unit: 'mm', format: 'a3', orientation: 'portrait' }
        };        

        html2pdf().set(opt).from(element).save(filename);
    }

    render() {
        let booking = this.state.booking;
        //console.log(`Is processing ? => ${this.props.UserStore.SearchResult_Flights.processing}`);
        //const Header = this.getHeader(this.state.step);

        return (
            <>
            { booking ? 
            <div id='ticket'>
                <Container className="themed-container ticket-view-container" fluid={true}>
                    <Ticket booking={booking} bookingid={booking ? booking.id : -1} chainid={booking ? booking.chainBookingId : null} title="E - Ticket" id="ticket-view"/>
                    <Button outline color="primary" className="print" onClick={(ev) => this.GeneratePDF(ev, 'ticket-view', `Booking-${booking.bookingNumber}.pdf`)}>
                        <i className="fa fa-file-pdf-o" aria-hidden="true"></i>&nbsp;<span>Generate PDF</span>
                    </Button>
                </Container>
            </div>
            : null }
            </>
        );
    }
}

export default inject("CommonStore", "CompanyStore", "UserStore")(withRouter(observer(TicketView, { forwardRef: true })));