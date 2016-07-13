import React from 'react';
import { hashHistory } from 'react-router';

import NetworkRequest from '../networkRequest';
import style from '../styles';

import AutoComplete from 'material-ui/AutoComplete';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import RaisedButton from 'material-ui/RaisedButton';
import MenuItem from 'material-ui/MenuItem';
import SelectField from 'material-ui/SelectField';
import TextField from 'material-ui/TextField';


module.exports = React.createClass({
  getInitialState: function () {
    return {
      Stock: [],
      StockTypes: [],
      object: {},
    };
  },
  componentDidMount: function () {

    NetworkRequest('GET', '/api/StockModel?orderBy=name&order=asc', (err, StockModel) => {

      if (err) {
        return console.error('StockModel API', status, err.toString());
      }

      NetworkRequest('GET', '/api/BarStock', (err, BarStock) => {

        if (err) {
          return console.error('BarStock API', status, err.toString());
        }

        StockModel = StockModel.map((stockModel) => {
          stockModel.stockModelId = stockModel.id;
          return stockModel;
        })
        BarStock.forEach((stock) => {
          const model = StockModel.find((stockModel) => { return (stockModel.id === stock.stockModelId); });
          if (model != null) {
            model.barStockId = stock.id;
          }
        });
        this.setState({ Stock: StockModel });
      });
    });

    NetworkRequest('GET', '/api/StockType?orderBy=id&order=asc', (err, result) => {

      if (err) {
        return console.error('StockType API', status, err.toString());
      }

      this.setState({ StockTypes: result });
    });
  },
  handleSave: function (e) {

    e.preventDefault();
    const object = this.state.object;

    if (object.name == null) {
      return;
    }

    object.unitsStocked = (() => {
      let arr = [];
      for (let i = 0; i < object.quantity; i++) {
        arr.push(Number(object.volume));
      }
      return arr;
    })();

    const transaction = {
      type: 'restock',
      monetaryValue: object.monetaryValue,
      abv: object.abv,
      barId: 0, // TODO barId
      barStockId: object.barStockId,
      name: object.name,
      stockModelId: object.stockModelId,
      stockTypeId: object.stockTypeId,
      unitsStocked: object.unitsStocked,
    };
    let url = '/api/Transaction';
    let type = 'POST';

    this.setState({ object: {} });
    NetworkRequest(type, url, transaction, (err, result) => {

      if (err) {
        this.setState({ object: object });
        return console.error('Transaction API', status, err.toString());
      }

      hashHistory.push('/inventory');
    });
  },
  handleInputChange: function (e) {
    const object = this.state.object;
    object[e.target.name] = e.target.value;
    this.setState({ object: object });
  },
  handleNameChange: function (e) {
    const object = this.state.object;
    object.name = (e.target) ? e.target.value : e;
    const stock = this.state.Stock.find((stock) => { return (object.name === stock.name); });

    if (stock == null) {
      delete this.state.object.barStockId;
      delete this.state.object.stockModelId;
    }
    else {
      object.abv = stock.abv;
      object.barStockId = stock.barStockId;
      object.stockModelId = stock.stockModelId;
      object.stockTypeId = stock.stockTypeId;
      object.unitType = stock.unitType;
    }
    this.setState({ object: object });
  },
  handleStockTypeChange: function (event, index, value) {
    this.state.StockType = this.state.StockTypes[index];
    this.state.object.stockTypeId = this.state.StockType.id;
    this.setState(this.state);
  },
  handleVolumeShortcut: function (event) {
    this.state.object.volume = event.currentTarget.dataset.volume;
    this.setState({ object: this.state.object });
  },
  handleCancel: function () {
    hashHistory.push('/inventory');
  },
  render: function () {

    const StockTypeOptions = this.state.StockTypes.map((StockType) => {
      return <MenuItem key={StockType.id} value={StockType.id} primaryText={StockType.id} />;
    });
    const NameOptions = this.state.Stock.map((Stock) => {
      return Stock.name;
    });
    // const units = this.state.object.StockType.unitType || 'units';
    const units = 'Volume of each unit (TODO - unit)';

    return (
      <form onSubmit={this.handleSave}>
        <AutoComplete
          name="name"
          floatingLabelText="Name"
          floatingLabelFixed={true}
          filter={AutoComplete.fuzzyFilter}
          dataSource={NameOptions}
          value={this.state.object.name}
          onUpdateInput={this.handleNameChange}
          onNewRequest={this.handleNameChange}
          maxSearchResults={8}
          openOnFocus={true}
        />
        <SelectField
          value={this.state.object.stockTypeId}
          onChange={this.handleStockTypeChange}
          floatingLabelText="Stock Type"
          style={style.textInput}
        >
          {StockTypeOptions}
        </SelectField>
        <TextField
          name="abv"
          type="number"
          floatingLabelText='ABV % (0-100)'
          floatingLabelFixed={true}
          step={0.5}
          value={this.state.object.abv}
          onChange={this.handleInputChange}
          style={style.textInput}
        />
        <br/>
        <TextField
          name="quantity"
          type="number"
          floatingLabelText='Number of units purchased'
          floatingLabelFixed={true}
          value={this.state.object.quantity}
          onChange={this.handleInputChange}
          style={style.textInput}
        />
        <TextField
          name="volume"
          type="number"
          floatingLabelText={units}
          floatingLabelFixed={true}
          value={this.state.object.volume}
          onChange={this.handleInputChange}
          style={style.textInput}
        />
        <br/>
        <div>
          Shortcuts:
          <FlatButton label="1.75L (handle)" onClick={this.handleVolumeShortcut} data-volume="1750" />
          <FlatButton label="750ml (fifth)" onClick={this.handleVolumeShortcut} data-volume="750" />
          <FlatButton label="375ml (pint)" onClick={this.handleVolumeShortcut} data-volume="375" />
          <FlatButton label="355ml (12oz beer bottle)" onClick={this.handleVolumeShortcut} data-volume="355" />
          <FlatButton label="330ml (11.2oz beer bottle)" onClick={this.handleVolumeShortcut} data-volume="330" />
        </div>
        <TextField
          name="monetaryValue"
          type="number"
          floatingLabelText="Purchase cost ($, pre-tax)"
          floatingLabelFixed={true}
          value={this.state.object.monetaryValue}
          onChange={this.handleInputChange}
          style={style.textInput}
        />
        <br/>
        <RaisedButton label="Add Inventory" primary={true} type="submit" />
        <br/>
        <RaisedButton label="Cancel" onClick={this.handleCancel} />
      </form>
    );
  }
});