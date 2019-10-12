import React from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import OtherPage from "./OtherPage";
import Fib from "./Fib";
import logo from "./logo.svg";

function App() {
    return (
        <Router>
            <div className="App">
                <header>
                    <h1 className="App-header">
                        <img
                            className="App-logo"
                            alt="logo"
                            src={logo}
                            height="100"
                            width="100"
                        ></img>
                        <Link className="App-link" to="/">
                            Home
                        </Link>
                        <Link className="App-link" to="/otherpage">
                            Other Page
                        </Link>
                    </h1>
                </header>
                <div>
                    <Route exact path="/" component={Fib} />
                    <Route path="/otherpage" component={OtherPage} />
                </div>
            </div>
        </Router>
    );
}

export default App;
