import React, { Component } from "react";
import "../App.css";
import { observer, inject } from 'mobx-react';
import { withRouter } from "react-router-dom";

class Register extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="inner-boxcontainer">
                <div className="formcontainer">
                    <input type="text" placeholder="Full Name" />
                    <input type="text" placeholder="Email" />
                    <input type="password" placeholder="Password" autoComplete="off"/>
                    <input type="password" placeholder="Confirm Password" autoComplete="off"/>
                </div>
                <a className="muted-link" href="#">Forgot Password?</a>
                {/* <Marginer direction="vertical" margin="1em" /> */}
                <button className="submit">Register</button>
                {/* <Marginer direction="vertical" margin={5} /> */}
                <div className="muted-link" href="#">
                    Already have an account?
                    <a href="#" onClick={this.props.switchScreen}>sign in</a>
                </div>
            </div>
        );
    }
}

export default inject("CompanyStore", "UserStore")(withRouter(observer(Register)));