import React from 'react';
import { hashHistory } from 'react-router';
import NetworkRequest from '../networkRequest';
import style from '../styles';

import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import IconDelete from 'material-ui/svg-icons/action/delete';


module.exports = React.createClass({
  getInitialState: function () {
    return {
      StockType: [],
      object: {},
    };
  },
  componentWillMount: function () {
    NetworkRequest('GET', '/api/StockType?orderBy=name', (err, result) => {

      if (err) {
        return console.error('StockType API', status, err.toString());
      }

      this.setState({ StockType: result });
    });
  },
  componentDidMount: function () {
    if (this.props.params.id != null) {

      NetworkRequest('GET', '/api/Stock/' + this.props.params.id, (err, result) => {

        if (err) {
          return console.error('Stock API', status, err.toString());
        }

        this.setState({ object: result });
      });
    }
  },
  handleSave: function (e) {
    e.preventDefault();
    const object = this.state.object;
    if (object.name == null) {
      return;
    }
    const stock = {
      id: this.props.params.id,
      name: object.name.trim(),
    };

    let url = '/api/Stock';
    let type = 'POST';
    if (stock.id != null) { // if we were given an ID, we're saving instead of creating
      url += '/' + stock.id;
      type = 'PUT';
    }
    this.setState({ object: {} });
    NetworkRequest(type, url, stock, (err, result) => {
      if (err) {
        this.setState({ object: object });
        return console.error('Stock API', status, err.toString());
      }
      hashHistory.push('/inventory');
    });
  },
  handleInputChange: function (e) {
    const object = this.state.object;
    object[e.target.name] = e.target.value;
    this.setState({ object: object });
  },
  handleCancel: function () {
    hashHistory.push('/inventory');
  },
  render: function () {
    return (
      <form onSubmit={this.handleSave}>
        <TextField
          name="name"
          floatingLabelText="Name"
          floatingLabelFixed={true}
          value={this.state.object.name}
          onChange={this.handleInputChange}
        />
        <br/>
        <RaisedButton label="Cancel" onClick={this.handleCancel} />
        <RaisedButton label="Save" type="submit" />
      </form>
    );
  }
});