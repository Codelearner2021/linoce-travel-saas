import React, { Component } from "react";
import { Container, TabContent, TabPane, Nav, NavItem, NavLink, Card, CardImg, Button, CardTitle, CardText, Row, Col } from 'reactstrap';
import { withRouter } from "react-router-dom";
import { observer, inject } from 'mobx-react';

import cardimage from '../img/img-card (5).jpg'
import "../App.css";
import SearchPanel from "../components/SearchPanel";
import Services from "../components/Services";
import Deals from "../components/Deals";
import MainCarousel from "../components/Carousel";


/* Include page component */

class Landing extends Component {
    constructor(props) {
        super(props);

        this.state = {
            movies : [
                "Movie 1",
                "Movie 2",
                "Movie 3",
                "Movie 4",
                "Movie 5"
            ]
        }
    }
  
    render() {
        return (
            <div id='landing'>
                <Container>
                    <Row>
                        {/*Search functions - Flights, Hotels, Bus, Cars etc.*/}
                        <Col xs="12" sm="12" md={{size: 5}}>
                            <SearchPanel />
                        </Col>
                        <Col xs="12" sm="12" md={{size: 7}}>
                            <Row>
                                <Col xs="12" sm="12">
                                    <div className="landing-content">
                                        <Row>
                                            <Col xs="12" sm="12" md="6">
                                                <Card body inverse style={{ backgroundColor: '#7d47dc', borderColor: '#333' }}>
                                                    <CardTitle tag="h5">Special Title Treatment</CardTitle>
                                                    <CardText>Advertisement section 1</CardText>
                                                    {/* <Button color="secondary">Button</Button> */}
                                                </Card>
                                            </Col>
                                            <Col xs="12" sm="12" md="6">
                                                <Card body inverse style={{ backgroundColor: '#ffffff', borderColor: '#333',  padding: '0px' }}>
                                                    {/* <CardImg variant="top" src="https://km.visamiddleeast.com/dam/VCOM/regional/ap/taiwan/global-elements/images/tw-visa-classic-card-498x280.png" /> */}
                                                    <CardImg variant="top" src={cardimage} style={{height: '98px'}}/>
                                                </Card>                                        
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col xs="12" sm="12" md="12">
                                                <Card body inverse style={{ backgroundColor: '#138880', borderColor: '#333' }}>
                                                    <CardTitle tag="h5">Special Title Treatment</CardTitle>
                                                    <CardText>Advertisement section 1</CardText>
                                                    {/* <Button color="secondary">Button</Button> */}
                                                </Card>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col xs="12" sm="12" md="6">
                                                <Card body inverse style={{ backgroundColor: '#a54e0a', borderColor: '#333' }}>
                                                    <CardTitle tag="h5">Special Title Treatment</CardTitle>
                                                    <CardText>Advertisement section 1</CardText>
                                                    {/* <Button color="secondary">Button</Button> */}
                                                </Card>
                                            </Col>
                                            <Col xs="12" sm="12" md="6">
                                                <Card body inverse style={{ backgroundColor: '#2c1aa7', borderColor: '#333' }}>
                                                    <CardTitle tag="h5">Special Title Treatment</CardTitle>
                                                    <CardText>Advertisement section 2</CardText>
                                                    {/* <Button color="secondary">Button</Button> */}
                                                </Card>                                        
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col xs="12" sm="12" md="12">
                                                <div className="service-line">
                                                    <h3 className="title">Services</h3>
                                                    <Services />
                                                </div>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col xs="12" sm="12" md="12">
                                                <div className="deals-line">
                                                    <h3 className="title">Carousel</h3>
                                                    <MainCarousel />
                                                </div>
                                            </Col>
                                        </Row>                                        
                                        <Row>
                                            <Col xs="12" sm="12" md="12">
                                                <div className="deals-line">
                                                    <h3 className="title">Hot Deals</h3>
                                                    <Deals />
                                                </div>
                                            </Col>
                                        </Row>
                                    </div>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Container>
        </div>
        );
    }
}

//export default Home;
export default inject("CompanyStore")(withRouter(observer(Landing)));