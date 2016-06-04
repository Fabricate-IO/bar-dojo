import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, Link, hashHistory } from 'react-router';
import injectTapEventPlugin from 'react-tap-event-plugin';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';

const RecipeLayout = require('./Recipe/RecipeLayout');
const RecipeList = require('./Recipe/RecipeList');
const RecipeAdd = require('./Recipe/RecipeAdd');
const RecipeEdit = require('./Recipe/RecipeEdit');

injectTapEventPlugin();
const theme = getMuiTheme(darkBaseTheme);


const PatronLayout = React.createClass({
  render: function () {
    return (
      <div>TODO</div>
    );
  }
});


const AppLayout = React.createClass({
  render: function () {
    return (
      <MuiThemeProvider muiTheme={theme}>
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