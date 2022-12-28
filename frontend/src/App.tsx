import React from 'react';
import logo from './logo.svg';
import {BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import ButtonUnstyled from '@mui/base/ButtonUnstyled';
import YaraPage from './Pages/GetYara';
import CreateYara from './Pages/CreateYara';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
          <Routes>
            <Route path="/yara/:field/:value" element={<YaraPage/>}/>
            <Route path="/yara/create" element={<CreateYara/>}/>
          </Routes>
        </BrowserRouter>
    </div>
  );
}

export default App;
