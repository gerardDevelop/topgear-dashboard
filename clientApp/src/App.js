import React, { Component } from 'react';
import './App.css';
import TestComponent from './Components/TestComponent';
import TokenSurvey2 from './Components/TokenSurvey2';
import TestLayout from './Components/TestLayout';
import { Route, Switch } from 'react-router-dom';

/*
  TODO - add admin dashboard component
*/

class App extends Component {

  render() {
    const appContents = (
      <div>
        
      </div>);

    return (
      <Switch>
          <Route exact path="/" component={TestComponent}></Route>
          <Route exact path="/survey" component={TokenSurvey2}></Route>
          <Route exact path="/testlayout" component={TestLayout}></Route>
      </Switch>
    );
  }
}

export default App;
