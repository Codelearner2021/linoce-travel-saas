import React, { Component, Fragment, useEffect, useState } from "react";
import Select from 'react-select';
import { TabContent, TabPane, Nav, NavItem, NavLink, Card, Button, CardTitle, CardText, Row, Col, Alert } from 'reactstrap';
import { withRouter } from "react-router-dom";
import { observer, inject } from 'mobx-react';
import Datetime from 'react-datetime';
import "react-datetime/css/react-datetime.css";
import 'font-awesome/css/font-awesome.min.css';
import NumberSelector from "./NumberSelector";
import OptionSelectorGroup from './OptionSelectorGroup';


import "../App.css";

var moment = require('moment');

const PaxInfo = ({CommonStore}) => {
    // const { source_city, destination_city, departure_date, return_date, traveller_choice } = selected_trip;
    const [sourceCity, setSourceCity] = useState('');
    const [adult, setAdult] = useState(0);
    const [child, setChild] = useState(0);
    const [infant, setInfant] = useState(0);
    const [flightClass, setFlightClass] = useState(null);
    const [isCollapsed, setIsCollapsed] = useState(false);
    // const [message, setMessage] = useState('');
    // const [alertTitle, setAlertTitle] = useState('');
    // const [isError, setIsError] = useState(false);
    // const [visible, setVisible] = useState(false);

    useEffect(() => {

    }, []);

    const onSelectionChange = item => {
        setFlightClass(item);
    };

    const ExpansionIcon = () => ({
        expanded: <i className="fa fa-arrow-down" aria-hidden="true"></i>,
        collapsed: <i className="fa fa-arrow-up" aria-hidden="true"></i>
    })

    const onHeaderClick = (ev) => {
        setIsCollapsed(!isCollapsed);
    }

    const doSearchFlight = ev => {
        CommonStore.setAlert('Confirmation', 'Search flight feature is in development. Soon it will be available. Keep visiting', true, false);

        setTimeout(() => {
            if(CommonStore.Alert.visible)
                CommonStore.toggleAlert(false);
        }, 3000);
    }

    return (
        <div className="pax-info-container">
            <div className="pax-info-box">
                <div className="pax-selection-header" onClick={(ev) => onHeaderClick(ev) }>
                    {ExpansionIcon()[isCollapsed ? "collapsed" : "expanded"]}
                    <span className="traveller-container">
                        <label className="traveller-label">Traveller(s), Class</label>
                        <span className="total-count">{adult + child}{infant>0 ? (' + '+infant) : ''}</span>
                        <span className="">Traveller</span>
                        <span className={(adult + child) > 0 ? "" : "hide"}>s</span>
                        <span className="flight-cls">{flightClass && ','} {flightClass}</span>
                    </span>
                </div>
                <div className={isCollapsed ? "pax-selection-container transform container-collapse" : "pax-selection-container transform"}>
                    <div id="passenger-box" className="flight-passenger-box dflex">
                        <NumberSelector id="adult_count" selector_name="Adult" maxValue={9} numberValue={0} onValueChange={(value) => setAdult(value)}/>
                        <NumberSelector id="child_count" selector_name="Child" maxValue={5} numberValue={0} onValueChange={(value) => setChild(value)}/>
                        <NumberSelector id="infant_count" selector_name="Infant" maxValue={5} numberValue={0} onValueChange={(value) => setInfant(value)}/>
                    </div>

                    <OptionSelectorGroup options={["Economy", "Premium Economy", "Business"]} defaultSelectedIndex={0} onSelectionChange={(ev) => onSelectionChange(ev)} isMultiSelect={false}/>
                </div>
            </div>
            <div className="action-section">
                <Button outline color="primary" onClick={(ev) => doSearchFlight()}> Search <i className="fa fa-arrow-right" aria-hidden="true"></i></Button>
            </div>
        </div>
    );
};

export default inject("CommonStore", "CompanyStore", "UserStore")(withRouter(observer(PaxInfo)));