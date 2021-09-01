import { makeAutoObservable, decorate, observable, computed, action, extendObservable, runInAction } from 'mobx';
import UserService from '../services/UserService';

export class User {
    id = -1;
    user_id = '';
    name = '';
    displayName = '';
    profile_image = '';
    email = '';
    mobile = '';
    address = '';
    stateid = '';
    countryid = '';
    is_supplier = false;
    is_customer = false;
    active = false;
    type = '';
    credit_ac = false;
    cr_limit = 0.00;
    doj = Date('2020-01-01');
    companyid = -1;
    created_by = 0;
    created_on = Date('2020-01-01');
    updated_by = 0;
    updated_on = Date('2020-01-01');
    permission = 255;
    is_admin = true;
    uid = '';
    pan = '';
    gst = '';
    rateplanid = -1;

    company = null;
    wallet = null;
    state_info = null;
    country_info = null;
    inventory = {
        flights: [],
        hotems: [],
        cars: [],
        packages: []
    }

    constructor() {
        makeAutoObservable(this);
    }
}

class UserStore {
    User = {};
    SearchResult_Flights = {
        payload: {},
        processing: false,
        processing_suspended: false,
        result: [],
        search_traceid: null,
        price_changed: false,
        updatedFlight: null,
        paymentInfo: null,
        selected_flight: null,
        paymentStatus: null,
        booking: []
    };

    constructor() {
        this.userService = new UserService();
        makeAutoObservable(this);
    }

    async getUserById(id) {
        var result = await this.userService.getById(id);
        if(result && result.data) {
            console.log(JSON.stringify(result.data));
        }
    }

    async getUserByUid(uid) {
        let token = localStorage.getItem('token');
        if(!token) return null;

        var result = await this.userService.useToken(token).getByUid(uid);

        console.log(JSON.stringify(result));
        if(result && result.data) {
            console.log(JSON.stringify(result.data));
            runInAction(() => {
                let user = result.data;
                this.User = user;

                console.log(`User => ${JSON.stringify(this.User)}`);
            });

            return result.data;
        }
        else {
            return result;
        }
    }

    async searchMyFlights(searchPayload) {
        let token = localStorage.getItem('token');
        if(!token) return null;

        localStorage.removeItem('traceid');
        runInAction(() => {
            this.SearchResult_Flights.processing_suspended = false;
            this.SearchResult_Flights.processing = true;
            this.SearchResult_Flights.traceId = null;
            this.SearchResult_Flights.payload = searchPayload;
            this.SearchResult_Flights.result = [];
            this.SearchResult_Flights.search_traceid = null;
        });

        return new Promise(async (resolve, reject) => {
            try
            {
                //console.log(JSON.stringify(searchPayload));
                var result = await this.userService.useToken(token).searchMyFlights(searchPayload);
        
                //console.log(JSON.stringify(result));
                if(result && result.data) {
                    //insert/update the traceid to localStorage
                    let traceid = result.data.traceId;
                    //console.log(JSON.stringify(result.data));
                    runInAction(() => {
                        let flights =  result.data.searchedFlights || []; //result.data;
                        let dataLength = flights.length;
                        let rowsCount = result.data.totalCount;

                        localStorage.setItem('traceid', traceid);
                        this.SearchResult_Flights.search_traceid = traceid;
                        this.SearchResult_Flights.result = flights;
                        this.SearchResult_Flights.processing = flights.length>0 && (rowsCount !== flights.length);
        
                        //console.log(`Flights => ${JSON.stringify(this.SearchResult_Flights)}`);
                    });

                    console.log(`Process suspended : ${this.SearchResult_Flights.processing_suspended}`);
        
                    if(this.SearchResult_Flights.processing && !this.SearchResult_Flights.processing_suspended) {
                        console.log(`Bringing next page of tickets : ${this.SearchResult_Flights.processing} | Suspended : ${this.SearchResult_Flights.processing_suspended}`);
                        await this.getRemainingFlights(result.data);
                    }
                    resolve(result.data);
                }
                else {
                    resolve(result);
                }
            }
            catch(ex) {
                console.log(`Error in searchMyFlights => ${ex}`);
                reject(ex);
            }
        });
    }

