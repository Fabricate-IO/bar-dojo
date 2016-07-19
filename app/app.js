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
import IconBeer from './Icon/IconBeer';
import IconInventory from './Icon/IconInventory';
import IconMixed from './Icon/IconMixed';
import IconPatrons from './Icon/IconPatrons';
import IconSearch from 'material-ui/svg-icons/action/search';
import IconShot from './Icon/IconShot';
import IconWine from './Icon/IconWine';

const DrinkList = require('./DrinkList');
const PatronForm = require('./Patron/PatronForm');
const PatronList = require('./Patron/PatronList');
const RecipeForm = require('./Recipe/RecipeForm');
const RecipeList = require('./Recipe/RecipeList');
const StockForm = require('./Stock/StockForm');
const StockList = require('./Stock/StockList');

injectTapEventPlugin();
const theme = getMuiTheme();


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
      return this.setState({ searchbarVisible: false });
    }
  },
  handleAdd: function () {
    ((path) => {
      if (path.indexOf('mixed') !== -1) { return hashHistory.push('/mixed/add'); }
      if (path.indexOf('patrons') !== -1) { return hashHistory.push('/patrons/add'); }
      if (path.indexOf('inventory') !== -1) { return hashHistory.push('/inventory/add'); }
      console.log('TODO: add button not set up for this page yet');
    })(this.props.location.pathname);
  },
  handleToggle: function () { this.setState({open: !this.state.open}); },
  handleNavigate: function () {
    this.setState({
      open: false,
      search: null,
    });
  },
  render: function () {

    const pageName = ((path) => {
      if (path.indexOf('mixed') !== -1) { return 'Mixed Drinks'; }
      if (path.indexOf('beer') !== -1) { return 'Beer'; }
      if (path.indexOf('wine') !== -1) { return 'Wine'; }
      if (path.indexOf('shots') !== -1) { return 'Shots'; }
      if (path.indexOf('patrons') !== -1) { return 'Patrons'; }
      if (path.indexOf('inventory') !== -1) { return 'Inventory'; }
      return 'TODO: set page name';
    })(this.props.location.pathname);

    const searchbarStyle = {};
    if (this.state.searchbarVisible === false) {
      searchbarStyle.display = 'none';
    }

    const menuItemInnerStyle = {
      paddingLeft: '48px'
    };

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
            <div
              style={{borderBottom: '1px solid #d2d2d2'}}
            >
              <img src="/static/img/logo.png" style={styles.logo}/>
            </div>
            <Link to="/mixed" style={styles.navlink}><MenuItem leftIcon={<IconMixed />} innerDivStyle={menuItemInnerStyle} onTouchTap={this.handleNavigate} primaryText='Mixed Drinks' /></Link>
            <Link to="/beer" style={styles.navlink}><MenuItem leftIcon={<IconBeer />} innerDivStyle={menuItemInnerStyle} onTouchTap={this.handleNavigate}>Beer</MenuItem></Link>
            <Link to="/wine" style={styles.navlink}><MenuItem leftIcon={<IconWine />} innerDivStyle={menuItemInnerStyle} onTouchTap={this.handleNavigate} primaryText='Wine' /></Link>
            <Link to="/shots" style={styles.navlink}><MenuItem leftIcon={<IconShot />} innerDivStyle={menuItemInnerStyle} onTouchTap={this.handleNavigate} primaryText='Straight Shots' /></Link>
            <Link to="/patrons" style={styles.navlink}><MenuItem leftIcon={<IconPatrons />} innerDivStyle={menuItemInnerStyle} onTouchTap={this.handleNavigate} primaryText='Patrons' /></Link>
            <Link to="/inventory" style={styles.navlink}><MenuItem leftIcon={<IconInventory />}innerDivStyle={menuItemInnerStyle} onTouchTap={this.handleNavigate} primaryText='Inventory' /></Link>
          </Drawer>
          <div style={styles.contentBox}>
            {React.cloneElement(this.props.children, {
              path: this.props.location.pathname,
              search: this.state.search,
            })}
          </div>
        </div>
      </MuiThemeProvider>
    );
    // <Link to="/shopping" style={styles.navlink}><MenuItem onTouchTap={this.handleNavigate}>Shopping List</MenuItem></Link>
    // <Link to="/history" style={styles.navlink}><MenuItem onTouchTap={this.handleNavigate}>History</MenuItem></Link>
  }
});


ReactDOM.render(
  <Router history={hashHistory}>
    <Route component={AppLayout}>
      <Route path="/">
        <IndexRedirect to="/mixed" />
      </Route>
      <Route path="/mixed">
        <IndexRoute component={RecipeList} />
        <Route path="add" component={RecipeForm} />
        <Route path="edit/:id" component={RecipeForm} />
      </Route>
      <Route path="/beer">
        <IndexRoute component={DrinkList} />
      </Route>
      <Route path="/wine">
        <IndexRoute component={DrinkList} />
      </Route>
      <Route path="/shots">
        <IndexRoute component={DrinkList} />
      </Route>
      <Route path="/patrons">
        <IndexRoute component={PatronList} />
        <Route path="add" component={PatronForm} />
        <Route path="edit/:id" component={PatronForm} />
      </Route>
      <Route path="/inventory">
        <IndexRoute component={StockList} />
        <Route path="add" component={StockForm} />
        <Route path="edit/:id" component={StockForm} />
      </Route>
    </Route>
  </Router>,
  document.getElementById('app')
);
