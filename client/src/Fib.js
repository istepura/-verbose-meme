import React, { Component } from "react";
import axios from "axios";

class Fib extends Component {
    state = {
        seenIndexes: [],
        values: {},
        index: "",
    };

    componentDidMount() {
        this.fetchValues();
        this.fetchIndexes();
    }

    async fetchValues() {
        const values = await axios.get("/api/values/current");
        this.setState({ values: values.data });
    }

    async fetchIndexes() {
        const res = await axios.get("/api/values/all");
        const data = res.data.constructor === Array ? res.data : [];
        this.setState({
            seenIndexes: data,
        });
    }

    handleSubmit = async ev => {
        ev.preventDefault();
        await axios.post("/api/values", {
            index: this.state.index,
        });
        this.setState({ index: "" });
    };

    renderSeen() {
        return this.state.seenIndexes.map(({ number }) => number).join(", ");
    }

    renderValues() {
        const entries = [];
        for (var key in this.state.values) {
            entries.push(
                <div key={key}>
                    For index {key} I calculated {this.state.values[key]}
                </div>
            );
        }
        return entries;
    }

    render() {
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <label htmlFor="">Enter your index:</label>
                    <input
                        value={this.state.index}
                        onChange={ev =>
                            this.setState({ index: ev.target.value })
                        }
                    />
                    <button>Submit</button>
                </form>
                <h3>Indexes I have seen:</h3>
                {this.renderSeen()}
                <h3>Calculated Values:</h3>
                {this.renderValues()}
            </div>
        );
    }
}

export default Fib;
