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
// react plugin used to create google maps
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
} from "react-google-maps";
import { Atlas, Layer, Coord  } from 'decentraland-ui'
import { Center } from 'decentraland-ui'
// reactstrap components
import { Card, CardHeader, CardBody, Row, Col } from "reactstrap";

let tiles
if (window) {
  Atlas.fetchTiles().then(_tiles => (tiles = _tiles))
}


class Map extends React.Component {

  constructor(props){
    super(props)
    this.state = {
      web3:props.web3Context,
      account:props.account,
      enabled:[],
      events:[],
      eventSelected:{},
      eventModalShow:false,
      disabledDates:[],
      currentLeases:[],
      loading:true,
      ercApproved:true,
      platformApproved:false,
      contracts:props.contracts,
      showAtlas:false,
      abi:props.abi,
      filter:"All",
      selected:[],
      selectedCoords:[],
      rentDays:0,
      singleEventColor:{ color: '#00ff29', scale:1.2 },
      singleLeasedColor:{ color: '#fbb320', scale:1.2 },
      combinedColor:{color:' linear-gradient(45deg, #00ff29, #fbb320)', scale: 1.2},
      selectedLease:false,
      selectedEvent:false,
      ranges: {
        startDate: new Date(),
        endDate: new Date(),
        key: 'selection'
      },
      tModal:false,
      txAction:"",
      tx:"",
      txStatus:"",
      manaAllowance:0
  }
  }

  handleClick = (x, y) => {
    if (this.isSelected(x, y)) {
       this.setState({selectedCoords:[], isSelected:false, selected:null })
       
    } else {
      this.setState({selectedCoords: [this.state.selectedCoords, { x, y }], selected:{x:x, y:y}})
      this.setState({isSelected:true})
      const key = x + ',' + y
      if (this.state.enabled && this.state.enabled[key] && 'enabled' in this.state.enabled[key]) {
        this.setState({selectedLease: true, selectedEvent:false, selected:this.state.enabled[key]})
      }
      else if(this.state.events && this.state.events[key]){
        this.setState({selectedEvent: true, selectedLease:false, selected:this.state.events[key]})
      }
      else
        this.setState({selectedEvent: false, selectedLease: false})
      }
  }
  isSelected = (x, y) =>{
    return this.state.selectedCoords.some(coord => coord.x === x && coord.y === y)
    }

  selectedLayer = (x, y) => {
    return this.isSelected(x, y) ? { color: '#ff0044', scale: 1.4 } : null
  }

  forSaleLayer = (x, y) => {
    const key = x + ',' + y
    if (tiles && tiles[key] && 'price' in tiles[key]) {
      return { color: '#00d3ff' }
    }
    return null
  }

  leasedLayer = (x,y) =>{
    const key = x + ',' + y
    if (this.state.enabled && this.state.enabled[key] && 'enabled' in this.state.enabled[key]) {
      if (this.state.events && this.state.events[key]) {
        console.log('both layers')
        return this.state.combinedColor
      }
      else{
        console.log('one layer')
        return this.state.singleLeasedColor
      }
    }
  }

  eventsLayer = (x,y) =>{
    const key = x + ',' + y
    if (this.state.events && this.state.events[key]) {
      if (this.state.enabled && this.state.enabled[key] && 'enabled' in this.state.enabled[key]) {
        return this.state.combinedColor
      }
      else{
        return this.state.singleEventColor
      }
    }
  }

  selectedLayer = (x, y) => {
    return this.isSelected(x, y) ? { color: '#ff0044', scale: 1.4 } : null
  }

  render() {
    return (
      <>
        <div className="content">
          <Row>
            <Col md="12">
              <Card>
                <CardHeader>Decentraland Atlas</CardHeader>
                <CardBody>
                  <div
                    id="map"
                    className="map"
                    style={{ position: "relative", overflow: "hidden" }}
                  >
                    <Atlas titles={this.state.tiles} onClick={this.handleClick} layers={[this.selectedLayer, this.leasedLayer, this.forSaleLayer, this.eventsLayer]}/>
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

export default Map;
