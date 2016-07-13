import React from 'react';
import { hashHistory } from 'react-router';
import NetworkRequest from '../networkRequest';

import styles from '../styles';
import utils from '../utils';

import Avatar from 'material-ui/Avatar';
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
      settlePlatform: (this.props.patron.splitwiseId != null) ? 'splitwise' : 'cash',
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
    this.setState({ settlePlatform: value });
  },
  handleSettle: function () {

    NetworkRequest('POST', '/api/Patron/' + this.props.patron.id + '/settle',
      { platform: this.state.settlePlatform },
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
    const tab = '$' + this.props.patron.tab;
    const modalTitle = 'Settle with ' + this.props.patron.name + ' - ' + tab;

    return (
      <div>
        <ListItem
          leftAvatar={
            <Avatar src={this.props.patron.image} />
          }
          rightIconButton={
            <div>
              <FlatButton label="Settle" onClick={this.handleOpen} />
              <IconButton onClick={this.handleEdit}><IconEdit /></IconButton>
            </div>
          }
          primaryText={this.props.patron.name}
          secondaryText={tab}
        />
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
          <Avatar src={this.props.patron.image} size={80} style={styles.floatLeft} />
          <br/>
          <SelectField
            value={this.state.settlePlatform}
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

    const searched = this.state.data.filter((element) => {
      return utils.search(this.props.search, [element.name]);
    });

    const patrons = searched.map((patron) => {
      return <Patron key={patron.id} patron={patron}></Patron>;
    });

    return (
      <List>
        {patrons}
      </List>
    );
  },
});