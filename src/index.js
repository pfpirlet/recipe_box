import React from 'react';
import ReactDOM from 'react-dom';
import { Provider, connect } from 'react-redux'
import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'

require ('./bulma.css')
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
	var stateLength = (state) => {
		if (state.length === 0) {
			return 1;
		} else {
			return state[state.length - 1]["recipeId"] + 1;
		}
	};
	switch (action.type) {
		case 'ADD':
			return state.concat({
				recipeId: stateLength(state),
				recipeName: action.recipeName,
				recipeIngredients: action.recipeIngredients
			});
		case 'DELETE':
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
				return updatedState.sort((a,b) => {return parseInt(a.recipeId) - parseInt(b.recipeId)});
		default:
			return state;
	}
}

const initialState = () => {
	if (sessionStorage.length !== 0) {
		console.log(JSON.parse(sessionStorage.getItem('state')));
		return JSON.parse(sessionStorage.getItem('state'));
	} else {
		return [{recipeId: 0, recipeName: "Paella", recipeIngredients: "Rice, saffron, jámon, mossels"}];
	}
}

const store = createStore(recipeReducer, initialState());

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
			recipeIngredients: '',
			isClicked: true
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
		var tempName, tempIngredients;
		this.props.recipes.forEach(recipe => {
			if (recipe.recipeId === keyValue) {
				tempName = recipe.recipeName;
				tempIngredients = recipe.recipeIngredients;
			}
		});
		this.setState({
			recipeId: keyValue,
			recipeName: tempName,
			recipeIngredients: tempIngredients
		});
		document.getElementById('myModal').style.display = "block";
	}

	componentWillMount () {
		this.props.recipes.map(()=>{
			this.setState({isClicked: [].concat(false)});
		});
	}

	render() {
		return (
			<div>
			<div className="columns">
			<div className="column" />
			<div className="column">
				<ModalPresentational recipeId={this.state.recipeId} recipeName={this.state.recipeName} recipeIngredients={this.state.recipeIngredients} handleChangeName={this.handleChangeName} handleChangeIngredients={this.handleChangeIngredients} submitRecipe={this.submitRecipe} cancelRecipe={this.cancelRecipe} editRecipe={this.editRecipe}/>

				<h1 style={{padding: 25}} className="title is-1 has-text-centered">RecipeBox</h1><br/>

				{/* Main Page */}
				<ul>
					{this.props.recipes.map((recipe, idx) => {
						var keyValue = recipe.recipeId;
						var ingredients = recipe.recipeIngredients.split(",");
						return (
							<div className="columns">
								<div className="column">
										<table className="table is-striped">
											<thead onClick={() => {
												var localIsClicked = [...this.state.isClicked];
												localIsClicked[keyValue] ? this.setState({isClicked: localIsClicked.slice(0,keyValue).concat(false).concat(localIsClicked.slice(keyValue + 1))}) : this.setState({isClicked: localIsClicked.slice(0,keyValue).concat(true).concat(localIsClicked.slice(keyValue + 1))});
												console.log(localIsClicked[keyValue]);
												}}>
												<th>{recipe.recipeName}</th>
											</thead>
											{this.state.isClicked[keyValue] ? <IngredientsTable ingredients={ingredients}/> : ""}
										</table>
								</div>
								<div className="column is-narrow">
									<div className="control is-grouped">
										<p className="control">
											<button className="button is-warning is-outlined" onClick={() => this.editRecipe(keyValue)}>Edit</button>
										</p>
										<p className="control">
											<button className="button is-danger is-outlined" onClick={() => this.props.deleteRecipe(keyValue)}>
												<span className="icon is-small"><i className="fa fa-times"></i></span>
    										<span>Delete</span>
    									</button>
										</p>
									</div>
								</div>
							</div>
							)
																										}
																	)
					}
				</ul>
				<br />
				<p className="control">
					<button className="button is-primary is-outlined" onClick={() => {document.getElementById('myModal').style.display = "block";}}>Add recipe</button>
					<br/>
				</p>
				<footer>
				<p className="control">
					<p className="has-text-centered">
						A project by <a href="https://github.com/pfpirlet">pfpirlet</a>
					</p>
					<p className="has-text-centered">
						Sources: <a href="https://github.com/pfpirlet/recipe_box">https://github.com/pfpirlet/recipe_box</a>
					</p>
				</p>
				</footer>
			</div>
			<div className="column" />
			</div>
			</div>
		);
	}

	componentDidUpdate () {
		console.log(this.props.recipes);
		sessionStorage.setItem('state', JSON.stringify(this.props.recipes));
	}
};

class IngredientsTable extends React.Component {
	render () {
		return (
			<tbody>
				{this.props.ingredients.map((item) => {
					return <tr><th>{item}</th></tr>;
				})}
			</tbody>	
			)
	}
}

class ModalPresentational extends React.Component {
	render () {
		return(
				<div id="myModal" className="modal">
					{/* Modal content */}
					<div className="modal-content">
  					<div className="modal-header">
    					<h2 className="title is-2 has-text-centered">Add a new recipe</h2>
  					</div>
  					<div className="modal-body">
    					<p className="control"><input className="input" placeholder="Recipe Name" value={this.props.recipeName} onChange={this.props.handleChangeName}/></p>
							<p className="control"><textarea className="textarea" placeholder="Recipe Ingredients" value={this.props.recipeIngredients} onChange={this.props.handleChangeIngredients}/><br/></p>
  						<div className="control is-grouped">
  							<p className="control">
  								<button className="button is-primary is-outlined" onClick={this.props.submitRecipe}>
  									<span className="icon is-small"><i className="fa fa-check"></i></span>
    								<span>Save</span>
    							</button>
    						</p>
  							<p className="control">
  								<button className="button is-warning is-outlined" onClick={this.props.cancelRecipe}>Cancel</button>
  							</p>
  						</div>
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
