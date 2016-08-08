import React from 'react';
import { hashHistory } from 'react-router';

import NetworkRequest from './networkRequest';
import styles from './styles';
import utils from './utils';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import MenuItem from 'material-ui/MenuItem';
import SelectField from 'material-ui/SelectField';


module.exports = React.createClass({
  getInitialState: function () {
    return {
      userId: null,
    };
  },
  handleOrder: function () {

    const data = {
      abv: this.props.drink.abv,
      ingredients: this.props.ingredients,
      monetaryValue: this.props.drink.price,
    };

    if (this.props.category === 'mixed') {
      data.recipeId = this.props.drink.id;
    }

    NetworkRequest('POST', '/api/User/' + this.state.userId + '/order', data, (err, result) => {

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
      return <MenuItem key={user.id} value={user.id} primaryText={user.name} />;
    });

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