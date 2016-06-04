import React from 'react';
import { hashHistory } from 'react-router';
import RaisedButton from 'material-ui/RaisedButton';

module.exports = React.createClass({
  getInitialState: function () {
    return {
      object: {},
    };
  },
  handlePost: function (e) {
    e.preventDefault();
    var object = this.state.object;
    var recipe = {
      name: object.name.trim(),
    };
    if (!recipe.name) {
      return;
    }
    this.setState({ object: {} });
    $.ajax({
      url: '/api/Recipe',
      dataType: 'json',
      type: 'POST',
      data: recipe,
      success: function (data) {
        // already updated state, we're good to go
        hashHistory.push('/');
      }.bind(this),
      error: function (xhr, status, err) {
        this.setState({ object: state });
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
      <form onSubmit={this.handlePost}>
        <input
          type="text"
          name="name"
          placeholder="Drink name"
          value={this.state.object.name}
          onChange={this.handleInputChange}
        />
        <RaisedButton label="Add" type="submit" />
      </form>
    );
  }
});