import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from "./Home";
import Register from "./Register";
import CreateChannel from "./CreateChannel";

export default function Root() {
    return (
        <Router>
            <Switch>
                <Route path="/home/:name?" exact component={Home} />
                <Route path="/register" exact component={Register} />
                <Route path="/create-channel" exact component={CreateChannel} />
            </Switch>
        </Router>
    );
}
