import { module, test } from 'qunit';
import { setupTest } from 'viz-perf-compare/tests/helpers';

module('Unit | Route | exports-by-country', function (hooks) {
  setupTest(hooks);

  test('it exists', function (assert) {
    let route = this.owner.lookup('route:exports-by-country');
    assert.ok(route);
  });
});
