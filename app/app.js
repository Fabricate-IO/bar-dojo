import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, IndexRedirect, Link, hashHistory } from 'react-router';
import injectTapEventPlugin from 'react-tap-event-plugin';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
// import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import style from './styles';

import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import AppBar from 'material-ui/AppBar';
import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';
import IconAdd from 'material-ui/svg-icons/content/add';
import IconSearch from 'material-ui/svg-icons/action/search';

const RecipeList = require('./Recipe/RecipeList');
const RecipeForm = require('./Recipe/RecipeForm');

injectTapEventPlugin();
const theme = getMuiTheme();


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
    const pageName = ((path) => {
      if (path.indexOf('drinks') !== -1) { return 'Drinks'; }
      if (path.indexOf('patrons') !== -1) { return 'Patrons'; }
      return 'TODO: set page name';
    })(this.props.location.pathname);
    return (
      <MuiThemeProvider muiTheme={theme}>
        <div id="page">
          <AppBar
            title={pageName}
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
            <h2>Bar Dojo</h2>
            <Link to="/drinks" style={style.navlink}><MenuItem onTouchTap={this.handleClose}>Drinks</MenuItem></Link>
            <Link to="/patrons" style={style.navlink}><MenuItem onTouchTap={this.handleClose}>Patrons</MenuItem></Link>
            <Link to="/inventory" style={style.navlink}><MenuItem onTouchTap={this.handleClose}>Inventory</MenuItem></Link>
            <Link to="/shopping" style={style.navlink}><MenuItem onTouchTap={this.handleClose}>Shopping List</MenuItem></Link>
            <Link to="/history" style={style.navlink}><MenuItem onTouchTap={this.handleClose}>History</MenuItem></Link>
          </Drawer>
          <div style={style.contentBox}>
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
        <Route path="add" component={RecipeForm} />
        <Route path="edit/:id" component={RecipeForm} />
      </Route>
      <Route path="/patrons" component={PatronLayout} />
    </Route>
  </Router>,
  document.getElementById('app')
);