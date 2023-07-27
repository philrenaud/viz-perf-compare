// @ts-check

import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';

export default class LookupExampleController extends Controller {
  @tracked multiplier = 5;

  get data() {
    return new Array(20).fill(0).map(() => Math.random() * this.multiplier);
  }
}
