import { Link, Redirect } from "react-router-dom";
import React, { Component } from 'react';
import store from '../store';

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            form: {},
            redirect: false,
        };
        this.handleInputChange = this.handleInputChange.bind(this);
        this.login = this.login.bind(this);
    }
    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        let form = Object.assign({}, this.state.form, { [name]: value });
        this.setState({
            form: form
        });
    }
    login() {
        store.dispatch({
            type: 'CHECK_LOGIN',
            payload: this.state.form
        });
        if (store.getState().get('isAuthenticated')) {
            this.setState({
                redirect: true
            })
        }
        else {
            this.setState({
                redirect: false
            })
        }

    }

    render() {
        return ((this.state.redirect) ? <Redirect to="/" /> : < div className="window-center" >
            <form onSubmit={this.login}>
                <table>
                    <th>
                        <td colspan="3">Login</td>
                    </th>
                    <tr>
                        <td><label htmlFor="email">User Name</label></td>
                        <td>:</td>
                        <td><input type="email" required="true" id="email" onChange={this.handleInputChange} name="email" /></td>
                    </tr>
                    <tr>
                        <td><label htmlFor="password">Password</label></td>
                        <td>:</td>
                        <td><input type="password" onChange={this.handleInputChange} id="password" name="password" /></td>
                    </tr>
                    <tr>
                        <td><Link to="/register">Sign Up</Link></td>
                        <td></td>
                        <td><button type="submit" >Login</button></td>
                    </tr>
                </table>
            </form>
        </div >)
    }
}