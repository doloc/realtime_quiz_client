import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { AdminRoom } from './pages/AdminRoom';
import { PlayerRoom } from './pages/PlayerRoom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin/:roomId" element={<AdminRoom />} />
        <Route path="/play/:roomId" element={<PlayerRoom />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;