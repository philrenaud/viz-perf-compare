import Component from '@glimmer/component';
import { inject as service } from '@ember/service';

export default class BarSegmentSvgComponent extends Component {
  @service preferences;
  compareData(data) {
    if (data) {
      this.preferences.set('comparedData', {
        name: data.name,
        relativeOffset: data.relativeOffset,
        offset: data.offset,
        parentName: this.args.parentName,
      });
    } else {
      this.preferences.set('comparedData', null);
    }
  }

  get opacity() {
    return this.preferences.get('comparedData')
      ? this.preferences.get('comparedData').name === this.args.data.name
        ? 1
        : 0.05
      : 1;
  }
}
