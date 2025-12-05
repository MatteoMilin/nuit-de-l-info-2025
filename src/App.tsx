import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import { Header } from './components/Header';
import { HomePage } from './pages/Home';
import { MusicalLogin } from './pages/MusicalLogin';
import { AboutPage } from './pages/About';
import { BecomePage } from './pages/Become';
import { ClashRoyalePage } from './pages/ClashRoyale';
import { CaptchaProvider } from './contexts/CaptchaContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import Snake from './snake/Snake';

function App() {
  return (
    <CaptchaProvider>
      <BrowserRouter>
        <Routes>
          <Route index element={<ClashRoyalePage />} />

          <Route path="/login" element={<ProtectedRoute><><Header /><MusicalLogin /></></ProtectedRoute>} />
          <Route path="/home" element={<ProtectedRoute><><Header /><HomePage /></></ProtectedRoute>} />
          <Route path="/snake" element={<ProtectedRoute><><Header /><Snake /></></ProtectedRoute>} />
          <Route path="/about" element={<ProtectedRoute><><Header /><AboutPage /></></ProtectedRoute>} />
          <Route path="/become" element={<ProtectedRoute><><Header /><BecomePage /></></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </CaptchaProvider>
  );
}

export default App;
