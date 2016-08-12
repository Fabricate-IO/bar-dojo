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
      friends: [],
      object: {
        tab: 0,
      },
    };
  },
  componentDidMount: function () {

    NetworkRequest('GET', '/api/Friend', (err, result) => {

      if (err) {
        return console.error('Friend API', status, err.toString());
      }

      this.setState({ friends: result });
    });
  },
  componentWillReceiveProps: function (nextProps) {
    if (nextProps.doSubmit && !this.props.doSubmit) {
      this.handleSave({ preventDefault: () => { return; }});
    }
  },
  handleSave: function (e) {

    e.preventDefault();
    const object = this.state.object;

    if (object.name == null) {
      return;
    }

    const user = {
      name: object.name.trim(),
      image: object.image,
      splitwiseId: object.splitwiseId,
      tab: object.tab,
    };

    this.setState({ object: {} });
    NetworkRequest('POST', '/api/User', user, (err, result) => {

      if (this.props.callback != null) {
        return this.props.callback(err, result);
      }

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
  handleSplitwiseFriendChange: function (event, index, value) {
    const friend = this.state.friends.find((friend) => { return (friend.id === value); });
    this.state.object.splitwiseId = value;
    this.state.object.name = friend.name;
    this.state.object.image = friend.image;
    this.setState({ object: this.state.object });
  },
  handleCancel: function () {
    hashHistory.push('/users');
  },
  render: function () {

    const friends = this.state.friends.map((friend) => {
      return <MenuItem
        key={friend.id}
        value={friend.id}
        leftIcon={<Avatar src={friend.image} />}
        primaryText={friend.name}
      />;
    });

    let submittable = false;
    if (this.state.object.name != null && this.state.object.name.length >= 2) {
      submittable = true;
    }

    return (
      <form onSubmit={this.handleSave}>
        <SelectField
          value={this.state.object.splitwiseId}
          onChange={this.handleSplitwiseFriendChange}
          floatingLabelText="Splitwise Friend"
          style={styles.textInput}
        >
          {friends}
        </SelectField>
        &nbsp; - OR - &nbsp;
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
          floatingLabelText="Initial tab"
          floatingLabelFixed={true}
          value={this.state.object.tab}
          onChange={this.handleInputChange}
        />
        { this.props.callback != null ? null :
          <div>
            <br/>
            <RaisedButton label="Save" primary={true} type="submit" disabled={!submittable} />
            <br/>
            <br/>
            <RaisedButton label="Cancel" onClick={this.handleCancel} />
          </div>
        }
      </form>
    );
  }
});
