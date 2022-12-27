import React from 'react';
import logo from './logo.svg';
import {BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import ButtonUnstyled from '@mui/base/ButtonUnstyled';
import YaraPage from './Pages/GetYara';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
          <Routes>
            <Route path="/yara/:field/:value" element={<YaraPage/>}/>
          </Routes>
        </BrowserRouter>
    </div>
  );
}

export default App;
