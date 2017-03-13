import React from "react";

import {BarChart} from "d3plus-react";
import {SectionColumns, SectionTitle} from "datawheel-canon";

import {fetchData} from "actions/profile";
import {COLORS_POVERTY} from "helpers/colors";
import {DICTIONARY} from "helpers/dictionary";
import {FORMATTERS} from "helpers/formatters";
import {povertyContent, geoSelector} from "pages/Profile/poverty/shared";

class Poverty extends SectionColumns {
  constructor(props) {
    super(props);
    this.state = {targetGeo: null};
    this.onChangeGeo = this.onChangeGeo.bind(this);
  }

  onChangeGeo(event) {
    this.setState({targetGeo: event.target.value});
  }

  render() {
    const {profile} = this.props;
    const {povertyData} = this.context.data;
    const targetGeo = this.state.targetGeo;
    // Get a list of the unique places in the dataset
    const {filteredData, vizData, selector} = geoSelector(profile, povertyData,
                                                          targetGeo, this.onChangeGeo);

    return (
      <SectionColumns>
        <SectionTitle>Poverty Level by Measure</SectionTitle>
        <article>
          {selector}

          {povertyContent(profile, filteredData)}
        </article>
        <BarChart config={{
          data: vizData,
          discrete: "y",
          groupBy: "measure",
          groupPadding: 64,
          label: d => `${DICTIONARY[d.measure]}`,
          shapeConfig: {
            fill: d => COLORS_POVERTY[d.measure],
            label: false
          },
          x: "value",
          xConfig: {
            domain: [0, 1],
            tickFormat: FORMATTERS.shareWhole,
            title: "Proportion of Poverty"
          },
          y: "poverty_level",
          yConfig: {
            tickFormat: d => DICTIONARY[d],
            title: "Poverty Level"
          }
        }} />
    </SectionColumns>
    );
  }
}

Poverty.need = [
  fetchData("povertyData", "api/join/?geo=<id>&show=year,poverty_level&sumlevel=latest_by_geo,all&required=hc,povgap,sevpov,num,poverty_geo_name,poverty_geo_parent_name")
];

export default Poverty;
