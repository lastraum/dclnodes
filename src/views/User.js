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

// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardTitle,
  FormGroup,
  Form,
  Input,
  Row,
  Col,
  Spinner
} from "reactstrap";

import Web3 from 'web3'
import { Back, Center, ItemContent, Mana } from 'decentraland-ui/'
import { Network } from '@dcl/schemas'
import { isThrowStatement } from "typescript";
import {withRouter} from 'react-router';
import {Link} from 'react-router-dom';
import Background from '../assets/img/namebg.svg'
import { ConnextModal } from "@connext/vector-modal";
import { supportsHistory } from "history/DOMUtils";


const DEBUG = false
const { ethereum } = window

class User extends React.Component {

  constructor(props){
    super(props)
    this.state = {
      user: this.props.match.params.id,
      account: props.account,
      mana:0,
      maticMana:0,
      loadingInventory:true,
      inventory:[],
      avatar:{
        userId:"",
        email:"",
        name:"",
        hasClaimedName:false,
        description:"",
        ethAddress:"",
        version:3,
        avatar:{
          bodyShape:"",
          snapshots:{
            face:"",
            face128:"",
            face256:"",
            body:""
          },
          eyes:{
            color:{
              r:0.125,
              g:0.703125,
              b:0.96484375
            }
          },
          hair:{
            color:{
              r:0.35546875,
              g:0.19140625,
              b:0.05859375
            }
          },
          skin:{
            color:{
              r:0.8671875,
              g:0.6953125,
              b:0.5625
            }
          },
          wearables:[]
        },
        tutorialStep:483,
        interests:[],
        unclaimedName:""}
    }

    console.log(this.state)

    this.handleNewAccount = this.handleNewAccount.bind(this)

  }

  async handleNewAccount(account){
    window.location.reload()
  }

  async initializeMetamask(){

      ethereum.on('accountsChanged', this.handleNewAccount)
    
      var response = await fetch('https://peer.decentraland.org/lambdas/profile/' + this.state.user)
      var data = await response.json()
      this.setState({avatar:data.avatars[0]})

      /*
      var wearableResponse = await fetch('https://dcl-wearables-dev.now.sh/expected.json')
      console.log(await wearableResponse.json())
      */

      var inventoryResponse = await fetch('https://api.opensea.io/api/v1/assets?owner='+this.state.user+'&order_direction=desc&offset=0&limit=50')
      var inventory = await inventoryResponse.json()
      console.log(inventory)

      var dclinventory = []
      for(var i = 0; i < inventory.assets.length; i++){
        if(inventory.assets[i].collection.slug == "dcl-names" || inventory.assets[i].collection.slug == "decentraland-wearables"){
          dclinventory.push(inventory.assets[i])
        }
      }
      this.setState({inventory: dclinventory, loadingInventory:false})
  }

