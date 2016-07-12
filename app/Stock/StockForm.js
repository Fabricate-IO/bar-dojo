import React from 'react';
import { hashHistory } from 'react-router';
import NetworkRequest from '../networkRequest';
import style from '../styles';

import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import RaisedButton from 'material-ui/RaisedButton';
import MenuItem from 'material-ui/MenuItem';
import SelectField from 'material-ui/SelectField';
import TextField from 'material-ui/TextField';


module.exports = React.createClass({
  getInitialState: function () {
    return {
      creating: (this.props.params.id == null), // if creating from scratch (otherwise saving)
      StockTypes: [],
      StockType: {},
      object: {},
    };
  },
  componentDidMount: function () {

    if (!this.state.creating) {

      NetworkRequest('GET', '/api/BarStock/' + this.props.params.id, (err, result) => {

        if (err) {
          return console.error('BarStock API', status, err.toString());
        }

        this.setState({ StockType: this.state.StockTypes.find((StockType) => { return StockType.id === result.stockTypeId; }) || {} });
        this.setState({ object: result });
      });
    }
    else {

      NetworkRequest('GET', '/api/StockType?orderBy=id&order=asc', (err, result) => {

        if (err) {
          return console.error('StockType API', status, err.toString());
        }

        this.setState({ StockTypes: result });
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
      stockTypeId: object.stockTypeId,
      initialQuantity: object.initialQuantity,
      initialCost: object.initialCost,
      remainingQuantity: object.remainingQuantity,
    };
    let url = '/api/Stock';
    let type = 'POST';

    if (!this.state.creating) { // if we were passed an ID, we're saving instead of creating
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

    if (this.state.creating) {
      if (e.target.name === 'initialQuantity') { // remainingQuantity = initial
        object.remainingQuantity = e.target.value;
      }
    }

    this.setState({ object: object });
  },
  handleStockTypeChange: function (event, index, value) {
    this.state.StockType = this.state.StockTypes[index];
    this.state.object.stockTypeId = this.state.StockType.id;
    this.setState(this.state);
  },
  handleQuantityShortcut: function (event) {
// TODO hardcoded ML to OZ conversion, should use bar settings
    const quantity = Math.round(event.currentTarget.dataset.quantity * 0.0338);

    this.state.object.initialQuantity = quantity;
    this.state.object.remainingQuantity = quantity;
    this.setState({ object: this.state.object });
  },
  handleCancel: function () {
    hashHistory.push('/inventory');
  },
  handleDelete: function (e) {

    if (window.confirm("Are you sure you want to delete " + this.state.object.name + '?')) {

      NetworkRequest('DELETE', '/api/Stock/' + this.props.params.id, (err, result) => {

        if (err) {
          return console.error('Stock API', status, err.toString());
        }

        hashHistory.push('/inventory');
      });
    }
  },
  render: function () {

    const options = this.state.StockTypes.map((StockType) => {
      return <MenuItem key={StockType.id} value={StockType.id} primaryText={StockType.id} />;
    });
    const units = this.state.StockType.unitType || 'units';
    const initialUnits = 'Initial ' + units;
    const remainingUnits = 'Remaining ' + units;

    return (
      <form onSubmit={this.handleSave}>
        <TextField
          name="name"
          floatingLabelText="Name"
          floatingLabelFixed={true}
          value={this.state.object.name}
          onChange={this.handleInputChange}
        />
        <SelectField
          value={this.state.object.stockTypeId}
          onChange={this.handleStockTypeChange}
          floatingLabelText="Stock Type"
          style={style.textInput}
        >
          {options}
        </SelectField>
        <br/>
        <TextField
          name="initialQuantity"
          type="number"
          floatingLabelText={initialUnits}
          floatingLabelFixed={true}
          value={this.state.object.initialQuantity}
          onChange={this.handleInputChange}
          style={style.textInput}
        />
        <TextField
          name="remainingQuantity"
          type="number"
          floatingLabelText={remainingUnits}
          floatingLabelFixed={true}
          value={this.state.object.remainingQuantity}
          onChange={this.handleInputChange}
          style={style.textInput}
        />
        <br/>
        { this.state.creating ?
          <div>
            Shortcuts:
            <FlatButton label="1.5L" onClick={this.handleQuantityShortcut} data-quantity="1500" />
            <FlatButton label="750ml" onClick={this.handleQuantityShortcut} data-quantity="750" />
            <FlatButton label="375ml" onClick={this.handleQuantityShortcut} data-quantity="375" />
          </div>
          : null
        }
        <TextField
          name="initialCost"
          type="number"
          floatingLabelText="Purchase cost ($, pre-tax)"
          floatingLabelFixed={true}
          value={this.state.object.initialCost}
          onChange={this.handleInputChange}
          style={style.textInput}
        />
        <br/>
        <RaisedButton label="Save" primary={true} type="submit" />
        <br/>
        <RaisedButton label="Cancel" onClick={this.handleCancel} />
        <br/>
        { this.state.creating ? null : <RaisedButton label="Delete" secondary={true} onClick={this.handleDelete} /> }
      </form>
    );
  }
});