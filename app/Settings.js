import React from 'react';
import { hashHistory } from 'react-router';

import NetworkRequest from './networkRequest';
import styles from './styles';
import utils from './utils';

import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import SelectField from 'material-ui/SelectField';


module.exports = React.createClass({
  getInitialState: function () {
    return {
      Bar: {
        settings: {},
      },
    };
  },
  componentDidMount: function () {
// TODO how do we know what our bar id is?
    NetworkRequest('GET', '/api/Bar', (err, result) => {

      if (err) {
        return console.error('Bar API', status, err.toString());
      }
// TODO this is temporary until we select the actual right bar
      result = result[0];

      result.settings = result.settings || {};

      this.setState({ Bar: result });
console.log(this.state.Bar);
    });
  },
  handleCancel: function () {
    hashHistory.push('/mixed');
  },
  handleSave: function (e) {

    e.preventDefault();
    const Bar = this.state.Bar;

    // if (object.name == null) {
    //   return;
    // }

    // const user = {
    //   id: this.props.params.id,
    //   name: object.name.trim(),
    //   image: object.image,
    //   splitwiseId: object.splitwiseId,
    //   tab: object.tab,
    // };
    // let url = '/api/User';
    // let type = 'POST';

    // if (!this.state.creating) { // if we were passed an ID, we're saving instead of creating
    //   url += '/' + user.id;
    //   type = 'PUT';
    // }

    // this.setState({ object: {} });
    // NetworkRequest(type, url, user, (err, result) => {

    //   if (err) {
    //     this.setState({ object: object });
    //     return console.error('User API', status, err.toString());
    //   }

    //   hashHistory.push('/users');
    // });
  },
  handleUnitSystemChange: function (event, index, value) {
    // const friend = this.state.friends.find((friend) => { return (friend.id === value); });
    // this.state.object.splitwiseId = value;
    this.state.Bar.settings.unitSystem = value;
console.log(this.state.Bar);
    this.setState({ Bar: this.state.Bar });
  },
  render: function () {
    return (
      <form onSubmit={this.handleSave}>
        <SelectField
          value={this.state.Bar.unitSystem}
          onChange={this.handleUnitSystemChange}
          floatingLabelText="Unit System"
          style={styles.textInput}
        >
          <MenuItem value='common' primaryText='Common' />
          <MenuItem value='metric' primaryText='Metric' />
          <MenuItem value='imperial' primaryText='Imperial' />
        </SelectField>
        <br/>
        <RaisedButton label="Save" primary={true} type="submit" />
        <br/>
        <RaisedButton label="Cancel" onClick={this.handleCancel} />
      </form>
    );
  },
});
