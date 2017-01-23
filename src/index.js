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

const deleteRecipe = (key) => {
	return {
		type: 'DELETE',
		key: key
	}
};

const recipeReducer = (state = [{recipeId: 0, recipeName: "Nom de recette", recipeIngredients: "ail, oignon"}], action) => {
	var stateLength = state[state.length - 1]["recipeId"] + 1;
	switch (action.type) {
		case 'ADD':
			return state.concat({
				recipeId: stateLength,
				recipeName: action.recipeName,
				recipeIngredients: action.recipeIngredients
			});
		case 'DELETE':
			console.log(action.key);
			return state.filter(recipe => recipe["recipeId"] !== action.key);
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
		},
		deleteRecipe: (idx) => {
			dispatch(deleteRecipe(idx))
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

	deleteRecipe = (idx) => {
		this.props.deleteRecipe(idx);
	}

	render() {
		console.log(JSON.stringify(this.props.recipes));
		return (
			<div>
				<h2>Recettes</h2>
				<ul>
					{this.props.recipes.map((recipe, idx) => {
						return (<div><li key={recipe.recipeId}>{recipe.recipeName}<br/>
						{recipe.recipeIngredients}<br/>
						<button onClick={() => this.props.deleteRecipe(recipe.recipeId)}>Delete</button></li></div>)
																										}
																	)
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
