import React, { useState, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './header.css';
import logo from '../imagenes/logo.png';
import { AuthContext } from '../context/AuthContext.js';
import BotonAzul from "../ui/botonAzul"
const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, handleLogout } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const userEmail = user ? user.email : 'Invitado';

  const toggleMenu = () => {
    if (location.pathname !== '/') {
      setIsMenuOpen(!isMenuOpen);
    }
  };

  const logoutAndCloseMenu = () => {
    handleLogout();
    setIsMenuOpen(false);
    navigate('/'); // Redirige a la raíz después de cerrar sesión
  };

  return (
    <header className="header">
      <div className="logo">
        <Link to="/home">
          <img src={logo} alt="Logo" />
        </Link>
      </div>
      <div className="menu-icon" onClick={toggleMenu}>
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
      </div>
      {isMenuOpen && location.pathname !== '/' && (
        <div className="menu">
          <button className="close-menu" onClick={toggleMenu}>✖</button>
          <ul>
            <li>
              <Link to="/mis-datos" onClick={toggleMenu}>Mis datos</Link>
            </li>
            <li>
              <Link to="/mascotas-reportadas" onClick={toggleMenu}>Mis mascotas reportadas</Link>
            </li>
            <li>
              <Link to="/reportar-mascota" onClick={toggleMenu}>Reportar mascota</Link>
            </li>
            <li className="email">{userEmail}</li>
            <li className="logout">
              <BotonAzul onClick={logoutAndCloseMenu}>CERRAR SESIÓN</BotonAzul>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
};

export default Header;
