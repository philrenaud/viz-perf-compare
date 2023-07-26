// @ts-check

import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { alias } from '@ember/object/computed';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
/**
 * @typedef yearTally
 * @property {string} year
 * @property {number} value
 */

/**
 * @typedef commodity
 * @property {string} name
 * @property {yearTally[]} years
 */

/**
 * @typedef export
 * @property {string} name
 * @property {commodity[]} commodities
 */

export default class ExportsByCountryController extends Controller {
  @service preferences;

  queryParams = ['countries', 'years', 'commodities', 'mode'];

  @alias('preferences.countries') countries;
  @alias('preferences.commodities') commodities;
  @alias('preferences.years') years;
  @alias('preferences.mode') mode;

  /**
   * @type {export[]}
   */
  @alias('model') exports;

  get data() {
    return this.exports
      .filter((e) => this.countries.includes(e.name))
      .map((e) => {
        return {
          name: e.name,
          commodities: e.commodities
            .filter((c) => this.commodities.includes(c.name))
            .map((c) => {
              return {
                name: c.name,
                years: c.years.filter((y) => this.years.includes(+y.year)),
              };
            }),
        };
      });
  }

  @action focusData(data) {
    this.preferences.focusing = data;
  }
}