  componentDidMount(){
    this.initializeMetamask()
    window.ethereum.on('accountsChanged', (accounts)=> this.handleNewAccount(accounts[0]))
    window.ethereum.on('chainChanged', (_chainId) => this.handleNetworkChange(_chainId));
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.id !== this.state.user) {

      window.location.reload()
    }
  }

  getWearableStyle(item){
    const wearableStyle = {
      backgroundImage: "url(" + item.image_url + ")",
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    }
    return wearableStyle;
  }

  getWearableInfo(traits){
    for(var i =0; i < traits.length; i++){
      if(traits[i].trait_type == "rarity"){
        return traits[i].value.toString().toUpperCase()
      }
    }
  }

  getRarityStyle(traits){
    var style = {
      backgroundColor:null,
      padding:'10px',
      textTransform:'uppercase',
      borderRadius:'4px',
      display:'flex'
    }

    for(var i =0; i < traits.length; i++){
      if(traits[i].trait_type == "rarity"){
        switch(traits[i].value){
          case 'legendary':
            console.log("legendeary")
            style.backgroundColor= '#8e39df'
            break;

          case 'epic':
            style.backgroundColor= '#3d85e6'
            break;

          case 'rare':
            style.backgroundColor= '#40cf75'
            break;

          case 'uncommon':
            style.backgroundColor= '#ed6d4f'
            break;

        }
        return style
      }
    }
  }

  render() {
    const nameStyle = {
      backgroundImage: "url(" + Background + ")",
      backgroundPosition: '50%',
      backgroundColor: "#37333d"
    }

    return (
      <>

      <ConnextModal
      showModal={this.state.showMatic}
      onClose={() => this.setState({showMatic:false})}
      onReady={params => console.log('MODAL IS READY =======>', params)}
      withdrawalAddress={this.state.account}
      routerPublicIdentifier="vector6Dd1twoMwXwdphzgY2JuM639keuQDRvUfQub3Jy5aLLYqa14Np"
      depositAssetId={'0x0f5d2fb29fb7d3cfee444a200298f468908cc942'}
      depositChainProvider="https://mainnet.infura.io/v3/39b2ecccd73d4ef2a8cd60594307f7b6"
      withdrawAssetId={'0xA1c57f48F0Deb89f569dFbE6E2B7f46D33606fD4'}
      withdrawChainProvider="https://rpc-mainnet.matic.network"
      injectedProvider={window.ethereum}
      loginProvider={window.ethereum}
    />
        <div className="content">
          <Row>
            <Col md="4">
              <Card>
                <CardBody>
                  <div style={{textAlign:'center'}}>
                      <img
                        alt="..."
                        className=""
                        src={this.state.avatar.avatar.snapshots.body} responsive
                      />
                    </div>
                </CardBody>
              </Card>

            </Col>
            <Col md="8">
                  <Row>
                    <Col md="4">
                    <Card className="card-user">
                      <CardHeader>
                      </CardHeader>
                      <CardBody> 
                      <div style={{textAlign:'center'}}>
                        <img
                              alt="..."
                              className="avatar border-gray"
                              src={this.state.avatar.avatar.snapshots.face} responsive/>
                              <h4>{this.state.avatar.name}</h4>
                        </div>
                      </CardBody>
                    </Card>
                      </Col>

                      <Col md="8">
                    <Card className="card-user">
                      <CardHeader>
                      </CardHeader>
                      <CardBody><div style={{textAlign:'center'}}>
                        <Row>
                        <Col md="6" style={{textAlign:'right'}}>
                          <div className="numbers">
                            <p className="card-category">Mana<Mana size="large"></Mana></p> 
                          </div><br></br>
                          <div className="numbers">
                            <p className="card-category">Matic Mana<Mana inline size="large" network={Network.MATIC}></Mana></p>
                          </div>
                          </Col>

                          <Col md="6" style={{textAlign:'right'}}>
                          <div className="numbers">
                            <p className="card-category"></p> 
                          </div><br></br>
                          <div>
                            {this.state.account == this.state.user ? 
                              <Button color="primary" onClick={()=>{ this.setState({showMatic:true})}}>Convert Mana</Button>
                              : null}
                          </div>
                          </Col>
                        </Row>

                        </div>
                      </CardBody>
                    </Card>
                      </Col>
                  </Row>

              <Card className="card-user">
                <CardHeader>
                  <CardTitle tag="h3">{this.state.user == this.state.account ? "Your": this.state.avatar.name + "'s"} Backpack</CardTitle>
                </CardHeader>
                <CardBody>
                  {this.state.loadingInventory ? 
                  
                  <Center>
                  <Spinner animation="border" role="status" size="xl">
                  <span className="sr-only">Loading...</span>
                </Spinner>
                </Center>
                : 
                  <Row>
                  {this.state.inventory.map((item, index) => (
                    <Col md="4" key={index}>
                      <a href={"https://market.decentraland.org/contracts/"+item.asset_contract.address +"/tokens/"+ item.token_id} target="_blank">
                      <Card style={item.collection.slug == "dcl-names" ? nameStyle : this.getWearableStyle(item)}>
                        <CardBody>
                        
                          {item.collection.slug == "dcl-names" ?
                          <div>
                          <Center>
                            <div style={{fontSize:'20px', fontWeight:'bold', color:'white'}}>
                        {item.name}
                        </div>
                        </Center>
                        
                        </div>
                      :
                      <div style={{height:'100%'}}></div>}
                      
                        </CardBody>
                        <CardFooter style={{backgroundColor:"#28262c", color:'white', fontWeight:'bold'}}>
                          <div style={{padding:'10px',  fontWeight:'bold'}}>{item.name}</div>
                        
                        <div style={{display:'flex'}}>
                        {item.collection.slug == "dcl-names" ?
                        
                      <div style={{padding:'10px'}}>NAME</div>
                    :
                    
                    <div style={this.getRarityStyle(item.traits)}>
                      {
                        this.getWearableInfo(item.traits)
                      }
                    </div>
                    }
                    </div>

                        </CardFooter>
                      </Card>
                      </a>
                    </Col>
                  ))}

                  </Row>
                }

                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </>
    );
    }
}

export default withRouter(User);
