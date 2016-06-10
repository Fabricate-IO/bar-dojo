import React from 'react';
import { hashHistory } from 'react-router';
import NetworkRequest from '../networkRequest';

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
    //   expanded = <RecipeExpanded recipe={this.props.recipe} />
    // }
    return (
      <ListItem
        onClick={this.handleClick}
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
    const stock = this.state.data.map((stock) => {
      return <Stock key={stock.id} stock={stock} onDelete={this.onDelete}></Stock>;
    });
    return (
      <List>
        {stock}
      </List>
    );
  },
});