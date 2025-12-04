import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import { useKonamiCode } from './hooks/useKonamiCode';
import { HomePage } from './pages/Home';
import { activateLaserGame } from './utils/laserGame';

function App() {
  useKonamiCode(() => {
    activateLaserGame();
  });

  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
