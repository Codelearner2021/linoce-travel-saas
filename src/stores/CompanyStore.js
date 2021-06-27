import { makeAutoObservable, decorate, observable, computed, action, extendObservable, runInAction } from 'mobx';
import CompanyService from '../services/CompanyService';
import UserStore, { User } from '../stores/UserStore';

export class Company {
    id = -1;
    createdBy = -1;
    createdOn = "0001-01-01T00:00:00";
    lastModifiedBy = 0;
    lastModifiedOn = "0001-01-01T00:00:00";
    code = "";
    name = "";
    address = "";
    stateId = -1;
    countryId = -1;
    displayName = "";
    tenentCode = "";
    primaryUserId = -1;
    gstNo = "";
    pan = "";
    type = -1;
    uid = '';
    active = true;
    parentCompanyId = -1;
    baseURL = "";
    pin = "";
    primaryUser = null;
    users = [];
    stateInfo = null;
    countryInfo = null;
    wallets = [];
    attributes = [];

    constructor() {
        makeAutoObservable(this);
    }
}

class CompanyStore {
    Company = {};
    LoggedInUser = {
        user: {},
        jwt: {
            token: ''
        }
    }

    constructor() {
        this.companyService = new CompanyService();

        //this._clearLocalStorage();
        makeAutoObservable(this);
        let uid = localStorage.getItem('uid');
        let token = localStorage.getItem('token');
        if(uid) {
            this.getLoggedInUser(token,uid);
        }
    }

    async _clearLocalStorage() {
        if(localStorage) {
            localStorage.clear();
        }
    }

    async getLoggedInUser(token, uid) {
        let result = await UserStore.getUserByUid(uid)
        .then(response => {
            console.log(response);
            runInAction(() => {
                if(response) {
                    console.log(`Auto loading user => ${response}`);
                    this.LoggedInUser.user = response;
                }
            });            
        })
        .catch(error => {
            console.log(error);
        });
    }

    async getCompanyById(id) {
        var result = await this.companyService.getById(id);
        if(result && result.data) {
            console.log(JSON.stringify(result.data));
        }
    }

    async getCompanyByUrl(url) {
        var result = await this.companyService.getByDomain(url);

        console.log(JSON.stringify(result));
        if(result && result.data) {
            console.log(JSON.stringify(result.data));
            runInAction(() => {
                let company = result.data;
                this.Company = company;

                if(localStorage)
                    localStorage.setItem('cuid', company.uid);

                console.log(`Company => ${JSON.stringify(this.Company)}`);
            });

            return result.data;
        }
        else {
            return result;
        }
    }

    async login(dns, companyuid, userid, password) {
        var result = await this.companyService.getByDomain(dns);

        console.log(JSON.stringify(result));
        if(result && result.data && result.succeeded) {
            console.log(JSON.stringify(result.data));
            let company = result.data;
            if(company && company.uid) {
                var login_result = await this.companyService.login(company.uid, userid, password);
                if(login_result && login_result.data && login_result.succeeded) {
                    console.log(JSON.stringify(login_result.data));
                    let user = login_result.data;
                    runInAction(() => {
                        this.Company = company;
                        this.LoggedInUser = {};
                        this.LoggedInUser.user = new User();
                        this.LoggedInUser.user.uid = user.id;
                        this.LoggedInUser.user.name = user.userName;
                        this.LoggedInUser.user.mobile = user.mobile;
                        this.LoggedInUser.user.email = user.email;
                        this.LoggedInUser.user.roles = user.roles;
                        this.LoggedInUser.jwt = {};
                        this.LoggedInUser.jwt.token = user.jwToken;
                        this.LoggedInUser.jwt.isVerified = user.isVerified;
                        this.LoggedInUser.jwt.issuedOn = user.issuedOn;
                        this.LoggedInUser.jwt.expiresOn = user.expiresOn;

                        localStorage.setItem('token', user.jwToken);
                        localStorage.setItem('uid', user.id);
        
                        console.log(`Logged-in user => ${JSON.stringify(this.LoggedInUser)}`);
                    });
        
                    return true;
                }
                else {
                    return false;
                }
            }
        }
        else {
            return false;
        }
    }

    async logout() {
        this._clearLocalStorage();
        runInAction(() => {
            this.LoggedInUser = {
                user: {},
                jwt: {
                    token: null
                }
            }
        });
    }
};

// decorate(CompanyStore, {
//     Company: observable,
//     getCompanyById: action,
//     getCompanyByUrl: action
// });

export default new CompanyStore();