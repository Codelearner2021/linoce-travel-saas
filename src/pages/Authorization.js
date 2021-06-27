import React, { Component } from "react";
import "../App.css";
import Login from './Login';
import Register from './Register';
import {Container} from 'reactstrap';
import { withRouter } from "react-router-dom";
import { observer, inject } from 'mobx-react';

class Authorization extends Component {
//   const [isExpanded, setExpanded] = useState(false);
//   const [active, setActive] = useState(
//     initialActive ? initialActive : "login"
//   );

  constructor(props) {
    super(props);

    this.changeScreenMode = this.changeScreenMode.bind(this);
    this.initialActive = this.props.initialActive;
    this.state = {
        active: this.initialActive ? this.initialActive : 'login'
    }
  }    

  changeScreenMode = () => {
      let active = this.state.active;
      if(active === 'login') {
        active = 'register';
      }
      else if(active === 'register') {
        active = 'login';
      }
      this.setState({
          active: active
      })
  }

  render() {
    const {active} = this.state;
    console.log(this.state);
    return (
        <Container className="themed-container">
            <div className="boxcontainer" id='auth'>
                <div className="topcontainer">
                    <div className="backdrop">
                    </div>
                    {active === 'login' && (
                        <div className="header-container">
                            <h2 className="header-text">Welcome Back</h2>
                            <h5 className="small-text">Please sign-in to continue!</h5>
                        </div>
                    )}
                    {active === 'register' && (
                        <div className="header-container">
                            <h2 className="header-text">Create Account</h2>
                            <h5 className="small-text">Please register to continue!</h5>
                        </div>
                    )}
                </div>
                <div className="inner-container">
                {active === "login" && <Login switchScreen={this.changeScreenMode} />}
                {active === "register" && <Register switchScreen={this.changeScreenMode} />}
                </div>
            </div>
        </Container>
    );
  }
}

export default inject("CompanyStore", "UserStore")(withRouter(observer(Authorization)));