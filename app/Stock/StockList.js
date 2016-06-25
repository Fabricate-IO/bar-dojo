import React from 'react';
import { hashHistory } from 'react-router';
import NetworkRequest from '../networkRequest';

import styles from '../styles';

import { List, ListItem } from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';
import IconButton from 'material-ui/IconButton';
import IconDelete from 'material-ui/svg-icons/action/delete';
import IconEdit from 'material-ui/svg-icons/editor/mode-edit';


const Stock = React.createClass({
  getInitialState: function () {
    return {
      expanded: false,
    };
  },
  handleClick: function () {
    this.setState({ expanded: !this.state.expanded });
  },
  handleDelete: function (e) {
    e.preventDefault();
    if (window.confirm("Are you sure you want to delete " + this.props.stock.name + '?')) {
      this.props.onDelete(this.props.stock.id);
    }
  },
  handleEdit: function () {
    hashHistory.push('/inventory/edit/' + this.props.stock.id);
  },
  render: function () {

    let expanded = '';
// TODO
    // if (this.state.expanded) {
    //   expanded = <StockExpanded stock={this.props.stock} />
    // }
    let style = {};
    if (this.props.stock.inStock === false) {
      style = styles.outOfStock;
    }

    return (
      <ListItem
        onClick={this.handleClick}
        style={style}
        rightIconButton={
          <div>
            <IconButton onClick={this.handleEdit}><IconEdit /></IconButton>
            <IconButton onClick={this.handleDelete}><IconDelete /></IconButton>
          </div>
        }
      >
        <div>
          {this.props.stock.name}
        </div>
        {expanded}
      </ListItem>
    );
  },
});

module.exports = React.createClass({
  getInitialState: function () {
    return {
      data: [],
    };
  },
  componentDidMount: function () {
    NetworkRequest('GET', '/api/Stock?orderBy=name', (err, result) => {

      if (err) {
        return console.error('Stock API', status, err.toString());
      }

      this.setState({ data: result });
    });
  },
  onDelete: function (id) {
    const data = this.state.data;
    const newData = data.filter((stock) => { return stock.id !== id; });
    this.setState({ data: newData });
    NetworkRequest('DELETE', '/api/Stock/' + id, (err, result) => {
      if (err) {
        this.setState({ data: data });
        return console.error('Stock API', status, err.toString());
      }
    });
  },
  render: function () {
    const stockInStock = this.state.data.filter((element) => {
      return (element.inStock === true);
    }).map((stock) => {
      return <Stock key={stock.id} stock={stock} onDelete={this.onDelete}></Stock>;
    });
    const stockOutOfStock = this.state.data.filter((element) => {
      return (element.inStock === false);
    }).map((stock) => {
      return <Stock key={stock.id} stock={stock} onDelete={this.onDelete}></Stock>;
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