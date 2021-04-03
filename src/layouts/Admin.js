/*!

=========================================================
* Paper Dashboard React - v1.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/paper-dashboard-react
* Copyright 2020 Creative Tim (https://www.creative-tim.com)

* Licensed under MIT (https://github.com/creativetimofficial/paper-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
// javascript plugin used to create scrollbars on windows
import PerfectScrollbar from "perfect-scrollbar";
import { Route, Switch } from "react-router-dom";

import DemoNavbar from "components/Navbars/DemoNavbar.js";
import Sidebar from "components/Sidebar/Sidebar.js";
import Dashboard from "views/Dashboard.js";
import Maps from "views/Map.js";
import UserPage from "views/User.js";
import routes from "routes.js";
import { Center } from 'decentraland-ui'
import Background from '../assets/img/dclbg.png'
import {
  Button
} from "reactstrap";
import Spinner from "reactstrap/lib/Spinner";


const DEBUG = false
const { ethereum } = window

const isMetaMaskInstalled = () => {
  const { ethereum } = window
  return Boolean(ethereum && ethereum.isMetaMask)
}

var ps;

class AdminLayout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      backgroundColor: "white",
      activeColor: "info",
      loading:true
    };
    this.mainPanel = React.createRef();
    this.onClickConnect = this.onClickConnect.bind(this)
    this.handleNewAccounts = this.handleNewAccounts.bind(this)
    this.handleNetworkChange = this.handleNetworkChange.bind(this)
    this.handleNewChain = this.handleNewChain.bind(this)
  }

  async onClickConnect(){
    try {
      const newAccounts = await ethereum.request({
        method: 'eth_requestAccounts',
      })
      this.setState({accounts: newAccounts[0]})
    } catch (error) {
      console.error(error)
    }
  }

  handleNewAccounts(newAccounts) {
    this.setState({account:newAccounts[0]})
    window.location.reload()
  }

  handleNewChain (chainId) {
    console.log(chainId)
    this.setState({network: chainId})
  }

  handleNetworkChange (networkId) {
    console.log(networkId)
    this.setState({network:networkId})
  }

  async initializeMetamask(){
    if (ethereum) {
      await window.ethereum.enable();
      ethereum.autoRefreshOnNetworkChange = true
      await this.getNetworkAndChainId()

      const accounts = await ethereum.request({ method: 'eth_accounts' });
      ethereum.on('accountsChanged', (accounts)=> this.handleNewAccount(accounts[0]))
      ethereum.on('chainChanged', (_chainId) => this.handleNetworkChange(_chainId));
      this.setState({account: accounts[0] , loading:false})
    }
    console.log(this.state)
  }

  async getNetworkAndChainId () {
    try {
      const chainId = await ethereum.request({
        method: 'eth_chainId',
      })
      this.handleNewChain(chainId)
    } catch (err) {
      console.error(err)
    }
  }


  componentDidMount() {
    if (navigator.platform.indexOf("Win") > -1) {

 
    }
    this.initializeMetamask()
    window.ethereum.on('accountsChanged', (accounts)=> this.handleNewAccounts(accounts[0]))
    window.ethereum.on('chainChanged', (_chainId) => this.handleNetworkChange(_chainId));

  }
  componentWillUnmount() {
    if (navigator.platform.indexOf("Win") > -1) {
      ps.destroy();
    }
  }
  componentDidUpdate(e) {
    if (e.history.action === "PUSH") {
      this.mainPanel.current.scrollTop = 0;
      document.scrollingElement.scrollTop = 0;
    }
  }
  handleActiveClick = (color) => {
    this.setState({ activeColor: color });
  };
  handleBgClick = (color) => {
    this.setState({ backgroundColor: color });
  };
  render() {
    if(this.state.loading){
      return(
        <Center>
          <Spinner>Loading</Spinner>
        </Center>
      )
    }
    else{
    if(this.state.network != (DEBUG ? "0x3" : "0x1")){
      return(<Center screen><div><h2>Please choose the {this.state.network = (DEBUG ? "Ropsten" : "Mainnet")} Network</h2></div></Center>)
    }
    else{
      if(!this.state.account || this.state.account.length <1){
        return(
          <Center>
            <Button color="danger" onClick={this.onClickConnect}>Metamask</Button>
          </Center>
        )
      }
      else{
    return (
      <div className="wrapper">
        <Sidebar
          {...this.props}
          routes={routes}
          bgColor={this.state.backgroundColor}
          activeColor={this.state.activeColor}
          account={this.state.account}
        />
        <div className="main-panel" style={{backgroundImage: "url(" + Background + ")", backgroundSize:'cover'}} ref={this.mainPanel}>
          <Switch>
          <Route exact path="/">
            <Dashboard web3Context={this.state.web3} account={this.state.account} />
          </Route>
          <Route exact path="/profile/:id">
            <UserPage web3Context={this.state.web3} account={this.state.account} id={this.state.account} />
          </Route>
          <Route exact path="/maps">
            <Maps web3Context={this.state.web3} account={this.state.account} />
          </Route>
          </Switch>
        </div>
      </div>
    );
  }
  }
}
}
}

export default AdminLayout;
