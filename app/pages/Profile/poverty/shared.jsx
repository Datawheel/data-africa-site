import React from "react";

import {COLORS_RESIDENCE, COLORS_GENDER} from "helpers/colors";
import {tooltipBody} from "helpers/d3plus";
import {DICTIONARY} from "helpers/dictionary";
import {VARIABLES, FORMATTERS, formatPlaceName} from "helpers/formatters";
import {titleCase} from "d3plus-text";

import {BarChart} from "d3plus-react";
import Selector from "components/Selector";

export function povertyContent(profile, poverty) {
  const first = poverty && poverty.length > 0 ? poverty[0] : null;
  if (!first) {
    return <span></span>;
  }
  const items = poverty.map(row => `${VARIABLES.totpop(row.num)} people living below ${DICTIONARY[row.poverty_level]}`);
  const place = formatPlaceName(first, "poverty", profile.level);
  return <p>As of {first.year}, there were {items.join(" and ")} in {place}.</p>;
}

function formatGender(gender, isTitle = false) {
  const inSentence = `${gender} headed households`;
  const inTitle = `${titleCase(gender)} Head of Household`;
  return isTitle ? inTitle : inSentence;
}

export function povertyTextByMode(profile, povertyData, povLevel, mode = "gender") {
  if (!povertyData || povertyData.length === 0) {
    return <p>No data available</p>;
  }
  const isGender = mode === "gender";
  const [categoryA, categoryB] = isGender ? ["male", "female"] : ["urban", "rural"];

  const first = povertyData[0];
  const place = formatPlaceName(first, "poverty", profile.level);
  let modeA = povertyData.filter(x => x[mode] === categoryA && povLevel === x.poverty_level);
  let modeB = povertyData.filter(x => x[mode] === categoryB && povLevel === x.poverty_level);
  modeA = modeA.length > 0 ? modeA[0] : null;
  modeB = modeB.length > 0 ? modeB[0] : null;
  const labelA = isGender ? formatGender(categoryA) : `people living in ${categoryA} areas`;
  const labelB = isGender ? formatGender(categoryB) : `people living in ${categoryB} areas`;
  if (modeA && modeB) {
    return <p>As of {first.year}, {FORMATTERS.shareWhole(modeA.hc)} of {labelA} and {FORMATTERS.shareWhole(modeB.hc)} of {labelB} in {place} live below {DICTIONARY[modeB.poverty_level]}.</p>;
  }
  else if (modeA || modeB) {
    const isA = modeA ? true : false;
    const mode = modeA || modeB;
    const label = isA ? labelA : labelB;
    return <p>As of {first.year}, {FORMATTERS.shareWhole(mode.hc)} of {label}.</p>;
  }
  else {
    return <p>No Data Available</p>;
  }
}

export function povertyVizByMode(profile, vizData, povertyLevel, mode, embed) {
  const colorMap = mode === "residence" ? COLORS_RESIDENCE : COLORS_GENDER;
  return <BarChart config={{
    data: vizData,
    groupBy: [mode, "poverty_level"],
    groupPadding: 100,
    height: embed ? undefined : 500,
    label: d => mode === "gender" ? formatGender(d[mode], true) : titleCase(d[mode]),
    shapeConfig: {
      fill: d => colorMap[d[mode]],
      label: false
    },
    tooltipConfig: {
      body: d => `${ d.poverty_geo_name !== profile.name ? `<span class="d3plus-body-sub">Based on data from ${formatPlaceName(d, "poverty", profile.level)}</span>` : "" }${tooltipBody.bind(["year", "poverty_prop"])(d)}`
    },
    x: "measure",
    xConfig: {
      tickFormat: d => DICTIONARY[d],
      title: "Poverty Measure"
    },
    y: "poverty_prop",
    yConfig: {
      domain: [0, 1],
      tickFormat: FORMATTERS.shareWhole,
      title: "Proportion of Poor Population"
    }
  }}/>;

}

export function makeGeoSelector(profile, povertyData, targetGeo, onChange) {
  // Get a list of the unique places in the dataset
  const places = [... new Set(povertyData.map(x => x.poverty_geo))];
  const opts = places.map(p => {
    const row = povertyData.filter(x => x.poverty_geo === p)[0];
    return {poverty_prop: p, label: formatPlaceName(row, "poverty", profile.level)};
  });
  // If there is more than one place, insert a place dropdown
  const selector = places && places.length > 1 ? <Selector options={opts} callback={onChange}/> : "";
  // By default, select the first place
  const target = targetGeo !== null ? targetGeo : places[0];
  // Filter the raw data to include only the target geo
  const filteredData = povertyData.filter(x => x.poverty_geo === target);
  // Format the data for viz display
  const vizData = filteredData.reduce((arr, d) => {
    arr.push({...d, measure: "hc", poverty_prop: d.hc});
    arr.push({...d, measure: "povgap", poverty_prop: d.povgap});
    arr.push({...d, measure: "sevpov", poverty_prop: d.sevpov});
    return arr;
  }, []);
  return {
    vizData,
    selector,
    filteredData
  };
}
