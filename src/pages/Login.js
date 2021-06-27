import React, { Component } from "react";
import { observer, inject } from 'mobx-react';
import "../App.css";
import { withRouter } from "react-router-dom";

class Login extends Component {
    constructor(props) {
        super(props);
        this.onSubmitForm = this.onSubmitForm.bind(this);
        this.input = {};
        //this.LoginFailed = false;
        this.state = {
            loginFailed: false
        }
    }

    onSubmitForm() {
        //this.loginFailed = false;
        this.setState({loginFailed: false});
        const dns = window.location.hostname;
        const href = window.location.href;
        const cuid = this.props.CompanyStore.Company.uid || localStorage.getItem('cuid');
    
        console.log(`Email : ${this.input.email.value}`);
        console.log(`Password : ${this.input.password.value}`);

        this.props.CompanyStore.login(dns, cuid, this.input.email.value, this.input.password.value)
            .then(response => {
                if(response) {
                    console.log('Login success !!');

                    this.props.history.push('/');
                }
                else {
                    console.log('Login failed !!');
                    this.setState({loginFailed: true});
                }
            })
            .catch(error => {
                console.log(`Login failed : ${error}`);
            });
    }

    render() {
        let error = this.state.loginFailed ? <span className="error login-failed">Invalid login !!</span> : null;

        return (
            <div className="inner-boxcontainer">
                {error}
                <div className="formcontainer">
                    <input type="text" name="email" placeholder="Email" ref={email_control => (this.input.email = email_control)} />
                    <input type="password" name="password" placeholder="Password" autoComplete="off" ref={password_control => (this.input.password = password_control)} />
                </div>
                <a className="muted-link" href="#">Forgot Password?</a>
                {/* <Marginer direction="vertical" margin="1em" /> */}
                <button className="submit" onClick={this.onSubmitForm}>Login</button>
                {/* <Marginer direction="vertical" margin={5} /> */}
                <div className="muted-link" href="#">
                    Dont have an Account?
                    <a href="#" onClick={this.props.switchScreen}>sign up</a>
                </div>
            </div>
        );
    }
}

export default inject("CompanyStore", "UserStore")(withRouter(observer(Login)));