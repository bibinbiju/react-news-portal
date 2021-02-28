import { Link, Redirect } from "react-router-dom";
import React, { Component } from 'react';
import store from '../store';

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            form: {},
            redirect: false,
            msg: '',
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
    login(e) {

        e.preventDefault()
        store.dispatch({
            type: 'CHECK_LOGIN',
            payload: this.state.form
        });
        if (store.getState().get('isAuthenticated')) {
            this.setState({
                redirect: true,
                msg: '',
            })
        }
        else {
            this.setState({
                redirect: false,
                msg: 'Login failed',
            })
        }

    }

    render() {
        return ((this.state.redirect) ? <Redirect to="/" /> : < div className="window-center" >
            <form onSubmit={this.login}>
                <p style={{ color: 'red' }}>{this.state.msg}</p>
                <table>
                    <thead>
                        <tr>
                            <th colSpan="3">Login</th>
                        </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td><label htmlFor="email">User Name</label></td>
                        <td>:</td>
                            <td><input type="email" required={true} id="email" onChange={this.handleInputChange} name="email" /></td>
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
                    </tbody>
                </table>
            </form>
        </div >)
    }
}