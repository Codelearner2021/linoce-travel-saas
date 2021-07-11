import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { observer, inject } from 'mobx-react';

import "./App.css";
// import { Router, Link } from "@reach/router";
//import { Router } from "react-router";

import { Route } from "react-router-dom";
import NavbarMain from "./components/Navbar";
import Home from "./pages/Home";
import Landing from "./pages/Landing";
import Tour from "./pages/Tour";
import Authorization from "./pages/Authorization";
import FlightSearch from "./pages/FlightSearch";
import axios from 'axios';
import ErrorPage from "./components/ErrorPage";
import { Alert } from 'reactstrap';

require('dotenv').config();

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      error: -1,
      company: {'displayName' : ''}
    };

    this.onDismiss = this.onDismiss.bind(this);
  }

//   componentDidMount() {
//     const dns = window.location.hostname;
//     const href = window.location.href;

//     const headers = {
//       'Content-Type': 'application/json'
//     }    

//     // axios.post(`${process.env.REACT_APP_API_URL}/v1/Company/get-company-url`, dns, headers)
//     //     .then(response => {
//     //       console.log(`${response.data.name} - ${response.data.id}`);
//     //     })
//     //     .catch(error => {
//     //       console.log('There is an error! ', error);
//     //     });

//     if(href.indexOf('/error') > -1) {
//       this.setState({error: -1, company: null});
//       return;
//     }

//     axios({
//       url: `${process.env.REACT_APP_API_URL}/v1/Company/get-company-url`,
//       method: "post",
//       data: JSON.stringify(dns),
//       headers
//     })        
//     .then(response => {
//       let company = response.data.data;
//       if(company) {
//         console.log(`${company.name} - ${company.id}`);
//         if(company.active) {
//           this.setState({error: -1, company});
//         }
//         else {
//           this.setState({error: 1, company: null});
//         }
//       }
//       else {
//         this.setState({error: 1, company: null});
//       }
//     })
//     .catch(error => {
//       console.log('There is an error! ', error);
//     });
// }

  componentDidMount() {
    const dns = window.location.hostname;
    const href = window.location.href;

    var cities = this.props.CommonStore.getCities()
        .then(response => {
          console.log(response);
        })
        .catch(error => {
          console.log(error);
        });

    var result = this.props.CompanyStore.getCompanyByUrl(dns)
        .then(response => {
          console.log(JSON.stringify(response));

          let company = response;

          if(company) {
            console.log(`${company.name} - ${company.id}`);

            document.title = `${company.name} - Redefining your journey!!`;
            if(company.active) {
              this.setState({error: -1, company});
            }
            else {
              this.setState({error: 1, company: null});
            }
          }
          else {
            this.setState({error: 1, company: null});
          }
        })
        .catch(error => {
          console.log('There is an error! ', error);
        });
  }

  onDismiss(ev) {
    this.props.CommonStore.toggleAlert(false);
  }

  render() {
    const AlertControl = ({title, msg, visible, onToggle, isErrorAlert}) => (
      <div className="themed-container container-fluid">
        <div className="alert-container">
          <Alert color={isErrorAlert ? "danger" : "success"} isOpen={visible} toggle={onToggle} fade={true}>
              <h4 className="alert-heading">{title}</h4>
              <p>{msg}</p>
          </Alert>
        </div>
      </div>
    )

    if(this.state.error === 1) {
      return (
        <div className="App"><ErrorPage /></div>
      );
    }
    else {
      return (
        <div className="App">
          <NavbarMain />
          <AlertControl title={this.props.CommonStore.Alert.title} msg={this.props.CommonStore.Alert.message} visible={this.props.CommonStore.Alert.visible} onToggle={this.onDismiss} isErrorAlert={this.props.CommonStore.Alert.isError} />
          {/* <AlertControl title="Testing header" msg="Testing message" visible={true} onToggle={this.onDismiss} isErrorAlert={false} /> */}
          <Route exact path="/">
            {/* <Home/> */}
            <Landing/>
          </Route>
          <Route exact path="/tour">
            <Tour/>
          </Route>
          <Route exact path="/auth">
            <Authorization/>
          </Route>
          <Route exact path="/flight-search">
            <FlightSearch/>
          </Route>
          {/* <Router>
            <Home path="/" />
            <Tour path="tour" />
            <Login path="login" />
          </Router> */}
        </div>
      );
    }
  }
}

//export default inject("CommonStore", "CompanyStore", "UserStore")(observer(App));
export default inject("CommonStore", "CompanyStore", "UserStore")(withRouter(observer(App)));
