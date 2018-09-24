import React, { Component } from 'react';
import {
    BrowserRouter as Router,
    Route
} from 'react-router-dom';
import StyledDrawer from './Drawer';


const Home = () => (
    <div>home!!!</div>
);


const Map = () => (
    <div>map!!!</div>
);


const Terrain = () => (
    <div>terrain!!!</div>
);


const Starred = () => (
    <div>star!!!</div>
);


class App extends Component {
    render() {
        return (
            <Router>
              <div style={{height: "100%"}}>
                <StyledDrawer title="Home">
                  <Route exact path="/" component={Home}/>
                  <Route exact path="/map" component={Map}/>
                  <Route exact path="/terrain" component={Terrain}/>
                  <Route exact path="/star" component={Starred}/>
                </StyledDrawer>

              </div>
            </Router>
        );
    }
}

export default App;
