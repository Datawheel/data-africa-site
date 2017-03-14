import React, {Component} from "react";
import {connect} from "react-redux";
import {activateSearch} from "actions/users";
import "./Nav.css";

class Nav extends Component {

  render() {
    const {breadcrumb, children, searchActive} = this.props;
    return (
      <nav className="nav">
        <div>
          <a className="logo" href="/">
            <span className="data">Data</span> <span className="africa">Africa</span>
          </a>
          {
            breadcrumb && breadcrumb.length ? breadcrumb.map((crumb, i) =>
              i < breadcrumb.length - 1
              ? <span><a className="link" href={`/profile/${crumb.id}`}>{ crumb.name }</a><span className="divider">/</span></span>
              : <span className={searchActive ? "profile link active" : "profile link"} onClick={ this.props.activateSearch }>{ crumb.name }</span>
            ) : null
          }
          { children }
        </div>
        <div>
          <span className={searchActive ? "link active" : "link"} onClick={ this.props.activateSearch }>Search</span>
          <a className="link" href="/">Map</a>
        </div>
      </nav>
    );
  }
}

export default connect(state => ({
  attrs: state.attrs.geo,
  breadcrumb: state.breadcrumb,
  searchActive: state.search.searchActive
}), {activateSearch})(Nav);
