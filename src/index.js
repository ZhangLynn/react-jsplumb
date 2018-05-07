import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import JsPlumbDemo from './components/JsPlumb';
import JointJSDemo from './components/JointJS';
import { Router, Route, Redirect } from 'react-router-dom';
import createBrowserHistory from 'history/createBrowserHistory'
import registerServiceWorker from './registerServiceWorker';
import './styles/style.less';

const history = createBrowserHistory()

ReactDOM.render(
  <Router history={history}>
    <div>
      <Route path="/" exact render={ () => <Redirect to="/jsplumb" /> } />
      <Route path="/jsplumb" component={JsPlumbDemo}/>
      <Route path="/jointjs" component={JointJSDemo}/>
    </div>
  </Router>, document.getElementById('app'));
registerServiceWorker();
