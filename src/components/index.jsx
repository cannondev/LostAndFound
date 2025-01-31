import React from 'react';
import {
  useParams, BrowserRouter, Routes, Route, NavLink,
} from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import './style.scss';

function About() {
  return (
    <div className="content">
      <p>I am a passionate designer & developer working on fun projects!</p>
      <div className="mycutegiphy">
        <img
          src="https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExcWJ5c3JlZHM4dTNnbHphZTdwcW5lN2Nvdmd4a2RtdzRrMDhhZXA2diZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/wKWxuUOcp9fdvckBty/giphy.gif"
          alt=""
        />
      </div>
    </div>
  );
}

function Welcome() {
  return (
    <div className="content">
      <p>Hi Im Cinay! Welcome to my personal site 🌸</p>
      <div className="mycutegiphy">
        <img
          src="https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExaTk3bnByOHAxMTk0bGI5M2xkc2EzcWM0MTZvMmZhdmE4NWo3eG9obCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/llm9DohTOuVh8Vl8oX/giphy.gif"
          alt=""
        />
      </div>
    </div>
  );
}

function Nav() {
  return (
    <nav>
      <ul>
        <li><NavLink to="/" className="nav-link">Home</NavLink></li>
        <li><NavLink to="/about" className="nav-link">About</NavLink></li>
        <li><NavLink to="/test/id1" className="nav-link">Test ID1</NavLink></li>
        <li><NavLink to="/test/id2" className="nav-link">Test ID2</NavLink></li>
      </ul>
    </nav>
  );
}

function Test() {
  const { id } = useParams();
  return <div className="content">Testing dynamic route ID: <strong>{id}</strong></div>;
}

function FallBack() {
  return <div>URL Not Found</div>;
}

function App() {
  return (
    <BrowserRouter>
      <div className="appbox">
        <Nav />
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/about" element={<About />} />
          <Route path="/test/:id" element={<Test />} />
          <Route path="*" element={<FallBack />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

const root = createRoot(document.getElementById('main'));
root.render(<App />);
