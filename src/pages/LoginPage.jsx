import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './LoginPage.css';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(username, password);
    
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error || 'Erreur de connexion');
    }
    
    setLoading(false);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
        <h1>
          <div className="logo-login">
            <img src="/logo-seminaire.png" alt="Logo" className="logo-main" />
          </div>
        </h1>
        <h1>Gestion Séminaristes</h1>
        </div>

        <h2>Commission Administration</h2>
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Nom d'utilisateur</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Mot de passe</label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? "Cacher le mot de passe" : "Afficher le mot de passe"}
              >
                {showPassword ? (
                  // Icône œil barré (cacher)
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                ) : (
                  // Icône œil (afficher)
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                )}
              </button>
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="btn-login" disabled={loading}>
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        {/* Aide pour les tests */}
        <div style={{ 
          marginTop: '25px', 
          padding: '15px', 
          background: 'linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%)',
          borderRadius: '12px',
          border: '2px solid var(--primary-green-light)',
          fontSize: '13px'
        }}>
          <p style={{ margin: '5px 0', fontWeight: 'bold' }}>
            👤 Identifiants de test:
          </p>
          <p style={{ margin: '5px 0' }}>
            Username: <code style={{ 
              background: 'white', 
              padding: '3px 8px', 
              borderRadius: '4px',
              fontFamily: 'monospace',
              color: 'var(--primary-green)',
              fontWeight: 600
            }}>admin</code>
          </p>
          <p style={{ margin: '5px 0' }}>
            Password: <code style={{ 
              background: 'white', 
              padding: '3px 8px', 
              borderRadius: '4px',
              fontFamily: 'monospace',
              color: 'var(--primary-green)',
              fontWeight: 600
            }}>admin123</code>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
