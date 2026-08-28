import { NavLink, useNavigate } from 'react-router-dom';

const items = [
  { label: 'Dashboard', to: '/' },
  { label: 'Produtos', to: '/produtos' },
  { label: 'Categorias', to: '/categorias' },
  { label: 'Movimentações', to: '/movimentacoes' },
];

export function TopNav() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    navigate('/login');
  };

  return (
    <header className="topbar">
      <div className="brand-block">
        <div className="brand-mark">I</div>
        <div>
          <strong>INFO TEC</strong>
          <small>Gestão operacional</small>
        </div>
      </div>

      <nav className="nav-menu" aria-label="Navegação principal">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <button type="button" className="logout-button" onClick={handleLogout}>
        Sair
      </button>
    </header>
  );
}
