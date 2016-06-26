import React from 'react';
import { hashHistory } from 'react-router';
import NetworkRequest from '../networkRequest';

import styles from '../styles';

import { List, ListItem } from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';
import IconButton from 'material-ui/IconButton';
import IconEdit from 'material-ui/svg-icons/editor/mode-edit';


const StockExpanded = React.createClass({
  render: function () {

    const stock = this.props.stock;

    return (
      <div style={styles.expanded}>
        <h1>{stock.stockTypeId}</h1>
        <div>{stock.remainingQuantity} {stock.stockType.unitType} remaining (out of {stock.initialQuantity} {stock.stockType.unitType})</div>
        <div>${stock.unitCost} per {stock.stockType.unitType} (initial cost: ${stock.afterTaxCost})</div>
      </div>
    );
  },
});


const Stock = React.createClass({
  getInitialState: function () {
    return {
      expanded: false,
    };
  },
  handleClick: function () {
    this.setState({ expanded: !this.state.expanded });
  },
  handleEdit: function () {
    hashHistory.push('/inventory/edit/' + this.props.stock.id);
  },
  render: function () {

    let expanded = '';
    if (this.state.expanded) {
      expanded = <StockExpanded stock={this.props.stock} />
    }
    let style = {};
    if (this.props.stock.inStock === false) {
      style = styles.outOfStock;
    }

    return (
      <div>
        <ListItem
          onClick={this.handleClick}
          style={style}
          rightIconButton={
            <div>
              <IconButton onClick={this.handleEdit}><IconEdit /></IconButton>
            </div>
          }
        >
          <div>
            {this.props.stock.name}
          </div>
        </ListItem>
        {expanded}
      </div>
    );
  },
});

module.exports = React.createClass({
  getInitialState: function () {
    return {
      data: [],
    };
  },
  componentWillMount: function () {

    NetworkRequest('GET', '/api/StockType?orderBy=name', (err, result) => {

      if (err) {
        return console.error('StockType API', status, err.toString());
      }

      this.setState({ StockTypes: result });
    });
  },
  componentDidMount: function () {

    NetworkRequest('GET', '/api/Stock?orderBy=name', (err, result) => {

      if (err) {
        return console.error('Stock API', status, err.toString());
      }

      const stock = result.map((stock) => {
        stock.stockType = this.state.StockTypes.find((StockType) => { return StockType.id === stock.stockTypeId; });
        return stock;
      });

      this.setState({ data: stock });
    });
  },
  render: function () {

    const stockInStock = this.state.data.filter((element) => {
      return (element.inStock === true);
    }).map((stock) => {
      return <Stock key={stock.id} stock={stock}></Stock>;
    });
    const stockOutOfStock = this.state.data.filter((element) => {
      return (element.inStock === false);
    }).map((stock) => {
      return <Stock key={stock.id} stock={stock}></Stock>;
    });

    return (
      <List>
        {stockInStock}
        <Divider />
        <Subheader>Out of stock</Subheader>
        <Divider />
        {stockOutOfStock}
      </List>
    );
  },
});