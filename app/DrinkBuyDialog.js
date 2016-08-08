import React from 'react';
import { hashHistory } from 'react-router';

import NetworkRequest from './networkRequest';
import styles from './styles';
import utils from './utils';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import MenuItem from 'material-ui/MenuItem';
import SelectField from 'material-ui/SelectField';


// Taken from DrinkList

// TOOD make compatible with recipe ordering as well

module.exports = React.createClass({
  getInitialState: function () {
    return {
      userId: null,
    };
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

      this.setState({ userId: null });
      this.props.handleDialogClose();
      this.props.openSnackbar(this.props.drink.name + ' purchased for ' + this.props.drink.priceFormatted);
    });
  },
  handleUserSelect: function (event, index, value) {
    event.preventDefault();
    this.setState({ userId: value });
  },
  render: function () {

    let buyConfirmText = 'Please select a patron to charge';
    const buyConfirmDisabled = (this.state.userId == null);
    if (buyConfirmDisabled === false) {
      buyConfirmText = 'Charge ' + this.props.Users.find((user) => { return (user.id === this.state.userId); }).name + ' ' + this.props.drink.priceFormatted;
    }
    const users = this.props.Users.map((user) => {
console.log(user)
      return <MenuItem key={user.id} value={user.id} primaryText={user.name} />;
    });

    let unitType = 'bottle';
    if (this.props.category === 'beer') { unitType = 'bottle'; }
    if (this.props.category === 'wine') { unitType = 'glass'; }
    if (this.props.category === 'shot') { unitType = 'shot'; }

    return (
      <Dialog
        title={this.props.drink.name}
        actions={[
          <FlatButton
            label="Cancel"
            onTouchTap={this.props.handleDialogClose}
          />,
          <FlatButton
            label={buyConfirmText}
            primary={true}
            onTouchTap={this.handleOrder}
            disabled={buyConfirmDisabled}
          />
        ]}
        modal={false}
        open={this.props.visible}
        onRequestClose={this.props.handleDialogClose}
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
    );
  },
});