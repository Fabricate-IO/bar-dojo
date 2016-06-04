import React from 'react';
import { hashHistory } from 'react-router';


module.exports = React.createClass({
  getInitialState: function () {
    return {
      object: {},
    };
  },
  componentDidMount: function () {
    $.ajax({
      url: '/api/Recipe/' + this.props.params.id,
      type: 'GET',
      success: function (data) {
        this.setState({ object: data });
      }.bind(this),
      error: function (xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this),
    });
  },
  handlePut: function (e) {
    e.preventDefault();
    var object = this.state.object;
    var recipe = {
      id: this.props.params.id,
      name: object.name.trim(),
    };
    if (!recipe.name) {
      return;
    }
    this.setState({ object: {} });
    $.ajax({
      url: '/api/Recipe/' + recipe.id,
      dataType: 'json',
      type: 'PUT',
      data: recipe,
      success: function (data) {
        // already updated state, we're good to go
        hashHistory.push('/');
      }.bind(this),
      error: function (xhr, status, err) {
        this.setState({ object: object });
        console.error(this.props.url, status, err.toString());
      }.bind(this),
    });
  },
  handleInputChange: function (e) {
    var object = this.state.object;
    object[e.target.name] = e.target.value;
    this.setState({ object: object });
  },
  render: function () {
    return (
      <form onSubmit={this.handlePut}>
        <input
          type="text"
          name="name"
          placeholder="Drink name"
          value={this.state.object.name}
          onChange={this.handleInputChange}
        />
        <input type="submit" value="Edit" />
      </form>
    );
  }
});