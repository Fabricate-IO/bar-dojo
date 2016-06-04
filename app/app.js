// var Router = ReactRouter;
// var Route = Router.Route, DefaultRoute = Router.DefaultRoute,
//   Link=Router.Link, RouteHandler = Router.RouteHandler, browserHistory = Router.browserHistory;

var ReactRouter = window.ReactRouter;
var Router = ReactRouter.Router;
var IndexRoute = ReactRouter.IndexRoute;
var Route = ReactRouter.Route;
var Link = ReactRouter.Link;
var hashHistory = ReactRouter.hashHistory;

var RecipeLayout = require('./Recipe/RecipeLayout');
var RecipeList = require('./Recipe/RecipeList');
var RecipeAdd = require('./Recipe/RecipeAdd');


var PatronLayout = React.createClass({
  render: function () {
    return (
      <div>TODO</div>
    );
  }
});


var AppLayout = React.createClass({
  render: function () {
    return (
      <div id="page">
        <ul className="navbar">
          <li><Link to="/">Drinks</Link></li>
          <li><Link to="/patrons">Patrons</Link></li>
          <li><Link to="/inventory">Inventory</Link></li>
          <li><Link to="/shopping">Shopping List</Link></li>
          <li><Link to="/history">History</Link></li>
        </ul>
        <div id="content">
          {this.props.children}
        </div>
      </div>
    );
  }
});


ReactDOM.render(
  <Router history={hashHistory}>
    <Route component={AppLayout}>
      <Route path="/" component={RecipeLayout}>
        <IndexRoute component={RecipeList} />
        <Route path="add" component={RecipeAdd} />
      </Route>
      <Route path="/patrons" component={PatronLayout} />
    </Route>
  </Router>,
  document.getElementById('app')
);

/*
      <Route component={SearchLayout}>
        <Route path="users" component={UserList} />
        <Route path="widgets" component={WidgetList} />
      </Route>
*/