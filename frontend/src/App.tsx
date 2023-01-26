import React from 'react';
import Header from './Components/Header';
import logo from './logo.svg';
import Container from 'react-bootstrap/Container';
import {BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import GetSnortPage from './Pages/Snort/GetSnort';
import HomePage from './Pages/Countermeasures/HomePage';
import YaraHomePage from './Pages/Yara/YaraHomePage';
import YaraSearchPage from './Pages/Yara/YaraSearchPage';
import YaraRulePage from './Pages/Yara/YaraRulePage';
import MitreHomePage from './Pages/Mitre/MitreHomePage';
import TacticsHomePage from './Pages/Mitre/Tactics/TacticsHomePage';
import TacticPage from './Pages/Mitre/Tactics/TacticPage';
import TechniquesHomePage from './Pages/Mitre/Techniques/TechniqueHomePage';
import TechniquePage from './Pages/Mitre/Techniques/TechniquePage';
import SubtechniquePage from './Pages/Mitre/Subtechniques/SubtechniquePage';
import SubtechniquesHomePage from './Pages/Mitre/Subtechniques/SubtechniquesHomePage';
import YaraTacticPage from './Pages/Mitre/Countermeasures/YaraTacticPage';
import YaraCreatePage from './Pages/Yara/CreateYaraPage';


export default function App() {
  return (
    <Container fluid className="App">
      <BrowserRouter>
        <Header/>
          <Routes>
            <Route path="/countermeasures" element={<HomePage/>}/>

            <Route path="/mitre" element={<MitreHomePage/>}/>
            <Route path="/mitre/tactics" element={<TacticsHomePage/>}/>
            <Route path="/mitre/tactic/:id" element={<TacticPage/>}/>
            <Route path="/mitre/techniques" element={<TechniquesHomePage/>}/>
            <Route path="/mitre/technique/:id" element={<TechniquePage/>}/>
            <Route path="/mitre/subtechniques" element={<SubtechniquesHomePage/>}/>
            <Route path="/mitre/subtechnique/:id" element={<SubtechniquePage/>}/>

            <Route path="/mitre/countermeasure/yara/tactic/:id" element={<YaraTacticPage/>}/>
            
            <Route path="/yara/home" element={<YaraHomePage/>}/>
            <Route path="/yara/search" element={<YaraSearchPage/>}/>
            <Route path="/yara/:id" element={<YaraRulePage/>}/>
            <Route path="/yara/create" element={<YaraCreatePage/>}/>
          
            <Route path="/snort/:field/:value" element={<GetSnortPage/>}/>

            
            
          </Routes>
        </BrowserRouter>
    </Container>
  );
}


