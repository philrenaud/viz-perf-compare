import { helper } from '@ember/component/helper';

export default helper(function dollarify([num] /*, named*/) {
  return num.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD'
  });
});
