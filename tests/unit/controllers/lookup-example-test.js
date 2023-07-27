import { module, test } from 'qunit';
import { setupTest } from 'viz-perf-compare/tests/helpers';

module('Unit | Controller | lookup-example', function (hooks) {
  setupTest(hooks);

  // TODO: Replace this with your real tests.
  test('it exists', function (assert) {
    let controller = this.owner.lookup('controller:lookup-example');
    assert.ok(controller);
  });
});
