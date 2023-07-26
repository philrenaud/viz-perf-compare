// @ts-check
import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class StackedBarHtmlComponent extends Component {
  @service preferences;
  get relativeBars() {
    console.log('RELATIVE BAERS REFIRE');
    if (!this.args.data) return [];
    // Return each bar's value as a percentage of the total,
    // plus an offset to account for the previous bars.
    console.log('dater', this.args.data, this.preferences.years);
    let data = this.preferences.years.map((c) => {
      let year = this.args.data?.years.find((d) => d.name === c);
      return year;
    });
    console.log('dater2', data);
    let total = this.total;
    let offset = 0;
    return data.map((d) => {
      if (!d) return;
      let relativeValue = (d.value / total) * 100;
      let relativeOffset = (offset / total) * 100;
      offset += d.value;
      return {
        name: d.name,
        value: d.value,
        relativeValue,
        offset: offset,
        relativeOffset,
      };
    });
  }

  get total() {
    return this.args.data?.years
    .filter((d) => this.preferences.years.includes(d.name))
    .reduce((acc, d) => acc + d.value, 0);
  }

  get width() {
    return this.preferences.normalize === 'year'
      ? 100
      : (this.total / this.args.maxPeerTotal) * 100;
  }

  @action focusData(year) {
    this.args.focusData({year, commodity: this.args.data});
  }
}
