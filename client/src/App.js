import React, { Component } from 'react';
import './App.css';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import AdminPanel from './components/AdminPanel';
import Home from './components/Home';
import { Container } from 'reactstrap';

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <Container>
            <Route exact path="/" component={Home} />
            <Route exact path="/admin" component={AdminPanel} />
          </Container>
        </div>
      </Router>
    );
  }
}

export default App;
