import React from 'react';
import logo from './logo.svg';
import {BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import YaraPage from './Pages/Yara/GetYara';
import CreateYara from './Pages/Yara/CreateYara';
import GetSnortPage from './Pages/Snort/GetSnort';
import SigmaCreatePage from './Pages/Sigma/CreateSigma';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
          <Routes>
            <Route path="/yara/:field/:value" element={<YaraPage/>}/>
            <Route path="/yara/create" element={<CreateYara/>}/>
            <Route path="/snort/:field/:value" element={<GetSnortPage/>}/>

            <Route path="/sigma/create" element={<SigmaCreatePage/>}/>
            
          </Routes>
        </BrowserRouter>
    </div>
  );
}

export default App;
