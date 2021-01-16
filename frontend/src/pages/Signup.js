import React, { Component } from "react";
import axios from "axios";

export default class Signup extends Component {
    constructor(props) {
        super (props);

        this.state = {
            email: '',
            password: '',
            password_confirm: '',
            reg_errors: ''
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    handleSubmit(event) {
        const { email, password, password_confirm} = this.state;

        axios.post(
            'http://localhost:3000/backend/api/auth/signup',
            {
                user: {
                    email: email,
                    password: password,
                    password_confirm: password_confirm
                }
            },
            { withCredentials: true }
        )
        ,then(response => {
            if(response.data.status === 'created'){
                this.props.handleSuccessfulAuth(response.data);
            }
        })
        .catch(error => {
            console.log('signup error', error);
        });
        event.preventDefault();
    }

    render() {
        return (
            <div className="Signup">
            <Form onSubmit={this.handleSubmit}>
              <Form.Group size="lg" controlId="email">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  autoFocus
                  name="email"
                  type="email"
                  value={this.state.email}
                  onChange={this.handleChange}
                />
              </Form.Group>
              <Form.Group size="lg" controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  name="password"
                  type="password"
                  value={this.state.password}
                  onChange={this.handleChange}
                />
              </Form.Group>
              <Form.Group size="lg" controlId="password_confirm">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  name="password_confirm"
                  type="password_confirm"
                  value={this.state.password_confirm}
                  onChange={this.handleChange}
                  required
                />
              </Form.Group>
              <Button block size="lg" type="submit" >Register</Button>
            </Form>
            </div>
        )
    }
}