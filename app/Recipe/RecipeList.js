import React from 'react';
import { hashHistory } from 'react-router';
import NetworkRequest from '../networkRequest';

import styles from '../styles';

import { List, ListItem } from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';
import IconButton from 'material-ui/IconButton';
import IconDelete from 'material-ui/svg-icons/action/delete';
import IconEdit from 'material-ui/svg-icons/editor/mode-edit';


const RecipeExpanded = React.createClass({
  render: function () {
    const ingredients = (this.props.recipe.ingredients || []).map((ingredient) => {
      const text = ingredient.quantity + 'x ' + ingredient.stockTypeId;
      return <ListItem key={ingredient.stockTypeId} primaryText={text} />
    });
    return (
      <div>
        <List>
          {ingredients}
        </List>
      </div>
    );
  },
});


const Recipe = React.createClass({
  getInitialState: function () {
    return {
      expanded: false,
    };
  },
  handleClick: function () {
    this.setState({ expanded: !this.state.expanded });
  },
  handleDelete: function (e) {
    e.preventDefault();
    if (window.confirm("Are you sure you want to delete " + this.props.recipe.name + '?')) {
      this.props.onDelete(this.props.recipe.id);
    }
  },
  handleEdit: function () {
    hashHistory.push('/drinks/edit/' + this.props.recipe.id);
  },
  render: function () {

    let expanded = '';
    if (this.state.expanded) {
      expanded = <RecipeExpanded recipe={this.props.recipe} />
    }
    let style = {};
    if (this.props.recipe.inStock === false) {
      style = styles.outOfStock;
    }

    return (
      <ListItem
        onClick={this.handleClick}
        style={style}
        rightIconButton={
          <div>
            <IconButton onClick={this.handleEdit}><IconEdit /></IconButton>
            <IconButton onClick={this.handleDelete}><IconDelete /></IconButton>
          </div>
        }
      >
        <div>
          {this.props.recipe.name}
        </div>
        {expanded}
      </ListItem>
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
    NetworkRequest('GET', '/api/Recipe?orderBy=name', (err, result) => {
      if (err) {
        return console.error('Recipe API', status, err.toString());
      }
      this.setState({ data: result });
    });
  },
  onDelete: function (id) {
    const data = this.state.data;
    const newData = data.filter((recipe) => { return recipe.id !== id; });
    this.setState({ data: newData });
    NetworkRequest('DELETE', '/api/Recipe/' + id, (err, result) => {
      if (err) {
        this.setState({ data: data });
        return console.error('Recipe API', status, err.toString());
      }
    });
  },
  render: function () {
    const recipesInStock = this.state.data.filter((element) => {
      return (element.inStock === true);
    }).map((recipe) => {
      return <Recipe key={recipe.id} recipe={recipe} onDelete={this.onDelete}></Recipe>;
    });
    const recipesOutOfStock = this.state.data.filter((element) => {
      return (element.inStock === false);
    }).map((recipe) => {
      return <Recipe key={recipe.id} recipe={recipe} onDelete={this.onDelete}></Recipe>;
    });
    return (
      <List>
        {recipesInStock}
        <Divider />
        <Subheader>Out of stock</Subheader>
        <Divider />
        {recipesOutOfStock}
      </List>
    );
  },
});