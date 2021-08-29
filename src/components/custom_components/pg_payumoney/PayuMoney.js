import React,{Component} from "react";
import ReactDOM from "react-dom";
import classes from './PayuMoney.css';

class PayuMoney extends Component {
    constructor(props) {
        super(props);
        this.state = {
            process_payment: (this.props.PaymentData && this.props.PaymentData.transactionId),
            payment_payload: this.props.PaymentData,
            status: ''
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
            payment_payload: payment_payload,
            process_payment: true
        });

        // setTimeout(() => {

        // }, 200);
        var payuForm = document.forms.payuForm;
        payuForm.submit();
    }

    processComplete(status) {
        this.setState({
            payment_payload: this.state.payment_payload,
            process_payment: false,
            status: status
        })
    }

//https://test.payu.in/_payment
//https://sandboxsecure.payu.in/_payment
    render() {
        let pmtdata = this.props.PaymentData || {key: '', hashValue: '', transactionId: '', amount: 0.00, name: '', email: '', mobile: '', productInfo: '', successUrl: '', failureUrl: '', secret: '', uid: ''};
        // if(pmtdata)
        //     pmtdata.mobile = '8765412345';
        return (
            <div className="pg-payumoney">
                <h5>{this.state.process_payment ? 'Processing ...' : ''}</h5>
                <form action="https://test.payu.in/_payment" method="post" name="payuForm" target="_blank">
                    <input type="hidden" name="key" value={pmtdata.key} />
                    <input type="hidden" name="hash" value={pmtdata.hashValue}/>
                    <input type="hidden" name="txnid" value={pmtdata.transactionId} />
                    <input type="hidden" name="amount" value={pmtdata.amount} />
                    <input type="hidden" name="firstname" id="firstname" value={pmtdata.name} />
                    <input type="hidden" name="email" id="email" value={pmtdata.email} />
                    <input type="hidden" name="phone" value={pmtdata.mobile} />
                    <input type="hidden" name="productinfo" value={pmtdata.productInfo}/>
                    <input type="hidden" name="surl" value={`${process.env.REACT_APP_API_URL}${pmtdata.successUrl}`} size="64" />
                    <input type="hidden" name="furl" value={`${process.env.REACT_APP_API_URL}${pmtdata.failureUrl}`} size="64" />
                    {/* <input type="hidden" name="service_provider" value="payu_paisa" size="64" /> */}
                    <input type="hidden" name="udf1" value={pmtdata.secret} />
                    <input type="hidden" name="udf2" value={pmtdata.uid} />
                    <input type="hidden" name="udf3" value="" />
                    <input type="hidden" name="udf4" value="" />
                    <input type="hidden" name="udf5" value="" />
                    <input type="hidden" name="pg" value="" />
                    <input type="submit" value="Submit" style={{display: 'none'}}/>
                </form>
                {this.state.process_payment ? 
                    <div>Please wait payment in process.Don`t refresh this page. [{this.state.payment_payload.transactionId}]</div>
                : null }

                {this.state.status !== '' ? 
                    <div className={this.state.status}>Your payment status: {this.state.status}</div>
                : null}
            </div>
        );
    }
}

export default PayuMoney;