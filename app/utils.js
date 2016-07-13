module.exports = {
  // could eventually also adjust to display in proof (bar setting)
  formatAbv: (abv, options) => {

    options = options || {};
    options.unit = options.unit || '%';
    options.decimals = options.decimals || (abv >= 10 ? 0 : 1);

    return abv.toFixed(options.decimals) + (options.unitless ? '' : options.unit);
  },
  formatPrice: (price, options) => {

    options = options || {};
    options.currency = options.currency || '$';

    price = Number(price.toFixed(1)).toFixed(2); // example rounding, rounds to the nearest 10c

    return (options.unitless ? '' : options.currency) + price;
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