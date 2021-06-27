import React, { Component, Fragment, useState } from "react";
import Select from 'react-select';
import { TabContent, TabPane, Nav, NavItem, NavLink, Card, Button, CardTitle, CardText, Row, Col } from 'reactstrap';
import { withRouter } from "react-router-dom";
import { observer, inject } from 'mobx-react';

import "../App.css";

var data = [
    {id: 1, name: "Kolkata", code: "CCU", enable: true},
    {id: 2, name: "Delhi", code: "DEL", enable: true},
    {id: 3, name: "Karnataka", code: "KTK", enable: true},
    {id: 4, name: "Bagdogra", code: "IXB", enable: true},
    {id: 5, name: "Jaipur", code: "JAI", enable: true},
    {id: 6, name: "Mumbai", code: "MUM", enable: true}
];


const TripSelector = ({ selected_trip }) => {
    const { source_city, destination_city, departure_date, return_date, traveller_choice } = selected_trip;
    const [sourceCity, setSourceCity] = useState('');
    const [destinationCity, setDestinationCity] = useState('');

    const onChangeSource = item => {
        //alert(JSON.stringify(item));
        setSourceCity(item);
    }

    const onChangeDestination = item => {
        //alert(JSON.stringify(item));
        setDestinationCity(item);
    }

    const styles = {
        control: (base) => ({
          ...base,
          minHeight: 30,
          maxHeight: 30,
        }),
        dropdownIndicator: (base) => ({
          ...base,
          paddingTop: 0,
          paddingBottom: 0,
          minHeight: 25,
          maxHeight: 25,
        }),
        clearIndicator: (base) => ({
          ...base,
          paddingTop: 0,
          paddingBottom: 0,
          minHeight: 25,
          maxHeight: 25,
        }),
        valueContainer: (base) => ({
            ...base,
            // paddingTop: 0,
            // paddingBottom: 0,
            padding: "0px 3px;",
            position: "initial",
            minHeight: 25,
            maxHeight: 25
        }),
        container: (base) => ({
            ...base,
            padding: 0
        }),
        option: (provided, state) => ({
            ...provided,
            //borderBottom: '1px dotted pink',
            fontSize: '.8em',
            color: "#4a54f1",
            padding: '0px 3px;',
        }),
        singleValue: (provided, state) => ({
            fontSize: '.9em',
            color: "#4a54f1",
            padding: '0px 3px;',
        }),
    };    

    return (
        <div className="">
            <Row>
                <Col xs="12" sm="12" md={{size: 6}}>
                    <label className="form-label">
                        Departure :
                    </label>
                    <Select
                        styles={styles}
                        classNamePrefix="select"
                        defaultValue={`<span className="option-item-text">${data[0].name} [${data[0].code}]</span>`}
                        isDisabled={false}
                        isLoading={false}
                        isClearable={false}
                        isRtl={false}
                        isSearchable={true}
                        onChange={onChangeSource}
                        name="color"
                        getOptionLabel={option => `${option.name} [${option.code}]`}
                        getOptionValue={option => `${option}`}
                        isOptionSelected={option => sourceCity.id == option.id}
                        options={data}
                    />
                </Col>
                <Col xs="12" sm="12" md={{size: 6}}>
                    <label className="form-label">
                        Arrival :
                    </label>
                    <Select
                        styles={styles}
                        classNamePrefix="select"
                        defaultValue={`<span className="option-item-text">${data[0].name} [${data[0].code}]</span>`}
                        isDisabled={false}
                        isLoading={false}
                        isClearable={false}
                        isRtl={false}
                        isSearchable={true}
                        onChange={onChangeDestination}
                        name="color"
                        getOptionLabel={option => `${option.name} [${option.code}]`}
                        getOptionValue={option => `${option}`}
                        isOptionSelected={option => destinationCity.id == option.id}
                        options={data}
                    />
                </Col>                
            </Row>
        </div>
    );
};

//export default TripSelector;
export default inject("CompanyStore")(withRouter(observer(TripSelector)));