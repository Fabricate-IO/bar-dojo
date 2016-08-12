import React from 'react';
import Async from 'async';
import { hashHistory } from 'react-router';

import NetworkRequest from './networkRequest';
import styles from './styles';
import utils from './utils';

import FlatButton from 'material-ui/FlatButton';
import { List, ListItem } from 'material-ui/List';
import RaisedButton from 'material-ui/RaisedButton';
import SelectField from 'material-ui/SelectField';


const OrderTransaction = React.createClass({
  getInitialState: function () {
    return {
      ingredients: [],
      Recipe: null,
      User: {},
    };
  },
  componentWillMount: function () {

    const transaction = this.props.transaction;

    NetworkRequest('GET', '/api/User/' + transaction.userId, (err, result) => {

      if (err) {
        return console.error('User API', status, err.toString());
      }

      this.setState({ User: result });
    });

    if (transaction.recipeId != null) {

      NetworkRequest('GET', '/api/Recipe/' + transaction.recipeId, (err, result) => {

        if (err) {
          return console.error('Recipe API', status, err.toString());
        }

        this.setState({ Recipe: result });
      });
    }
    else {

      Async.map(transaction.ingredients, (ingredient, callback) => {
        NetworkRequest('GET', '/api/BarStock/' + ingredient.barStockId, callback);
      }, (err, result) => {

        if (err) {
          return console.error('BarStock API', status, err.toString());
        }

        this.setState({ ingredients: result });
      })
    }
  },
  render: function () {

    const transaction = this.props.transaction;
    let name;
    if (this.state.Recipe != null) {
      name = this.state.Recipe.name;
    }
    else if ([1, 2].indexOf(transaction.ingredients.length) !== -1) {
      name = (this.state.ingredients[0] || {}).name;
      if (transaction.ingredients.length === 2) {
        name += ' & ' + (this.state.ingredients[1] || {}).name;
      }
    }
    else {
      name = 'custom drink';
    }
    const primaryText = this.state.User.name + ' ordered a ' + name;

    return (
      <ListItem
        primaryText={primaryText}
        secondaryText={transaction.monetaryValueFormatted}
      />
    );
  },
});


const RestockTransaction = React.createClass({
  render: function () {
    const transaction = this.props.transaction;
    const primaryText = "Restocked " + transaction.name;
    return (
      <ListItem
        primaryText={primaryText}
        secondaryText={transaction.monetaryValueFormatted}
      />
    );
  },
});


const SettleTransaction = React.createClass({
  getInitialState: function () {
    return {
      User: {},
    };
  },
  componentWillMount: function () {

    NetworkRequest('GET', '/api/User/' + this.props.transaction.userId, (err, result) => {

      if (err) {
        return console.error('User API', status, err.toString());
      }

      this.setState({ User: result });
    });
  },
  render: function () {
    const transaction = this.props.transaction;
    const primaryText = this.state.User.name + ' settled via ' + transaction.settlementPlatform;
    return (
      <ListItem
        primaryText={primaryText}
        secondaryText={transaction.monetaryValueFormatted}
      />
    );
  },
});


const Transaction = React.createClass({
  render: function () {
    switch (this.props.transaction.type) {
      case 'order': return <OrderTransaction transaction={this.props.transaction}/>; break;
      case 'restock': return <RestockTransaction transaction={this.props.transaction}/>; break;
      case 'settle': return <SettleTransaction transaction={this.props.transaction}/>; break;
      default: return <ListItem>TODO {this.props.transaction.type}</ListItem>; break;
    }
  },
});


module.exports = React.createClass({
  getInitialState: function () {
    return {
      Transactions: [],
    };
  },
  componentDidMount: function () {

    NetworkRequest('GET', '/api/Transaction', (err, result) => {

      if (err) {
        return console.error('Transaction API', status, err.toString());
      }

      result = result.map((transaction) => {
        transaction.monetaryValueFormatted = utils.formatPrice(transaction.monetaryValue);
        return transaction;
      });

      this.setState({ Transactions: result });
    });
  },
  render: function () {

    const searched = this.state.Transactions.filter((element) => {
      return utils.search(this.props.search, [element.name]);
    });

    const transactions = searched.map((transaction) => {
      return <Transaction
        key={transaction.id}
        transaction={transaction}
      />;
    });

    return (
      <div>
        <List>
          {transactions}
        </List>
      </div>
    );
  },
});
