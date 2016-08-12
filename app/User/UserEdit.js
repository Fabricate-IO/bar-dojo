import React from 'react';
import { hashHistory } from 'react-router';

import NetworkRequest from '../networkRequest';
import styles from '../styles';

import Avatar from 'material-ui/Avatar';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import SelectField from 'material-ui/SelectField';
import TextField from 'material-ui/TextField';


module.exports = React.createClass({
  getInitialState: function () {
    return {
      object: {},
    };
  },
  componentDidMount: function () {

    NetworkRequest('GET', '/api/User/' + this.props.params.id, (err, result) => {

      if (err) {
        return console.error('User API', status, err.toString());
      }

      this.setState({ object: result });
    });
  },
  handleSave: function (e) {

    e.preventDefault();
    const object = this.state.object;

    if (object.name == null) {
      return;
    }

    const user = {
      id: this.props.params.id,
      name: object.name.trim(),
      image: object.image,
      splitwiseId: object.splitwiseId,
      tab: object.tab,
    };

    this.setState({ object: {} });
    NetworkRequest('PUT', '/api/User/' + user.id, user, (err, result) => {

      if (err) {
        this.setState({ object: object });
        return console.error('User API', status, err.toString());
      }

      hashHistory.push('/users');
    });
  },
  handleInputChange: function (e) {
    const object = this.state.object;
    object[e.target.name] = e.target.value;
    this.setState({ object: object });
  },
  handleCancel: function () {
    hashHistory.push('/users');
  },
  handleDelete: function (e) {

    if (window.confirm("Are you sure you want to delete " + this.state.object.name + '?')) {

      NetworkRequest('DELETE', '/api/User/' + this.props.params.id, (err, result) => {

        if (err) {
          return console.error('User API', status, err.toString());
        }

        hashHistory.push('/users');
      });
    }
  },
  render: function () {

    return (
      <form onSubmit={this.handleSave}>
        <TextField
          name="name"
          floatingLabelText="Name"
          floatingLabelFixed={true}
          value={this.state.object.name}
          onChange={this.handleInputChange}
        />
        <br/>
        $<TextField
          name="tab"
          type="number"
          step="0.01"
          floatingLabelText="Tab"
          floatingLabelFixed={true}
          value={this.state.object.tab}
          onChange={this.handleInputChange}
        />
        <br/>
        { this.state.object.splitwiseId != null ?
          <div>Splitwise enabled<br/></div>
          : null
        }
        <RaisedButton label="Save" primary={true} type="submit" />
        <br/>
        <br/>
        <RaisedButton label="Cancel" onClick={this.handleCancel} />
        <br/>
        <br/>
        <RaisedButton label="Delete" secondary={true} onClick={this.handleDelete} />
      </form>
    );
  }
});