    async getRemainingFlights(flightResult) { 
        let token = localStorage.getItem('token');
        if(!token) return null;

        return new Promise(async (resolve, reject) => {
            try
            {
                var cacheKey = flightResult.traceId;
                var pageSize = parseInt(flightResult.pageSize, 10);
                var pageIndex = parseInt(flightResult.pageIndex, 10) + 1;
                //console.log(JSON.stringify(searchPayload));
                var result = await this.userService.useToken(token).searchPagedMyFlights(cacheKey, pageSize, pageIndex);
        
                //console.log(JSON.stringify(result));
                if(result && result.data) {
                    runInAction(() => {
                        // let flights = this.SearchResult_Flights.result;
                        let flights =  result.data.searchedFlights; //result.data;
                        
                        // flights.push(newFlights);

                        let dataLength = flights ? flights.length : 0;
                        let rowsCount = result.data.totalCount;
                        //this.SearchResult_Flights = flights;
                        if(flights) {
                            //this.SearchResult_Flights.result.push(flights);
                            this.SearchResult_Flights.result = this.SearchResult_Flights.result.concat(flights);
                            this.SearchResult_Flights.processing = flights.length>0;
                        }
                        else {
                            this.SearchResult_Flights.processing = false;
                        }
        
                        //console.log(`Flights => ${JSON.stringify(this.SearchResult_Flights.result)}`);
                    });
        
                    if(this.SearchResult_Flights.processing && !this.SearchResult_Flights.processing_suspended) {
                        await this.getRemainingFlights({'traceId': cacheKey, 'pageSize': pageSize, 'pageIndex': pageIndex});
                    }
                    resolve(result.data);
                }
            }
            catch(ex) {
                console.log(`Error in getRemainingFlights => ${ex}`);
                reject(ex);
            }
        });
    }

    getFlightById(id) {
        let flights = this.SearchResult_Flights.result;
        let flight = null;
        for (let index = 0; index < flights.length; index++) {
            flight = flights[index];
            if(flight.id === id) {
                break;
            }
        }

        return flight;
    }

    async getFareRule(id) {
        let token = localStorage.getItem('token');
        if(!token) return null;

        runInAction(() => {
            this.SearchResult_Flights.processing = true;
        });

        return new Promise(async (resolve, reject) => {
            try
            {
                console.log(`${this.SearchResult_Flights.search_traceid}`);
                var result = await this.userService.useToken(token).getFlightFareRule(this.SearchResult_Flights.search_traceid, id);
        
                console.log(JSON.stringify(result));
                if(result && result.data) {
                    //insert/update the traceid to localStorage
                    // let traceid = result.data.traceId;
                    //console.log(JSON.stringify(result.data));
                    // runInAction(() => {
                    //     let flights =  result.data.searchedFlights || []; //result.data;
                    //     let dataLength = flights.length;
                    //     let rowsCount = result.data.totalCount;
                    //     //this.SearchResult_Flights = flights;
                    //     this.setState({
                    //         SearchResult_Flights: {
                    //             payload: this.SearchResult_Flights.payload,
                    //             search_traceid: traceid,
                    //             result: flights,
                    //             processing: flights.length>0 && (rowsCount !== flights.length)
                    //         }
                    //     });
    
                    //     // this.SearchResult_Flights.result = flights;
                    //     // this.SearchResult_Flights.processing = flights.length>0 && (rowsCount !== flights.length);
        
                    //     //console.log(`Flights => ${JSON.stringify(this.SearchResult_Flights)}`);
                    // });
        
                    resolve(result.data);
                }
                else {
                    resolve(result);
                }
            }
            catch(ex) {
                console.log(`Error in getFareRule => ${ex}`);
                reject(ex);
            }
        });        
    }

