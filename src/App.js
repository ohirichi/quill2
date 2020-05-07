import React from 'react';
import './App.css';
import CssBaseline from '@material-ui/core/CssBaseline';
import {Navbar, Footer} from './components/index';
import Routes from './routes'

function App() {
  return (
    <div className="App">
      <CssBaseline />
      <Navbar className="navbar" />
      <Routes className="content" />
      <Footer className="footer" />
    </div>
  );
}


export default App;
