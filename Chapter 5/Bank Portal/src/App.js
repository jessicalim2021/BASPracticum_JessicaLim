import React, { Component } from "react";
import StellarSdk from "stellar-sdk";
import Nav from "./Components/Nav";
import Description from "./Components/Description";
import Container from "./Components/Container";
import assets from "./Assets/Assets.js";
import LoginPage from "./Pages/LoginPage";
import {Route, Switch, Redirect, BrowserRouter, useHistory} from 'react-router-dom'
import TransferPage from "./Pages/TransferPage";
import TransactionHistory from "./Pages/TransactionHistory";
import AddressBar from "./Components/AddressBar";
var toml = require("toml");
var concat = require("concat-stream");
var fs = require("fs");
const requestObj = require("request");
const DBServerA = "localhost:3600"; // change from 3602 (Bank B) to 3600 (Bank A)
const DBServerB = "localhost:3602";

export default function App (){
  
  const appName = "Remittance App"
  const network = "Private Testnet"
  const history = useHistory()
  
    return (
		<div>
			
			  <Nav appName={appName} history={history} network={network} />
          <Description />
        <div className="main-body">
          
          <Switch>
            <Route path="/login">
              <LoginPage/>
            </Route>
            <Route path="/transfer">
              <TransferPage/>
            </Route>
            <Route path="/transaction-history">
              <TransactionHistory/>
            </Route>
            <Redirect exact path="/" to="/login"/>
          </Switch>
        </div>
      <div>
        {/* <Description name={this.state.name} />
        <Container
          onInputChangeUpdateField={this.onInputChangeUpdateField}
          account={this.state.account}
          balance={this.state.balance}
          payment={this.payment}
          setBank={this.setBank}
          receivedtx={this.state.receivedtx}
          chkaddr={this.chkaddr}
          setBalance={this.setBalance}
          fields={this.state.fields}
         leftHome={this.state.leftHome}
          goHome={this.goHome}
          setAccount={this.setAccount}
          txstatus={this.state.txstatus}
          txid={this.state.txid}
        /> */}
      </div>
	  
	</div>
    );
}
