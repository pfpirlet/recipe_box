import React from 'react';
import ReactDOM from 'react-dom';
import { Provider, connect } from 'react-redux'
import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'

//Redux____________________________________________

const addRecipe = (recipeName, recipeIngredients) => {
	return {
		type: 'ADD',
		recipeName: recipeName,
		recipeIngredients: recipeIngredients
	}
};

const recipeReducer = (state = [{id: 0, recipeName: "Nom de recette", recipeIngredients: "ail, oignon"}], action) => {
	switch (action.type) {
		case 'ADD':
			return state.concat({
				id: state.length,
				recipeName: action.recipeName,
				recipeIngredients: action.recipeIngredients
			});
		default:
			return state;
	}
}

const store = createStore(recipeReducer);

//React-redux______________________________________

const mapStateToProps = (state) => {
	return {recipes: state}
};

const mapDispatchToProps = (dispatch) => {
	return {
		submitNewRecipe: (recipe) => {
			dispatch(addRecipe(recipe.recipeName, recipe.recipeIngredients))
		}
	}
};

//React____________________________________________
class Presentational extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			recipeName: '',
			recipeIngredients: ''
		}
	}

	handleChangeName = (event) => {
		this.setState({
			recipeName: event.target.value
		});
	}

	handleChangeIngredients = (event) => {
		this.setState({
			recipeIngredients: event.target.value
		});
	}

	submitRecipe = () => {
		this.props.submitNewRecipe(this.state);
		this.setState({
			recipeName: '',
			recipeIngredients: ''
		});
	}

	render() {
		return (
			<div>
				<h2>Recettes</h2>
				<ul>
					{this.props.recipes.map((recipe, i) => {
						return (<div><li key={i}>{recipe.recipeName}</li><br/>
						{recipe.recipeIngredients}</div>)
					})
				}
				</ul>
				<input placeholder="Recipe Name" value={this.state.recipeName} onChange={this.handleChangeName}/><br/>
				<textarea placeholder="Recipe Ingredients" value={this.state.recipeIngredients} onChange={this.handleChangeIngredients}/><br/>
				<button onClick={this.submitRecipe}>Submit</button>
			</div>
		);
	}
};

const Container = connect(mapStateToProps, mapDispatchToProps)(Presentational);

class AppWrapper extends React.Component {
	render() {
		return (
			<Provider store={store}>
				<Container/>
			</Provider>
		);
	}
};

ReactDOM.render(
  <AppWrapper />,
  document.getElementById('root')
);
