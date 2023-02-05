import React from 'react';
import Header from './Components/Header';
import Container from 'react-bootstrap/Container';
import {BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
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
import YaraTacticPage from './Pages/Mitre/Countermeasures/Tactic/YaraTacticPage';
import YaraCreatePage from './Pages/Yara/CreateYaraPage';
import UpdateYaraPage from './Pages/Yara/UpdateYaraPage';
import SearchResultPage from './Pages/Yara/SearchResultPage';
import YaraIoCPage from './Pages/Yara/YaraIoCPage';
import YaraIoCSearchPage from './Pages/Yara/YaraIoCSearchPage';
import SnortHomePage from './Pages/Snort/SnortHomePage';
import SnortSearchPage from './Pages/Snort/SnortSearchPage';
import SnortSearchResultPage from './Pages/Snort/SnortSearchResultPage';
import SnortRulePage from './Pages/Snort/SnortRulePage';
import SnortUpdatePage from './Pages/Snort/SnortUpdatePage';
import SnortCreatePage from './Pages/Snort/SnortCreatePage';
import SigmaHomePage from './Pages/Sigma/SigmaHome';
import SigmaCreatePage from './Pages/Sigma/SigmaCreatePage';
import SigmaRulePage from './Pages/Sigma/SigmaRule';
import SigmaSearchPage from './Pages/Sigma/SigmaSearchPage';
import SigmaSearchResultPage from './Pages/Sigma/SigmaSearchResultPage';
import SigmaUpdatePage from './Pages/Sigma/SigmaUpdatePage';
import SnortTacticPage from './Pages/Mitre/Countermeasures/Tactic/SnortTacticPage';
import SigmaTacticPage from './Pages/Mitre/Countermeasures/Tactic/SigmaTacticPage';
import YaraTechniquePage from './Pages/Mitre/Countermeasures/Technique/YaraTechniquePage';
import SnortTechniquePage from './Pages/Mitre/Countermeasures/Technique/SnortTechniquePage';
import SigmaTechniquePage from './Pages/Mitre/Countermeasures/Technique/SigmaTechniquePage';
import YaraSubtechniquePage from './Pages/Mitre/Countermeasures/Subtechnique/YaraSubtechniquePage';
import SnortSubtechniquePage from './Pages/Mitre/Countermeasures/Subtechnique/SnortSubtechniquePage';
import SigmaSubtechniquePage from './Pages/Mitre/Countermeasures/Subtechnique/SigmaSubtechniquePage';
import LayersHomePage from './Pages/Mitre/Layers/LayersHomePage';
import CreateLayerPage from './Pages/Mitre/Layers/CreateLayerPage';

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

            <Route path="/mitre/countermeasure/yara/tactic/:id/:page" element={<YaraTacticPage/>}/>
            <Route path="/mitre/countermeasure/snort/tactic/:id/:page" element={<SnortTacticPage/>}/>
            <Route path="/mitre/countermeasure/sigma/tactic/:id/:page" element={<SigmaTacticPage/>}/>
            <Route path="/mitre/countermeasure/yara/technique/:id/:page" element={<YaraTechniquePage/>}/>
            <Route path="/mitre/countermeasure/snort/technique/:id/:page" element={<SnortTechniquePage/>}/>
            <Route path="/mitre/countermeasure/sigma/technique/:id/:page" element={<SigmaTechniquePage/>}/>
            <Route path="/mitre/countermeasure/yara/subtechnique/:id/:page" element={<YaraSubtechniquePage/>}/>
            <Route path="/mitre/countermeasure/snort/subtechnique/:id/:page" element={<SnortSubtechniquePage/>}/>
            <Route path="/mitre/countermeasure/sigma/subtechnique/:id/:page" element={<SigmaSubtechniquePage/>}/>

            <Route path="/mitre/visualizations/home" element={<LayersHomePage/>}/>
            <Route path="/mitre/layer/create" element={<CreateLayerPage/>}/>
            
            <Route path="/yara/home" element={<YaraHomePage/>}/>
            <Route path="/yara/search" element={<YaraSearchPage/>}/>
            <Route path="/yara/search/:field/:value/:page" element={<SearchResultPage/>}/>
            <Route path="/yara/create" element={<YaraCreatePage/>}/>
            <Route path="/yara/:id" element={<YaraRulePage/>}/>
            <Route path="/yara/update/:id" element={<UpdateYaraPage/>}/>
            <Route path="/yara/test/:id" element={<YaraIoCPage/>}/>
            <Route path="/yara/ioc/search" element={<YaraIoCSearchPage/>}/>
            
            <Route path="/snort/home" element={<SnortHomePage/>}/>
            <Route path="/snort/search" element={<SnortSearchPage/>}/>
            <Route path="/snort/search/:field/:value/:page" element={<SnortSearchResultPage/>}/>
            <Route path="/snort/create" element={<SnortCreatePage/>}/>
            <Route path="/snort/:id" element={<SnortRulePage/>}/>
            <Route path="/snort/update/:id" element={<SnortUpdatePage/>}/>

            <Route path="/sigma/home" element={<SigmaHomePage/>}/>
            <Route path="/sigma/:id" element={<SigmaRulePage/>}/>
            <Route path="/sigma/create" element={<SigmaCreatePage/>}/>
            <Route path="/sigma/search" element={<SigmaSearchPage/>}/>
            <Route path="/sigma/search/:field/:value/:page" element={<SigmaSearchResultPage/>}/>
            <Route path="/sigma/update/:id" element={<SigmaUpdatePage/>}/>
            
          </Routes>
        </BrowserRouter>
    </Container>
  );
}


