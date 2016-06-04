'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, Link, hashHistory } from 'react-router';
import injectTapEventPlugin from 'react-tap-event-plugin';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

var RecipeLayout = require('./Recipe/RecipeLayout');
var RecipeList = require('./Recipe/RecipeList');
var RecipeAdd = require('./Recipe/RecipeAdd');
var RecipeEdit = require('./Recipe/RecipeEdit');

injectTapEventPlugin();


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
      <MuiThemeProvider muiTheme={getMuiTheme()}>
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
      </MuiThemeProvider>
    );
  }
});


ReactDOM.render(
  <Router history={hashHistory}>
    <Route component={AppLayout}>
      <Route path="/" component={RecipeLayout}>
        <IndexRoute component={RecipeList} />
        <Route path="/add" component={RecipeAdd} />
        <Route path="/edit/:id" component={RecipeEdit} />
      </Route>
      <Route path="/patrons" component={PatronLayout} />
    </Route>
  </Router>,
  document.getElementById('app')
);