import { module, test } from 'qunit';
import { setupTest } from 'viz-perf-compare/tests/helpers';

module('Unit | Controller | exports-by-country', function (hooks) {
  setupTest(hooks);

  // TODO: Replace this with your real tests.
  test('it exists', function (assert) {
    let controller = this.owner.lookup('controller:exports-by-country');
    assert.ok(controller);
  });
});
