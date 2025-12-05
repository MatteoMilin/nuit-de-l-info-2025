import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import { Header } from './components/Header';
import { ProtectedRoute } from './components/ProtectedRoute';
import { CaptchaProvider } from './contexts/CaptchaContext';
import { useKonamiCode } from './hooks/useKonamiCode';
import { AboutPage } from './pages/About';
import { BecomePage } from './pages/Become';
import { ClashRoyalePage } from './pages/ClashRoyale';
import { HomePage } from './pages/Home';
import { MusicalLogin } from './pages/MusicalLogin';
import Snake from './snake/Snake';
import { activateLaserGame } from './utils/laserGame';

function App() {
  useKonamiCode(() => {
    activateLaserGame();
  });

  return (
    <CaptchaProvider>
      <BrowserRouter>
        <Routes>
          <Route index element={<ClashRoyalePage />} />

          {/* <Route path="/login" element={<ProtectedRoute><Header /><MusicalLogin /></ProtectedRoute>} /> */}
          {/* <Route path="/home" element={<ProtectedRoute><Header /><HomePage /></ProtectedRoute>} /> */}
          {/* <Route path="/snake" element={<ProtectedRoute><Header /><Snake /></ProtectedRoute>} /> */}
          {/* <Route path="/about" element={<ProtectedRoute><Header /><AboutPage /></ProtectedRoute>} /> */}
          {/* <Route path="/become" element={<ProtectedRoute><Header /><BecomePage /></ProtectedRoute>} /> */}
          
          <Route path="/login" element={<><Header /><MusicalLogin /></>} />
          <Route path="/home" element={<><Header /><HomePage /></>} />
          <Route path="/snake" element={<><Header /><Snake /></>} />
          <Route path="/about" element={<><Header /><AboutPage /></>} />
          <Route path="/become" element={<><Header /><BecomePage /></>} />
        </Routes>
      </BrowserRouter>
    </CaptchaProvider>
  );
}

export default App;
