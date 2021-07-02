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

const OptionSelector = ({optionname, optionkey, select, onChange}) => {
    // const { source_city, destination_city, departure_date, return_date, traveller_choice } = selected_trip;
    const [checked, setChecked] = useState(select);

    useEffect(() => {
        //console.log(`Item Name -> ${optionname}`);
    }, []);

    const onItemChange = (chk) => {
        setChecked(!chk);
        //console.log(`${optionkey} => ${!chk}`);

        onChange(optionkey, !chk);
    };

    const CheckIcon = () => ({
        selected: <i className="fa fa-check" aria-hidden="true"></i>,
        not_selected: <i className="fa fa-times" aria-hidden="true"></i>
    })

    return (
        <div className="option-selector" name="class" onClick={(ev) => onItemChange(checked)}>
            {CheckIcon()[select ? "selected" : "not_selected"]}
            <span className="">{optionname}</span>
        </div>
    );
};

export default inject("CommonStore", "CompanyStore", "UserStore")(withRouter(observer(OptionSelector)));