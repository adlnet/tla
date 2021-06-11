import React, { Component } from 'react';
import './App.css';
import NavBar from './components/NavBar';
import { Route, Switch} from 'react-router-dom';
import Visualizer from './containers/Visualizer';
import Landing from './containers/Landing';
import Repository from './containers/Repository';
import { withCookies } from 'react-cookie';

class App extends Component {
  constructor() {
    super();
    this.state = {
      error: null
    }
  }

  // calls the backend page upon initial page render
  componentDidMount() {
    this.callExpress()
    .then(res => console.log(res))
    .catch(err => console.log(err));
  }

  // tests to see that the backend Express server is hooked up
  callExpress = async () => {
    const response = await fetch('http://localhost:5000/');
    const body = await response.json();
    debugger
    if (response.status !== 200) {
      throw Error(body.message)
    }
    return body;
    

  }

  render() {
    return (
      <div id="page-container">
        <div id="content-wrap">
          <NavBar/>
          <Switch>
            <Route exact path="/visualizer" render={()=>{
              return <div><Visualizer/></div>
            }}/>
            <Route exact path="/repositories" render={()=>{
              return <div><Repository/></div>
            }}/>
            <Route path="/" render={()=>{
              return <div><Landing/></div>
            }}/>
          </Switch>
        </div>
        <footer>
          <div className="footer">
            
          </div>
        </footer>
      </div>
    );
  }
}

export default withCookies(App);
