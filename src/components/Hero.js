import React from "react";
import { Button } from "reactstrap";
import { withRouter } from "react-router-dom";
import { observer, inject } from 'mobx-react';

import "../App.css";
const Hero = ({CompanyStore}) => (
  //console.log(`Display Name : ${store.Company.displayName}`)

  <div>
    <main className="cover-page" id="hero">
      <section className="wrapped-page">
        <div className="item-center">
          {console.log('Store in hero => ' + JSON.stringify(CompanyStore))}
          <h1>{CompanyStore.Company.displayName ? CompanyStore.Company.displayName : 'Manila Tourism'}</h1>
          <h3>Tours | Travel | Guide</h3>
          <Button outline color="warning" href="#about">
            Explore More
          </Button>
        </div>
      </section>
    </main>
  </div>
);

//export default Hero;
export default inject("CompanyStore")(withRouter(observer(Hero)));