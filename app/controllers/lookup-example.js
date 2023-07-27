// @ts-check

import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';

export default class LookupExampleController extends Controller {
  @tracked multiplier = 5;

  @tracked numberOfDataPoints = 20;

  get data() {
    return new Array(+this.numberOfDataPoints).fill(0).map(() => Math.random() * this.multiplier);
  }
}
