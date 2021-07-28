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
        result: [],
        search_traceid: null,
        price_changed: false,
        updatedFlight: null
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
            this.SearchResult_Flights.processing = true;
            this.SearchResult_Flights.traceId = null;
            this.SearchResult_Flights.payload = searchPayload;
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
        
                    if(this.SearchResult_Flights.processing) {
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
        
                        console.log(`Flights => ${JSON.stringify(this.SearchResult_Flights.result)}`);
                    });
        
                    if(this.SearchResult_Flights.processing) {
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

        runInAction(() => {
            this.SearchResult_Flights.processing = true;
        });

        return new Promise(async (resolve, reject) => {
            try
            {
                console.log(`Trace Id : ${this.SearchResult_Flights.search_traceid}`);

                var result = await this.userService.useToken(token).getFlightFareQuote(this.SearchResult_Flights.search_traceid, id);
        
                console.log(JSON.stringify(result));
                if(result && result.data) {
                    //insert/update the traceid to localStorage
                    this.SearchResult_Flights.traceId = result.data.traceId;
                    this.SearchResult_Flights.price_changed = result.data.priceChanged;
                    //console.log(JSON.stringify(result.data));
                    runInAction(() => {
                        this.SearchResult_Flights.updatedFlight = result.data.updatedFlightTicket;
                        this.SearchResult_Flights.processing = false;
        
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
};

// decorate(CompanyStore, {
//     Company: observable,
//     getCompanyById: action,
//     getCompanyByUrl: action
// });

export default new UserStore();