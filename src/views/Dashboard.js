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
// react plugin used to create charts
import { Line, Pie } from "react-chartjs-2";
// reactstrap components
import { Redirect } from 'react-router-dom';
import {withRouter} from 'react-router';
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardTitle,
  Row,
  Col,
  Form,
  Input,
  Label,
  FormGroup,
  Carousel,
  CarouselItem,
  CarouselControl,
  CarouselIndicators,
  CarouselCaption,
  Button,
  Table,
  Jumbotron
} from "reactstrap";
// core components
import {
  dashboard24HoursPerformanceChart,
  dashboardEmailStatisticsChart,
  dashboardNASDAQChart,
} from "variables/charts.js";

import BubbleChart from '@weknow/react-bubble-chart-d3'; 

const servers = ["peer-eu1.decentraland.org", "peer.decentral.games", "peer.decentraland.org", "peer-ec1.decentraland.org", "peer-wc1.decentraland.org", "peer-ap1.decentraland.org", "interconnected.online", "peer.melonwave.com", "decentraland.org.cn", "peer.kyllian.me", "peer.uadevops.com", "peer.dclnodes.io"]
const realmNames = ["fenrir", "dg", "hephaestus", "heimdallr", "baldr", "artemis", "loki", "poseidon", "cn86", "unicorn", "thor", "odin"]


class Dashboard extends React.Component {

  constructor(){
    super()
    this.state = {
      realms:[],
      servers:[],
      serversLocs:servers,
      realmNames:realmNames,
      bubbleData:[],
      totalUsers:0,
      selectedRealm:"fenrir",
      selectedServer:"",
      x:0,
      y:0,
      events:[],
      eventPointer:0
    }
    this.advancedJump = this.advancedJump.bind(this)
    this.updateRealmSelection = this.updateRealmSelection.bind(this)
    this.bubbleClick = this.bubbleClick.bind(this)
    this.previousEvent = this.previousEvent.bind(this)
    this.nextEvent = this.nextEvent.bind(this)
    this.jumpIn = this.jumpIn.bind(this)
  }

  componentDidMount() {
    this.fetchRealmsInfo()
    this.getDCLEvents()
  }

  bubbleClick(label){
    console.log(label)
    console.log(this.state)
    var index = this.state.realmNames.indexOf(label)
      window.location.href = "https://play.decentraland.org/?position=0%2C0&realm="+ this.state.realms[index].name + "-" + this.state.realms[index].popular
  }

  jumpIn(){
    console.log(this.state.events[this.state.eventPointer].url)
      window.location.href = this.state.events[this.state.eventPointer].url
  }

  async getDCLEvents(){
    var events = []
    var response = await fetch("https://events.decentraland.org/api/events/" )
    var data = await response.json()
    events = data.data
    console.log(events)
    this.setState({events:events})
  }

  nextEvent(){
    if(this.state.eventPointer < this.state.events.length -1){
      var pointer = this.state.eventPointer
      pointer++
      this.setState({eventPointer:pointer})
    }
  }

  previousEvent(){
    if(this.state.eventPointer >= 1){
      var pointer = this.state.eventPointer
      pointer--
      this.setState({eventPointer:pointer})
    }
  }

  advancedJump(){
    console.log(this.state)
    window.location.href = "https://play.decentraland.org/?position="+ this.state.x+"%2C"+this.state.y+"&realm="+ this.state.selectedRealm + "-" + this.state.selectedServer;
    
  }

  updateRealmSelection(e){
    this.setState({selectedRealm: e.target.value})
    this.updateServerSelection(e.target.value)
  }

  updateServerSelection(e){
     var servers = []
     var index = this.state.realmNames.indexOf(e)
     for(var i = 0; i < this.state.realms[index].servers.length; i++){
       var option = {
         name: this.state.realms[index].servers[i].name,
         count: this.state.realms[index].servers[i].count
       }
       servers.push(option)
     }
     this.setState({servers:servers})
  }

