import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, IndexRedirect, Link, hashHistory } from 'react-router';
import injectTapEventPlugin from 'react-tap-event-plugin';

import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
// import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import styles from './styles';

import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import AppBar from 'material-ui/AppBar';
import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';
import IconAdd from 'material-ui/svg-icons/content/add';
import IconSearch from 'material-ui/svg-icons/action/search';

const RecipeList = require('./Recipe/RecipeList');
const RecipeForm = require('./Recipe/RecipeForm');
const StockList = require('./Stock/StockList');
const StockForm = require('./Stock/StockForm');

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
    return {
      searchbarVisible: (document.body.getBoundingClientRect().width >= 425),
    };
  },
  handleSearchInput: function (e) {
    this.setState({ search: e.target.value });
  },
  handleSearch: function () {
    if (this.state.searchbarVisible === false) {
      return this.setState({ searchbarVisible: true });
    }
    else if (document.body.getBoundingClientRect().width < 425) {
      // TODO also search here
      return this.setState({ searchbarVisible: false });
    }
    alert(this.state.search);
  },
  handleAdd: function () {
    ((path) => {
      if (path.indexOf('drinks') !== -1) { return hashHistory.push('/drinks/add'); }
      if (path.indexOf('patrons') !== -1) { return hashHistory.push('/patrons/add'); }
      if (path.indexOf('inventory') !== -1) { return hashHistory.push('/inventory/add'); }
      console.log('TODO: add button not set up for this page yet');
    })(this.props.location.pathname);
  },
  handleToggle: function () { this.setState({open: !this.state.open}); },
  handleClose: function () { this.setState({open: false}); },
  render: function () {

    const pageName = ((path) => {
      if (path.indexOf('drinks') !== -1) { return 'Drinks'; }
      if (path.indexOf('patrons') !== -1) { return 'Patrons'; }
      if (path.indexOf('inventory') !== -1) { return 'Inventory'; }
      return 'TODO: set page name';
    })(this.props.location.pathname);

    const searchbarStyle = {};
    if (this.state.searchbarVisible === false) {
      searchbarStyle.display = 'none';
    }

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
                  style={searchbarStyle}
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
            <img src="/static/img/logo.png" style={styles.logo}/>
            <Link to="/drinks" style={styles.navlink}><MenuItem onTouchTap={this.handleClose}>Drinks</MenuItem></Link>
            <Link to="/patrons" style={styles.navlink}><MenuItem onTouchTap={this.handleClose}>Patrons</MenuItem></Link>
            <Link to="/inventory" style={styles.navlink}><MenuItem onTouchTap={this.handleClose}>Inventory</MenuItem></Link>
            <Link to="/shopping" style={styles.navlink}><MenuItem onTouchTap={this.handleClose}>Shopping List</MenuItem></Link>
            <Link to="/history" style={styles.navlink}><MenuItem onTouchTap={this.handleClose}>History</MenuItem></Link>
          </Drawer>
          <div style={styles.contentBox}>
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
      <Route path="/inventory">
        <IndexRoute component={StockList} />
        <Route path="add" component={StockForm} />
        <Route path="edit/:id" component={StockForm} />
      </Route>
    </Route>
  </Router>,
  document.getElementById('app')
);