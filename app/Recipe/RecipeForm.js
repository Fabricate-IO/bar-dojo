import React from 'react';
import { hashHistory } from 'react-router';

import NetworkRequest from '../networkRequest';
import styles from '../styles';

import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import IconDelete from 'material-ui/svg-icons/action/delete';


const IngredientSelect = React.createClass({
  getInitialState: function () {
    const StockType = this.props.StockTypes.find((StockType) => { return StockType.id === this.props.ingredient.stockTypeId; }) || {};
    return {
      object: this.props.ingredient,
      StockType: StockType,
    };
  },
  handleInputChange: function (e) {
    this.state.object[e.target.name] = e.target.value;
    this.setState({ object: this.state.object });
    this.props.changeIngredient(this.props.index, this.state.object);
  },
  handleSelectChange: function (event, index, value) {
    this.state.StockType.id = index;
    this.state.object.stockTypeId = value;
    this.setState(this.state);
    this.props.changeIngredient(this.props.index, this.state.object);
  },
  handleDelete: function () {
    this.props.removeIngredient(this.props.index);
  },
  render: function () {

    const options = this.props.StockTypes.map((StockType) => {
      return <MenuItem key={StockType.id} value={StockType.id} primaryText={StockType.id} />;
    });
    const units = this.state.StockType.unitType || 'units';
    const quantityLabel = 'Quantity (' + units + ')';

    return (
      <div>
        <TextField
          name="quantity"
          type="number"
          floatingLabelText={quantityLabel}
          floatingLabelFixed={true}
          value={this.state.object.quantity}
          onChange={this.handleInputChange}
          style={styles.textInput}
        />
        <SelectField
          value={this.state.object.stockTypeId}
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
      creating: (this.props.params.id == null), // if creating from scratch (otherwise saving)
      StockTypes: [],
      object: {
        name: '',
        instructions: '',
        ingredients: [],
      },
    };
  },
  componentWillMount: function () {

    NetworkRequest('GET', '/api/StockType?orderBy=name', (err, result) => {

      if (err) {
        return console.error('StockType API', status, err.toString());
      }

      this.setState({ StockTypes: result });
    });
  },
  componentDidMount: function () {

    if (this.state.creating === false) {

      NetworkRequest('GET', '/api/Recipe/' + this.props.params.id, (err, result) => {

        if (err) {
          return console.error('Recipe API', status, err.toString());
        }

        result.ingredients = result.ingredients || [];
        this.setState({ object: result });
      });
    }
  },
  handleSave: function (e) {

    e.preventDefault();
    const object = this.state.object;
    if (object.name == null || object.ingredients == null) {
      return;
    }
    const recipe = {
      id: this.props.params.id,
      name: object.name.trim(),
      ingredients: object.ingredients,
    };

    if (object.instructions) {
      recipe.instructions = object.instructions.trim();
    }
    let url = '/api/Recipe';
    let type = 'POST';
    if (recipe.id != null) { // if we were given an ID, we're saving instead of creating
      url += '/' + recipe.id;
      type = 'PUT';
    }
    this.setState({ object: {} });

    NetworkRequest(type, url, recipe, (err, result) => {

      if (err) {
        this.setState({ object: object });
        return console.error('Recipe API', status, err.toString());
      }

      hashHistory.push('/drinks');
    });
  },
  handleInputChange: function (e) {

    const object = this.state.object;
    object[e.target.name] = e.target.value;
    this.setState({ object: object });
  },
  handleCancel: function () {
    hashHistory.push('/drinks');
  },
  handleDelete: function (e) {

    if (window.confirm("Are you sure you want to delete " + this.state.object.name + '?')) {

      NetworkRequest('DELETE', '/api/Recipe/' + this.props.params.id, (err, result) => {

        if (err) {
          return console.error('Recipe API', status, err.toString());
        }

        hashHistory.push('/drinks');
      });
    }
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

    const ingredients = this.state.object.ingredients.map((ingredient, index) => {
      return <IngredientSelect
        key={ingredient.stockTypeId}
        index={index}
        ingredient={ingredient}
        StockTypes={this.state.StockTypes}
        changeIngredient={this.changeIngredient}
        removeIngredient={this.removeIngredient}
      />;
    });

    return (
      <form onSubmit={this.handleSave}>
        <TextField
          name="name"
          floatingLabelText="Drink name"
          floatingLabelFixed={true}
          value={this.state.object.name}
          onChange={this.handleInputChange}
          style={styles.textInput}
        />
        <br/>
        <TextField
          name="instructions"
          floatingLabelText="Instructions (optional)"
          floatingLabelFixed={true}
          multiLine={true}
          rows={2}
          value={this.state.object.instructions}
          onChange={this.handleInputChange}
          style={styles.textInput}
        />
        <br/>
        {ingredients}
        <RaisedButton label="Add Ingredient" onClick={this.addIngredient} />
        <br/>
        <RaisedButton label="Save" primary={true} type="submit" />
        <br/>
        <RaisedButton label="Cancel" onClick={this.handleCancel} />
        <br/>
        { this.state.creating ? null : <RaisedButton label="Delete" secondary={true} onClick={this.handleDelete} /> }
      </form>
    );
  }
});