import React, { Component } from 'react'
import logo from './logo.svg'
import './App.css'
import { connect } from 'react-redux'
import store from './store';
import {
  Switch,
  Route,
  Link,
  Redirect
} from "react-router-dom";
import Login from './components/login';
import Register from './components/register';
import Home from './components/home';
import Profile from './components/profile';
import SavedArticles from './components/saved-articles';
class App extends Component {
  render() {
    let { state } = this.props;
    return (
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/read-later">Read Later</Link>
            </li>
            <li ><Link to="/profile">Profile</Link></li>
            {(!state.get('isAuthenticated')) ? <li style={{ "float": "right" }}>
              <Link to="/login">Login</Link>
            </li> : <li style={{ "float": "right" }}>
                <Link to="/logout">Logout</Link>
              </li>}

            {/* <li>
              <Link to="/register">Register</Link>
            </li> */}


          </ul>
        </nav>
        <Switch>
          <Route path="/login" >
            <Login state={state} />
          </Route>
          <Route path="/logout" render={({ location }) => {
            store.dispatch({
              type: 'LOG_OUT',
            })
            return <Redirect
              to={{
                pathname: "/login",
                state: { from: location }
              }}
            />
          }}
          />
          <Route path="/register">
            <Register state={state} />
          </Route>
          <PrivateRoute path="/profile" state={state}>
            <Profile state={state} />
          </PrivateRoute>
          <PrivateRoute path="/read-later" state={state}>
            <SavedArticles state={state} />
          </PrivateRoute>
          <PrivateRoute path="/" state={state}>
            <Home state={state} />
          </PrivateRoute>
        </Switch>
      </div>
    );
  }
}
function PrivateRoute({ children, ...rest }) {
  let { state } = rest;
  return (
    <Route
      {...rest}
      render={({ location }) =>
        state.toJS().isAuthenticated ? (
          children
        ) : (
            <Redirect
              to={{
                pathname: "/login",
                state: { from: location }
              }}
            />
          )
      }
    />
  );
}
function mapStateToProps(reduxState) {
  return {
    state: reduxState
  }
}
export default connect(
  mapStateToProps
)(App)
