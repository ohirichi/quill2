import React from 'react';
import './App.css';
import CssBaseline from '@material-ui/core/CssBaseline';
import {Navbar, Footer} from './components/index';
import Routes from './routes'

function App() {
  return (
    <div className="App">
      <CssBaseline />
      <Navbar />
      <Routes />
      <div className="footer">
        <Footer  />
      </div>
    </div>
  );
}


export default App;
