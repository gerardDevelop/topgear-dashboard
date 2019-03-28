import React, { Component } from 'react';
import logo from '../logo.svg';
import '../App.css';


class TestComponent extends Component {

  componentDidMount() {
    console.log("component did mount.");
  }

  render() {  
    return (
      <div className="App">
        <header className="App-header">

          <a
            className="App-link"
            href="/survey?token=303d1eb2-ddb8-486c-a823-02af2365beb6"
            target="_blank"
            rel="noopener noreferrer"
          >
            View survey (for customer)
          </a>

          <a
            className="App-link"
            href="/survey2?token=303d1eb2-ddb8-486c-a823-02af2365beb6"
            target="_blank"
            rel="noopener noreferrer"
          >
            View survey 2 (for customer)
          </a>

          <a
            className="App-link"
            href="/testLayout"
            target="_blank"
            rel="noopener noreferrer"
          >
            View testlayout
          </a>

        </header>
      </div>
    );
  }
}

export default TestComponent;