  async fetchRealmsInfo(){
    for(var i = 0; i < this.state.serversLocs.length; i++){
      var response = await fetch("https://"+this.state.serversLocs[i]+"/comms/layers")
      var servers = await response.json()
      
      var realms = this.state.realms
      var totalUsers = this.state.totalUsers
      var bubbles = this.state.bubbleData

      var max = 0
      var users = 0
      var popular = ""
      var realm = {
        name:"",
        users:0,
        servers:[],
        label:"",
        value:0,
        popular:""
      }
      for (var j = 0; j < servers.length; j++) {
        var com = {
            name: servers[j].name,
            count: servers[j].usersCount
        }

        users += servers[j].usersCount;

        if(max < servers[j].usersCount){
          max = servers[j].usersCount;
            popular = servers[j].name;
          }
        
        realm.servers.push(com)
      }
        realm.users = users
        realm.name = this.state.realmNames[i]
        realm.value = users
        realm.label = realm.name
        realm.popular = popular
        realms.push(realm)
        totalUsers += users
        this.setState({realms:realms, totalUsers:totalUsers})
    }
    this.updateServerSelection(this.state.selectedRealm)
  }

  render() {
    return (
      <>
        <div className="content">
          <Row>
            <Col lg="12">
        <Jumbotron style={{backgroundColor:'white'}}>
        <h1 className="display-3" style={{textAlign:'center'}}>DCLNodes.io</h1>
        <p className="lead" style={{paddingLeft:'10%', paddingRight:'10%'}}>Realms are hosted on nodes managed by the Decentraland community. The realm bubbles below are sized according to their population in order to make it easier to identify where users are congregating. <strong>Choose a realm to join by clicking on the corresponding bubble.</strong></p>
      </Jumbotron>
      </Col>
      </Row>
          <Row>
            <Col lg="6" md="6" sm="6">
              <Card className="card-stats">
                <CardBody>
                  <Row>
                  <Col md="8" xs="8">
                    <h2>Helpful Links</h2>
                    <Table bordered={false}>
                    <tbody>
                      <tr>
                        <td><a href="https://market.decentraland.org/">Marketplace</a></td>
                        <td><a href="https://rewards.decentraland.org/">Rewards</a></td>
                      </tr>
                      <tr>
                        <td><a href="https://builder.decentraland.org/">Builder</a></td>
                        <td><a href="https://builder.decentraland.org/claim-name">Claim Names</a></td>
                      </tr>
                      <tr>
                        <td><a href="ttps://governance.decentraland.org/">DAO</a></td>
                        <td><a href="https://docs.decentraland.org/">Developers</a></td>
                      </tr>
                      <tr>
                        <td><a href="https://market.decentraland.org/">Twitter</a></td>
                        <td><a href="https://dcl.gg/discord">Discord</a></td>
                      </tr>
                    </tbody>
                  </Table>
                    </Col>

                    <Col md="4" xs="4">
                      <div className="numbers">
                        <p className="card-category">Users Online</p>
                        <CardTitle tag="p">{this.state.totalUsers}</CardTitle>
                        <p />
                      </div>
                    </Col>
                  </Row>
                </CardBody>
                <CardFooter>
                 
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle tag="h2">Decentraland Events</CardTitle>
                  <a href="https://events.decentraland.org/api/events">View All Events</a>
                </CardHeader>
                <CardBody>
                <Carousel
                    activeIndex={this.state.eventPointer}
                    next={this.nextEvent}
                    previous={this.previousEvent}
                  >
                    <CarouselIndicators items={this.state.events} activeIndex={this.state.eventPointer} />
                    {this.state.events.map((item, index) => (
                      <CarouselItem
                      key={item.id}
                    >
                      <img src={item.image} alt={item.name} />
                      <CarouselCaption captionText={item.name} captionHeader={item.name} />
                    </CarouselItem>
                    ))}
                    <CarouselControl direction="prev" directionText="Previous" onClickHandler={this.previousEvent} />
                    <CarouselControl direction="next" directionText="Next" onClickHandler={this.nextEvent} />
                  </Carousel>
                  <br></br>
                  <h2>{ 
                    this.state.events.length > 0 ? 
                    this.state.events[this.state.eventPointer].name: ""}</h2>
                    <h4>{ 
                    this.state.events.length > 0 ? "Date:    ": ""}
                    {this.state.events.length > 0 ? new Date(this.state.events[this.state.eventPointer].start_at).toLocaleDateString(): ""}

                   </h4>
                  <h4>{ 
                    this.state.events.length > 0 ? "Oranized by: "
                    :""}
                    <span style={{color:"orangered", fontSize:'large'}}>{this.state.events.length > 0 ?
                    this.state.events[this.state.eventPointer].user_name : ""}</span>
                   </h4>
                  <h4>{ 
                    this.state.events.length > 0 ? "Location: " + this.state.events[this.state.eventPointer].coordinates[0] + "," + this.state.events[this.state.eventPointer].coordinates[1] + "    ":""}
                    <span style={{color:"orangered", fontSize:'large'}}>{this.state.events.length > 0 ?
                    this.state.events[this.state.eventPointer].live ? "LIVE" : ""
                    :""}</span>
                   </h4>
                   <h4>{ 
                    this.state.events.length > 0 ? "Attending : " + this.state.events[this.state.eventPointer].total_attendees :""}
                   </h4>
                  <h5>{
                  this.state.events.length > 0 ? 
                  this.state.events[this.state.eventPointer].description: ""}</h5>
                    <br></br>
                    {this.state.events.length > 0 ? 
                  <Button color="danger" block onClick={this.jumpIn}>JUMP IN</Button>: ""}
                </CardBody>
                <CardFooter>
                  <hr />
                  <div className="stats">
                    <i className="fa fa-history" /> Updated 3 minutes ago
                  </div>
                </CardFooter>
              </Card>
                  
              </Col>
              
              <Col lg="6" md="6" sm="6">
              <Card className="card-stats">
                <CardBody>
                  <Row>
                    <Col md="4" xs="5">
                    </Col>
                    <Col md="8" xs="7">
                      <div className="numbers">
                        <p className="card-category">Advanced Realm Selection</p>
                        <p />
                      </div>
                    </Col>
                  </Row>

                  <Row>
      
                  <Col md="3" lg="=3">
                    <FormGroup>
                    <Label for="realmSelect">Choose Realm</Label>
                      <Input type="select" name="select" id="realmSelect" onChange={this.updateRealmSelection}>
                      {this.state.realms.map((realm, index) => (
                        <option key={index} value={realm.name}>{realm.name}</option>
                      ))}
                      </Input>
                    </FormGroup>
                    </Col>

                    <Col md="3" lg="=3">
                    <FormGroup>
                    <Label for="serverSelect">Choose Server</Label>
                      <Input type="select" name="select" id="serverSelect" onChange={(e)=> {this.setState({selectedServer: e.target.value})}}>
                      {this.state.servers.map((server, index) => (
                        <option key={index} value={server.name}>{server.name + " (" + server.count + ")"}</option>
                      ))}
                      </Input>
                    </FormGroup>
                    </Col>

                    <Col md="3" lg="=3">
                      <Row>
                        <Col md="6">
                        <FormGroup>
                          <Label for="serverSelect">X</Label>
                            <Input type="input" name="email" id="x" placeholder="" onChange={(e)=> {this.setState({x: e.target.value})}} />
                          </FormGroup>
                        </Col>
                        <Col md="6">
                          <FormGroup>
                          <Label for="serverSelect">Y</Label>
                            <Input type="input" name="email" id="y" placeholder="" onChange={(e)=> {this.setState({y: e.target.value})}} />
                          </FormGroup>
                        </Col>
                      </Row>

                    </Col>

                    <Col md="3" lg="=3">
                      <br/>
                    <FormGroup>
                    <Button color="success" onClick={this.advancedJump}>Jump In</Button>
                    </FormGroup>
                    </Col>

                  </Row>
                </CardBody>
                <CardFooter>
                  <hr />
                </CardFooter>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle tag="h2">Decentraland Nodes</CardTitle>
                </CardHeader>
                <CardBody>
                  <div style={{textAlign:'center'}}>
                <BubbleChart
                  graph= {{
                    zoom: 1,
                    offsetX: 0,
                    offsetY: 0,
                  }}
                  width={700}
                  height={700}
                  padding={0} // optional value, number that set the padding between bubbles
                  showLegend={false} // optional value, pass false to disable the legend.
                  valueFont={{
                        family: 'Arial',
                        size: 12,
                        color: '#fff',
                        weight: 'bold',
                      }}
                  labelFont={{
                        family: 'Arial',
                        size: 16,
                        color: '#fff',
                        weight: 'bold',
                      }}
                  //Custom bubble/legend click functions such as searching using the label, redirecting to other page
                  bubbleClickFun={this.bubbleClick}
                  data={this.state.realms}
                />
                </div>
                </CardBody>
              </Card>
            </Col>
            </Row>
        </div>
      </>
    );
  }
}

export default withRouter(Dashboard);