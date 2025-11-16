import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './HomePage.css';

const HomePage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [cameraPermission, setCameraPermission] = useState(null);

  // Demander l'autorisation de la caméra dès l'arrivée sur la page
  useEffect(() => {
    requestCameraPermission();
  }, []);

  const requestCameraPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      
      // Arrêter immédiatement le stream (on demande juste la permission)
      stream.getTracks().forEach(track => track.stop());
      
      setCameraPermission('granted');
      console.log('✅ Permission caméra accordée');
    } catch (error) {
      console.error('❌ Permission caméra refusée:', error);
      setCameraPermission('denied');
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="home-page">
      <header className="app-header">
        <h1>
          <img src="/logo-seminaire.png" alt="Logo" className="header-logo logo-circle" />
          Gestion Séminaristes An-nour
        </h1>

        <div className="user-info">
          <span>Bienvenue, {user?.username}</span>
          <button onClick={handleLogout} className="btn-logout">
            Déconnexion
          </button>
        </div>
      </header>

      <main className="home-content">
        <div className="welcome-card">
          <div className="logo-section">
            <div className="logo-circle">
              <img src="/logo-seminaire.png" alt="Logo Séminaire" className="logo-main" />
            </div>

          </div>
          
          <h2>Commission Administration</h2>
          <p>
            Scannez le QR code d'un séminariste pour modifier ses informations 
            et ajouter sa photo.
          </p>

          {/* Afficher l'état de la permission caméra */}
          {cameraPermission === 'denied' && (
            <div className="camera-warning">
              <p>⚠️ Accès à la caméra refusé</p>
              <p style={{ fontSize: '14px', marginTop: '8px' }}>
                Veuillez autoriser l'accès à la caméra dans les paramètres de votre navigateur
              </p>
            </div>
          )}
          
          <button 
            onClick={() => navigate('/scan')} 
            className="btn-scan-primary"
          >
            📱 Scanner un QR Code
          </button>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
