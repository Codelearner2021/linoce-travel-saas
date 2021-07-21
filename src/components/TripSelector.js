import React, { Component, Fragment, useEffect, useState } from "react";
import Select from 'react-select';
import { TabContent, TabPane, Nav, NavItem, NavLink, Card, Button, CardTitle, CardText, Row, Col } from 'reactstrap';
import { withRouter } from "react-router-dom";
import { observer, inject } from 'mobx-react';
import Datetime from 'react-datetime';
import "react-datetime/css/react-datetime.css";
import FlightTripChoice from "./FlightTripChoice";
import PaxInfo from "./PaxInfo";

import "../App.css";

var moment = require('moment');

const TripSelector = ({history, CommonStore, UserStore, selected_trip, trip_type, cities, airlines }) => {
    const { source_city, destination_city, departure_date, return_date, traveller_choice } = selected_trip;
    const [sourceCity, setSourceCity] = useState('');
    const [destinationCity, setDestinationCity] = useState('');
    const [showReturnDate, setShowReturnDate] = useState(false);
    const [tripType, setTripType] = useState(trip_type);
    const [deptDate, setDeptDate] = useState('');
    const [arrvDate, setArrvDate] = useState('');
    const [paxInfo, setPaxInfo] = useState({class: 'Economy', adult: 0, child: 0, infant: 0});

    useEffect(() => {
        setShowReturnDate(tripType === 'Roundtrip');
    });

    const onChangeSource = item => {
        //alert(JSON.stringify(item));
        setSourceCity(item);
    }

    const onChangeDestination = item => {
        //alert(JSON.stringify(item));
        setDestinationCity(item);
    }

    const onTripChange = trip_type => {
        //alert(`trip_type => ${trip_type}`)
        setTripType(trip_type);
        console.log(`Result -> ${trip_type === 'Roundtrip'}`);
        setShowReturnDate(trip_type === 'Roundtrip');
    }

    const onPaxChange = paxinfo => {
        //alert(JSON.stringify(paxinfo));

        setPaxInfo({'class': paxinfo.class || 'Economy', 'adult': paxinfo.adult || 0, 'child': paxinfo.child || 0, 'infant': paxinfo.infant || 0});
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
            flexWrap: "initial",
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
            fontSize: '.8em',
            color: "#4a54f1",
            padding: '0px 3px;',
        }),
    };    

    const doSearchFlight = async (ev) => {
        //CommonStore.setAlert('Confirmation', 'Search flight feature is in development. Soon it will be available. Keep visiting', true, false);

        // setTimeout(() => {
        //     if(CommonStore.Alert.visible)
        //         CommonStore.toggleAlert(false);
        // }, 3000);

        //alert(paxInfo.class);
        let searchPayload = {
            "sourcecityid": sourceCity.id ? sourceCity.id : -1,
            "destinationcityid": destinationCity.id ? destinationCity.id : -1,
            "departuredate": deptDate,
            "returndate": arrvDate,
            "triptype": ((tripType === 'Roundtrip') ? 2 : ((tripType === 'Oneway') ? 1 : 0)),
            "flightclass": (paxInfo.class === 'Economy' ? 1 : (paxInfo.class === 'Premium Economy' ? 1 : (paxInfo.class === 'Business' ? 2 : -1))),
            "adult": paxInfo.adult | 0,
            "child": paxInfo.child | 0,
            "infant": paxInfo.infant | 0
        };

        //alert(JSON.stringify(searchPayload));
        let {isValid, message} = isValidPayload(searchPayload);

        //alert(`isValid : ${isValid} | message : ${message}`);

        if(isValid) {
            //history.push('/flight-search');
            history.push({
                pathname: '/flight-search',
                state: {payload : searchPayload}
            });
        }
        else {
            CommonStore.setAlert('Warning', message, true, false);
        }
    }

    const isValidPayload = (payload) => {
        let message = '';
        let lineFeed = ' | ';
        if(!UserStore.isLoggedIn()) message += (message!=='' ? lineFeed : '') + 'Sorry you need to login to search flights';
        if(payload.sourcecityid <= -1) message += (message!=='' ? lineFeed : '') + 'Please select departure city of your travel';
        if(payload.destinationcityid <= -1) message += (message!=='' ? lineFeed : '') + 'Please select arrival city of your travel';
        if(moment(payload.departuredate) <= moment()) message += (message!=='' ? lineFeed : '') + 'Your planned departure date should be greater than today';
        if(payload.triptype !== 1 && payload.triptype !== 2) message += (message!=='' ? lineFeed : '') + 'Please select your journey type [Oneway] or [Roundtrip]';
        if(payload.triptype === 2 && moment(payload.returndate) <= moment()) message += (message!=='' ? lineFeed : '') + 'Your planned retrun date should be greater than today in case roundtrip journey';
        if(payload.flightclass !== 1 && payload.triptype !== 2) message += (message!=='' ? lineFeed : '') + 'Please select your flight class. Allowed types are [Economy], [Premium Economy], [Business]';
        if(payload.adult <= 0 || payload.adult > 9) message += (message!=='' ? lineFeed : '') + 'You must select at least one and not more than 9 Adult passengers';
        if(payload.child < 0 || payload.child > 9) message += (message!=='' ? lineFeed : '') + 'You can`t have more than 9 Child passengers';
        if(payload.infant < 0 || payload.infant > 9) message += (message!=='' ? lineFeed : '') + 'You can`t have more than 9 Infant passengers';
        if(payload.infant > payload.adult || payload.child > payload.adult) message += (message!=='' ? lineFeed : '') + 'Number of Infant or Child passengers can`t be more than Adult passengers';

        message = message.trim();
        //alert(message.trim());
        let isValid = (message == '');
        return {isValid, message}
    }

    const onArrvDateChange = date => {
        setArrvDate(moment(date).format('YYYY-MM-DD'));
    }

    const onDeptDateChange = date => {
        setDeptDate(moment(date).format('YYYY-MM-DD'));
    }

    const yesterday = moment().subtract(1, 'day');
    const disablePastDt = current => {
      return current.isAfter(yesterday);
    };    

    // console.log(`Return Date => ${return_date}`);
    // console.log(`TripType => ${trip_type} | ${trip_type === 'Roundtrip'}`);

    console.log(`Logged-in ? ${UserStore.isLoggedIn()}`);

    return (
        <div className="search-control-group">
            <Row>
                <Col xs="12" sm="12" md={{size: 12}}>
                    <FlightTripChoice selected_trip={selected_trip} trip_type={tripType} cities={cities} airlines={airlines} onTripChange={onTripChange} />
                </Col>
            </Row>
            <Row>
                <Col xs="12" sm="12" md={{size: 6}}>
                    <label className="form-label">
                        Departure :
                    </label>
                    <Select
                        styles={styles}
                        classNamePrefix="select"
                        defaultValue={`<span className="option-item-text">${(cities && cities.length>0)? cities[0].name : ''}</span>`}
                        isDisabled={false}
                        isLoading={false}
                        isClearable={false}
                        isRtl={false}
                        isSearchable={true}
                        onChange={onChangeSource}
                        name="color"
                        getOptionLabel={option => `${option.name}`}
                        getOptionValue={option => `${option}`}
                        isOptionSelected={option => sourceCity.id == option.id}
                        options={cities}
                    />
                </Col>
                <Col xs="12" sm="12" md={{size: 6}}>
                    <label className="form-label">
                        Arrival :
                    </label>
                    <Select
                        styles={styles}
                        classNamePrefix="select"
                        defaultValue={`<span className="option-item-text">${(cities && cities.length>0)? cities[0].name : ''}</span>`}
                        isDisabled={false}
                        isLoading={false}
                        isClearable={false}
                        isRtl={false}
                        isSearchable={true}
                        onChange={onChangeDestination}
                        name="color"
                        getOptionLabel={option => `${option.name}`}
                        getOptionValue={option => `${option}`}
                        isOptionSelected={option => destinationCity.id == option.id}
                        options={cities}
                    />
                </Col>
            </Row>
            <Row>
                <Col xs="12" sm="12" md={{size: 6}}>
                    <label className="form-label">
                        Departure Date :
                    </label>
                    <Datetime className="datetime-picker-control" dateFormat="YYYY-MM-DD" timeFormat={false} onChange={onDeptDateChange} closeOnSelect={true} closeOnTab={true} isValidDate={disablePastDt}/>
                </Col>
                {console.log(`showReturnDate => ${showReturnDate}`)}
                {showReturnDate && (
                <Col xs="12" sm="12" md={{size: 6}} >
                    <label className="form-label">
                        Return Date :
                    </label>
                    <Datetime className="datetime-picker-control" dateFormat="YYYY-MM-DD" timeFormat={false} onChange={onArrvDateChange} closeOnSelect={true} closeOnTab={true}/>
                </Col>
                )}
            </Row>
            <Row>
                <Col xs="12" sm="12" md={{size: 12}}>
                    <PaxInfo onPaxInfoChange={onPaxChange}></PaxInfo>
                </Col>
            </Row>
            <Row>
                <Col xs="12" sm="12" md="12">
                    <div className="action-section">
                        <Button outline color="primary" onClick={(ev) => doSearchFlight()} disabled={!UserStore.isLoggedIn()}> Search <i className="fa fa-arrow-right" aria-hidden="true"></i></Button>
                        {!UserStore.isLoggedIn() && (<span className="error-message">To search please sign-in first</span>)}
                    </div>
                </Col>
            </Row>
        </div>
    );
};

//export default TripSelector;
export default inject("CommonStore", "CompanyStore", "UserStore")(withRouter(observer(TripSelector)));