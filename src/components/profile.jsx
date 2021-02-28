import { Link } from "react-router-dom";
import React, { Component } from 'react';
import store from '../store';

export default class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            form: {},
            editMode: false
        };
        this.handleInputChange = this.handleInputChange.bind(this);
        this.updateProfile = this.updateProfile.bind(this);
        this.deleteAccount = this.deleteAccount.bind(this);
    }
    componentDidMount() {
        let { state } = this.props;
        let user = state.getIn(['users', state.get('isAuthenticated')]);
        if (user) {
            let form = Object.assign(this.state.form, {
                name: user.get('name'),
                password: user.get('password'),
                email: user.get('email'),
                id: user.get('id')
            })
            this.setState({
                form: form
            });
        }
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
    updateProfile(e) {
        e.preventDefault();
        store.dispatch({
            type: 'EDIT_PROFILE',
            payload: this.state.form
        });
        this.toggleEditMode(false);
    }
    toggleEditMode(value = false) {
        this.setState({
            editMode: value
        });
    }
    deleteAccount() {
        store.dispatch({
            type: 'DELETE_ACCOUNT',
        });
    }

    render() {
        let { state } = this.props;
        let user = state.getIn(['users', state.get('isAuthenticated')])
        return (<div className="window-center">
            <form onSubmit={this.updateProfile}>
            <table>
                    <thead>
                        <tr>
                            <th colSpan="3">Profile</th>
                        </tr>
                    </thead>
                    <tbody>
                <tr>
                    <td><label htmlFor="name">Name </label></td>
                    <td>:</td>
                    <td>
                        {(!this.state.editMode) ? <span >{user.get('name')}</span> :
                                    <input required={true} type="text" maxLength="30" id="name" onChange={this.handleInputChange} value={this.state.form.name} name="name" />}
                    </td>
                </tr>
                <tr>
                    <td><label htmlFor="email">User Name</label></td>
                    <td>:</td>
                    <td><span >{user.get('email')}</span></td>
                </tr>
                <tr>
                    <td><label htmlFor="password">Password</label></td>
                    <td>:</td>
                            <td>{(!this.state.editMode) ? <span >{user.get('password')}</span> : <input required={true} maxLength="20" type="password" onChange={this.handleInputChange} value={this.state.form.password} id="password" name="password" />}</td>
                </tr>
                <tr>
                    <td><button onClick={() => { this.deleteAccount() }}>Delete Account</button></td>
                    <td></td>
                            <td>{(!this.state.editMode) ? <button onClick={(e) => { e.preventDefault(); this.toggleEditMode(true); }}>Edit</button> :
                                <button type="submit" >Save</button>}</td>
                </tr>
                    </tbody>
            </table>
            </form>
        </div>)
    }
}