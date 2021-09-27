import React, {Component} from 'react';
import { Link } from 'react-router-dom';

class Signup extends Component {
    render() {
        return (
            <>
                <h1>
                    Sign up
                </h1>

                <span>
                    Already have an account>
                    <Link to="/login">Log In</Link>
                </span>

                <br/>

                <span> Go back <Link to="/"> Home </Link></span>
            </>
        )
    }
}

export default Signup;