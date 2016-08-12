import React from 'react';
import { hashHistory } from 'react-router';

import NetworkRequest from './networkRequest';
import styles from './styles';
import utils from './utils';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import MenuItem from 'material-ui/MenuItem';
import SelectField from 'material-ui/SelectField';

import UserAdd from './User/UserAdd';


module.exports = React.createClass({
  getInitialState: function () {
    return {
      userId: null,
      newUser: false,
      doSubmitUser: false,
    };
  },
  handleOrder: function () {

    if (this.state.newUser && !this.state.doSubmitUser) {
      return this.setState({ doSubmitUser: true });
    }

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
    this.setState({
      newUser: (value === -1),
      userId: value,
    });
  },
  handleUserAdded: function (err, result) {

    if (err) {
      return console.error(err);
    }

    this.setState({ newUser: result, userId: result.id });
    this.handleOrder();
  },
  render: function () {

    let buyConfirmText = 'Please select a patron to charge';
    const buyConfirmDisabled = (this.state.userId == null);
    if (buyConfirmDisabled === false) {
      const name = (this.state.newUser) ? 'New User' : this.props.Users.find((user) => { return (user.id === this.state.userId); }).name;
      buyConfirmText = 'Charge ' + name + ' ' + this.props.drink.priceFormatted;
    }
    let users = this.props.Users;
    users.push({
      id: -1,
      name: '+ Add New User',
    });
    users = users.map((user) => {
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
        { this.state.newUser ? <UserAdd doSubmit={this.state.doSubmitUser} callback={this.handleUserAdded} /> : null }
      </Dialog>
    );
  },
});