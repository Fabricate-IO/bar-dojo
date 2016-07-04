module.exports = {
  formatPrice: (price, options) => {

    options = options || {};
    options.currency = options.currency || '$';

    return (options.unitless ? '' : options.currency) + price.toFixed(2);
  },
  // http://stackoverflow.com/a/4328722
  // searches for query in one or more supplied strings
  // strips punctuation and ignores capitalization
  search: (query, strings) => {

    if (query == null || query === '') {
      return true;
    }

    const simplifiedQuery = query.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"").replace(/\s{2,}/g," ").toLowerCase();
    const simplifiedStrings = [].concat(strings).map((string) => {
      return string.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"").replace(/\s{2,}/g," ").toLowerCase();
    });

    return simplifiedStrings.some((string) => {
      return (string.indexOf(simplifiedQuery) !== -1);
    });
  },
};