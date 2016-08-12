import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, IndexRedirect, Link, hashHistory } from 'react-router';
import injectTapEventPlugin from 'react-tap-event-plugin';

import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
// import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import styles from './styles';

import Divider from 'material-ui/Divider';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import AppBar from 'material-ui/AppBar';
import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';
import IconAdd from 'material-ui/svg-icons/content/add';
import IconAnalytics from './Icon/IconAnalytics';
import IconBeer from './Icon/IconBeer';
import IconInventory from './Icon/IconInventory';
import IconMixed from './Icon/IconMixed';
import IconUsers from './Icon/IconUsers';
import IconSearch from 'material-ui/svg-icons/action/search';
import IconSettings from './Icon/IconSettings';
import IconShot from './Icon/IconShot';
import IconTimeline from './Icon/IconTimeline';
import IconWine from './Icon/IconWine';

const Analytics = require('./Analytics');
const CustomDrink = require('./CustomDrink');
const DrinkList = require('./DrinkList');
const UserAdd = require('./User/UserAdd');
const UserEdit = require('./User/UserEdit');
const UserList = require('./User/UserList');
const RecipeForm = require('./Recipe/RecipeForm');
const RecipeList = require('./Recipe/RecipeList');
const StockForm = require('./Stock/StockForm');
const StockList = require('./Stock/StockList');
const TimelineList = require('./TimelineList');
const Settings = require('./Settings');

injectTapEventPlugin();
const theme = getMuiTheme();


const AppLayout = React.createClass({
  getInitialState: function () {
    return {
      search: '',
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
      if (path.indexOf('users') !== -1) { return hashHistory.push('/users/add'); }
      if (path.indexOf('inventory') !== -1) { return hashHistory.push('/inventory/add'); }
      alert('TODO: add button not set up for this page yet');
    })(this.props.location.pathname);
  },
  handleToggle: function () { this.setState({open: !this.state.open}); },
  handleNavigate: function () {
    this.setState({
      open: false,
      search: '',
    });
  },
  render: function () {

    const titleIconStyles = {
      transform: 'translate(0, 4px)',
      paddingRight: '6px',
      color: 'white',
      fill: 'white',
    };
    const pageName = ((path) => {
      if (path.indexOf('analytics') !== -1) { return <div><IconAnalytics style={titleIconStyles} />Analytics</div>; }
      if (path.indexOf('beer') !== -1) { return <div><IconBeer style={titleIconStyles} />Beer</div>; }
      if (path.indexOf('custom') !== -1) { return <div><IconMixed style={titleIconStyles} />Custom Drink</div>; }
      if (path.indexOf('inventory') !== -1) { return <div><IconInventory style={titleIconStyles} />Inventory</div>; }
      if (path.indexOf('mixed') !== -1) { return <div><IconMixed style={titleIconStyles} />Mixed Drinks</div>; }
      if (path.indexOf('settings') !== -1) { return <div><IconSettings style={titleIconStyles} />Settings</div>; }
      if (path.indexOf('shots') !== -1) { return <div><IconShot style={titleIconStyles} />Shots</div>; }
      if (path.indexOf('timeline') !== -1) { return <div><IconTimeline style={titleIconStyles} />Timeline</div>; }
      if (path.indexOf('users') !== -1) { return <div><IconUsers style={titleIconStyles} />Patrons</div>; }
      if (path.indexOf('wine') !== -1) { return <div><IconWine style={titleIconStyles} />Wine</div>; }
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
        <div
          id="page"
          style={{
            marginTop: '64px',
          }}
        >
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
            style={{
              position: 'fixed',
              top: 0,
            }}
          />
          <Drawer
            docked={false}
            width={200}
            open={this.state.open}
            onRequestChange={(open) => this.setState({open})}
          >
            <div
              style={{borderBottom: '1px solid #d2d2d2'}}
              onTouchTap={this.handleToggle}
            >
              <img src="/static/img/logo.png" style={styles.logo}/>
            </div>
            <Link to="/mixed" style={styles.navlink}><MenuItem leftIcon={<IconMixed />} innerDivStyle={menuItemInnerStyle} onTouchTap={this.handleNavigate} primaryText='Mixed Drinks' /></Link>
            <Link to="/beer" style={styles.navlink}><MenuItem leftIcon={<IconBeer />} innerDivStyle={menuItemInnerStyle} onTouchTap={this.handleNavigate}>Beer</MenuItem></Link>
            <Link to="/wine" style={styles.navlink}><MenuItem leftIcon={<IconWine />} innerDivStyle={menuItemInnerStyle} onTouchTap={this.handleNavigate} primaryText='Wine' /></Link>
            <Link to="/shots" style={styles.navlink}><MenuItem leftIcon={<IconShot />} innerDivStyle={menuItemInnerStyle} onTouchTap={this.handleNavigate} primaryText='Straight Shots' /></Link>
            <Link to="/custom" style={styles.navlink}><MenuItem leftIcon={<IconMixed />} innerDivStyle={menuItemInnerStyle} onTouchTap={this.handleNavigate} primaryText='Custom Drink' /></Link>
            <Link to="/users" style={styles.navlink}><MenuItem leftIcon={<IconUsers />} innerDivStyle={menuItemInnerStyle} onTouchTap={this.handleNavigate} primaryText='Patrons' /></Link>
            <Link to="/inventory" style={styles.navlink}><MenuItem leftIcon={<IconInventory />} innerDivStyle={menuItemInnerStyle} onTouchTap={this.handleNavigate} primaryText='Inventory' /></Link>
            <Link to="/timeline" style={styles.navlink}><MenuItem leftIcon={<IconTimeline />} innerDivStyle={menuItemInnerStyle} onTouchTap={this.handleNavigate} primaryText='Timeline' /></Link>

            <Divider/>

            <a href="/auth/logout" style={styles.navlink}><MenuItem primaryText='Log out' /></a>
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
    // <Link to="/analytics" style={styles.navlink}><MenuItem leftIcon={<IconAnalytics />} innerDivStyle={menuItemInnerStyle} onTouchTap={this.handleNavigate} primaryText='Analytics' /></Link>
    // <Link to="/settings" style={styles.navlink}><MenuItem onTouchTap={this.handleNavigate} primaryText='Settings' /></Link>
    // <Link to="/shopping" style={styles.navlink}><MenuItem onTouchTap={this.handleNavigate}>Shopping List</MenuItem></Link>
  }
});


// TODO anlaytics route
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
      <Route path="/custom">
        <IndexRoute component={CustomDrink} />
      </Route>
      <Route path="/users">
        <IndexRoute component={UserList} />
        <Route path="add" component={UserAdd} />
        <Route path="edit/:id" component={UserEdit} />
      </Route>
      <Route path="/inventory">
        <IndexRoute component={StockList} />
        <Route path="add" component={StockForm} />
        <Route path="edit/:id" component={StockForm} />
      </Route>
      <Route path="/timeline">
        <IndexRoute component={TimelineList} />
      </Route>
      <Route path="/analytics">
        <IndexRoute component={Analytics} />
      </Route>
      <Route path="/settings">
        <IndexRoute component={Settings} />
      </Route>
    </Route>
  </Router>,
  document.getElementById('app')
);
