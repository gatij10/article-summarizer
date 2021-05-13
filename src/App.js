import React from 'react';
import Title from './components/Layout/PageHeader';
import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import NltkSummarizer from '../src/components/Pages/NltkSummarizer';
// import GraphSummarizer from './components/Pages/GraphSummarizer';
import SearchSummary from './components/Pages/SearchSummary';

const App = () => {
  return (
    <Router>
      <div className='App'>
        <Title />
        <Switch>
          <Route exact path='/' component={SearchSummary}></Route>
          <Route exact path='/nltk' component={NltkSummarizer}></Route>
        </Switch>
      </div>
    </Router>
  );
};

export default App;
