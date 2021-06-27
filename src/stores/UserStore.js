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
};

// decorate(CompanyStore, {
//     Company: observable,
//     getCompanyById: action,
//     getCompanyByUrl: action
// });

export default new UserStore();