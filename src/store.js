import { createStore, combineReducers, applyMiddleware } from 'redux'
import ReduxThunk from 'redux-thunk'
import { State, User, Article } from './model';
import { fromJS } from 'immutable';
const initialState = fromJS(new State);
var uniqid = require('uniqid');

const AppReducer = (state, action) => {

  switch (action.type) {
    case 'REMOVE_ARTICLE':
      state = state.deleteIn(['users', state.get('isAuthenticated'), 'savedArticles', action.id]);
      return state;
    case 'ADD_TO_READ_LATER':
      let readLaterData = action.payload;
      let article = {
        id: uniqid(),
        slug_name: readLaterData.slug_name,
        title: readLaterData.title,
        abstract: readLaterData.abstract,
        url: readLaterData.url,
      }
      state = state.setIn(['users', state.get('isAuthenticated'), 'savedArticles', article.id], new Article(article));
      return state;
    case 'DELETE_ACCOUNT':
      state = state.deleteIn(['users', state.get('isAuthenticated')]);
      state = state.setIn(['isAuthenticated'], false);
      return state;
    case 'EDIT_PROFILE':
      let editData = action.payload;
      let newData = {
        name: editData.name,
        password: editData.password,
      }
      state = state.mergeIn(['users', editData.id], newData);
      return state;
    case 'ADD_USER':
      let data = action.payload;
      let user = {
        id: uniqid(),
        name: data.name,
        email: data.email,
        password: data.password,
      }
      state = state.setIn(['users', user.id], new User(user));
      return state;
    case 'LOG_OUT':
      state = state.setIn(['isAuthenticated'], false);
      return state;
    case 'CHECK_LOGIN':
      let loginData = action.payload;

      let checkUser = state.getIn(['users']).find((u) => (u.get('email') == loginData.email && u.get('password') == loginData.password));

      if (checkUser) {
        state = state.setIn(['isAuthenticated'], checkUser.get('id'));
      }
      else {
        state = state.setIn(['isAuthenticated'], false);
      }
      return state
    default:
      return state || initialState
  }
}

const store = createStore(
  AppReducer,
  loadFromLocalStorage(),
  applyMiddleware(
    ReduxThunk
  )
)

store.subscribe(() => saveToLocalStorage(store.getState()));
export default store;
// convert object to string and store in localStorage
function saveToLocalStorage(state) {
  console.log(state, "bkvjcbkmgkf")
  try {
    const serialisedState = JSON.stringify(state);
    localStorage.setItem("persistantState", serialisedState);
  } catch (e) {
    console.warn(e);
  }
}

// load string from localStarage and convert into an Object
// invalid output must be undefined
function loadFromLocalStorage() {
  try {
    const serialisedState = localStorage.getItem("persistantState");
    if (serialisedState === null) return undefined;
    return fromJS(JSON.parse(serialisedState));
  } catch (e) {
    console.warn(e);
    return undefined;
  }
}