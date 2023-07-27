// @ts-check
import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class StackedBarHtmlComponent extends Component {
  @service preferences;
  get relativeBars() {
    if (!this.args.data) return [];
    // Return each bar's value as a percentage of the total,
    // plus an offset to account for the previous bars.
    let data = this.preferences.years.map((c) => {
      let year = this.args.data?.years.find((d) => d.name === c);
      return year;
    });
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

  // If data is being compared, move the bar the % to make the segments at that year line up
  get left() {
    if (this.preferences.comparedData) {
      if (this.preferences.normalize === "country") {
        let thisBarOffset = this.relativeBars.find((d) => d.name === this.preferences.comparedData.name).relativeOffset;
        return -thisBarOffset * this.width / 100;
      } else {
        let thisBarOffset = this.relativeBars.find((d) => d.name === this.preferences.comparedData.name).relativeOffset;
        return this.preferences.comparedData.relativeOffset - thisBarOffset;
      }
    } else {
      return 0;
    }
  }

  get titleStyle() {
    if (this.preferences.comparedData) {
      if (this.args.data.name === this.preferences.comparedData.parentName) {
        return `opacity: 1; color: white; left: ${-this.left}%;`;
      } else {
        return "opacity: 0.05; color: white;";
      }
    } else if (this.preferences.focusing.commodity) {
      if (this.args.data.name === this.preferences.focusing.commodity.name) {
        return "color: black; background-color: white;";
      }
    } else {
      return "opacity: 1; color: white;";
    }
  }
}
