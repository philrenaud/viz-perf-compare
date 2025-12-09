// @ts-check

import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class BarChartHtmlComponent extends Component {
  @service preferences;

  get maxPeerTotal() {
    let peerTotals = this.args.data.commodities
      .filter((c) => this.preferences.commodities.includes(c.name)) // only include commodities that are selected
      .map((c) =>
        c.years
          .filter((y) => this.preferences.years.includes(y.name))
          .reduce((acc, year) => acc + year.value, 0)
      );
    let maxPeerTotal = Math.max(...peerTotals);
    return maxPeerTotal;
  }

  getCommodityTotal(commodity) {
    if (!commodity?.years) return 0;
    return commodity.years
      .filter((y) => this.preferences.years.includes(y.name))
      .reduce((acc, y) => acc + y.value, 0);
  }

  getCommodityGrowth(commodity) {
    if (!commodity?.years) return null;
    const sortedYears = [...this.preferences.years].sort((a, b) => a - b);
    const firstYear = sortedYears[0];
    const lastYear = sortedYears[sortedYears.length - 1];

    const firstYearData = commodity.years.find((y) => +y.name === firstYear);
    const lastYearData = commodity.years.find((y) => +y.name === lastYear);

    // If either endpoint is missing, return null to indicate incomplete data
    if (!firstYearData || !lastYearData) return null;

    const firstValue = firstYearData.value;
    const lastValue = lastYearData.value;

    if (firstValue === 0) return lastValue > 0 ? Infinity : 0;
    return ((lastValue - firstValue) / firstValue) * 100;
  }

  get sortedCommodities() {
    const commoditiesWithData = this.preferences.commodities.map((name) => {
      const commodity = this.args.data?.commodities?.find(
        (c) => c.name === name
      );
      return {
        name,
        total: this.getCommodityTotal(commodity),
        growth: this.getCommodityGrowth(commodity),
      };
    });

    const sorted = [...commoditiesWithData].sort((a, b) => {
      switch (this.preferences.sort) {
        case 'alpha-desc':
          return b.name.localeCompare(a.name);
        case 'total-desc':
          return b.total - a.total;
        case 'total-asc':
          return a.total - b.total;
        case 'growth-desc':
          // Push null (incomplete data) to the bottom
          if (a.growth === null && b.growth === null) return 0;
          if (a.growth === null) return 1;
          if (b.growth === null) return -1;
          return b.growth - a.growth;
        case 'growth-asc':
          // Push null (incomplete data) to the bottom
          if (a.growth === null && b.growth === null) return 0;
          if (a.growth === null) return 1;
          if (b.growth === null) return -1;
          return a.growth - b.growth;
        case 'alpha-asc':
        default:
          return a.name.localeCompare(b.name);
      }
    });

    return sorted.map((c) => c.name);
  }

  @action focusData({ year, commodity }) {
    this.args.focusData({ year, commodity, country: this.args.data });
  }
}
