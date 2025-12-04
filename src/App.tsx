import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import { HomePage } from './pages/Home';
import Snake from './snake/Snake';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index path='/snake' element={<Snake />} />
        <Route index element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
