// var Router = ReactRouter;
// var Route = Router.Route, DefaultRoute = Router.DefaultRoute,
//   Link=Router.Link, RouteHandler = Router.RouteHandler, browserHistory = Router.browserHistory;

var ReactRouter = window.ReactRouter;
var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var Link = ReactRouter.Link;
var hashHistory = ReactRouter.hashHistory;

var RecipeLayout = require('./Recipe/RecipeLayout');


// var CommentForm = React.createClass({
//   getInitialState: function () {
//     return {author: '', text: ''};
//   },
//   handleAuthorChange: function (e) {
//     this.setState({author: e.target.value});
//   },
//   handleTextChange: function (e) {
//     this.setState({text: e.target.value});
//   },
//   handleSubmit: function (e) {
//     e.preventDefault();
//     var author = this.state.author.trim();
//     var text = this.state.text.trim();
//     if (!text || !author) {
//       return;
//     }
//     this.props.onCommentSubmit({name: author, unitType: text});
//     this.setState({author: '', text: ''});
//   },
//   render: function () {
//     return (
//       <form className="commentForm" onSubmit={this.handleSubmit}>
//         <input
//           type="text"
//           placeholder="Your name"
//           value={this.state.author}
//           onChange={this.handleAuthorChange}
//         />
//         <input
//           type="text"
//           placeholder="Say something..."
//           value={this.state.text}
//           onChange={this.handleTextChange}
//         />
//         <input type="submit" value="Post" />
//       </form>
//     );
//   }
// });



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
          <li>Shopping List</li>
          <li>History</li>
        </ul>
        <div id="content">
          {this.props.children}
        </div>
      </div>
    );
  }
});


ReactDOM.render(
  // <App url="/api/Recipe" />,
  <Router history={hashHistory}>
    <Route component={AppLayout}>
      <Route path="/" component={RecipeLayout} />
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

/* ===== NETWORK HELPERS ===== */

function deleteOne (modelName, id, callback) {}

function getOne (modelName, id, callback) {}

function patchOne (modelName, id, delta, callback) {}

function postOne (modelName, object, callback) {}

function putOne (modelName, object, callback) {}



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