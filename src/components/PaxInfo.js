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

const PaxInfo = ({CommonStore, onPaxInfoChange, value}) => {
    // const { source_city, destination_city, departure_date, return_date, traveller_choice } = selected_trip;
    // const [sourceCity, setSourceCity] = useState('');
    let paxinfoValue = value || {class: 'Economy', adult: 1, child: 0, infant: 0};
    const [adult, setAdult] = useState(paxinfoValue.adult);
    const [child, setChild] = useState(paxinfoValue.child);
    const [infant, setInfant] = useState(paxinfoValue.infant);
    const [flightClass, setFlightClass] = useState(paxinfoValue.class);
    const [isCollapsed, setIsCollapsed] = useState(false);
    // const [message, setMessage] = useState('');
    // const [alertTitle, setAlertTitle] = useState('');
    // const [isError, setIsError] = useState(false);
    // const [visible, setVisible] = useState(false);

    useEffect(() => {

    }, []);

    const onSelectionChange = item => {
        setFlightClass(item);

        let paxInfo = {'class': item, adult, child, infant }
        onPaxInfoChange(paxInfo);
    };

    const ExpansionIcon = () => ({
        expanded: <i className="fa fa-arrow-down" aria-hidden="true"></i>,
        collapsed: <i className="fa fa-arrow-up" aria-hidden="true"></i>
    })

    const onHeaderClick = (ev) => {
        setIsCollapsed(!isCollapsed);
    }

    const onPaxChange = (paxtype, value) => {
        let paxInfo = {'class': flightClass, adult, child, infant }
        switch (paxtype) {
            case 'adult':
                setAdult(value);
                paxInfo.adult = value;
                break;
            case 'child':
                setChild(value);
                paxInfo.child = value;
                break;
            case 'infant':
                setInfant(value);
                paxInfo.infant = value;
                break;
            default:
                break;
        }

        onPaxInfoChange(paxInfo);
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
                        <NumberSelector id="adult_count" selector_name="Adult" maxValue={9} numberValue={adult} onValueChange={(value) => onPaxChange('adult', value)}/>
                        <NumberSelector id="child_count" selector_name="Child" maxValue={5} numberValue={child} onValueChange={(value) => onPaxChange('child', value)}/>
                        <NumberSelector id="infant_count" selector_name="Infant" maxValue={5} numberValue={infant} onValueChange={(value) => onPaxChange('infant', value)}/>
                    </div>

                    <OptionSelectorGroup options={["Economy", "Premium Economy", "Business"]} defaultSelectedIndex={0} onSelectionChange={(ev) => onSelectionChange(ev)} isMultiSelect={false}/>
                </div>
            </div>
        </div>
    );
};

export default inject("CommonStore", "CompanyStore", "UserStore")(withRouter(observer(PaxInfo)));