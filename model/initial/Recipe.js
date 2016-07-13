module.exports = [
/*
  {
    name: '',
    instructions: '',
    ingredients: [
      {
        stockTypeId: '',
        quantity: ,
      },
    ],
  },
*/
// Cocktail DB cocktails: http://www.thecocktaildb.com/api/json/v1/1/filter.php?c=Cocktail
    // http://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=15561
// NOTE: 1 lime juiced = 1 oz juice
// TODO
// Cosmopolitan
// Liquid Cocaine http://www.webtender.com/db/drink/1351?x74
// Manhattan
// Margarita
// Martini
// Old Fashion
// Orgasm
// Pina Colada
// Side Car
// Tequilla Sunrise


  {
    name: 'Amaretto Sour',
    instructions: 'Rub the rim of an old fashioned glass with lemon, and dip repeatedly into granulated sugar until it has a good "frosted" rim. Shake a jigger of Amaretto with the juice of 1/2 a lemon. Strain into glass and add ice. Garnish with a Marachino Cherry.',
    ingredients: [
      {
        stockTypeId: 'amaretto liqueur',
        quantity: 44,
      },
      // 1/2 lemon, juiced
      // ice
    ],
  },
  {
    name: 'Appletini',
    instructions: 'Fill a martini glass with ice and top with water. This will get the glass chilled before pouring your tini. Add ice to your shaker. The more you add, the better chilled the tini will be. Add the vodka, schnapps and sweet-and-sour. Cover and shake vigorously for about ten seconds. Dump the ice and water from the martini glass. Strain the contents of the shaker into the glass. Garnish with a cherry, or sliver of granny apple, or lemon twist.',
    ingredients: [
      {
        stockTypeId: 'vodka',
        quantity: 44,
      },
      {
        stockTypeId: 'sour apple schnapps',
        quantity: 44,
      },
      // optional: 0.5 oz sweet and sour mix
      // ice
    ],
  },
  {
    name: 'B-2',
    ingredients: [
      {
        stockTypeId: 'coffee liqueur',
        quantity: 59,
      },
      {
        stockTypeId: 'cream liqueur',
        quantity: 59,
      },
      {
        stockTypeId: 'orange liqueur',
        quantity: 59,
      },
      {
        stockTypeId: 'dark rum',
        quantity: 29.5,
      },
    ],
  },
  {
    name: 'B-52',
    instructions: 'Layer coffe, cream then orange using the back of a spoon.',
    ingredients: [
      {
        stockTypeId: 'coffee liqueur',
        quantity: 15,
      },
      {
        stockTypeId: 'cream liqueur',
        quantity: 15,
      },
      {
        stockTypeId: 'orange liqueur',
        quantity: 15,
      },
    ],
  },
  // http://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=13815
  {
    name: 'Bloody Mary',
    ingredients: [
      {
        stockTypeId: 'vodka',
        quantity: 44,
      },
      {
        stockTypeId: 'tomato juice',
        quantity: 44,
      },
      // pinch of salt
      // pinch of pepper
      // ice
    ],
  },
  {
    name: 'Cherry Bomb',
    instructions: 'Serve as a shot or on the rocks',
    ingredients: [
      {
        stockTypeId: 'vodka',
        quantity: 29.5,
      },
      {
        stockTypeId: 'chocolate liqueur',
        quantity: 44,
      },
      {
        stockTypeId: 'grenadine',
        quantity: 22,
      },
    ],
  },
  {
    name: 'Cherry Electric Lemonade',
    instructions: 'Stir vigorously and pour over a cup of ice.',
    ingredients: [
      {
        stockTypeId: 'gin',
        quantity: 29.5,
      },
      {
        stockTypeId: 'tequila',
        quantity: 29.5,
      },
      {
        stockTypeId: 'vodka',
        quantity: 29.5,
      },
      {
        stockTypeId: 'white rum',
        quantity: 29.5,
      },
      {
        stockTypeId: 'orange liqueur',
        quantity: 29.5,
      },
      {
        stockTypeId: 'grenadine',
        quantity: 29.5,
      },
      {
        stockTypeId: 'sweet and sour mix',
        quantity: 29.5,
      },
      {
        stockTypeId: 'club soda',
        quantity: 89,
      },
    ],
  },
  {
    name: 'Dark and Stormy',
    ingredients: [
      {
        stockTypeId: 'dark rum',
        quantity: 59,
      },
      {
        stockTypeId: 'ginger beer',
        quantity: 100,
      },
    ],
  },
  // http://allrecipes.com/recipe/49355/gin-and-tonic/
  {
    name: 'Gin and Tonic',
    ingredients: [
      {
        stockTypeId: 'gin',
        quantity: 118,
      },
      {
        stockTypeId: 'tonic water',
        quantity: 118,
      },
      {
        stockTypeId: 'lime juice',
        quantity: 15,
      },
      // ice
    ],
  },
  // http://allrecipes.com/recipe/228491/the-real-long-island-iced-tea/
  {
    name: 'Long Island Ice Tea',
    instructions: 'Add ingredients. Shake vigorously. Enjoy',
    ingredients: [
      {
        stockTypeId: 'gin',
        quantity: 29.5,
      },
      {
        stockTypeId: 'tequila',
        quantity: 29.5,
      },
      {
        stockTypeId: 'vodka',
        quantity: 29.5,
      },
      {
        stockTypeId: 'white rum',
        quantity: 29.5,
      },
      {
        stockTypeId: 'orange liqueur',
        quantity: 15,
      },
      {
        stockTypeId: 'cola',
        quantity: 118,
      },
      {
        stockTypeId: 'sweet and sour mix',
        quantity: 118,
      },
      // ice
    ],
  },
  {
    name: 'Mai Tai',
    ingredients: [
      {
        stockTypeId: 'dark rum',
        quantity: 44,
      },
      {
        stockTypeId: 'coconut rum',
        quantity: 29.5,
      },
      {
        stockTypeId: 'pineapple juice',
        quantity: 89,
      },
      {
        stockTypeId: 'orange juice',
        quantity: 59,
      },
      {
        stockTypeId: 'grenadine',
        quantity: 3,
      },
      // ice
    ],
  },
  {
    name: 'Mimosa',
    ingredients: [
      {
        stockTypeId: 'orange juice',
        quantity: 59,
      },
      {
        stockTypeId: 'sparkling wine',
        quantity: 177.5,
      },
    ],
  },
  {
    // http://www.webtender.com/db/drink/1435?x1
    name: 'Mojito',
    instructions: 'Lightly muddle the mint and sugar with a splash of soda water in a mixing glass until the sugar dissolve and you smell the mint. Squeeze the lime into the glass, add rum and shake with ice. Strain over cracked ice in a highball glass. Top with soda water, garnish with mint sprig and serve.',
    ingredients: [
      {
        stockTypeId: 'white rum',
        quantity: 59,
      },
      {
        stockTypeId: 'lime juice',
        quantity: 29.5,
      },
      {
        stockTypeId: 'club soda',
        quantity: 59,
      },
      // ice
    ],
  },
  {
    name: 'Moscow Mule',
    ingredients: [
      {
        stockTypeId: 'vodka',
        quantity: 44,
      },
      {
        stockTypeId: 'ginger beer',
        quantity: 118,
      },
      {
        stockTypeId: 'lime juice',
        quantity: 15,
      },
      // Ice
    ],
  },
  {
    name: 'Mudslide',
    instructions: 'Add ingredients to blender. Blend until smooth. Enjoy',
    ingredients: [
      {
        stockTypeId: 'ice cube',
        quantity: 118,
      },
      {
        stockTypeId: 'cream liqueur',
        quantity: 29.5,
      },
      {
        stockTypeId: 'coffee liqueur',
        quantity: 29.5,
      },
      {
        stockTypeId: 'milk',
        quantity: 29.5,
      },
      {
        stockTypeId: 'vodka',
        quantity: 29.5,
      },
    ],
  },
  // http://www.esquire.com/food-drink/drinks/recipes/a3683/negroni-drink-recipe/
  {
    name: 'Negroni',
    ingredients: [
      {
        stockTypeId: 'gin',
        quantity: 44,
      },
      {
        stockTypeId: 'campari',
        quantity: 22,
      },
      {
        stockTypeId: 'vermout',
        quantity: 22,
      },
      // ice
    ],
  },
  {
    name: 'Rum and Coke',
    ingredients: [
      {
        stockTypeId: 'dark rum',
        quantity: 44,
      },
      {
        stockTypeId: 'cola',
        quantity: 148,
      },
    ],
  },
  // http://www.chowhound.com/recipes/sazerac-cocktail-10330
  {
    name: 'Sazerac',
    // instructions: '', // LOTS of instructions
    ingredients: [
      {
        stockTypeId: 'whiskey', // rye whiskey
        quantity: 44,
      },
      {
        stockTypeId: 'absinthe',
        quantity: 5, // 1 barspoon
      },
      {
        stockTypeId: "peychaud's bitters",
        quantity: 2, // 2 dashes
      },
      {
        stockTypeId: 'angostura bitters',
        quantity: 1, // 1 dash
      },
      // 1 sugar - cube
      // ice
      // lemon peel
    ],
  },
  {
    // http://allrecipes.com/recipe/222410/screwdriver-cocktail/
    name: 'Screwdriver',
    ingredients: [
      {
        stockTypeId: 'vodka',
        quantity: 44,
      },
      {
        stockTypeId: 'orange juice',
        quantity: 177,
      },
    ],
  },
  {
    name: 'Sex on the Beach',
    ingredients: [
      {
        stockTypeId: 'vodka',
        quantity: 44,
      },
      {
        stockTypeId: 'peach schnapps',
        quantity: 22,
      },
      {
        stockTypeId: 'cranberry juice',
        quantity: 44,
      },
      {
        stockTypeId: 'orange juice',
        quantity: 44,
      },
    ],
  },
  {
    name: 'White Russian',
    ingredients: [
      {
        stockTypeId: 'vodka',
        quantity: 44,
      },
      {
        stockTypeId: 'coffee liqueur',
        quantity: 15,
      },
      {
        stockTypeId: 'milk',
        quantity: 15,
      },
    ],
  },
];