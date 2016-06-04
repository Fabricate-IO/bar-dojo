import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, IndexRedirect, Link, hashHistory } from 'react-router';
import injectTapEventPlugin from 'react-tap-event-plugin';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';

import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import AppBar from 'material-ui/AppBar';
import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';
import IconAdd from 'material-ui/svg-icons/content/add';
import IconSearch from 'material-ui/svg-icons/action/search';

const RecipeList = require('./Recipe/RecipeList');
const RecipeAdd = require('./Recipe/RecipeAdd');
const RecipeEdit = require('./Recipe/RecipeEdit');

injectTapEventPlugin();
const theme = getMuiTheme(darkBaseTheme);

const styles = {
  navlink: {
    'text-decoration': 'none',
  },
};


const PatronLayout = React.createClass({
  render: function () {
    return (
      <div>TODO</div>
    );
  }
});


const AppLayout = React.createClass({
  getInitialState: function () {
    return {};
  },
  handleSearchInput: function (e) {
    this.setState({ search: e.target.value });
  },
  handleSearch: function () {
    alert(this.state.search);
  },
  handleAdd: function () {
    hashHistory.push('/drinks/add');
  },
  handleToggle: function () { this.setState({open: !this.state.open}); },
  handleClose: function () { this.setState({open: false}); },
  render: function () {
    return (
      <MuiThemeProvider muiTheme={theme}>
        <div id="page">
          <AppBar
            title={this.props.location.pathname}
            iconElementRight={
              <div>
                <TextField
                  hintText="Search..."
                  value={this.state.search}
                  onChange={this.handleSearchInput}
                />
                <IconButton onClick={this.handleSearch}><IconSearch /></IconButton>
                <IconButton onClick={this.handleAdd}><IconAdd /></IconButton>
              </div>
            }
            onLeftIconButtonTouchTap={this.handleToggle}
          />
          <Drawer
            docked={false}
            width={200}
            open={this.state.open}
            onRequestChange={(open) => this.setState({open})}
          >
            <h2>BarNinja</h2>
            <Link to="/drinks" style={styles.navlink}><MenuItem onTouchTap={this.handleClose}>Drinks</MenuItem></Link>
            <Link to="/patrons" style={styles.navlink}><MenuItem onTouchTap={this.handleClose}>Patrons</MenuItem></Link>
            <Link to="/inventory" style={styles.navlink}><MenuItem onTouchTap={this.handleClose}>Inventory</MenuItem></Link>
            <Link to="/shopping" style={styles.navlink}><MenuItem onTouchTap={this.handleClose}>Shopping List</MenuItem></Link>
            <Link to="/history" style={styles.navlink}><MenuItem onTouchTap={this.handleClose}>History</MenuItem></Link>
          </Drawer>
          <div>
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
      <Route path="/">
        <IndexRedirect to="/drinks" />
      </Route>
      <Route path="/drinks">
        <IndexRoute component={RecipeList} />
        <Route path="add" component={RecipeAdd} />
        <Route path="edit/:id" component={RecipeEdit} />
      </Route>
      <Route path="/patrons" component={PatronLayout} />
    </Route>
  </Router>,
  document.getElementById('app')
);