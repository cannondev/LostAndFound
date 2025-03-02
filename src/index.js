import React from 'react';
import ReactDOM from 'react-dom/client';
import MainRouter from './components/index'; // Import MainRouter

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <MainRouter /> {/* Main router without any extra wrapping */}
  </React.StrictMode>,
);