    async getFareQuote(id) {
        let token = localStorage.getItem('token');
        if(!token) return null;

        this.SearchResult_Flights.search_traceid = localStorage.getItem('traceid');
        // let flight = this.getFlightById(id);
        
        // if(flight)
        //     this.SearchResult_Flights.selected_flight = flight;

        runInAction(() => {
            this.SearchResult_Flights.processing_suspended = true;
            this.SearchResult_Flights.processing = true;
        });

        return new Promise(async (resolve, reject) => {
            try
            {
                console.log(`Trace Id : ${this.SearchResult_Flights.search_traceid}`);

                var result = await this.userService.useToken(token).getFlightFareQuote(this.SearchResult_Flights.search_traceid, id);
        
                //console.log(JSON.stringify(result));
                if(result && result.data) {
                    let resultData = result.data;
                    let quotedFlight = resultData.updatedFlightTicket;
                    if(this.SearchResult_Flights.result && this.SearchResult_Flights.result.length>0) {
                        for (let index = 0; index < this.SearchResult_Flights.result.length; index++) {
                            let flightItem = this.SearchResult_Flights.result[index];
                            if(flightItem.id === quotedFlight.id) {
                                this.SearchResult_Flights.result[index] = quotedFlight;
                                break;
                            }
                        }
                    }
                    else {
                        this.SearchResult_Flights.result = [quotedFlight];
                    }
                //insert/update the traceid to localStorage
                    this.SearchResult_Flights.traceId = resultData.traceId;
                    this.SearchResult_Flights.price_changed = resultData.priceChanged;
                    //console.log(JSON.stringify(result.data));
                    runInAction(() => {
                        this.SearchResult_Flights.updatedFlight = quotedFlight;
                        this.SearchResult_Flights.selected_flight = quotedFlight;
                        this.SearchResult_Flights.processing = false;
                        this.SearchResult_Flights.processing_suspended = false;
        
                        //console.log(`Flights => ${JSON.stringify(this.SearchResult_Flights)}`);
                    });
        
                    resolve(result.data);
                }
                else {
                    resolve(result);
                }
            }
            catch(ex) {
                console.log(`Error in getFareRule => ${ex}`);
                reject(ex);
            }
        });
    }

    isLoggedIn() {
        let token = localStorage.getItem('token');
        //if(!token) return null;
        return token !== null;
    }

    async getMyWallet() {
        let token = localStorage.getItem('token');
        if(!token) return null;

        var result = await this.userService.useToken(token).getMyWallet();

        console.log(JSON.stringify(result));
        if(result && result.data) {
            console.log(JSON.stringify(result.data));
            runInAction(() => {
                let user = result.data;
                this.User = user;

                console.log(`User => ${JSON.stringify(this.User)}`);
            });

            return result.data;
        }
        else {
            return result;
        }
    }

    async initiatePaymentProcessingOnline(paymentProcessingData) {
        let paymentData = {
            cacheKey: this.SearchResult_Flights.traceId,
            ticketTraceId: this.SearchResult_Flights.selected_flight.traceId, //paymentProcessingData.ticket.traceId,
            paymentInfo: paymentProcessingData.payment,
            passengers: paymentProcessingData.passengers
        } //paymentProcessingData || { ticket: {}, payment: {}, passengers: {}};

        let token = localStorage.getItem('token');
        if(!token) return null;

        var result = await this.userService.useToken(token).initiatePaymentProcessingOnline(paymentData);

        console.log(JSON.stringify(result));
        if(result && result.data) {
            console.log(JSON.stringify(result.data));
            runInAction(() => {
                let paymentInfo = result.data;
                this.paymentInfo = paymentInfo;

                console.log(`Payment Info => ${JSON.stringify(this.paymentInfo)}`);
            });

            return result.data;
        }
        else {
            return result;
        }
    }

    async initiateBookingProcessing(paymentProcessingData) {
        let paymentData = {
            cacheKey: this.SearchResult_Flights.traceId,
            ticketTraceId: this.SearchResult_Flights.selected_flight.traceId, //paymentProcessingData.ticket.traceId,
            paymentInfo: paymentProcessingData.payment,
            passengers: paymentProcessingData.passengers
        } //paymentProcessingData || { ticket: {}, payment: {}, passengers: {}};

        let token = localStorage.getItem('token');
        if(!token) return null;

        var result = await this.userService.useToken(token).initiateBookingProcessing(paymentData);

        console.log(JSON.stringify(result));
        if(result && result.data) {
            console.log(JSON.stringify(result.data));
            runInAction(() => {
                let booking = result.data;
                this.booking = booking;

                console.log(`Booking Info => ${JSON.stringify(this.SearchResult_Flights.booking)}`);
            });

            return result.data;
        }
        else {
            return result;
        }
    }

    async getOnlinePaymentStatus(transactionId) {
        let token = localStorage.getItem('token');
        if(!token) return null;

        var result = await this.userService.useToken(token).getOnlinePaymentStatus(transactionId);

        console.log(JSON.stringify(result));
        if(result && result.data) {
            console.log(JSON.stringify(result.data));
            runInAction(() => {
                let paymentInfo = result.data;
                this.paymentStatus = paymentInfo;

                console.log(`Payment Info => ${JSON.stringify(this.paymentInfo)}`);
            });

            return result.data;
        }
        else {
            return result;
        }
    }
};

// decorate(CompanyStore, {
//     Company: observable,
//     getCompanyById: action,
//     getCompanyByUrl: action
// });

export default new UserStore();