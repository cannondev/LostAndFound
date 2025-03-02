import React from 'react';
import {
  BrowserRouter as Router, Route, Routes,
} from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import LoadingPage from './Loading';
import WhereFrom from './WhereFrom';
import App from './App';

function LoadingScreen() {
  return (
    <div>
      <LoadingPage />
    </div>
  );
}

function WhereFromScreen() {
  return (
    <div>
      <WhereFrom />
    </div>
  );
}

function MainRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoadingScreen />} />
        <Route path="/wherefrom" element={<WhereFromScreen />} />
        <Route path="/app" element={<App />} />
      </Routes>
    </Router>
  );
}

export default MainRouter;
