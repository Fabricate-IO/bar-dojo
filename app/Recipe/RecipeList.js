import React from 'react';
import { hashHistory } from 'react-router';
import NetworkRequest from '../networkRequest';

import styles from '../styles';
import utils from '../utils';

import Dialog from 'material-ui/Dialog';
import Divider from 'material-ui/Divider';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import IconEdit from 'material-ui/svg-icons/editor/mode-edit';
import { List, ListItem } from 'material-ui/List';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import SelectField from 'material-ui/SelectField';
import Snackbar from 'material-ui/Snackbar';
import Subheader from 'material-ui/Subheader';


const RecipeExpanded = React.createClass({
  getInitialState: function () {
    return {
      modal: false,
      Patrons: [],
      patronId: null,
      recipe: this.props.recipe,
    };
  },
  calculateAbv: function (options) {

    let abv = 0;
    let volume = 0;

    const ingredients = this.state.recipe.ingredients.map((ingredient, ingredientIndex) => {

      const stock = ingredient.stock.find((stock) => { return stock.id === ingredient.stockId; });

      if (stock != null) {
        abv += ingredient.quantity * stock.abv;
        volume += ingredient.quantity;
      }
    });

    abv /= volume;

    return utils.formatAbv(abv, options);
  },
  calculatePrice: function (options) {

    let price = 0;

    const ingredients = this.state.recipe.ingredients.map((ingredient, ingredientIndex) => {

      const stock = ingredient.stock.find((stock) => { return stock.id === ingredient.stockId; });

      if (stock != null) {
        price += ingredient.quantity * stock.volumeCost;
      }
    });

    return utils.formatPrice(price, options);
  },
  componentDidMount: function () {

    NetworkRequest('GET', '/api/Patron?orderBy=name', (err, result) => {

      if (err) {
        return console.error('Patron API', status, err.toString());
      }

      this.setState({ Patrons: result });
    });
  },
  handleOrder: function () {

    NetworkRequest('POST', '/api/Patron/' + this.state.patronId + '/order',
      {
        abv: this.calculateAbv({ unitless: true }),
        ingredients: this.state.recipe.ingredients.map((stock) => {
          return {
            quantity: stock.quantity,
            barStockId: stock.stockId,
          }
        }),
        monetaryValue: this.calculatePrice({ unitless: true }),
        recipeId: this.state.recipe.id,
      },
      (err, result) => {

      if (err) {
        return console.error('Patron API', status, err.toString());
      }

      this.setState({ modal: false });
      this.props.handleClose();
      this.props.openSnackbar(this.state.recipe.name + ' purchased for ' + this.calculatePrice());
    });
  },
  handleModalOpen: function () {
    this.setState({ modal: true });
  },
  handleModalClose: function () {
    this.setState({ modal: false });
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

    const abv = this.calculateAbv();
    const price = this.calculatePrice();

    const ingredients = this.state.recipe.ingredients.map((ingredient, ingredientIndex) => {

      const quantityText = ingredient.quantity + ingredient.stockType.unitType;
      const stock = ingredient.stock.find((stock) => { return stock.id === ingredient.stockId; });
      let options = '';

      if (stock != null) {
        options = ingredient.stock[0].name;
      }
      if (stock == null || ingredient.stock[0].name.toLowerCase() !== ingredient.stockTypeId) {
        options += ' ' + ingredient.stockTypeId;
      }

      if (ingredient.stock.length > 1) {
        // generate select options
        options = ingredient.stock.map((stock) => {
          const price = stock.volumeCost * ingredient.quantity;
          const text = stock.name + ' - ' + utils.formatPrice(price);
          return <MenuItem key={stock.id} value={stock.id} primaryText={text} />;
        });

        const handleStockSelect = (event, index, value) => {
          this.handleStockSelect(event, index, value, ingredientIndex);
        };

        // create full select field
        options = <span>
          {ingredient.stockTypeId}: &nbsp;
          <SelectField
            name={ingredient.id}
            value={ingredient.stockId}
            onChange={handleStockSelect}
            style={styles.textInput}
            autoWidth={true}
          >
            {options}
          </SelectField>
        </span>;
      }

      return (
        <ListItem key={ingredient.stockTypeId} style={styles.inlineSelect} innerDivStyle={styles.inlineSelect}>
          <div style={ stock == null ? styles.outOfStock : null }>
            {quantityText} {options}
          </div>
        </ListItem>
      );
    });

    const buyButtonText = 'Buy - ' + price + ' (' + abv + ')';
    let buyConfirmText = 'Please select a patron to charge';
    const buyConfirmDisabled = (this.state.patronId == null);
    if (buyConfirmDisabled === false) {
      buyConfirmText = 'Charge ' + this.state.Patrons.find((patron) => { return (patron.id === this.state.patronId); }).name + ' ' + price;
    }
    const patrons = this.state.Patrons.map((patron) => {
      return <MenuItem key={patron.id} value={patron.id} primaryText={patron.name} />;
    });

    return (
      <div style={styles.expanded}>
        <RaisedButton label={buyButtonText} onClick={this.handleModalOpen} />
        <List>
          {ingredients}
        </List>

        <Dialog
          title={this.state.recipe.name}
          actions={[
            <FlatButton
              label="Cancel"
              onTouchTap={this.handleModalClose}
            />,
            <FlatButton
              label={buyConfirmText}
              primary={true}
              onTouchTap={this.handleOrder}
              disabled={buyConfirmDisabled}
            />
          ]}
          modal={false}
          open={this.state.modal}
          onRequestClose={this.handleModalClose}
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
  handleClose: function () {
    this.setState({ expanded: false });
  },
  handleEdit: function () {
    hashHistory.push('/drinks/edit/' + this.props.recipe.id);
  },
  render: function () {

    let expanded = '';
    if (this.state.expanded) {
      expanded = <RecipeExpanded
          recipe={this.props.recipe}
          handleClose={this.handleClose}
          openSnackbar={this.props.openSnackbar}
      />;
    }
    let style = {};
    if (this.props.recipe.inStock === false) {
      style = styles.outOfStock;
    }

    let priceRange = utils.formatPrice(this.props.recipe.costMin);
    if (this.props.recipe.costMin !== this.props.recipe.costMax) {
      priceRange += ' - ' + utils.formatPrice(this.props.recipe.costMax);
    }

    let abvRange = utils.formatAbv(this.props.recipe.abvMin);
    if (this.props.recipe.abvMin !== this.props.recipe.abvMax) {
      abvRange += ' - ' + utils.formatAbv(this.props.recipe.abvMax);
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
            {this.props.recipe.name} ({priceRange}, {abvRange})
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
      snackbar: {
        open: false,
        message: null,
      },
    };
  },
  componentWillMount: function () {

    NetworkRequest('GET', '/api/BarStock?orderBy=name', (err, result) => {

      if (err) {
        return console.error('BarStock API', status, err.toString());
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

    NetworkRequest('GET', '/api/Recipe?orderBy=volumeCost', (err, result) => {

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
  handleSnackbarClose: function () {
    this.state.snackbar.open = false;
    this.setState({ snackbar: this.state.snackbar });
  },
  handleSnackbarOpen: function (message) {
    this.state.snackbar.open = true;
    this.state.snackbar.message = message;
    this.setState({ snackbar: this.state.snackbar });
  },
  render: function () {

    const searched = this.state.data.filter((element) => {
      return utils.search(this.props.search, [element.name]);
    });

    const recipesInStock = searched.filter((element) => {
      return (element.inStock === true);
    }).map((recipe) => {
      return <Recipe key={recipe.id} recipe={recipe} openSnackbar={this.handleSnackbarOpen}></Recipe>;
    });
    const recipesOutOfStock = searched.filter((element) => {
      return (element.inStock === false);
    }).map((recipe) => {
      return <Recipe key={recipe.id} recipe={recipe} openSnackbar={this.handleSnackbarOpen}></Recipe>;
    });

    return (
      <div>
        <List>
          {recipesInStock}
          <Divider />
          <Subheader>Out of stock</Subheader>
          <Divider />
          {recipesOutOfStock}
        </List>

        <Snackbar
          open={this.state.snackbar.open}
          message={this.state.snackbar.message}
          autoHideDuration={4000}
          onRequestClose={this.handleSnackbarClose}
        />
      </div>
    );
  },
});