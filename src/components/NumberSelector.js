import React, { Component, Fragment, useEffect, useState } from "react";
import Select from 'react-select';
import { TabContent, TabPane, Nav, NavItem, NavLink, Card, Button, CardTitle, CardText, Row, Col } from 'reactstrap';
import { withRouter } from "react-router-dom";
import { observer, inject } from 'mobx-react';
import Datetime from 'react-datetime';
import "react-datetime/css/react-datetime.css";
import 'font-awesome/css/font-awesome.min.css';

import "../App.css";

var moment = require('moment');

const NumberSelector = ({selector_name, numberValue, maxValue, onValueChange}) => {
    // const { source_city, destination_city, departure_date, return_date, traveller_choice } = selected_trip;
    // const [sourceCity, setSourceCity] = useState('');
    const [value, setValue] = useState(numberValue);
    const [enablePlus, setEnablePlus] = useState(numberValue<maxValue);
    const [enableMinus, setEnableMinus] = useState(numberValue>0);

    useEffect(() => {

    });

    const onAddNumber = () => {
        //console.log(value);
        if(value<maxValue)
            setValue(value+1);

        //console.log(value+1);
        onValueChange(value+1);
        // setEnablePlus(value<100);
        // setEnableMinus(value>0)
    };

    const onSubtractNumber = () => {
        //console.log(value);
        if(value>0)
            setValue(value-1);
        
        //console.log(value-1);
        onValueChange(value-1);
        // setEnablePlus(value<100);
        // setEnableMinus(value>0)
    };

    return (
        <div className="passenger-section col-x-fluid">
            <div className="pax-limit">
                <span className="count">{value}</span>
                <span className="pax-type">{' '}{selector_name}</span>
                <span className={value > 1 ? "plural " : "plural hide"}>s</span>
            </div>
            <div className="pax-selector">
                <div className="title-section">
                    <span className={value>0 ? "minus " : "minus disabled"} onClick={(ev) => value>0 && onSubtractNumber(ev)}></span>
                    <span className={value<maxValue ? "plus " : "plus disabled"} onClick={(ev) => value<maxValue && onAddNumber(ev)}></span>
                </div>
            </div>
        </div>
    );
};

export default inject("CommonStore", "CompanyStore", "UserStore")(withRouter(observer(NumberSelector)));