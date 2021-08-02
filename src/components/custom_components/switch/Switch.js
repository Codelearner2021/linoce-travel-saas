import React, { Component } from 'react';
import classes from './Switch.css';

export class Switch extends Component {
    constructor(props) {
        super(props);
        this.state = {
          error: -1,
        };
    }

    render () {
        let random = Math.random();
        let id = this.props.id ? this.props.id : `switch-${random}`;
        let name = this.props.name ? this.props.name : `switch-${random}`;
        let checked = this.props.value ? this.props.value : false;
        return (
            <div className="custom-switch custom_control">
                <input type="checkbox" id={id} name={name} className="custom-control-input" onChange={(ev) => this.props.onChange(ev)} checked={checked}/>
                <label className="custom-control-label" htmlFor={id}>{this.props.children}</label>
            </div>
        );
    }
}

export default Switch;