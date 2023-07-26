import { module, test } from 'qunit';
import { setupRenderingTest } from 'viz-perf-compare/tests/helpers';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | bar-segment-html', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(hbs`<BarSegmentHtml />`);

    assert.dom(this.element).hasText('');

    // Template block usage:
    await render(hbs`
      <BarSegmentHtml>
        template block text
      </BarSegmentHtml>
    `);

    assert.dom(this.element).hasText('template block text');
  });
});
