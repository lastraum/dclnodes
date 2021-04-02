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
import { NavLink } from "react-router-dom";
import { Nav } from "reactstrap";
// javascript plugin used to create scrollbars on windows
import PerfectScrollbar from "perfect-scrollbar";
import {withRouter} from 'react-router';
import logo from "../../assets/img/dcllogo.png";

import metaverse2 from "../../assets/img/metaverse2.png"
import metaverse from "../../assets/img/mbe.jpeg"

var ps;

class Sidebar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      account: props.account
    }
    this.activeRoute.bind(this);
    this.sidebar = React.createRef();
    console.log('sidebar props')
    console.log(this.props)
  }
  // verifies if routeName is the one active (in browser input)
  activeRoute(routeName) {
    return this.props.location.pathname.indexOf(routeName) > -1 ? "active" : "";
  }
  componentDidMount() {
    if (navigator.platform.indexOf("Win") > -1) {
      ps = new PerfectScrollbar(this.sidebar.current, {
        suppressScrollX: true,
        suppressScrollY: false,
      });
    }
  }
  componentWillUnmount() {
    if (navigator.platform.indexOf("Win") > -1) {
      ps.destroy();
    }
  }
  render() {
    return (
      <div
        className="sidebar"
        data-color={this.props.bgColor}
        data-active-color={this.props.activeColor}
      >
        <div className="logo">
          <a
            href="https://www.decentraland.org"
            className="simple-text logo-mini"
          >
            <div className="logo-img">
              <img src={logo} alt="react-logo" width={50} />
            </div>
          </a>
          <a
            href="#"
            className="simple-text logo-normal"
          >
            DCL Nodes
          </a>
        </div>
        <div className="sidebar-wrapper" ref={this.sidebar}>
        <Nav>
                <li
                  className={
                    this.activeRoute("/dashboard")}
                >
                  <NavLink
                    to={"/"}
                    className="nav-link"
                    activeClassName="active"
                  >
                    <i className={"nc-icon nc-bank"} />
                    <p>{"Dashboard"}</p>
                  </NavLink>
                </li>
                <li
                  className={
                    this.activeRoute("/maps")
                  }
                >
                  <NavLink
                    to={"/maps"}
                    className="nav-link"
                    activeClassName="active"
                  >
                    <i className={"nc-icon nc-pin-3"} />
                    <p>{"Maps"}</p>
                  </NavLink>
                </li>
                <li
                  className={
                    this.activeRoute("/profile")
                  }
                >
                  <NavLink
                    to={"/profile/" + this.state.account}
                    className="nav-link"
                    activeClassName="active"
                  >
                    <i className={"nc-icon nc-single-02"} />
                    <p>{"User Profile"}</p>
                  </NavLink>
                </li>
          </Nav>
          <hr></hr>
          <br></br><br></br>
          <div style={{padding:'5px'}}>
          <img src={metaverse}/>
          </div>
          <div style={{padding:'5px'}}>
          <img src={metaverse2}/>
          </div>
          <div>
          <iframe style={{width:"100%"}} src={"https://www.youtube.com/embed/LnQCnuvm4uo"} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen=""></iframe>
          </div>
          <div align="center"><a href="https://chrome.google.com/webstore/detail/metaverse/nghkdhckeabmkjbklgocfoojnpchhlgc?hl=en" class="btn btn-primary">Get it for Chrome</a><br/><br/></div>
        <div align="center"><a href="https://addons.mozilla.org/en-US/firefox/addon/metaverse/" class="btn btn-primary">Get it for Firefox</a></div>
        <div align="center"><a href="https://nftworld.io/metaverse-browser-extension/">Learn more</a><br/><br/></div>

        </div>
      </div>
    );
  }
}

export default withRouter(Sidebar);
