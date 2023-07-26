import { module, test } from 'qunit';
import { setupRenderingTest } from 'viz-perf-compare/tests/helpers';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | bar-chart-html', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(hbs`<BarChartHtml />`);

    assert.dom(this.element).hasText('');

    // Template block usage:
    await render(hbs`
      <BarChartHtml>
        template block text
      </BarChartHtml>
    `);

    assert.dom(this.element).hasText('template block text');
  });
});
