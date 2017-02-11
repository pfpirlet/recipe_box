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

const editRecipe = (recipeId, recipeName, recipeIngredients) => {
	return {
		type: 'EDIT',
		recipeId: recipeId,
		recipeName: recipeName,
		recipeIngredients: recipeIngredients
	}
};

const recipeReducer = (state, action) => {
	var stateLength = state[state.length - 1]["recipeId"] + 1;
	switch (action.type) {
		case 'ADD':
			return state.concat({
				recipeId: stateLength,
				recipeName: action.recipeName,
				recipeIngredients: action.recipeIngredients
			});
		case 'DELETE':
			console.log("deleting n " + action.key + " and new state = " + state.filter(recipe => recipe["recipeId"] !== action.key));
			return state.filter(recipe => recipe["recipeId"] !== action.key);
		case 'EDIT':
				const updatedState = state.map(item => {
					if (item.recipeId === action.recipeId) {
						return {recipeId: action.recipeId,
										recipeName: action.recipeName,
										recipeIngredients: action.recipeIngredients}
					} else {
						return item;
					}
				});
				console.log("updatedState: " + JSON.stringify(updatedState));
				return updatedState.sort((a,b) => {return parseInt(a.recipeId) - parseInt(b.recipeId)});
		default:
			return state;
	}
}

const initialState = [{ 
  recipeId: 0, recipeName: "Nom de recette", recipeIngredients: "ail, oignon"
}];

const store = createStore(recipeReducer, initialState);

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
		},
		editRecipe: (recipe) => {
			dispatch(editRecipe(recipe.recipeId, recipe.recipeName, recipe.recipeIngredients))
		}
	}
};

//React____________________________________________
class Presentational extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			recipeId: '',
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

	submitRecipe = (keyValue) => {
		this.state.recipeId === '' ? this.props.submitNewRecipe(this.state) : this.props.editRecipe(this.state);
		this.setState({
			recipeId: '',
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

	deleteRecipe = (keyValue) => {
		this.props.deleteRecipe(keyValue);
	}

	editRecipe = (keyValue) => {
		console.log("Editing keyValue N " + keyValue);
		var tempName = this.props.recipes.map(recipe => {
			console.log("recipe: " + JSON.stringify(recipe));
			if (recipe.recipeId === keyValue) {
				return recipe.recipeName;
			}
		}).slice(1);
		var tempIngredients = this.props.recipes.map(recipe => {
			if (recipe.recipeId === keyValue) {
				return recipe.recipeIngredients;
			}
		}).slice(1);
		console.log("tempName: " + tempName + " tempIngredients: " + tempIngredients);
		this.setState({
			recipeId: keyValue,
			recipeName: tempName,
			recipeIngredients: tempIngredients
		});
		document.getElementById('myModal').style.display = "block";
	}

	render() {
		console.log(JSON.stringify(this.props.recipes));
		return (
			<div>
				<ModalPresentational recipeId={this.state.recipeId} recipeName={this.state.recipeName} recipeIngredients={this.state.recipeIngredients} handleChangeName={this.handleChangeName} handleChangeIngredients={this.handleChangeIngredients} submitRecipe={this.submitRecipe} cancelRecipe={this.cancelRecipe} editRecipe={this.editRecipe}/>

				<h2>Recettes</h2>

				{/* Main Page */}
				<ul>
					{this.props.recipes.map((recipe, idx) => {
						var keyValue = recipe.recipeId;
						return (<div><li key={keyValue}>{recipe.recipeName}<br/>
						{recipe.recipeIngredients}<br/>
						<button onClick={() => this.props.deleteRecipe(keyValue)}>Delete</button>
						<button onClick={() => this.editRecipe(keyValue)}>Edit</button>
						</li></div>)
																										}
																	)
					}
				</ul>
				<button onClick={() => {document.getElementById('myModal').style.display = "block";}}>Add recipe</button>
			</div>
		);
	}
};

class ModalPresentational extends React.Component {
	render () {
		return(
				<div id="myModal" className="modal">
					{/* Modal content */}
					<div className="modal-content">
  					<div className="modal-header">
    					<h2>Add a new recipe</h2>
  					</div>
  					<div className="modal-body">
    					<p><input placeholder="Recipe Name" value={this.props.recipeName} onChange={this.props.handleChangeName}/></p>
							<p><textarea placeholder="Recipe Ingredients" value={this.props.recipeIngredients} onChange={this.props.handleChangeIngredients}/><br/></p>
  						<button onClick={this.props.submitRecipe} autoFocus>Submit</button>
  						<button onClick={this.props.cancelRecipe}>Cancel</button>
  					</div>
					</div>
				</div>
			)
	}
}

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
