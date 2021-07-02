import { makeAutoObservable, decorate, observable, computed, action, extendObservable, runInAction } from 'mobx';
import CompanyService from '../services/CompanyService';
import UserService from '../services/UserService';
import CommonService from '../services/CommonService';

export class Common {
    cities = [];
    airlines = [];
    states = [];
    countries = [];

    constructor() {
        makeAutoObservable(this);
    }
}

class CommonStore {
    Common = {};
    Alert = {
        title: '',
        message: '',
        visible: false,
        isError: false
    }

    LoggedInUser = {
        user: {},
        jwt: {
            token: ''
        }
    }

    constructor() {
        this.companyService = new CompanyService();
        this.userService = new UserService();
        this.commonService = new CommonService();

        //this._clearLocalStorage();
        makeAutoObservable(this);
        // let uid = localStorage.getItem('uid');
        // let token = localStorage.getItem('token');
        // if(uid) {
        //     this.getLoggedInUser(token,uid);
        // }
    }

    async _clearLocalStorage() {
        if(localStorage) {
            localStorage.clear();
        }
    }

    async getStates() {
        var result = await this.commonService.getStates();
        if(result && result.data) {
            console.log(JSON.stringify(result.data));
            this.Common.states = result.data;
        }
    }

    async getCountries() {
        var result = await this.commonService.getCountries();
        if(result && result.data) {
            console.log(JSON.stringify(result.data));
            this.Common.countries = result.data;
        }
    }

    async getCities() {
        var result = await this.commonService.getCities();
        if(result && result.data) {
            console.log(JSON.stringify(result.data));
            this.Common.cities = result.data;
        }
    }

    async getCity(id) {
        var result = await this.commonService.getCity(id);
        if(result && result.data) {
            console.log(JSON.stringify(result.data));
        }
    }
    
    async getAirlines() {
        var result = await this.commonService.getAirlines();
        if(result && result.data) {
            console.log(JSON.stringify(result.data));
            this.Common.airlines = result.data;
        }
    }

    async getAirline(id) {
        var result = await this.commonService.getAirline(id);
        if(result && result.data) {
            console.log(JSON.stringify(result.data));
        }
    }

    async setAlert(title, message, visible=false, isError=false) {
        this.Alert.isError = isError;
        this.Alert.title = title;
        this.Alert.message = message;
        this.Alert.visible = visible;
    }

    async toggleAlert(show=false) {
        this.Alert.visible = show;
    }
};

// decorate(CompanyStore, {
//     Company: observable,
//     getCompanyById: action,
//     getCompanyByUrl: action
// });

export default new CommonStore();