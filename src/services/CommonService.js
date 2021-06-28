import axios from "axios"

export default class CommonService {
    getCities = async () => {
        const headers = new Headers();
        headers.append("Content-Type", "application/json");
        const url = `${process.env.REACT_APP_API_URL}/v1/common/masterdata/cities`;

        var options = {
            method: "GET"
        }
        const request = new Request(url, options);
        const response = await fetch(request);
        return response.json();
    }

    getCity = async (cityid) => {
        const headers = new Headers();
        headers.append("Content-Type", "application/json");
        const url = `${process.env.REACT_APP_API_URL}/v1/common/masterdata/cities/${cityid}`;

        var options = {
            method: "GET"
        }
        const request = new Request(url, options);
        const response = await fetch(request);
        return response.json();
    }

    getCountries = async () => {
        const headers = new Headers();
        headers.append("Content-Type", "application/json");
        const url = `${process.env.REACT_APP_API_URL}/v1/common/metadata/country`;

        var options = {
            method: "GET"
        }
        const request = new Request(url, options);
        const response = await fetch(request);
        return response.json();
    }

    getStates = async () => {
        const headers = new Headers();
        headers.append("Content-Type", "application/json");
        const url = `${process.env.REACT_APP_API_URL}/v1/common/metadata/state`;

        var options = {
            method: "GET"
        }
        const request = new Request(url, options);
        const response = await fetch(request);
        return response.json();
    }

    getAirlines = async () => {
        const headers = new Headers();
        headers.append("Content-Type", "application/json");
        const url = `${process.env.REACT_APP_API_URL}/v1/common/masterdata/airlines`;

        var options = {
            method: "GET"
        }
        const request = new Request(url, options);
        const response = await fetch(request);
        return response.json();
    }

    getAirline = async (airlineid) => {
        const headers = new Headers();
        headers.append("Content-Type", "application/json");
        const url = `${process.env.REACT_APP_API_URL}/v1/common/masterdata/airlines/${airlineid}`;

        var options = {
            method: "GET"
        }
        const request = new Request(url, options);
        const response = await fetch(request);
        return response.json();
    }
}