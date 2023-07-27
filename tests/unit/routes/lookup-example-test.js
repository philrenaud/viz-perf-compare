import { module, test } from 'qunit';
import { setupTest } from 'viz-perf-compare/tests/helpers';

module('Unit | Route | lookup-example', function (hooks) {
  setupTest(hooks);

  test('it exists', function (assert) {
    let route = this.owner.lookup('route:lookup-example');
    assert.ok(route);
  });
});
