import axios from "axios"

export default class UserService {
    constructor() {
        this.useToken.bind(this);
        this.getById.bind(this);
        this.getByUid.bind(this);
        this.token = '';
    }

    useToken = (token) => {
        this.token = token;

        return this;
    }

    getById = async (id) => {
        const headers = new Headers();
        if(this.token)
            headers.append("Authorization", `Bearer ${this.token}`);
        headers.append("Content-Type", "application/json");
        const url = `${process.env.REACT_APP_API_URL}/v1/user/${id}`;

        var options = {
            method: "GET"
        }
        const request = new Request(url, options);
        const response = await fetch(request);
        return response.json();
    }

    getByUid = async (uid) => {
        const headers = new Headers();
        if(this.token)
            headers.append("Authorization", `Bearer ${this.token}`);

        headers.append("Content-Type", "application/json");
        
        const url = `${process.env.REACT_APP_API_URL}/v1/user/props/${uid}`;
        
        try
        {
            var options = {
                method: "GET",
                headers
                // body: JSON.stringify(domain)
            }
            const request = await new Request(url, options);
            const response = await fetch(request);

            console.log(JSON.stringify(response));
            return response.json();
        }
        catch(e) {
            console.log(e);
        }
    }

    searchMyFlights = async (payload) => {
        const headers = new Headers();
        if(this.token)
            headers.append("Authorization", `Bearer ${this.token}`);

        headers.append("Content-Type", "application/json");
        
        const url = `${process.env.REACT_APP_API_URL}/v1/user/inventory/my/flights`;
        
        try
        {
            var options = {
                method: "POST",
                headers,
                body: JSON.stringify(payload)
            }
            const request = await new Request(url, options);
            const response = await fetch(request);

            console.log(JSON.stringify(response));
            return response.json();
        }
        catch(e) {
            console.log(e);
        }
    }

    searchPagedMyFlights = async (cacheKey, pageSize, pageIndex) => {
        const headers = new Headers();
        if(this.token)
            headers.append("Authorization", `Bearer ${this.token}`);

        headers.append("Content-Type", "application/json");
        
        const url = `${process.env.REACT_APP_API_URL}/v1/user/inventory/my/flights/search/${cacheKey}/${pageSize}/${pageIndex}`;
        
        try
        {
            var options = {
                method: "GET",
                headers
                //body: JSON.stringify(payload)
            }
            const request = await new Request(url, options);
            const response = await fetch(request);

            console.log(JSON.stringify(response));
            return response.json();
        }
        catch(e) {
            console.log(e);
        }
    }

    getFlightFareRule = async(cacheKey, id) => {
        const headers = new Headers();
        if(this.token)
            headers.append("Authorization", `Bearer ${this.token}`);

        headers.append("Content-Type", "application/json");
        
        const url = `${process.env.REACT_APP_API_URL}/v1/user/inventory/my/flights/farerule/${cacheKey}/${id}`;
        
        try
        {
            var options = {
                method: "GET",
                headers
                //body: JSON.stringify(payload)
            }
            const request = await new Request(url, options);
            const response = await fetch(request);

            console.log(JSON.stringify(response));
            return response.json();
        }
        catch(e) {
            console.log(e);
        }
    }

    getFlightFareQuote = async(cacheKey, id) => {
        const headers = new Headers();
        if(this.token)
            headers.append("Authorization", `Bearer ${this.token}`);

        headers.append("Content-Type", "application/json");
        
        const url = `${process.env.REACT_APP_API_URL}/v1/user/inventory/my/flights/farequote/${cacheKey}/${id}`;
        
        try
        {
            var options = {
                method: "GET",
                headers
                //body: JSON.stringify(payload)
            }
            const request = await new Request(url, options);
            const response = await fetch(request);

            console.log(JSON.stringify(response));
            return response.json();
        }
        catch(e) {
            console.log(e);
        }
    }

    getMyWallet = async () => {
        const headers = new Headers();
        if(this.token)
            headers.append("Authorization", `Bearer ${this.token}`);

        headers.append("Content-Type", "application/json");
        
        const url = `${process.env.REACT_APP_API_URL}/v1/user/my/wallet`;
        
        try
        {
            var options = {
                method: "GET",
                headers
                // body: JSON.stringify(domain)
            }
            const request = await new Request(url, options);
            const response = await fetch(request);

            console.log(JSON.stringify(response));
            return response.json();
        }
        catch(e) {
            console.log(e);
        }
    }

    initiatePaymentProcessingOnline = async (paymentData) => {
        const headers = new Headers();
        if(this.token)
            headers.append("Authorization", `Bearer ${this.token}`);

        headers.append("Content-Type", "application/json");
        
        const url = `${process.env.REACT_APP_API_URL}/v1/user/booking/payment/online/process`;
        
        try
        {
            var options = {
                method: "POST",
                headers,
                body: JSON.stringify(paymentData)
            }
            const request = await new Request(url, options);
            const response = await fetch(request);

            console.log(JSON.stringify(response));
            return response.json();
        }
        catch(e) {
            console.log(e);
        }
    }

    initiateBookingProcessing = async (paymentData) => {
        const headers = new Headers();
        if(this.token)
            headers.append("Authorization", `Bearer ${this.token}`);

        let cacheKey = paymentData.cacheKey;
        let ticketTraceId = paymentData.ticketTraceId;

        headers.append("Content-Type", "application/json");
        
        const url = `${process.env.REACT_APP_API_URL}/v1/user/booking/process/${cacheKey}/${ticketTraceId}`;
        
        try
        {
            var options = {
                method: "POST",
                headers,
                body: JSON.stringify(paymentData)
            }
            const request = await new Request(url, options);
            const response = await fetch(request);

            console.log(JSON.stringify(response));
            return response.json();
        }
        catch(e) {
            console.log(e);
        }
    }

    getOnlinePaymentStatus = async (transactionId) => {
        const headers = new Headers();
        if(this.token)
            headers.append("Authorization", `Bearer ${this.token}`);

        headers.append("Content-Type", "application/json");
        
        const url = `${process.env.REACT_APP_API_URL}/v1/user/payment/online/status/${transactionId}`;
        
        try
        {
            var options = {
                method: "GET",
                headers
                //body: JSON.stringify(paymentData)
            }
            const request = await new Request(url, options);
            const response = await fetch(request);

            console.log(JSON.stringify(response));
            return response.json();
        }
        catch(e) {
            console.log(e);
        }
    }

    getBookingById = async(bookingid, chainid) => {
        const headers = new Headers();
        if(this.token)
            headers.append("Authorization", `Bearer ${this.token}`);

        headers.append("Content-Type", "application/json");
        
        const url = `${process.env.REACT_APP_API_URL}/v1/user/booking/${bookingid}/${chainid}`;
        
        try
        {
            var options = {
                method: "GET",
                headers
                //body: JSON.stringify(paymentData)
            }
            const request = await new Request(url, options);
            const response = await fetch(request);

            console.log(JSON.stringify(response));
            return response.json();
        }
        catch(e) {
            console.log(e);
        }
    }
}