// @ts-check

import Route from '@ember/routing/route';
import { dsv } from 'd3-fetch';
import { inject as service } from '@ember/service';

/**
 * @typedef RawExportDatum
 * @property {string} CTY_DESC
 * @property {string} CTY_CODE
 * @property {string} COMM_DESC
 * @property {string} END_USE
 * @property {string} value_13
 * @property {string} value_14
 * @property {string} value_15
 * @property {string} value_16
 * @property {string} value_17
 * @property {string} value_18
 * @property {string} value_19
 * @property {string} value_20
 * @property {string} value_21
 * @property {string} value_22
 */

export default class ExportsByCountryRoute extends Route {
  @service preferences;

  cleanData(data) {
    let yearColumns = [
      'value_13',
      'value_14',
      'value_15',
      'value_16',
      'value_17',
      'value_18',
      'value_19',
      'value_20',
      'value_21',
      'value_22',
    ];
    let cleanData = data.map((d) => {
      let cleanDatum = {};
      cleanDatum.country = d.CTY_DESC;
      cleanDatum.commodity = d.COMM_DESC;
      cleanDatum.years = [];
      yearColumns.forEach((yearColumn) => {
        cleanDatum.years.push({
          name: +`20${yearColumn.split('_')[1]}`,
          value: +d[yearColumn],
        });
      });
      return cleanDatum;
    });

    // Group commodities by country
    return cleanData;
  }

  groupDataByCountry(data) {
    return data
      .reduce((acc, d) => {
        let country = acc.find((a) => a.name === d.country);
        if (!country) {
          acc.push({
            name: d.country,
            commodities: [],
          });
          country = acc[acc.length - 1];
        }

        country.commodities.push({
          name: d.commodity,
          years: d.years,
        });
        return acc;
      }, [])
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  async model() {
    console.time('fetch');
    let exports = await dsv(',', '/enduse_exports.csv');
    console.timeEnd('fetch');
    console.time('clean');
    let data = this.groupDataByCountry(this.cleanData(exports)); // c'mon pipe operators, land already
    console.timeEnd('clean');

    // TODO: I probably actually want to see commoddities/years pivoted.

    return data;
  }

  afterModel(model, transition) {
    // set the allCountries list of the preferences service
    this.preferences.allCountries = model.map((e) => e.name);
    this.preferences.allCommodities = model
      .find((e) => e.name === 'World Total')
      .commodities.map((c) => c.name)
      .sort((a, b) => a.localeCompare(b));
  }
}
