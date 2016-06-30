import React from 'react';
import { hashHistory } from 'react-router';
import NetworkRequest from '../networkRequest';

import styles from '../styles';

import { List, ListItem } from 'material-ui/List';
import IconButton from 'material-ui/IconButton';
import IconEdit from 'material-ui/svg-icons/editor/mode-edit';


const Patron = React.createClass({
  getInitialState: function () {
    return {};
  },
  handleEdit: function () {
    hashHistory.push('/patrons/edit/' + this.props.patron.id);
  },
  render: function () {

    let expanded = '';

    return (
      <div>
        <ListItem
          rightIconButton={
            <div>
              <IconButton onClick={this.handleEdit}><IconEdit /></IconButton>
            </div>
          }
        >
          <div>
            {this.props.patron.name} - ${this.props.patron.tab}
          </div>
        </ListItem>
        {expanded}
      </div>
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

    NetworkRequest('GET', '/api/Patron?orderBy=name', (err, result) => {

      if (err) {
        return console.error('Patron API', status, err.toString());
      }

      this.setState({ data: result });
    });
  },
  render: function () {

    const patrons = this.state.data.map((patron) => {
      return <Patron key={patron.id} patron={patron}></Patron>;
    });

    return (
      <List>
        {patrons}
      </List>
    );
  },
});