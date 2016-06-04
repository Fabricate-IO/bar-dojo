import React from 'react';
import { hashHistory } from 'react-router';
import { List, ListItem } from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import IconButton from 'material-ui/IconButton';
import IconDelete from 'material-ui/svg-icons/action/delete';
import IconEdit from 'material-ui/svg-icons/editor/mode-edit';


const Recipe = React.createClass({
  handleDelete: function () {
    this.props.onDelete(this.props.recipe.id);
  },
  handleEdit: function () {
    hashHistory.push('/drinks/edit/' + this.props.recipe.id);
  },
  render: function () {
    return (
      <ListItem
        primaryText={this.props.recipe.name}
        rightIconButton={
          <div>
            <IconButton onClick={this.handleEdit}><IconEdit /></IconButton>
            <IconButton onClick={this.handleDelete}><IconDelete /></IconButton>
          </div>
        }
      />
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
    $.ajax({
      url: '/api/Recipe',
      type: 'GET',
      success: function (data) {
        this.setState({data: data});
      }.bind(this),
      error: function (xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this),
    });
  },
  onDelete: function (id) {
    var data = this.state.data;
    var newData = data.filter((recipe) => { return recipe.id !== id; });
    this.setState({ data: newData });
    $.ajax({
      url: '/api/Recipe/' + id,
      type: 'DELETE',
      error: function (xhr, status, err) {
        console.error(this.props.url, status, err.toString());
        this.setState({data: data});
      }.bind(this),
    });
  },
  render: function () {
    var recipes = this.state.data.map((recipe) => {
      return <Recipe key={recipe.id} recipe={recipe} onDelete={this.onDelete}></Recipe>;
    });
    return (
      <List>
        <Subheader>Available drinks</Subheader>
        {recipes}
        <Subheader>Out of stock</Subheader>
      </List>
    );
  },
});