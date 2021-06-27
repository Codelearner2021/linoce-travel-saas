import React, { Component } from "react";
import { TabContent, TabPane, Nav, NavItem, NavLink, Card, Button, CardTitle, CardText, Row, Col } from 'reactstrap';
import classnames from 'classnames';

import { withRouter } from "react-router-dom";
import { observer, inject } from 'mobx-react';

import "../App.css";
import TripSelector from "./TripSelector";
class SearchPanel extends Component {
    constructor(props) {
        super(props);

        //console.log(`Display Name : ${store.Company.displayName}`)

        this.toggle = this.toggle.bind(this);
        this.onChangeTripType = this.onChangeTripType.bind(this);

        this.state = {
            activeTab: '1',
            trip_type: 'Oneway',
            selected_trip: {'source_city': {id: 1, name: "Kolkata", code: "CCU", enable: true}, 'destination_city': {id: 1, name: "Mumbai", code: "MUM", enable: true}, 
            'departure_date': new Date('2021-06-30'), 'return_date': null, 'traveller_choice': {'adult': 1, 'child': 0, 'infant': 0, 'class': 'Economy'}}
        };
    }

    toggle(tab) {
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab,
                trip_type: 'Oneway',
                selected_trip: this.state.selected_trip
            });
        }
    }  

    onChangeTripType(event) {
        console.log(event.target.value);
        var selected_trip = {};

        if(event.target.value === 'Oneway') {
            selected_trip = {'source_city': {id: 1, name: "Kolkata", code: "CCU", enable: true}, 'destination_city': {id: 1, name: "Mumbai", code: "MUM", enable: true}, 
            'departure_date': new Date('2021-06-30'), 'return_date': null, 'traveller_choice': {'adult': 1, 'child': 0, 'infant': 0, 'class': 'Economy'}};
            this.setState({
                activeTab: this.state.activeTab,
                trip_type: event.target.value,
                selected_trip
            });


            //console.log('OW Value => ' + JSON.stringify(this.state.selected_trip));
        }
        else if(event.target.value === 'Roundtrip') {
            selected_trip = {'source_city': {id: 1, name: "Kolkata", code: "CCU", enable: true}, 'destination_city': {id: 1, name: "Mumbai", code: "MUM", enable: true}, 
            'departure_date': new Date('2021-06-30'), 'return_date': new Date('2021-07-05'), 'traveller_choice': {'adult': 1, 'child': 0, 'infant': 0, 'class': 'Economy'}};
            //console.log('Before RT Value => ' + JSON.stringify(this.state.selected_trip));
            this.setState({
                activeTab: this.state.activeTab,
                trip_type: event.target.value,
                selected_trip
            });
            //console.log('RT Value => ' + JSON.stringify(this.state.selected_trip));
        }
    }

    render() {
        //console.log(`Company Name => ${JSON.stringify(this.props.CompanyStore.Company)}`);
        //console.log(`activeTab => ${JSON.stringify(this.state.activeTab)}`);
        console.log(`activeTab => ${JSON.stringify(this.state.selected_trip)}`);
        // let activeTab = this.state.activeTab ;
        // let link_classname = {
        //     classnames({ active: (activeTab === '1') }),
        //     'link': true
        // };

        return (
            <div id="search-panel">
                {/* <main className="cover-page" id="hero"> */}
                    {/* <section className="wrapped-page"> */}
                        <Nav tabs>
                            <NavItem>
                                <NavLink className={classnames({ active: this.state.activeTab === '1' })} onClick={() => { this.toggle('1'); }}>Flight</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink className={classnames({ active: this.state.activeTab === '2' })} onClick={() => { this.toggle('2'); }}>Hotels</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink className={classnames({ active: this.state.activeTab === '3' })} onClick={() => { this.toggle('3'); }}>Car</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink className={classnames({ active: this.state.activeTab === '4' })} onClick={() => { this.toggle('4'); }}>Cruise</NavLink>
                            </NavItem>
                        </Nav>
                        <TabContent activeTab={this.state.activeTab}>
                            <TabPane tabId="1">
                                <Row>
                                    <Col sm="12">
                                        <Row>
                                            <Col sm="12">
                                                <div onChange={this.onChangeTripType} className="trip-selector">
                                                    <input type="radio" value="Oneway" name="triptype" defaultChecked/> Oneway
                                                    <input type="radio" value="Roundtrip" name="triptype"/> Roundtrip
                                                </div>
                                            </Col>
                                        </Row>
                                        <TripSelector selected_trip={this.state.selected_trip} trip_type={this.state.trip_type}/>
                                    </Col>
                                </Row>
                            </TabPane>
                            <TabPane tabId="2">
                                <Row>
                                    <Col sm="12">
                                        <TripSelector selected_trip={{'source_city': {id: 1, name: "Kolkata", code: "CCU", enable: true}, 'destination_city': {id: 1, name: "Mumbai", code: "MUM", enable: true}, 
                                            'departure_date': new Date('2021-06-30'), 'return_date': new Date('2021-07-05'), 'traveller_choice': {'adult': 1, 'child': 0, 'infant': 0, 'class': 'Economy'}}} trip_type={this.state.trip_type}/>
                                    </Col>
                                </Row>
                            </TabPane>
                            <TabPane tabId="3">
                                <Row>
                                    <Col sm="12">
                                        <Card body>
                                            <CardTitle>Car Rentals</CardTitle>
                                            <CardText>This is the place to rent cars</CardText>
                                            <Button>Proceed</Button>
                                        </Card>
                                    </Col>
                                </Row>
                            </TabPane>
                            <TabPane tabId="4">
                                <Row>
                                    <Col sm="12">
                                        <Card body>
                                            <CardTitle>Cruise Booking</CardTitle>
                                            <CardText>This is the place to book cruise</CardText>
                                            <Button>Proceed</Button>
                                        </Card>
                                    </Col>
                                </Row>
                            </TabPane>
                        </TabContent>
                    {/* </section> */}
                {/* </main> */}
            </div>
        );
    }
}

//export default Hero;
export default inject("CompanyStore", "UserStore")(withRouter(observer(SearchPanel)));