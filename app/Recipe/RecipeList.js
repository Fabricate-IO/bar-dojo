import React from 'react';
import { hashHistory } from 'react-router';
import NetworkRequest from '../networkRequest';

import styles from '../styles';

import Dialog from 'material-ui/Dialog';
import Divider from 'material-ui/Divider';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import IconEdit from 'material-ui/svg-icons/editor/mode-edit';
import { List, ListItem } from 'material-ui/List';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import SelectField from 'material-ui/SelectField';
import Subheader from 'material-ui/Subheader';


const RecipeExpanded = React.createClass({
  getInitialState: function () {
    return {
      open: false,
      Patrons: [],
      patronId: null,
      recipe: this.props.recipe,
    };
  },
  calculatePrice: function () {

    let price = 0;

    const ingredients = this.state.recipe.ingredients.map((ingredient, ingredientIndex) => {

      const stock = ingredient.stock.find((stock) => { return stock.id === ingredient.stockId; });

      if (stock != null) {
        price += ingredient.quantity * stock.unitCost;
      }
    });

    return price.toFixed(2);
  },
  componentDidMount: function () {

    NetworkRequest('GET', '/api/Patron?orderBy=name', (err, result) => {

      if (err) {
        return console.error('Patron API', status, err.toString());
      }

      this.setState({ Patrons: result });
    });
  },
  handleBuy: function () {

    NetworkRequest('POST', '/api/Patron/' + this.state.patronId + '/charge',
      { amount: this.calculatePrice() },
      (err, result) => {

      if (err) {
        return console.error('Patron API', status, err.toString());
      }

      this.setState({ open: false });
    });
  },
  handleOpen: function () {
    this.setState({ open: true });
  },
  handleClose: function () {
    this.setState({ open: false });
  },
  handleStockSelect: function (event, index, value, ingredientIndex) {
    event.preventDefault();
    this.state.recipe.ingredients[ingredientIndex].stockId = value;
    this.setState({ ingredients: this.state.recipe.ingredients });
  },
  handlePatronSelect: function (event, index, value) {
    event.preventDefault();
    this.setState({ patronId: value });
  },
  render: function () {

    const price = this.calculatePrice();

    const ingredients = this.state.recipe.ingredients.map((ingredient, ingredientIndex) => {

      const quantityText = ingredient.quantity + ingredient.stockType.unitType;
      const stock = ingredient.stock.find((stock) => { return stock.id === ingredient.stockId; });
      let options = '-unavailable-';

      if (stock != null) {
        options = ingredient.stock[0].name;
      }

      if (ingredient.stock.length > 1) {
        // generate select options
        options = ingredient.stock.map((stock) => {
          const price = stock.unitCost * ingredient.quantity;
          const text = stock.name + ' - $' + price.toFixed(2);
          return <MenuItem key={stock.id} value={stock.id} primaryText={text} />;
        });

        const handleStockSelect = (event, index, value) => {
          this.handleStockSelect(event, index, value, ingredientIndex);
        };

        // create full select field
        options = <SelectField
          name={ingredient.id}
          value={ingredient.stockId}
          onChange={handleStockSelect}
          floatingLabelText="Ingredient"
          style={styles.textInput}
        >
          {options}
        </SelectField>;
      }

      return (
        <ListItem key={ingredient.stockTypeId}>
          {quantityText} {options} {ingredient.stockTypeId}
        </ListItem>
      );
    });

    const buyButtonText = 'Buy - $' + price;
    let buyConfirmText = 'Please select a patron to charge';
    const buyConfirmDisabled = (this.state.patronId == null);
    if (buyConfirmDisabled === false) {
      buyConfirmText = 'Charge ' + this.state.Patrons.find((patron) => { return (patron.id === this.state.patronId); }).name +
        ' $' + price;
    }
    const patrons = this.state.Patrons.map((patron) => {
      return <MenuItem key={patron.id} value={patron.id} primaryText={patron.name} />;
    });

    return (
      <div style={styles.expanded}>
        <RaisedButton label={buyButtonText} onClick={this.handleOpen} />
        <List>
          {ingredients}
        </List>

        <Dialog
          title={this.state.recipe.name}
          actions={[
            <FlatButton
              label="Cancel"
              onTouchTap={this.handleClose}
            />,
            <FlatButton
              label={buyConfirmText}
              primary={true}
              onTouchTap={this.handleBuy}
              disabled={buyConfirmDisabled}
            />
          ]}
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose}
        >
          <SelectField
            maxHeight={300}
            value={this.state.patronId}
            onChange={this.handlePatronSelect}
            floatingLabelText="Select Patron"
          >
            {patrons}
          </SelectField>
        </Dialog>
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
    let priceRange = '$' + this.props.recipe.costMin;
    if (this.props.recipe.costMin !== this.props.recipe.costMax) {
      priceRange += ' - $' + this.props.recipe.costMax;
    }

    return (
      <div>
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
            {this.props.recipe.name} ({priceRange})
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

    NetworkRequest('GET', '/api/Recipe?orderBy=unitCost', (err, result) => {

      if (err) {
        return console.error('Recipe API', status, err.toString());
      }

      const recipes = result.map((recipe) => {

        recipe.ingredients = recipe.ingredients.map((ingredient) => {

          ingredient.stockType = this.state.StockTypes.find((StockType) => { return StockType.id === ingredient.stockTypeId; });
          ingredient.stock = this.state.Stock.filter((Stock) => { return Stock.stockTypeId === ingredient.stockTypeId; });
          if (ingredient.stock.length > 0) {
            ingredient.stockId = ingredient.stock[0].id;
          }
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