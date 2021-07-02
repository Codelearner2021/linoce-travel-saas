/* eslint-disable no-unused-expressions */

import React, { Component, Fragment, useEffect, useState } from "react";
import Select from 'react-select';
import { TabContent, TabPane, Nav, NavItem, NavLink, Card, Button, CardTitle, CardText, Row, Col } from 'reactstrap';
import { withRouter } from "react-router-dom";
import { observer, inject } from 'mobx-react';
import Datetime from 'react-datetime';
import "react-datetime/css/react-datetime.css";
import 'font-awesome/css/font-awesome.min.css';
import OptionSelector from './OptionSelector';

import "../App.css";

var moment = require('moment');

const OptionSelectorGroup = ({options, defaultSelectedIndex, onSelectionChange, isMultiSelect}) => {
    // const { source_city, destination_city, departure_date, return_date, traveller_choice } = selected_trip;
    const [infant, setInfant] = useState(0);
    const [optionData, setOptionData] = useState([]);
    const [selectedKey, setSelectedKey] = useState('');

    useEffect(() => {
        if(Array.isArray(options)) {
            let ops = [];
    
            for (let index = 0; index < options.length; index++) {
                const value = options[index];
                let item = {'value': value, 'key': `key-${index}`, 'selected': (defaultSelectedIndex === index)};
                ops.push(item);
                //console.log(`${index} => ${value}`);
            }
            setOptionData(ops);

            defaultSelectedIndex>-1 && onSelectionChange(ops[defaultSelectedIndex].value);
        }    
    }, []);

    const onItemChange = (key, value) => {
        if(!isMultiSelect && value) {
            setSelectedKey(key);
        }
        let ops = Object.assign([], optionData);
        let selectedItem = null;

        ops.map((item, idx) => {
            item.selected = (item.key === key) && value;
            if(item.selected)
                selectedItem = item;
        });

        setOptionData(ops);
        
        if(selectedItem)
            onSelectionChange(selectedItem.value);
        else 
            onSelectionChange(null);
    }

    const RenderedOptions = ({optionData}) => (
        <>
            {optionData && optionData.map((item, idx) => 
                <OptionSelector key={idx} optionname={item.value} optionkey={item.key} select={item.selected} onChange={(key, value) => onItemChange(key, value)} />
            )}
        </>
    )

    return (
        <div id="class-box" className="flight-class-box">
            <div className="traveller-container">
                <label className="">Flight Class</label>
            </div>
            <div className="class-box">
                <RenderedOptions optionData={optionData}/>
            </div>
        </div>
    );
};

export default inject("CommonStore", "CompanyStore", "UserStore")(withRouter(observer(OptionSelectorGroup)));