import React, { Component, Fragment, useEffect, useState } from "react";
import Select from 'react-select';
import { TabContent, TabPane, Nav, NavItem, NavLink, Card, Button, CardTitle, CardText, Row, Col } from 'reactstrap';
import { withRouter } from "react-router-dom";
import { observer, inject } from 'mobx-react';
import Datetime from 'react-datetime';
import "react-datetime/css/react-datetime.css";

import "../App.css";

var moment = require('moment');

const FlightTripChoice = ({ selected_trip, trip_type, cities, airlines, onTripChange }) => {
    const { source_city, destination_city, departure_date, return_date, traveller_choice } = selected_trip;
    const [sourceCity, setSourceCity] = useState('');
    const [destinationCity, setDestinationCity] = useState('');
    const [showReturnDate, setShowReturnDate] = useState(false);

    useEffect(() => {
        //setShowReturnDate(trip_type === 'Roundtrip');
        // this.onChangeTripType = this.onChangeTripType.bind(this);
    });

    const onChangeTripType = triptype => {
        //alert(`${triptype} - ${typeof(onTripChange)}`);
        //alert(typeof(onTripChange) === 'function');
        if(typeof(onTripChange) === 'function') {
            onTripChange.call(this, triptype);
        }
    };

    return (
        <div className="trip-selector">
            {/* <label className="form-label">Select flight booking choice</label> */}
            <ul>
                <li>
                    <a href="#" title="Oneway" onClick={() => { onChangeTripType('Oneway'); }} className={trip_type=='Oneway' ? "triptype-item active-item" : "triptype-item"}>Oneway</a>
                </li>
                <li>
                    <a href="#" title="Roundtrip" onClick={() => { onChangeTripType('Roundtrip'); }} className={trip_type=='Roundtrip' ? "triptype-item active-item" : "triptype-item"}>Roundtrip</a>
                </li>
            </ul>
        </div>
    );
};

export default inject("CommonStore", "CompanyStore", "UserStore")(withRouter(observer(FlightTripChoice)));