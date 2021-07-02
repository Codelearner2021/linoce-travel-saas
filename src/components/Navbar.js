import React, { Component } from "react";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  Container,
  Button,
  UncontrolledDropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle
} from "reactstrap";
import "../App.css";
import { withRouter } from "react-router-dom";
import { observer, inject } from 'mobx-react';

//import { useHistory } from 'react-router-dom';

class NavbarMain extends React.Component {
  //const history = null;

  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
    this.handleLogoutClick = this.handleLogoutClick.bind(this);

    this.toggle = this.toggle.bind(this);

    this.state = {
      isOpen: false
    };
  }
  
  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  handleLogoutClick = async (e) => {
    e.preventDefault();
    await this.props.CompanyStore.logout();

    this.props.CommonStore.setAlert('Confirmation', 'You have been successfully logged out. Come back soon!', true, false);

    setTimeout(() => {
      if(this.props.CommonStore.Alert.visible)
        this.props.CommonStore.toggleAlert(false);
    }, 3000, this);
}

  handleClick = (e) => {
    e.preventDefault();
    //console.log(JSON.stringify(this.props));
    this.props.history.push('/auth');
    // let history = useHistory();
    // history.push('/login');
  }

  render() {
    console.log(`Company Name => ${JSON.stringify(this.props.CompanyStore.Company)}`);
    console.log(`Loggin User => ${JSON.stringify(this.props.CompanyStore.LoggedInUser)}`);

    console.log(`User name => ${this.props.CompanyStore.LoggedInUser.user.name}`);

    // const logged_in_user = observer(() => {
    //   console.log(`User Name => ${this.props.CompanyStore.LoggedInUser.user.name}`);
    //   if(this.props.CompanyStore.LoggedInUser.user.name !== '') {
    //     return(
    //       <div className="logged-in-user">Hi! {this.props.CompanyStore.LoggedInUser.user.name}</div>
    //     );
    //   }
    //   else {
    //     return(
    //       <></>
    //     )
    //   }
    // });    

    let button;
    if(this.props.CompanyStore.LoggedInUser && this.props.CompanyStore.LoggedInUser.user.uid) {
      button = <Button color="success" onClick={this.handleLogoutClick} className="ab-loginout">Logout</Button>;
    }
    else {
      button = <Button color="success" onClick={this.handleClick} className="ab-login">Login</Button>;
    }

    return (
      <div>
        <Navbar
          color="faded"
          dark
          expand="md"
          fixed={`top`}
          className="navDark"
        >
          <Container className="themed-container" fluid={true}>
            <NavbarBrand href="/#">
              <span>
                {this.props.CompanyStore.Company.displayName ? this.props.CompanyStore.Company.displayName : ''}
                {
                  this.props.CompanyStore.LoggedInUser.user.name ? 
                  <div className="logged-in-user">Hi! {this.props.CompanyStore.LoggedInUser.user.name}</div> : null
                }
              </span>
            </NavbarBrand>
            <NavbarToggler onClick={this.toggle} />
            <Collapse isOpen={this.state.isOpen} navbar>
              <Nav className="ml-auto" navbar>
                <NavItem>
                  <NavLink href="/">Home</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink href="/#dealsBody">Deals</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink href="/#servicesBody">Services</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink href="/#contactBody">Contact</NavLink>
                </NavItem>
                <UncontrolledDropdown nav inNavbar>
                  <DropdownToggle nav caret>
                    My Account
                  </DropdownToggle>
                  <DropdownMenu right>
                    <DropdownItem>
                      Manage Wallet
                    </DropdownItem>
                    <DropdownItem divider />
                    <DropdownItem>
                      My profile
                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>                
                {button}{" "}
              </Nav>
            </Collapse>
          </Container>
        </Navbar>
      </div>
    );
  }
}

//inject("CompanyStore")(observer(App));

//export default withRouter(NavbarMain);
export default inject("CommonStore", "CompanyStore", "UserStore")(withRouter(observer(NavbarMain)));
