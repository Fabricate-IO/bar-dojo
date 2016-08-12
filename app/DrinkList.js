import React from 'react';
import { hashHistory } from 'react-router';

import NetworkRequest from './networkRequest';
import styles from './styles';
import utils from './utils';

import FlatButton from 'material-ui/FlatButton';
import { List, ListItem } from 'material-ui/List';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import SelectField from 'material-ui/SelectField';
import Snackbar from 'material-ui/Snackbar';

import DrinkBuyDialog from './DrinkBuyDialog';


const Drink = React.createClass({
  getInitialState: function () {
    return {
      buyDialog: false,
    };
  },
  handleDialogOpen: function () {
    this.setState({ buyDialog: true });
  },
  handleDialogClose: function () {
    this.setState({ buyDialog: false });
  },
  render: function () {

    const buyButtonText = 'Buy - ' + this.props.drink.priceFormatted;

    let unitType = 'bottle';
    if (this.props.category === 'beer') { unitType = 'bottle'; }
    if (this.props.category === 'wine') { unitType = 'glass'; }
    if (this.props.category === 'shot') { unitType = 'shot'; }

    const ingredients = [{
      quantity: this.props.drink.remainingUnits[0],
      barStockId: this.props.drink.id,
    }];

    return (
      <div>
        <ListItem
          onClick={this.handleClick}
          rightIconButton={
            <RaisedButton label={buyButtonText} onClick={this.handleDialogOpen} />
          }
        >
          <div>
            {this.props.drink.name} <span style={styles.faded}>({this.props.drink.abvFormatted} - {this.props.drink.priceFormatted}/{unitType})</span>
          </div>
        </ListItem>
        <DrinkBuyDialog
          category={this.props.category}
          drink={this.props.drink}
          Users={this.props.Users}
          ingredients={ingredients}
          handleDialogOpen={this.handleDialogOpen}
          handleDialogClose={this.handleDialogClose}
          openSnackbar={this.openSnackbar}
          visible={this.state.buyDialog}
        />
      </div>
    );
  },
});

module.exports = React.createClass({
  getInitialState: function () {
    return {
      category: '',
      data: [],
      Users: [],
      snackbar: {
        open: false,
        message: null,
      },
    };
  },
  componentDidMount: function () {

    this.fetchData(this.props);

    NetworkRequest('GET', '/api/User?orderBy=name&order=asc', (err, result) => {

      if (err) {
        return console.error('User API', status, err.toString());
      }

      this.setState({ Users: result });
    });
  },
  componentWillReceiveProps: function (nextProps) {
    this.fetchData(nextProps);
  },
  handleSnackbarClose: function () {
    this.state.snackbar.open = false;
    this.setState({ snackbar: this.state.snackbar });
  },
  handleSnackbarOpen: function (message) {
    this.state.snackbar.open = true;
    this.state.snackbar.message = message;
    this.setState({ snackbar: this.state.snackbar });
  },
  fetchData: function (props) {

    this.setState({ data: [] });

    let filter = '&category=';
    let category = '';
    if (props.path.indexOf('beer') !== -1) { category = 'beer'; filter += 'beer'; }
    else if (props.path.indexOf('wine') !== -1) { category = 'wine'; filter += 'wine'; }
    else if (props.path.indexOf('shots') !== -1) { category = 'shot'; filter += 'spirit'; }
    this.setState({ category: category });

    NetworkRequest('GET', '/api/BarStock?orderBy=name&order=asc' + filter, (err, result) => {

      if (err) {
        return console.error('BarStock API', status, err.toString());
      }

      result = result.map((drink) => {
        drink.abvFormatted = utils.formatAbv(drink.abv);
        if (category === 'beer') {
          drink.volume = drink.remainingUnits[0];
        }
        else if (category === 'wine') {
          drink.volume = 118;
        }
        else if (category === 'shot') {
          drink.volume = 44;
        }
        drink.price = drink.volume * drink.volumeCost;
        drink.priceFormatted = utils.formatPrice(drink.price);
        return drink;
      });

      this.setState({ data: result });
    });
  },
  render: function () {

    const searched = this.state.data.filter((element) => {
      return utils.search(this.props.search, [element.name]);
    });

    let inStock = searched.filter((element) => {
      return (element.inStock === true);
    })

    if (searched.length === 0) {
      inStock = <div>No {this.state.category} available</div>;
    } else {
      inStock = inStock.map((drink) => {
        return <Drink
          key={drink.id}
          category={this.state.category}
          drink={drink}
          Users={this.state.Users}
          openSnackbar={this.handleSnackbarOpen}>
        </Drink>;
      });
    }

    return (
      <div>
        <List>
          {inStock}
        </List>

        <Snackbar
          open={this.state.snackbar.open}
          message={this.state.snackbar.message}
          autoHideDuration={4000}
          onRequestClose={this.handleSnackbarClose}
        />
      </div>
    );
  },
});
