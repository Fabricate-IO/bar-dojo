(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"C:\\Users\\Todd\\bar-dojo\\app\\Recipe\\RecipeAdd.js":[function(require,module,exports){
module.exports = React.createClass({displayName: "exports",
  // handlePost: function (comment) {
  //   var data = this.state.data;
  //   var newData = state.concat([comment]);
  //   this.setState({data: newData});
  //   $.ajax({
  //     url: this.props.url,
  //     dataType: 'json',
  //     type: 'POST',
  //     data: comment,
  //     success: function (data) {
  //       // already updated state, we're good to go
  //     }.bind(this),
  //     error: function (xhr, status, err) {
  //       this.setState({data: data});
  //       console.error(this.props.url, status, err.toString());
  //     }.bind(this)
  //   });
  // },
  render: function () {
    return (
      React.createElement("div", null, 
        "TODO"
      )
    );
  },
});



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
//     this.props.onPost({name: author, unitType: text});
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
},{}],"C:\\Users\\Todd\\bar-dojo\\app\\Recipe\\RecipeLayout.js":[function(require,module,exports){
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







module.exports = React.createClass({displayName: "exports",
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
      React.createElement("div", null, 
        React.createElement("h1", null, "Recipes"), 
        React.createElement(Link, {to: "/"}, "List"), 
        React.createElement(Link, {to: "add"}, "Add"), 
        this.props.children
      )
    );
  }
});

// <CommentForm onPost={this.handlePost} />

// <div>
//         <h1>Recipes</h1>
//         <RecipeList data={this.state.data} />
//       </div>

},{}],"C:\\Users\\Todd\\bar-dojo\\app\\Recipe\\RecipeList.js":[function(require,module,exports){
var Recipe = React.createClass({displayName: "Recipe",
  handleDelete: function () {
    this.props.onDelete(this.props.recipe.id);
  },
  render: function () {
    return (
      React.createElement("li", {className: "recipe"}, 
        React.createElement("h2", null, 
          this.props.recipe.name
        ), 
        React.createElement("button", {className: "delete", onClick: this.handleDelete}, "X"), 
        this.props.children
      )
    );
  },
});

module.exports = React.createClass({displayName: "exports",
  getInitialState: function () {
    return {
      data: [],
    };
  },
  componentDidMount: function () {
    $.ajax({
      url: '/api/Recipe',
      success: function (data) {
        this.setState({data: data});
      }.bind(this),
      error: function (xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this),
    });
  },
  onDelete: function (id) {
    var data = this.state.data;
    var newData = data.filter((recipe) => { return recipe.id !== id; });
    this.setState({ data: newData });
    $.ajax({
      url: '/api/Recipe/' + id,
      type: 'DELETE',
      error: function (xhr, status, err) {
        console.error(this.props.url, status, err.toString());
        this.setState({data: data});
      }.bind(this),
    });
  },
  render: function () {
    var recipes = this.state.data.map((recipe) => {
      return React.createElement(Recipe, {key: recipe.id, recipe: recipe, onDelete: this.onDelete});
    });
    return (
      React.createElement("ul", null, 
        recipes
      )
    );
  },
});

},{}],"C:\\Users\\Todd\\bar-dojo\\app\\app.js":[function(require,module,exports){
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


var PatronLayout = React.createClass({displayName: "PatronLayout",
  render: function () {
    return (
      React.createElement("div", null, "TODO")
    );
  }
});


var AppLayout = React.createClass({displayName: "AppLayout",
  render: function () {
    return (
      React.createElement("div", {id: "page"}, 
        React.createElement("ul", {className: "navbar"}, 
          React.createElement("li", null, React.createElement(Link, {to: "/"}, "Drinks")), 
          React.createElement("li", null, React.createElement(Link, {to: "/patrons"}, "Patrons")), 
          React.createElement("li", null, React.createElement(Link, {to: "/inventory"}, "Inventory")), 
          React.createElement("li", null, React.createElement(Link, {to: "/shopping"}, "Shopping List")), 
          React.createElement("li", null, React.createElement(Link, {to: "/history"}, "History"))
        ), 
        React.createElement("div", {id: "content"}, 
          this.props.children
        )
      )
    );
  }
});


ReactDOM.render(
  React.createElement(Router, {history: hashHistory}, 
    React.createElement(Route, {component: AppLayout}, 
      React.createElement(Route, {path: "/", component: RecipeLayout}, 
        React.createElement(IndexRoute, {component: RecipeList}), 
        React.createElement(Route, {path: "add", component: RecipeAdd})
      ), 
      React.createElement(Route, {path: "/patrons", component: PatronLayout})
    )
  ),
  document.getElementById('app')
);

/*
      <Route component={SearchLayout}>
        <Route path="users" component={UserList} />
        <Route path="widgets" component={WidgetList} />
      </Route>
*/

},{"./Recipe/RecipeAdd":"C:\\Users\\Todd\\bar-dojo\\app\\Recipe\\RecipeAdd.js","./Recipe/RecipeLayout":"C:\\Users\\Todd\\bar-dojo\\app\\Recipe\\RecipeLayout.js","./Recipe/RecipeList":"C:\\Users\\Todd\\bar-dojo\\app\\Recipe\\RecipeList.js"}]},{},["C:\\Users\\Todd\\bar-dojo\\app\\app.js"])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJDOlxcVXNlcnNcXFRvZGRcXGJhci1kb2pvXFxhcHBcXFJlY2lwZVxcUmVjaXBlQWRkLmpzIiwiQzpcXFVzZXJzXFxUb2RkXFxiYXItZG9qb1xcYXBwXFxSZWNpcGVcXFJlY2lwZUxheW91dC5qcyIsIkM6XFxVc2Vyc1xcVG9kZFxcYmFyLWRvam9cXGFwcFxcUmVjaXBlXFxSZWNpcGVMaXN0LmpzIiwiQzpcXFVzZXJzXFxUb2RkXFxiYXItZG9qb1xcYXBwXFxhcHAuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQSxvQ0FBb0MsdUJBQUE7QUFDcEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7RUFFRSxNQUFNLEVBQUUsWUFBWTtJQUNsQjtNQUNFLG9CQUFBLEtBQUksRUFBQSxJQUFDLEVBQUE7QUFBQSxRQUFBLE1BQUE7QUFBQSxNQUVDLENBQUE7TUFDTjtHQUNIO0FBQ0gsQ0FBQyxDQUFDLENBQUM7QUFDSDtBQUNBOztBQUVBLHdDQUF3QztBQUN4QyxtQ0FBbUM7QUFDbkMscUNBQXFDO0FBQ3JDLE9BQU87QUFDUCx1Q0FBdUM7QUFDdkMsK0NBQStDO0FBQy9DLE9BQU87QUFDUCxxQ0FBcUM7QUFDckMsNkNBQTZDO0FBQzdDLE9BQU87QUFDUCxpQ0FBaUM7QUFDakMsMEJBQTBCO0FBQzFCLDZDQUE2QztBQUM3Qyx5Q0FBeUM7QUFDekMsOEJBQThCO0FBQzlCLGdCQUFnQjtBQUNoQixRQUFRO0FBQ1IseURBQXlEO0FBQ3pELDZDQUE2QztBQUM3QyxPQUFPO0FBQ1AsMEJBQTBCO0FBQzFCLGVBQWU7QUFDZixvRUFBb0U7QUFDcEUsaUJBQWlCO0FBQ2pCLHdCQUF3QjtBQUN4QixvQ0FBb0M7QUFDcEMsc0NBQXNDO0FBQ3RDLCtDQUErQztBQUMvQyxhQUFhO0FBQ2IsaUJB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QUFLLENBQUMsU0FBQSxFQUFTLENBQUUsU0FBVSxDQUFBLENBQUcsQ0FBQTtNQUNwQyxDQUFBLEVBQUE7TUFDUixvQkFBQyxLQUFLLEVBQUEsQ0FBQSxDQUFDLElBQUEsRUFBSSxDQUFDLFVBQUEsRUFBVSxDQUFDLFNBQUEsRUFBUyxDQUFFLFlBQWEsQ0FBQSxDQUFHLENBQUE7SUFDNUMsQ0FBQTtFQUNELENBQUE7RUFDVCxRQUFRLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQztBQUNoQyxDQUFDLENBQUM7O0FBRUY7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwibW9kdWxlLmV4cG9ydHMgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XHJcbiAgLy8gaGFuZGxlUG9zdDogZnVuY3Rpb24gKGNvbW1lbnQpIHtcclxuICAvLyAgIHZhciBkYXRhID0gdGhpcy5zdGF0ZS5kYXRhO1xyXG4gIC8vICAgdmFyIG5ld0RhdGEgPSBzdGF0ZS5jb25jYXQoW2NvbW1lbnRdKTtcclxuICAvLyAgIHRoaXMuc2V0U3RhdGUoe2RhdGE6IG5ld0RhdGF9KTtcclxuICAvLyAgICQuYWpheCh7XHJcbiAgLy8gICAgIHVybDogdGhpcy5wcm9wcy51cmwsXHJcbiAgLy8gICAgIGRhdGFUeXBlOiAnanNvbicsXHJcbiAgLy8gICAgIHR5cGU6ICdQT1NUJyxcclxuICAvLyAgICAgZGF0YTogY29tbWVudCxcclxuICAvLyAgICAgc3VjY2VzczogZnVuY3Rpb24gKGRhdGEpIHtcclxuICAvLyAgICAgICAvLyBhbHJlYWR5IHVwZGF0ZWQgc3RhdGUsIHdlJ3JlIGdvb2QgdG8gZ29cclxuICAvLyAgICAgfS5iaW5kKHRoaXMpLFxyXG4gIC8vICAgICBlcnJvcjogZnVuY3Rpb24gKHhociwgc3RhdHVzLCBlcnIpIHtcclxuICAvLyAgICAgICB0aGlzLnNldFN0YXRlKHtkYXRhOiBkYXRhfSk7XHJcbiAgLy8gICAgICAgY29uc29sZS5lcnJvcih0aGlzLnByb3BzLnVybCwgc3RhdHVzLCBlcnIudG9TdHJpbmcoKSk7XHJcbiAgLy8gICAgIH0uYmluZCh0aGlzKVxyXG4gIC8vICAgfSk7XHJcbiAgLy8gfSxcclxuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcclxuICAgIHJldHVybiAoXHJcbiAgICAgIDxkaXY+XHJcbiAgICAgICAgVE9ET1xyXG4gICAgICA8L2Rpdj5cclxuICAgICk7XHJcbiAgfSxcclxufSk7XHJcblxyXG5cclxuXHJcbi8vIHZhciBDb21tZW50Rm9ybSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcclxuLy8gICBnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uICgpIHtcclxuLy8gICAgIHJldHVybiB7YXV0aG9yOiAnJywgdGV4dDogJyd9O1xyXG4vLyAgIH0sXHJcbi8vICAgaGFuZGxlQXV0aG9yQ2hhbmdlOiBmdW5jdGlvbiAoZSkge1xyXG4vLyAgICAgdGhpcy5zZXRTdGF0ZSh7YXV0aG9yOiBlLnRhcmdldC52YWx1ZX0pO1xyXG4vLyAgIH0sXHJcbi8vICAgaGFuZGxlVGV4dENoYW5nZTogZnVuY3Rpb24gKGUpIHtcclxuLy8gICAgIHRoaXMuc2V0U3RhdGUoe3RleHQ6IGUudGFyZ2V0LnZhbHVlfSk7XHJcbi8vICAgfSxcclxuLy8gICBoYW5kbGVTdWJtaXQ6IGZ1bmN0aW9uIChlKSB7XHJcbi8vICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbi8vICAgICB2YXIgYXV0aG9yID0gdGhpcy5zdGF0ZS5hdXRob3IudHJpbSgpO1xyXG4vLyAgICAgdmFyIHRleHQgPSB0aGlzLnN0YXRlLnRleHQudHJpbSgpO1xyXG4vLyAgICAgaWYgKCF0ZXh0IHx8ICFhdXRob3IpIHtcclxuLy8gICAgICAgcmV0dXJuO1xyXG4vLyAgICAgfVxyXG4vLyAgICAgdGhpcy5wcm9wcy5vblBvc3Qoe25hbWU6IGF1dGhvciwgdW5pdFR5cGU6IHRleHR9KTtcclxuLy8gICAgIHRoaXMuc2V0U3RhdGUoe2F1dGhvcjogJycsIHRleHQ6ICcnfSk7XHJcbi8vICAgfSxcclxuLy8gICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcclxuLy8gICAgIHJldHVybiAoXHJcbi8vICAgICAgIDxmb3JtIGNsYXNzTmFtZT1cImNvbW1lbnRGb3JtXCIgb25TdWJtaXQ9e3RoaXMuaGFuZGxlU3VibWl0fT5cclxuLy8gICAgICAgICA8aW5wdXRcclxuLy8gICAgICAgICAgIHR5cGU9XCJ0ZXh0XCJcclxuLy8gICAgICAgICAgIHBsYWNlaG9sZGVyPVwiWW91ciBuYW1lXCJcclxuLy8gICAgICAgICAgIHZhbHVlPXt0aGlzLnN0YXRlLmF1dGhvcn1cclxuLy8gICAgICAgICAgIG9uQ2hhbmdlPXt0aGlzLmhhbmRsZUF1dGhvckNoYW5nZX1cclxuLy8gICAgICAgICAvPlxyXG4vLyAgICAgICAgIDxpbnB1dFxyXG4vLyAgICAgICAgICAgdHlwZT1cInRleHRcIlxyXG4vLyAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJTYXkgc29tZXRoaW5nLi4uXCJcclxuLy8gICAgICAgICAgIHZhbHVlPXt0aGlzLnN0YXRlLnRleHR9XHJcbi8vICAgICAgICAgICBvbkNoYW5nZT17dGhpcy5oYW5kbGVUZXh0Q2hhbmdlfVxyXG4vLyAgICAgICAgIC8+XHJcbi8vICAgICAgICAgPGlucHV0IHR5cGU9XCJzdWJtaXRcIiB2YWx1ZT1cIlBvc3RcIiAvPlxyXG4vLyAgICAgICA8L2Zvcm0+XHJcbi8vICAgICApO1xyXG4vLyAgIH1cclxuLy8gfSk7XHJcbiIsInZhciBSZWFjdFJvdXRlciA9IHdpbmRvdy5SZWFjdFJvdXRlcjtcclxudmFyIFJvdXRlID0gUmVhY3RSb3V0ZXIuUm91dGU7XHJcbnZhciBMaW5rID0gUmVhY3RSb3V0ZXIuTGluaztcclxuXHJcbi8qXHJcblJlY2lwZS5zY2hlbWEgPSB7XHJcbiAgbmFtZTogSm9pLnN0cmluZygpLnJlcXVpcmVkKCksXHJcbiAgdGFnczogSm9pLmFycmF5KCkuaXRlbXMoSm9pLnN0cmluZygpKSwgLy8gdGFnIG5hbWVcclxuICBpbnN0cnVjdGlvbnM6IEpvaS5hcnJheSgpLml0ZW1zKEpvaS5zdHJpbmcoKSksIC8vIG9wdGlvbmFsXHJcbiAgaW5ncmVkaWVudHM6IEpvaS5hcnJheSgpLml0ZW1zKEpvaS5vYmplY3QoKS5rZXlzKHtcclxuICAgIHN0b2NrVHlwZUlkOiBKb2kuc3RyaW5nKCksXHJcbiAgICBxdWFudGl0eTogSm9pLm51bWJlcigpLFxyXG4gIH0pKSxcclxuXHJcbiAgY3JlYXRlZDogSm9pLmRhdGUoKS50aW1lc3RhbXAoKSxcclxuICBhcmNoaXZlZDogSm9pLmJvb2xlYW4oKS5kZWZhdWx0KGZhbHNlKSxcclxufTtcclxuKi9cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xyXG4gIHJlbmRlcjogZnVuY3Rpb24gKCkge1xyXG4vLyBUT0RPIGhhdmUgRHJpbmtzIG1lbnUgaGF2ZSBzdWJtZW51IGZvciBkcmluayB0eXBlc1xyXG4vLyBUT0RPIHNldCB1cCBhIHJvdXRlciBiZXR3ZWVuIGNhdGVnb3J5IGRpc3BsYXkgYW5kIGRpZmZlcmVudCBkcmluayBtZW51cyAocGVyaGFwcyBzZXR0aW5nIHRoZSBzZWxlY3RlZCBjYXRlZ29yeSBhcyBhIHF1ZXJ5IHZhbD8pXHJcbi8vIGFsc28gYSByb3V0ZSBmb3IgdGhlIGFkZCBmb3JtXHJcbiAgICAvLyByZXR1cm4gKFxyXG4gICAgLy8gICA8Um91dGUgY29tcG9uZW50PXtSZWNpcGVMYXlvdXR9PlxyXG4gICAgLy8gICAgIDxSb3V0ZSBwYXRoPVwiL1wiIGNvbXBvbmVudD17UmVjaXBlTGlzdH0gLz5cclxuICAgIC8vICAgICA8Um91dGUgcGF0aD1cIi9hZGRcIiBjb21wb25lbnQ9e1JlY2lwZUFkZH0gLz5cclxuICAgIC8vICAgPC9Sb3V0ZT5cclxuICAgIC8vICk7XHJcbiAgICByZXR1cm4gKFxyXG4gICAgICA8ZGl2PlxyXG4gICAgICAgIDxoMT5SZWNpcGVzPC9oMT5cclxuICAgICAgICA8TGluayB0bz1cIi9cIj5MaXN0PC9MaW5rPlxyXG4gICAgICAgIDxMaW5rIHRvPVwiYWRkXCI+QWRkPC9MaW5rPlxyXG4gICAgICAgIHt0aGlzLnByb3BzLmNoaWxkcmVufVxyXG4gICAgICA8L2Rpdj5cclxuICAgICk7XHJcbiAgfVxyXG59KTtcclxuXHJcbi8vIDxDb21tZW50Rm9ybSBvblBvc3Q9e3RoaXMuaGFuZGxlUG9zdH0gLz5cclxuXHJcbi8vIDxkaXY+XHJcbi8vICAgICAgICAgPGgxPlJlY2lwZXM8L2gxPlxyXG4vLyAgICAgICAgIDxSZWNpcGVMaXN0IGRhdGE9e3RoaXMuc3RhdGUuZGF0YX0gLz5cclxuLy8gICAgICAgPC9kaXY+IiwidmFyIFJlY2lwZSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcclxuICBoYW5kbGVEZWxldGU6IGZ1bmN0aW9uICgpIHtcclxuICAgIHRoaXMucHJvcHMub25EZWxldGUodGhpcy5wcm9wcy5yZWNpcGUuaWQpO1xyXG4gIH0sXHJcbiAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XHJcbiAgICByZXR1cm4gKFxyXG4gICAgICA8bGkgY2xhc3NOYW1lPVwicmVjaXBlXCI+XHJcbiAgICAgICAgPGgyPlxyXG4gICAgICAgICAge3RoaXMucHJvcHMucmVjaXBlLm5hbWV9XHJcbiAgICAgICAgPC9oMj5cclxuICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImRlbGV0ZVwiIG9uQ2xpY2s9e3RoaXMuaGFuZGxlRGVsZXRlfT5YPC9idXR0b24+XHJcbiAgICAgICAge3RoaXMucHJvcHMuY2hpbGRyZW59XHJcbiAgICAgIDwvbGk+XHJcbiAgICApO1xyXG4gIH0sXHJcbn0pO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XHJcbiAgZ2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbiAoKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBkYXRhOiBbXSxcclxuICAgIH07XHJcbiAgfSxcclxuICBjb21wb25lbnREaWRNb3VudDogZnVuY3Rpb24gKCkge1xyXG4gICAgJC5hamF4KHtcclxuICAgICAgdXJsOiAnL2FwaS9SZWNpcGUnLFxyXG4gICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe2RhdGE6IGRhdGF9KTtcclxuICAgICAgfS5iaW5kKHRoaXMpLFxyXG4gICAgICBlcnJvcjogZnVuY3Rpb24gKHhociwgc3RhdHVzLCBlcnIpIHtcclxuICAgICAgICBjb25zb2xlLmVycm9yKHRoaXMucHJvcHMudXJsLCBzdGF0dXMsIGVyci50b1N0cmluZygpKTtcclxuICAgICAgfS5iaW5kKHRoaXMpLFxyXG4gICAgfSk7XHJcbiAgfSxcclxuICBvbkRlbGV0ZTogZnVuY3Rpb24gKGlkKSB7XHJcbiAgICB2YXIgZGF0YSA9IHRoaXMuc3RhdGUuZGF0YTtcclxuICAgIHZhciBuZXdEYXRhID0gZGF0YS5maWx0ZXIoKHJlY2lwZSkgPT4geyByZXR1cm4gcmVjaXBlLmlkICE9PSBpZDsgfSk7XHJcbiAgICB0aGlzLnNldFN0YXRlKHsgZGF0YTogbmV3RGF0YSB9KTtcclxuICAgICQuYWpheCh7XHJcbiAgICAgIHVybDogJy9hcGkvUmVjaXBlLycgKyBpZCxcclxuICAgICAgdHlwZTogJ0RFTEVURScsXHJcbiAgICAgIGVycm9yOiBmdW5jdGlvbiAoeGhyLCBzdGF0dXMsIGVycikge1xyXG4gICAgICAgIGNvbnNvbGUuZXJyb3IodGhpcy5wcm9wcy51cmwsIHN0YXR1cywgZXJyLnRvU3RyaW5nKCkpO1xyXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe2RhdGE6IGRhdGF9KTtcclxuICAgICAgfS5iaW5kKHRoaXMpLFxyXG4gICAgfSk7XHJcbiAgfSxcclxuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciByZWNpcGVzID0gdGhpcy5zdGF0ZS5kYXRhLm1hcCgocmVjaXBlKSA9PiB7XHJcbiAgICAgIHJldHVybiA8UmVjaXBlIGtleT17cmVjaXBlLmlkfSByZWNpcGU9e3JlY2lwZX0gb25EZWxldGU9e3RoaXMub25EZWxldGV9PjwvUmVjaXBlPjtcclxuICAgIH0pO1xyXG4gICAgcmV0dXJuIChcclxuICAgICAgPHVsPlxyXG4gICAgICAgIHtyZWNpcGVzfVxyXG4gICAgICA8L3VsPlxyXG4gICAgKTtcclxuICB9LFxyXG59KTsiLCIvLyB2YXIgUm91dGVyID0gUmVhY3RSb3V0ZXI7XHJcbi8vIHZhciBSb3V0ZSA9IFJvdXRlci5Sb3V0ZSwgRGVmYXVsdFJvdXRlID0gUm91dGVyLkRlZmF1bHRSb3V0ZSxcclxuLy8gICBMaW5rPVJvdXRlci5MaW5rLCBSb3V0ZUhhbmRsZXIgPSBSb3V0ZXIuUm91dGVIYW5kbGVyLCBicm93c2VySGlzdG9yeSA9IFJvdXRlci5icm93c2VySGlzdG9yeTtcclxuXHJcbnZhciBSZWFjdFJvdXRlciA9IHdpbmRvdy5SZWFjdFJvdXRlcjtcclxudmFyIFJvdXRlciA9IFJlYWN0Um91dGVyLlJvdXRlcjtcclxudmFyIEluZGV4Um91dGUgPSBSZWFjdFJvdXRlci5JbmRleFJvdXRlO1xyXG52YXIgUm91dGUgPSBSZWFjdFJvdXRlci5Sb3V0ZTtcclxudmFyIExpbmsgPSBSZWFjdFJvdXRlci5MaW5rO1xyXG52YXIgaGFzaEhpc3RvcnkgPSBSZWFjdFJvdXRlci5oYXNoSGlzdG9yeTtcclxuXHJcbnZhciBSZWNpcGVMYXlvdXQgPSByZXF1aXJlKCcuL1JlY2lwZS9SZWNpcGVMYXlvdXQnKTtcclxudmFyIFJlY2lwZUxpc3QgPSByZXF1aXJlKCcuL1JlY2lwZS9SZWNpcGVMaXN0Jyk7XHJcbnZhciBSZWNpcGVBZGQgPSByZXF1aXJlKCcuL1JlY2lwZS9SZWNpcGVBZGQnKTtcclxuXHJcblxyXG52YXIgUGF0cm9uTGF5b3V0ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xyXG4gIHJlbmRlcjogZnVuY3Rpb24gKCkge1xyXG4gICAgcmV0dXJuIChcclxuICAgICAgPGRpdj5UT0RPPC9kaXY+XHJcbiAgICApO1xyXG4gIH1cclxufSk7XHJcblxyXG5cclxudmFyIEFwcExheW91dCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcclxuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcclxuICAgIHJldHVybiAoXHJcbiAgICAgIDxkaXYgaWQ9XCJwYWdlXCI+XHJcbiAgICAgICAgPHVsIGNsYXNzTmFtZT1cIm5hdmJhclwiPlxyXG4gICAgICAgICAgPGxpPjxMaW5rIHRvPVwiL1wiPkRyaW5rczwvTGluaz48L2xpPlxyXG4gICAgICAgICAgPGxpPjxMaW5rIHRvPVwiL3BhdHJvbnNcIj5QYXRyb25zPC9MaW5rPjwvbGk+XHJcbiAgICAgICAgICA8bGk+PExpbmsgdG89XCIvaW52ZW50b3J5XCI+SW52ZW50b3J5PC9MaW5rPjwvbGk+XHJcbiAgICAgICAgICA8bGk+PExpbmsgdG89XCIvc2hvcHBpbmdcIj5TaG9wcGluZyBMaXN0PC9MaW5rPjwvbGk+XHJcbiAgICAgICAgICA8bGk+PExpbmsgdG89XCIvaGlzdG9yeVwiPkhpc3Rvcnk8L0xpbms+PC9saT5cclxuICAgICAgICA8L3VsPlxyXG4gICAgICAgIDxkaXYgaWQ9XCJjb250ZW50XCI+XHJcbiAgICAgICAgICB7dGhpcy5wcm9wcy5jaGlsZHJlbn1cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgPC9kaXY+XHJcbiAgICApO1xyXG4gIH1cclxufSk7XHJcblxyXG5cclxuUmVhY3RET00ucmVuZGVyKFxyXG4gIDxSb3V0ZXIgaGlzdG9yeT17aGFzaEhpc3Rvcnl9PlxyXG4gICAgPFJvdXRlIGNvbXBvbmVudD17QXBwTGF5b3V0fT5cclxuICAgICAgPFJvdXRlIHBhdGg9XCIvXCIgY29tcG9uZW50PXtSZWNpcGVMYXlvdXR9PlxyXG4gICAgICAgIDxJbmRleFJvdXRlIGNvbXBvbmVudD17UmVjaXBlTGlzdH0gLz5cclxuICAgICAgICA8Um91dGUgcGF0aD1cImFkZFwiIGNvbXBvbmVudD17UmVjaXBlQWRkfSAvPlxyXG4gICAgICA8L1JvdXRlPlxyXG4gICAgICA8Um91dGUgcGF0aD1cIi9wYXRyb25zXCIgY29tcG9uZW50PXtQYXRyb25MYXlvdXR9IC8+XHJcbiAgICA8L1JvdXRlPlxyXG4gIDwvUm91dGVyPixcclxuICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYXBwJylcclxuKTtcclxuXHJcbi8qXHJcbiAgICAgIDxSb3V0ZSBjb21wb25lbnQ9e1NlYXJjaExheW91dH0+XHJcbiAgICAgICAgPFJvdXRlIHBhdGg9XCJ1c2Vyc1wiIGNvbXBvbmVudD17VXNlckxpc3R9IC8+XHJcbiAgICAgICAgPFJvdXRlIHBhdGg9XCJ3aWRnZXRzXCIgY29tcG9uZW50PXtXaWRnZXRMaXN0fSAvPlxyXG4gICAgICA8L1JvdXRlPlxyXG4qLyJdfQ==
