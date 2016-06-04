import React from 'react';
import { hashHistory } from 'react-router';
import RaisedButton from 'material-ui/RaisedButton';


var Recipe = React.createClass({
  handleDelete: function () {
    this.props.onDelete(this.props.recipe.id);
  },
  handleEdit: function () {
    hashHistory.push('/edit/' + this.props.recipe.id);
  },
  render: function () {
    return (
      <li className="recipe">
        <h2>
          {this.props.recipe.name}
        </h2>
        <RaisedButton className="edit" onClick={this.handleEdit}>EDIT</RaisedButton>
        <RaisedButton className="delete" onClick={this.handleDelete}>X</RaisedButton>
        {this.props.children}
      </li>
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
      <ul>
        {recipes}
      </ul>
    );
  },
});