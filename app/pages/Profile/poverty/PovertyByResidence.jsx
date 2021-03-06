import React from "react";
import {SectionColumns, SectionTitle} from "datawheel-canon";
import Download from "components/Download";

import {fetchData} from "datawheel-canon";
import {povertyVizByMode, povertyTextByMode, makeGeoSelector} from "pages/Profile/poverty/shared";
import Selector from "components/Selector";

const url = "api/join/?show=year,residence&geo=<geoid>&required=poverty_geo_name,poverty_geo_parent_name,poverty_level,hc,sevpov,povgap&sumlevel=latest_by_geo,all";

class PovertyByResidence extends SectionColumns {
  constructor(props) {
    super(props);
    this.state = {povertyLevel: "ppp2", targetGeo: null};
    this.onChange = this.onChange.bind(this);
    this.onChangeGeo = this.onChangeGeo.bind(this);
  }

  onChangeGeo(event) {
    this.setState({targetGeo: event.target.value});
  }

  onChange(event) {
    this.setState({povertyLevel: event.target.value});
  }

  render() {
    const {povertyByResidence} = this.context.data;
    const {embed, profile} = this.props;
    const povertyLevel = this.state.povertyLevel;
    const {targetGeo} = this.state;

    const {filteredData, vizData, selector} = makeGeoSelector(profile, povertyByResidence.filter(x => x.poverty_level === povertyLevel),
                                                              targetGeo, this.onChangeGeo);
    const viz = povertyVizByMode.bind(this)(profile, vizData, povertyLevel, "residence", embed);
    const opts = ["ppp1", "ppp2"];
    return <SectionColumns>
            <article className="section-text">
              <SectionTitle>Poverty Measures by Residence</SectionTitle>
              <span className="dropdown-title">Disposable Income</span>
              {selector}
              <Selector options={opts} callback={this.onChange} selected={povertyLevel} />
              {povertyTextByMode(profile, filteredData, povertyLevel, "residence")}
              <Download component={ this }
                title={ `Poverty Measures by Residence in ${ profile.name } (${ vizData[0].year })` }
                url={ url.replace("<geoid>", vizData[0].geo).replace("join/", "join/csv/") } />
              <div className="data-source">Data provided by <a href="http://iresearch.worldbank.org/PovcalNet/povOnDemand.aspx" target="_blank">World Bank's PovcalNet</a></div>
            </article>
            {viz}
        </SectionColumns>;
  }
}

PovertyByResidence.need = [
  fetchData("povertyByResidence", url)
];

export default PovertyByResidence;
