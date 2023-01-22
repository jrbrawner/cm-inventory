import React from 'react';
import Header from './Components/Header';
import logo from './logo.svg';
import Container from 'react-bootstrap/Container';
import {BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import YaraPage from './Pages/Yara/GetYara';
import CreateYara from './Pages/Yara/CreateYara';
import GetSnortPage from './Pages/Snort/GetSnort';
import SigmaCreatePage from './Pages/Sigma/CreateSigma';
import SigmaRebuildPage from './Pages/Sigma/RebuildRule';
import HomePage from './Pages/Countermeasures/HomePage';
import YaraHomePage from './Pages/Yara/YaraHomePage';
import YaraSearchPage from './Pages/Yara/YaraSearchPage';

export default function App() {
  return (
    <Container fluid className="App">
      <BrowserRouter>
        <Header/>
          <Routes>
            <Route path="/countermeasures" element={<HomePage/>}/>
            
            <Route path="/yara/search" element={<YaraSearchPage/>}/>
            <Route path="/yara/home" element={<YaraHomePage/>}/>
            <Route path="/yara/:field/:value" element={<YaraPage/>}/>
            <Route path="/yara/create" element={<CreateYara/>}/>

            <Route path="/snort/:field/:value" element={<GetSnortPage/>}/>

            <Route path="/sigma/create" element={<SigmaCreatePage/>}/>
            <Route path="/sigma/rebuild/:id" element={<SigmaRebuildPage/>}/>
            
          </Routes>
        </BrowserRouter>
    </Container>
  );
}


