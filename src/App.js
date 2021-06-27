import React, { Component } from "react";
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
import axios from 'axios';
import ErrorPage from "./components/ErrorPage";

require('dotenv').config();

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      error: -1,
      company: {'displayName' : ''}
    };
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

    //console.log(JSON.stringify(result));

    // if(company) {
    //   console.log(`${company.name} - ${company.id}`);
    //   if(company.active) {
    //     this.setState({error: -1, company});
    //   }
    //   else {
    //     this.setState({error: 1, company: null});
    //   }
    // }
    // else {
    //   this.setState({error: 1, company: null});
    // }    
  }

  render() {
    if(this.state.error === 1) {
      return (
        <div className="App"><ErrorPage /></div>
      );
    }
    return (
      <div className="App">
        <NavbarMain />
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
        {/* <Router>
          <Home path="/" />
          <Tour path="tour" />
          <Login path="login" />
        </Router> */}
      </div>
    );
  }
}

export default inject("CompanyStore", "UserStore")(observer(App));
