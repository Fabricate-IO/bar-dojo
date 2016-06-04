var ReactRouter = window.ReactRouter;
var Route = ReactRouter.Route;
var Link = ReactRouter.Link;

/*
Recipe.schema = {
  name: Joi.string().required(),
  tags: Joi.array().items(Joi.string()), // tag name
  instructions: Joi.array().items(Joi.string()), // optional
  ingredients: Joi.array().items(Joi.object().keys({
    stockTypeId: Joi.string(),
    quantity: Joi.number(),
  })),

  created: Joi.date().timestamp(),
  archived: Joi.boolean().default(false),
};
*/







module.exports = React.createClass({
  render: function () {
// TODO have Drinks menu have submenu for drink types
// TODO set up a router between category display and different drink menus (perhaps setting the selected category as a query val?)
// also a route for the add form
    // return (
    //   <Route component={RecipeLayout}>
    //     <Route path="/" component={RecipeList} />
    //     <Route path="/add" component={RecipeAdd} />
    //   </Route>
    // );
    return (
      <div>
        <h1>Recipes</h1>
        <Link to="/">List</Link>
        <Link to="/add">Add</Link>
        {this.props.children}
      </div>
    );
  }
});

// <CommentForm onPost={this.handlePost} />

// <div>
//         <h1>Recipes</h1>
//         <RecipeList data={this.state.data} />
//       </div>