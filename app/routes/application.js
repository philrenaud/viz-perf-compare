import Route from '@ember/routing/route';

export default class ApplicationRoute extends Route {
  beforeModel(transition) {
    if (transition.to.name !== 'lookup-example') {
      this.transitionTo('exports-by-country');
    }
  }
}
