import React, {Component} from "react";
import "./Footer.css";

class Footer extends Component {

  render() {

    return (
      <footer>
        <img className="ifpri" src="/images/logos/ifpri.png" />
        <img className="datawheel" src="/images/logos/datawheel.png" />
      </footer>
    );

  }
}

export default Footer;
