// @ts-check
import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

const YEAR_COLORS = {
  2015: '#1f77b4',
  2016: '#ff7f0e',
  2017: '#2ca02c',
  2018: '#d62728',
  2019: '#9467bd',
  2020: '#8c564b',
  2021: '#e377c2',
  2022: '#7f7f7f',
  2023: '#bcbd22',
  2024: '#17becf',
};

export default class StackedBarCanvasComponent extends Component {
  @service preferences;

  canvas = null;
  ctx = null;

  get relativeBars() {
    if (!this.args.data) return [];
    let data = this.preferences.years.map((c) => {
      let year = this.args.data?.years.find((d) => d.name === c);
      return year;
    });
    let total = this.total;
    if (!total) return [];
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

  get left() {
    if (this.preferences.comparedData) {
      let thisBarOffset = this.relativeBars.find(
        (d) => d?.name === this.preferences.comparedData.name
      )?.relativeOffset;
      if (thisBarOffset === undefined) return 0;

      if (this.preferences.normalize === 'country') {
        // Calculate absolute positions (as % of container)
        let clickedAbsolutePos =
          (this.preferences.comparedData.relativeOffset *
            this.preferences.comparedData.barWidth) /
          100;
        let thisAbsolutePos = (thisBarOffset * this.width) / 100;
        let desiredMove = clickedAbsolutePos - thisAbsolutePos;
        // translateX uses % of element width, so convert container % to element %
        return (desiredMove / this.width) * 100;
      } else {
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
        return 'opacity: 0.05; color: white;';
      }
    } else if (this.preferences.focusing.commodity) {
      if (this.args.data.name === this.preferences.focusing.commodity.name) {
        return 'color: black; background-color: white;';
      }
      return 'opacity: 1; color: white;';
    } else {
      return 'opacity: 1; color: white;';
    }
  }

  @action
  setupCanvas(element) {
    this.canvas = element;
    this.ctx = element.getContext('2d');
    this.drawBars();
  }

  @action
  updateCanvas() {
    if (this.ctx) {
      this.drawBars();
    }
  }

  drawBars() {
    const canvas = this.canvas;
    const ctx = this.ctx;
    if (!canvas || !ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    const comparedData = this.preferences.comparedData;

    for (const bar of this.relativeBars) {
      if (!bar) continue;

      const x = (bar.relativeOffset / 100) * width;
      const barWidth = (bar.relativeValue / 100) * width;
      const color = YEAR_COLORS[bar.name] || '#999';

      let opacity = 1;
      if (comparedData) {
        opacity = comparedData.name === bar.name ? 1 : 0.05;
      }

      ctx.globalAlpha = opacity;
      ctx.fillStyle = color;
      ctx.fillRect(x, 0, barWidth, height);
    }

    ctx.globalAlpha = 1;
  }

  @action
  handleMouseMove(event) {
    if (!this.canvas) return;

    const rect = this.canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const relativeX = (x / rect.width) * 100;

    for (const bar of this.relativeBars) {
      if (!bar) continue;
      if (
        relativeX >= bar.relativeOffset &&
        relativeX < bar.relativeOffset + bar.relativeValue
      ) {
        this.args.focusData({ year: bar, commodity: this.args.data });
        break;
      }
    }
  }

  @action
  handleMouseDown(event) {
    if (!this.canvas) return;

    const rect = this.canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const relativeX = (x / rect.width) * 100;

    for (const bar of this.relativeBars) {
      if (!bar) continue;
      if (
        relativeX >= bar.relativeOffset &&
        relativeX < bar.relativeOffset + bar.relativeValue
      ) {
        this.preferences.set('comparedData', {
          name: bar.name,
          relativeOffset: bar.relativeOffset,
          offset: bar.offset,
          parentName: this.args.data.name,
          barWidth: this.width,
        });
        this.drawBars();
        break;
      }
    }
  }

  @action
  handleMouseUp() {
    this.preferences.set('comparedData', null);
    this.drawBars();
  }
}
