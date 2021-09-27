import React, {Component} from 'react';
import { Switch, Route } from 'react-router-dom';
import Home from "./components/home/home";
import Login from './components/login/login';
import Signup from "./components/login/signup";

class Router extends Component {
    render() {
        return (
            <Switch>
                <Route exact path="/">
                    <Home/>
                </Route>
                <Route exact path="/login">
                    <Login/>
                </Route>
                <Route exact path="/signup">
                    <Signup/>
                </Route>
            </Switch>
        )
    }
}

export default Router;

