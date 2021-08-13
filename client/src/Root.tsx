import * as React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import HomePage from './scenes/Home';

export default () => {
  return (
    <Router>
      <main className="main">
        <Switch>
          <Route exact path="/" component={HomePage} />
        </Switch>
      </main>
    </Router>
  );
};
