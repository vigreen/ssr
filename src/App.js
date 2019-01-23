import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { Helmet } from 'react-helmet';

class App extends Component {
  createHead = () => {
    return (
      <Helmet>
        <title>Server-Side Rendering</title>
        <meta name="description" content="Get metas for React Server" />
      </Helmet>
    )
  }

  render() {
    return (
      <div className="App">
        {this.createHead()}
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
          <button onClick={() => console.log('Some text')}>Console</button>
        </header>
      </div>
    );
  }
}

export default App;
