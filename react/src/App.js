import React, { Component } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import StyledDrawer from './Drawer';


class App extends Component {
    render() {
        return (
            <Router>
              <div style={{height: "100%"}}>
                <StyledDrawer>
                </StyledDrawer>
              </div>
            </Router>
        );
    }
}

export default App;
