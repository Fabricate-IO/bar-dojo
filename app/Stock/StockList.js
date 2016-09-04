import React from 'react';
import { hashHistory } from 'react-router';

import NetworkRequest from '../networkRequest';
import styles from '../styles';
import utils from '../utils';

import { List, ListItem } from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';
import IconButton from 'material-ui/IconButton';
import IconEdit from 'material-ui/svg-icons/editor/mode-edit';


const StockExpanded = React.createClass({
  render: function () {

    const stock = this.props.stock;
    const volumeCost = utils.formatPrice(stock.volumeCost);

    return (
      <div style={styles.expanded}>
        <div>{stock.abv}% ABV</div>
        <div>{stock.volumeAvailable} {stock.unitType} (incl {stock.remainingUnits.length} full bottles) remaining</div>
        <div>{volumeCost} per {stock.unitType}</div>
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
  // handleEdit: function () {
  //   hashHistory.push('/inventory/edit/' + this.props.stock.id);
  // },
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
          // rightIconButton={
          //   <div>
          //     <IconButton onClick={this.handleEdit}><IconEdit /></IconButton>
          //   </div>
          // }
        >
          <div>
            {this.props.stock.name} <span style={styles.faded}>({this.props.stock.stockTypeId})</span>
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
      StockTypes: [],
    };
  },
  componentWillMount: function () {

    NetworkRequest('GET', '/api/StockType', (err, result) => {

      if (err) {
        return console.error('StockType API', status, err.toString());
      }

      this.setState({ StockTypes: result });

      NetworkRequest('GET', '/api/BarStock?orderBy=name&order=asc', (err, result) => {

        if (err) {
          return console.error('BarStock API', status, err.toString());
        }

        const stock = result.map((stock) => {
          stock.stockType = this.state.StockTypes.find((StockType) => { return StockType.id === stock.stockTypeId; });
          return stock;
        // NOTE: sorting here b/c rethink doesn't currently support case-agnostic sort / search
        }).sort((a, b) => { // ascending, by name, ignore case
          a = a.name.toLowerCase();
          b = b.name.toLowerCase();
          if (a < b) { return -1; }
          if (b < a) { return 1; }
          return 0;
        });

        this.setState({ data: stock });
      });
    });
  },
  render: function () {

    const searched = this.state.data.filter((element) => {
      return utils.search(this.props.search, [element.name, element.stockTypeId]);
    });

    const stockInStock = searched.filter((element) => {
      return (element.inStock === true);
    }).map((stock) => {
      return <Stock key={stock.id} stock={stock}></Stock>;
    });
    const stockOutOfStock = searched.filter((element) => {
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