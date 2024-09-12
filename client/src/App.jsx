import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { EthProvider } from './contexts/EthContext';
import Navbar from './components/Navbar';
import Balance from './components/Balance';
import Donate from './components/Donate';
import Info from './components/Info';
import Register from './components/Register';

function App() {
  return (
    <EthProvider>
      <Router>
        <div id="App">
          <Navbar />
          <div className="flex justify-center">
            <Routes>
              <Route path="/" element={<Info />} />
              <Route path="/register" element={<Register />} />
              <Route path="/donate" element={<Donate />} />
              <Route path="/balance" element={<Balance />} />
              <Route path="*" element={<h1>404 Not Found</h1>} />
            </Routes>
          </div>
        </div>
      </Router>
    </EthProvider>
  );
}

export default App;
