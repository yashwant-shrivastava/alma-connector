import React, {Component} from "react";
import { Link } from 'react-router-dom';

class Login extends Component {
    render() {
        return (
            <>
                <h1>
                    Login Page!
                </h1>

                <span>
                    Don't have an account?
                    <Link to="/signup"> Sign up </Link>
                </span>

                <br/>

                <span> Go back <Link to="/"> Home </Link></span>
            </>
        )
    }
}

export default Login;