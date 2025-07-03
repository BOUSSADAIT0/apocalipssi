import React from 'react';
import './Sidebar.css';
import logo from './assets/logocolor.png';
import newIcon from './assets/edit.png';
import profilIcon from './assets/user-2.png';
import logoutIcon from './assets/logout.png';

function Sidebar({ onLogout, onNavigate }) {
  return (
    <div className="sidebar">
      <img src={logo} alt="Logo" className="logo" />

      <nav className="nav">
        <button className="nav-item" onClick={() => onNavigate('home')}>
          <img src={newIcon} alt="Icône résumé" className="icon" /> nouveau résumé
        </button>

        <button className="nav-item" onClick={() => onNavigate('dashboard')}>
          voir l’historique
        </button>
      </nav>

      <div className="bottom">
        <button className="profile nav-item">
          <img src={profilIcon} alt="Icône profil" className="icon" /> profil
        </button>

        <button className="logout nav-item" onClick={onLogout}>
          <img src={logoutIcon} alt="Icône déconnexion" className="icon" /> déconnexion
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
