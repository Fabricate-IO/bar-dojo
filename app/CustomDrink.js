import React from 'react';
import { hashHistory } from 'react-router';

import NetworkRequest from './networkRequest';
import styles from './styles';
import utils from './utils';

import IconButton from 'material-ui/IconButton';
import IconDelete from 'material-ui/svg-icons/action/delete';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import SelectField from 'material-ui/SelectField';
import Snackbar from 'material-ui/Snackbar';
import TextField from 'material-ui/TextField';

import DrinkBuyDialog from './DrinkBuyDialog';


const IngredientSelect = React.createClass({
  handleInputChange: function (e) {
    const object = this.props.ingredient;
    object[e.target.name] = e.target.value;
    this.props.changeIngredient(this.props.index, object);
  },
  handleSelectChange: function (event, index, value) {
    const object = this.props.Stock.find((Stock) => { return Stock.id === value; }) || {};
    object.quantity = this.props.ingredient.quantity;
    this.props.changeIngredient(this.props.index, object);
  },
  handleDelete: function () {
    this.props.removeIngredient(this.props.index);
  },
  render: function () {

    const options = this.props.Stock.map((Stock) => {
      return <MenuItem key={Stock.id} value={Stock.id} primaryText={Stock.name} />;
    });
    const units = this.props.ingredient.unitType || 'units';
    const quantityLabel = 'Quantity (' + units + ')';

    return (
      <div>
        <TextField
          name="quantity"
          type="number"
          floatingLabelText={quantityLabel}
          floatingLabelFixed={true}
          value={this.props.ingredient.quantity}
          onChange={this.handleInputChange}
          style={styles.textInput}
        />
        <SelectField
          value={this.props.ingredient.id}
          onChange={this.handleSelectChange}
          floatingLabelText="Ingredient"
          style={styles.textInput}
        >
          {options}
        </SelectField>
        <IconButton onClick={this.handleDelete}><IconDelete /></IconButton>
      </div>
    );
  }
});


module.exports = React.createClass({
  getInitialState: function () {
    return {
      buyDialog: false,
      Stock: [],
      Users: [],
      object: {
        ingredients: [{}],
      },
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

    NetworkRequest('GET', '/api/User?orderBy=name', (err, result) => {

      if (err) {
        return console.error('User API', status, err.toString());
      }

      this.setState({ Users: result });
    });
  },
  handleDialogOpen: function () {
    this.setState({ buyDialog: true });
  },
  handleDialogClose: function () {
    this.setState({ buyDialog: false });
  },
  handleInputChange: function (e) {

    const object = this.state.object;
    object[e.target.name] = e.target.value;
    this.setState({ object: object });
  },
  handleClear: function () {
    this.setState({ object: { ingredients: [{}] } });
  },
  addIngredient: function () {
    this.state.object.ingredients.push({});
    this.setState({ object: this.state.object });
  },
  changeIngredient: function (index, ingredient) {
    this.state.object.ingredients[index] = ingredient;
    this.setState({ object: this.state.object });
  },
  removeIngredient: function (index) {
    this.state.object.ingredients.splice(index, 1);
    this.setState({ object: this.state.object });
  },
  render: function () {

    const ingredientsList = this.state.object.ingredients.map((ingredient, index) => {
      return <IngredientSelect
        key={ingredient.id}
        index={index}
        ingredient={ingredient}
        Stock={this.state.Stock}
        changeIngredient={this.changeIngredient}
        removeIngredient={this.removeIngredient}
      />;
    });

    const recipe = this.state.object;
    recipe.name = 'Custom drink';
    recipe.abv = utils.calculateAbv(this.state.object.ingredients, { unitless: true });
    recipe.abvFormatted = utils.formatAbv(recipe.abv);
    recipe.price = utils.calculatePrice(this.state.object.ingredients, { unitless: true });
    recipe.priceFormatted = utils.formatPrice(recipe.price);
    const ingredients = recipe.ingredients.map((stock) => {
      return {
        quantity: stock.quantity,
        barStockId: stock.id,
      };
    });

    const buyButtonText = 'Buy - ' + recipe.priceFormatted;

    return (
      <div>
        <div>
          {ingredientsList}
          <RaisedButton label="Add Ingredient" onClick={this.addIngredient} />
          <br/>
          <br/>
          <RaisedButton label={buyButtonText} primary={true} onClick={this.handleDialogOpen} />
          <br/>
          <br/>
          <RaisedButton label="Clear" onClick={this.handleClear} />
        </div>

        <DrinkBuyDialog
          category='custom'
          drink={recipe}
          ingredients={ingredients}
          Users={this.state.Users}
          handleDialogOpen={this.handleDialogOpen}
          handleDialogClose={this.handleDialogClose}
          openSnackbar={this.openSnackbar}
          visible={this.state.buyDialog}
        />

        { this.state.snackbar.message == null ? null :
          <Snackbar
            open={this.state.snackbar.open}
            message={this.state.snackbar.message}
            autoHideDuration={4000}
            onRequestClose={this.handleSnackbarClose}
          />
        }
      </div>
    );
  }
});