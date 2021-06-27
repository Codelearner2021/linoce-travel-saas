import axios from "axios"

export default class CompanyService {
    getById = async (id) => {
        const headers = new Headers();
        headers.append("Content-Type", "application/json");
        const url = `${process.env.REACT_APP_API_URL}/v1/Company/${id}`;

        var options = {
            method: "GET"
        }
        const request = new Request(url, options);
        const response = await fetch(request);
        return response.json();
    }

    getByDomain = async (domain) => {
        const headers = new Headers();
        headers.append("Content-Type", "application/json");
        const url = `${process.env.REACT_APP_API_URL}/v1/Company/get-company-url`;
        
        try
        {
            var options = {
                method: "POST",
                headers,
                body: JSON.stringify(domain)
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

    login = async(companyuid, userid, password) => {
        const headers = new Headers();
        headers.append("Content-Type", "application/json");
        const url = `${process.env.REACT_APP_API_URL}/identity/token`;

        const payload = {
            companyuid: companyuid,
            mobile: userid,
            email: userid,
            password
        }
        
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
}