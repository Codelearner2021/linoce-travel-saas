import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
//import { Router } from "react-router";
import { BrowserRouter as Router } from "react-router-dom";
import { createBrowserHistory } from "history";
import registerServiceWorker, { unregister } from "./registerServiceWorker";
import { Provider } from 'mobx-react';

import companyStoreInstance from './stores/CompanyStore';
import userStoreInstance from './stores/UserStore';

import "bootstrap/dist/css/bootstrap.css";
// Add custom css import below this line
import "./index.css";

const history = createBrowserHistory();

export const StoreContext = React.createContext();

ReactDOM.render(
    <Provider CompanyStore={companyStoreInstance} UserStore={userStoreInstance}>
        <Router history={history}>
            <App />
        </Router>
    </Provider>
, document.getElementById("root"));

// registerServiceWorker();
unregister();
