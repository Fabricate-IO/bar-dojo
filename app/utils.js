module.exports = {
  // if passed a stockId, looks up in ingredient.stock - otherwise, pulls abv info directly from each ingredient
  calculateAbv: function (ingredients, options) {

    let abv = 0;
    let volume = 0;

    ingredients = ingredients.map((ingredient, ingredientIndex) => {

      let stock = ingredient;
      if (ingredient.stockId != null) {
        stock = (ingredient.stock || []).find((stock) => { return stock.id === ingredient.stockId; });
      }

      if (stock != null) {
        abv += Number(ingredient.quantity) * stock.abv;
        volume += Number(ingredient.quantity);
      }
    });

    abv /= volume;

    return module.exports.formatAbv(abv, options);
  },
  // if passed a stockId, looks up in ingredient.stock - otherwise, pulls price info directly from each ingredient
  calculatePrice: function (ingredients, options) {

    let price = 0;

    ingredients = ingredients.map((ingredient, ingredientIndex) => {

      let stock = ingredient;
      if (ingredient.stockId != null) {
        stock = (ingredient.stock || []).find((stock) => { return stock.id === ingredient.stockId; });
      }

      if (stock != null) {
        price += Number(ingredient.quantity) * stock.volumeCost;
      }
    });

    return module.exports.formatPrice(price, options);
  },
  // could eventually also adjust to display in proof (bar setting)
  formatAbv: (abv, options) => {

    options = options || {};
    options.unit = options.unit || '%';
    options.decimals = options.decimals || (abv >= 10 ? 0 : 1);

    return Number(abv).toFixed(options.decimals) + (options.unitless ? '' : options.unit);
  },
  formatPrice: (price, options) => {

    options = options || {};
    options.currency = options.currency || '$';

    price = Number(Number(price).toFixed(1)).toFixed(2); // example rounding, rounds to the nearest 10c

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