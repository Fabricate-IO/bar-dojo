import React from 'react';
import { hashHistory } from 'react-router';

import NetworkRequest from './networkRequest';
import styles from './styles';
import utils from './utils';


module.exports = React.createClass({
  getInitialState: function () {
    return {};
  },
  componentDidMount: function () {
// // TODO how do we know what our bar id is?
//     NetworkRequest('GET', '/api/Bar', (err, result) => {

//       if (err) {
//         return console.error('Bar API', status, err.toString());
//       }
// // TODO this is temporary until we select the actual right bar
//       result = result[0];

//       result.settings = result.settings || {};

//       this.setState({ Bar: result });
// console.log(this.state.Bar);
//     });
  },
  render: function () {
    return (
      <div>
        TODO: analytics
        When the bar was founded
        How many drinks enjoyed, how many patrons served
      </div>
    );
  },
});
