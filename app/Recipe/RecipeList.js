import React from 'react';
import { hashHistory } from 'react-router';
import NetworkRequest from '../networkRequest';

import styles from '../styles';

import { List, ListItem } from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';
import IconButton from 'material-ui/IconButton';
import IconEdit from 'material-ui/svg-icons/editor/mode-edit';


const RecipeExpanded = React.createClass({
  render: function () {
    const ingredients = (this.props.recipe.ingredients || []).map((ingredient) => {
      const text = ingredient.quantity + ingredient.stockType.unitType + ' ' + ingredient.stockTypeId;
      return <ListItem key={ingredient.stockTypeId} primaryText={text} />
    });
    return (
      <div style={styles.expanded}>
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
          </div>
        }
      >
        <div>
          {this.props.recipe.name} (${this.props.recipe.costMin} - ${this.props.recipe.costMax})
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
  componentWillMount: function () {

    NetworkRequest('GET', '/api/Stock?orderBy=name', (err, result) => {

      if (err) {
        return console.error('Stock API', status, err.toString());
      }

      this.setState({ Stock: result });
    });

    NetworkRequest('GET', '/api/StockType?orderBy=name', (err, result) => {

      if (err) {
        return console.error('StockType API', status, err.toString());
      }

      this.setState({ StockTypes: result });
    });
  },
  componentDidMount: function () {

    NetworkRequest('GET', '/api/Recipe?orderBy=name', (err, result) => {

      if (err) {
        return console.error('Recipe API', status, err.toString());
      }

      const recipes = result.map((recipe) => {
        recipe.ingredients = recipe.ingredients.map((ingredient) => {
          ingredient.stockType = this.state.StockTypes.find((StockType) => { return StockType.id === ingredient.stockTypeId; });
          return ingredient;
        });
        return recipe;
      });

      this.setState({ data: recipes });
    });
  },
  render: function () {

    const recipesInStock = this.state.data.filter((element) => {
      return (element.inStock === true);
    }).map((recipe) => {
      return <Recipe key={recipe.id} recipe={recipe}></Recipe>;
    });
    const recipesOutOfStock = this.state.data.filter((element) => {
      return (element.inStock === false);
    }).map((recipe) => {
      return <Recipe key={recipe.id} recipe={recipe}></Recipe>;
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