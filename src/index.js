import React from 'react';
import ReactDOM from 'react-dom';
import { Provider, connect } from 'react-redux'
import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'

require ('./index.css')

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
		document.getElementById('myModal').style.display = "none";
	}

	cancelRecipe = () => {
		this.setState({
			recipeName: '',
			recipeIngredients: ''
		});
		document.getElementById('myModal').style.display = "none";
	}

	deleteRecipe = (idx) => {
		this.props.deleteRecipe(idx);
	}

	render() {
		console.log(JSON.stringify(this.props.recipes));
		return (
			<div>
				<div id="myModal" className="modal">
					{/* Modal content */}
					<div className="modal-content">
  					<div className="modal-header">
    					<h2>Add a new recipe</h2>
  					</div>
  					<div className="modal-body">
    					<p><input placeholder="Recipe Name" value={this.state.recipeName} onChange={this.handleChangeName}/></p>
							<p><textarea placeholder="Recipe Ingredients" value={this.state.recipeIngredients} onChange={this.handleChangeIngredients}/><br/></p>
  						<button onClick={this.submitRecipe} autofocus>Submit</button>
  						<button onClick={this.cancelRecipe}>Cancel</button>
  					</div>
					</div>
				</div>

				<h2>Recettes</h2>

				{/* Main Page */}
				<ul>
					{this.props.recipes.map((recipe, idx) => {
						return (<div><li key={recipe.recipeId}>{recipe.recipeName}<br/>
						{recipe.recipeIngredients}<br/>
						<button onClick={() => this.props.deleteRecipe(recipe.recipeId)}>Delete</button></li></div>)
																										}
																	)
					}
				</ul>
				<button onClick={() => {document.getElementById('myModal').style.display = "block";}}>Submit</button>
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
