import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import Mainpage from './components/mainPage';
import Registerpage from './components/Registerpage';
import Profile from './components/Profile';

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Mainpage/>}/>
          <Route path="/register" element={<Registerpage/>}/>
          <Route path="/profile" element={<Profile/>}/>
        </Routes>
      </Router>
    </>
  )
}

export default App
