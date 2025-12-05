import { Link } from 'react-router-dom';
import '../style/Header.css';

export function Header() {
  return (
    <header className="retro-header">
      <div className="retro-title">TechnoFut</div>

      <nav className="retro-nav">
        <Link to="/">Accueil</Link>
        <Link to="/about">À propos</Link>
        <Link to="/become">Etre NIRD</Link>
      </nav>
    </header>
  );
}
