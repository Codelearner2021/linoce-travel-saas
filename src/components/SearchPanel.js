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
        this.state = {
            activeTab: '1'
        };
    }

    toggle(tab) {
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab
            });
        }
    }  

  render() {
    console.log(`Company Name => ${JSON.stringify(this.props.CompanyStore.Company)}`);
    console.log(`activeTab => ${JSON.stringify(this.state.activeTab)}`);
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
                                    <TripSelector selected_trip={{'source_city': {id: 1, name: "Kolkata", code: "CCU", enable: true}, 'destination_city': {id: 1, name: "Mumbai", code: "MUM", enable: true}, 
                                    'departure_date': new Date('2021-06-30'), 'return_date': null, 'traveller_choice': {'adult': 1, 'child': 0, 'infant': 0, 'class': 'Economy'}}}/>
                                    {/* <Card body>
                                        <CardTitle>Flight Search</CardTitle>
                                        <CardText>This is the place to search flight</CardText>
                                        <Button>Proceed</Button>
                                    </Card> */}
                                </Col>
                            </Row>
                        </TabPane>
                        <TabPane tabId="2">
                            <Row>
                                <Col sm="12">
                                    <Card body>
                                        <CardTitle>Hotel Search</CardTitle>
                                        <CardText>This is the place to search hotels</CardText>
                                        <Button>Proceed</Button>
                                    </Card>
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