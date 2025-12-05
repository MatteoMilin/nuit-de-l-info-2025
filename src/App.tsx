import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import { Header } from './components/Header';
import { HomePage } from './pages/Home';
import { AboutPage } from './pages/About';
import { BecomePage } from './pages/Become';
import Snake from './snake/Snake';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route index element={<HomePage />} />
        <Route path='/snake' element={<Snake />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/become" element={<BecomePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
