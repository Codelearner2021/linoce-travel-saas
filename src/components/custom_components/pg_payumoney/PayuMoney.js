import React,{Component} from "react";
import ReactDOM from "react-dom";
import classes from './PayuMoney.css';

class PayuMoney extends Component {
    constructor(props) {
        super(props);
        this.state = {
            process_payment: false,
            payment_payload: {}
        };
    }

    componentDidMount() {
        // const script = document.createElement("script");
        // script.id = "bolt";
        // script.async = true;    
        // script.src = "https://sboxcheckout-static.citruspay.com/bolt/run/bolt.min.js";
        // this.div.appendChild(script);  
    }

    //Call to process the payment towards PayUMoney
    processPayment(payment_payload = {}) {
        this.setState({
            payment_payload = payment_payload,
            process_payment: true
        });
    }

    render() {
        return (
            <div className="pg-payumoney">
                {this.state.process_payment ? 
                    <h5>Processing Payment</h5>
                : null }
            </div>
        );
    }
}

export default PayuMoney;