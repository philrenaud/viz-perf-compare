// @ts-check

import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class BarChartHtmlComponent extends Component {
  @service preferences;

  get maxPeerTotal() {
    let peerTotals = this.args.data.commodities
      .filter((c) => this.preferences.commodities.includes(c.name)) // only include commodities that are selected
      .map((c) => c.years.filter((y) => this.preferences.years.includes(y.name)).reduce((acc, year) => acc + year.value, 0));
    let maxPeerTotal = Math.max(...peerTotals);
    return maxPeerTotal;
  }

  @action focusData({year, commodity}) {
    this.args.focusData({year, commodity, country: this.args.data});
  }
}
