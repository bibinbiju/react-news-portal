import { Link } from "react-router-dom";
import React, { Component } from 'react';
import store from '../store';
export default class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            form: {}
        }
        this.handleInputChange = this.handleInputChange.bind(this);
        this.submit = this.submit.bind(this);
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
    submit(e) {
        e.preventDefault()
        let { state } = this.props;
        let allUsers = state.get('users');
        let findUserExist = allUsers.find((u) => {
            console.log(u, "dskhbvfjh")
            return u.get('email') == this.state.form.email
        });
        if (!findUserExist) {
            store.dispatch({
                type: 'ADD_USER',
                payload: this.state.form
            });
            alert('New User added!!!!');
        }
        else {
            alert('Email Already registered!!!!');
        }
    }
    render() {
        return (<div className="window-center">
            <form onSubmit={this.submit}>
                <table>
                    <thead>
                        <tr>
                            <th colSpan="3">Register Form</th>
                        </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td><label htmlFor="name">User Name</label></td>
                        <td>:</td>
                            <td><input type="text" maxLength="30" required={true} onChange={this.handleInputChange} id="name" name="name" /></td>
                    </tr>
                    <tr>
                        <td><label htmlFor="email">User Name</label></td>
                        <td>:</td>
                            <td><input type="email" required={true} onChange={this.handleInputChange} id="email" name="email" /></td>
                    </tr>
                    <tr>
                        <td><label htmlFor="password" >Password</label></td>
                        <td>:</td>
                            <td><input type="password" maxLength="20" required={true} onChange={this.handleInputChange} id="password" name="password" /></td>
                    </tr>
                    <tr>
                        <td><Link to="/login">Login</Link></td>
                        <td></td>
                        <td><button type="submit" >Create Account</button></td>
                    </tr>
                    </tbody>
                </table>
            </form>
        </div>)
    }
}