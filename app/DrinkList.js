import React from 'react';
import { hashHistory } from 'react-router';

import NetworkRequest from './networkRequest';
import styles from './styles';
import utils from './utils';

import Dialog from 'material-ui/Dialog';
import Divider from 'material-ui/Divider';
import FlatButton from 'material-ui/FlatButton';
import { List, ListItem } from 'material-ui/List';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import SelectField from 'material-ui/SelectField';
import Snackbar from 'material-ui/Snackbar';
import Subheader from 'material-ui/Subheader';


const Drink = React.createClass({
  getInitialState: function () {
    return {
      modal: false,
      userId: null,
    };
  },
  handleModalOpen: function () {
    this.setState({ modal: true });
  },
  handleModalClose: function () {
    this.setState({ modal: false });
  },
  handleOrder: function () {

    NetworkRequest('POST', '/api/User/' + this.state.userId + '/order',
      {
        abv: this.props.drink.abv,
        ingredients: [{
          quantity: this.props.drink.remainingUnits[0],
          barStockId: this.props.drink.id,
        }],
        monetaryValue: this.props.drink.price,
      },
      (err, result) => {

      if (err) {
        return console.error('User API', status, err.toString());
      }

      this.setState({ modal: false });
      this.handleModalClose();
      this.props.openSnackbar(this.props.drink.name + ' purchased for ' + this.props.drink.priceFormatted);
    });
  },
  handleUserSelect: function (event, index, value) {
    event.preventDefault();
    this.setState({ userId: value });
  },
  render: function () {

    const buyButtonText = 'Buy - ' + this.props.drink.priceFormatted;
    let buyConfirmText = 'Please select a patron to charge';
    const buyConfirmDisabled = (this.state.userId == null);
    if (buyConfirmDisabled === false) {
      buyConfirmText = 'Charge ' + this.props.Users.find((user) => { return (user.id === this.state.userId); }).name + ' ' + this.props.drink.priceFormatted;
    }
    const users = this.props.Users.map((user) => {
      return <MenuItem key={user.id} value={user.id} primaryText={user.name} />;
    });

    let unitType = 'bottle';
    if (this.props.category === 'beer') { unitType = 'bottle'; }
    if (this.props.category === 'wine') { unitType = 'glass'; }
    if (this.props.category === 'shot') { unitType = 'shot'; }

    return (
      <div>
        <ListItem
          onClick={this.handleClick}
          rightIconButton={
            <RaisedButton label={buyButtonText} onClick={this.handleModalOpen} />
          }
        >
          <div>
            {this.props.drink.name} <span style={styles.faded}>({this.props.drink.abvFormatted} - {this.props.drink.priceFormatted}/{unitType})</span>
          </div>
        </ListItem>
        <Dialog
          title={this.props.drink.name}
          actions={[
            <FlatButton
              label="Cancel"
              onTouchTap={this.handleModalClose}
            />,
            <FlatButton
              label={buyConfirmText}
              primary={true}
              onTouchTap={this.handleOrder}
              disabled={buyConfirmDisabled}
            />
          ]}
          modal={false}
          open={this.state.modal}
          onRequestClose={this.handleModalClose}
        >
          <SelectField
            maxHeight={300}
            value={this.state.userId}
            onChange={this.handleUserSelect}
            floatingLabelText="Select Patron"
          >
            {users}
          </SelectField>
        </Dialog>
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

    const inStock = searched.filter((element) => {
      return (element.inStock === true);
    }).map((drink) => {
      return <Drink
        key={drink.id}
        category={this.state.category}
        drink={drink}
        Users={this.state.Users}
        openSnackbar={this.handleSnackbarOpen}>
      </Drink>;
    });

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
