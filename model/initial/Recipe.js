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
// Bloody Mary
// Cosmopolitan
// Gin and Tonic
// Liquid Cocaine http://www.webtender.com/db/drink/1351?x74
// Manhattan
// Margarita
// Martini
// Mimosa
// Negroni
// Old Fashion
// Orgasm
// Pina Colada
// Sazerac
// Tequilla Sunrise


  {
    name: 'Amaretto Sour',
    instructions: 'Rub the rim of an old fashioned glass with lemon, and dip repeatedly into granulated sugar until it has a good "frosted" rim. Shake a jigger of Amaretto with the juice of 1/2 a lemon. Strain into glass and add ice. Garnish with a Marachino Cherry.',
    ingredients: [
      {
        stockTypeId: 'amaretto liqueur',
        quantity: 1.5,
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
        quantity: 1.5,
      },
      {
        stockTypeId: 'sour apple schnapps',
        quantity: 1.5,
      },
      // optional: 0.5 oz sweet and sour mix
      // ice
    ],
  },
  {
    name: 'B-52',
    instructions: 'Layer coffe, cream then orange using the back of a spoon.',
    ingredients: [
      {
        stockTypeId: 'coffee liqueur',
        quantity: 0.5,
      },
      {
        stockTypeId: 'irish cream liqueur',
        quantity: 0.5,
      },
      {
        stockTypeId: 'orange liqueur',
        quantity: 0.5,
      },
    ],
  },
  {
    name: 'Cherry Bomb',
    instructions: 'Serve as a shot or on the rocks',
    ingredients: [
      {
        stockTypeId: 'vodka',
        quantity: 1,
      },
      {
        stockTypeId: 'chocolate liqueur',
        quantity: 1.5,
      },
      {
        stockTypeId: 'grenadine',
        quantity: .75,
      },
    ],
  },
  {
    name: 'Cherry Electric Lemonade',
    instructions: 'Stir vigorously and pour over a cup of ice.',
    ingredients: [
      {
        stockTypeId: 'gin',
        quantity: 1,
      },
      {
        stockTypeId: 'tequila',
        quantity: 1,
      },
      {
        stockTypeId: 'vodka',
        quantity: 1,
      },
      {
        stockTypeId: 'white rum',
        quantity: 1,
      },
      {
        stockTypeId: 'orange liqueur',
        quantity: 1,
      },
      {
        stockTypeId: 'grenadine',
        quantity: 1,
      },
      {
        stockTypeId: 'sweet and sour mix',
        quantity: 1,
      },
      {
        stockTypeId: 'club soda',
        quantity: 3,
      },
    ],
  },
  {
    name: 'Dark and Stormy',
    ingredients: [
      {
        stockTypeId: 'dark rum',
        quantity: 2,
      },
      {
        stockTypeId: 'ginger beer',
        quantity: 0.2,
      },
    ],
  },
  {
    name: 'Long Island Ice Tea',
    instructions: 'Add ingredients. Shake vigorously. Enjoy',
    ingredients: [
      {
        stockTypeId: 'ice cube',
        quantity: 4,
      },
      {
        stockTypeId: 'gin',
        quantity: 1,
      },
      {
        stockTypeId: 'tequila',
        quantity: 1,
      },
      {
        stockTypeId: 'vodka',
        quantity: 1,
      },
      {
        stockTypeId: 'white rum',
        quantity: 1,
      },
      {
        stockTypeId: 'organe liqueur',
        quantity: 0.5,
      },
      {
        stockTypeId: 'cola',
        quantity: 4,
      },
      // sweet and sour mix
    ],
  },
  {
    name: 'Mai Tai',
    ingredients: [
      {
        stockTypeId: 'dark rum',
        quantity: 1.5,
      },
      {
        stockTypeId: 'coconut rum',
        quantity: 1,
      },
      {
        stockTypeId: 'pineapple juice',
        quantity: 3,
      },
      {
        stockTypeId: 'orange juice',
        quantity: 2,
      },
      {
        stockTypeId: 'grenadine',
        quantity: 0.1,
      },
      // ice
    ],
  },
  {
    // http://www.webtender.com/db/drink/1435?x1
    name: 'Mojito',
    instructions: 'Lightly muddle the mint and sugar with a splash of soda water in a mixing glass until the sugar dissolve and you smell the mint. Squeeze the lime into the glass, add rum and shake with ice. Strain over cracked ice in a highball glass. Top with soda water, garnish with mint sprig and serve.',
    ingredients: [
      {
        stockTypeId: 'white rum',
        quantity: 2,
      },
      {
        stockTypeId: 'lime juice',
        quantity: 1,
      },
      {
        stockTypeId: 'club soda',
        quantity: 2,
      },
      // ice
    ],
  },
  {
    name: 'Moscow Mule',
    ingredients: [
      {
        stockTypeId: 'vodka',
        quantity: 1.5,
      },
      {
        stockTypeId: 'ginger beer',
        quantity: 4,
      },
      {
        stockTypeId: 'lime juice',
        quantity: 0.5,
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
        quantity: 4,
      },
      {
        stockTypeId: 'irish cream liqueur',
        quantity: 1,
      },
      {
        stockTypeId: 'coffee liquor',
        quantity: 1,
      },
      {
        stockTypeId: 'milk',
        quantity: 1,
      },
      {
        stockTypeId: 'vodka',
        quantity: 1,
      },
    ],
  },
  {
    name: 'Rum and Coke',
    ingredients: [
      {
        stockTypeId: 'dark rum',
        quantity: 1.5,
      },
      {
        stockTypeId: 'cola',
        quantity: 5,
      },
    ],
  },
  {
    // http://allrecipes.com/recipe/222410/screwdriver-cocktail/
    name: 'Screwdriver',
    ingredients: [
      {
        stockTypeId: 'vodka',
        quantity: 1.5,
      },
      {
        stockTypeId: 'orange juice',
        quantity: 6,
      },
    ],
  },
  {
    name: 'Sex on the Beach',
    ingredients: [
      {
        stockTypeId: 'vodka',
        quantity: 1.5,
      },
      {
        stockTypeId: 'peach schnapps',
        quantity: 0.75,
      },
      {
        stockTypeId: 'cranberry juice',
        quantity: 1.5,
      },
      {
        stockTypeId: 'orange juice',
        quantity: 1.5,
      },
    ],
  },
  {
    name: 'White Russian',
    ingredients: [
      {
        stockTypeId: 'vodka',
        quantity: 1.5,
      },
      {
        stockTypeId: 'coffee liqueur',
        quantity: 0.5,
      },
      {
        stockTypeId: 'milk',
        quantity: 0.5,
      },
    ],
  },
];