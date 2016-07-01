import React from 'react';
import { hashHistory } from 'react-router';
import NetworkRequest from '../networkRequest';

import styles from '../styles';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import IconEdit from 'material-ui/svg-icons/editor/mode-edit';
import { List, ListItem } from 'material-ui/List';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import SelectField from 'material-ui/SelectField';


const Patron = React.createClass({
  getInitialState: function () {
    return {
      open: false,
      settleType: (this.props.patron.splitwiseId != null) ? 'splitwise' : 'cash',
    };
  },
  handleOpen: function () {
    this.setState({ open: true });
  },
  handleClose: function () {
    this.setState({ open: false });
  },
  handleEdit: function () {
    hashHistory.push('/patrons/edit/' + this.props.patron.id);
  },
  handleSettleSelect: function (event, index, value) {
    this.setState({ settleType: value });
  },
  handleSettle: function () {

    NetworkRequest('POST', '/api/Patron/' + this.props.patron.id + '/settle',
      { type: this.state.settleType },
      (err, result) => {

      if (err) {
        return console.error('Patron API', status, err.toString());
      }

      this.setState({ open: false });
    });
  },
  render: function () {

    let expanded = '';
    let settleOptions = [
      <MenuItem key='0' value='cash' primaryText='Cash' />
    ];
    if (this.props.patron.splitwiseId != null) {
      settleOptions.push(<MenuItem key='1' value='splitwise' primaryText='Splitwise' />);
    }
    const modalTitle = 'Settle with ' + this.props.patron.name + ' - $' + this.props.patron.tab;

    return (
      <div>
        <ListItem
          rightIconButton={
            <div>
              <RaisedButton label="Settle" onClick={this.handleOpen} />
              <IconButton onClick={this.handleEdit}><IconEdit /></IconButton>
            </div>
          }
        >
          <div>
            {this.props.patron.name} - ${this.props.patron.tab}
          </div>
        </ListItem>
        {expanded}
        <Dialog
          title={modalTitle}
          actions={[
            <FlatButton
              label="Cancel"
              onTouchTap={this.handleClose}
            />,
            <FlatButton
              label="Settle"
              primary={true}
              onTouchTap={this.handleSettle}
            />
          ]}
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose}
        >
          <SelectField
            value={this.state.settleType}
            onChange={this.handleSettleSelect}
            floatingLabelText="Type of settlement"
          >
            {settleOptions}
          </SelectField>
        </Dialog>
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