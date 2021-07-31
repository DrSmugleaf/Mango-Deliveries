import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';
import FrontPage from './components/FrontPage';
import Login from './components/Login';
import Callback from './components/Callback';
import Contracts from './components/contracts/Contracts';
import Director from './components/director/Director';
import Forbidden from './components/Forbidden';
import NotFound from './components/NotFound';
import InternalError from './components/InternalError';
import WithLogin from "./components/WithLogin";
import { BrowserRouter, Switch, Route } from "react-router-dom"

ReactDOM.render(
  <BrowserRouter>
    <Switch>
      <Route exact path="/">
        <FrontPage />
      </Route>
      <Route exact path="/login">
        <Login />
      </Route>
      <Route exact path="/callback">
        <Callback />
      </Route>
      <Route exact path="/contracts">
        <WithLogin page={<Contracts />} />
      </Route>
      <Route exact path="/director">
        <WithLogin page={<Director />} />
      </Route>
      <Route exact path="/403">
        <Forbidden />
      </Route>
      <Route exact path="/404">
        <NotFound />
      </Route>
      <Route exact path="/500">
        <InternalError />
      </Route>
    </Switch>
  </BrowserRouter>,
  document.getElementById('root')
);

reportWebVitals();
