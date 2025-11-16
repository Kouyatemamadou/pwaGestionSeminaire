import { MOCK_USERS, delay } from './mockData';

// Mode développement : true = utiliser les mocks, false = utiliser l'API réelle
const USE_MOCK = true;
const API_BASE_URL = 'http://localhost:8000';

export const loginUser = async (username, password) => {
  if (USE_MOCK) {
    // Mode mock
    await delay(800); // Simuler un délai réseau
    
    const user = MOCK_USERS.find(
      u => u.username === username && u.password === password
    );

    if (!user) {
      throw new Error('Identifiants incorrects');
    }

    // Simuler un token JWT
    const mockToken = btoa(JSON.stringify({ 
      userId: user.id, 
      username: user.username,
      role: user.role 
    }));

    return {
      access_token: mockToken,
      token_type: 'bearer',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    };
  } else {
    // Mode API réelle
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);

    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formData
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Erreur de connexion');
    }

    return response.json();
  }
};

export const verifyToken = async (token) => {
  if (USE_MOCK) {
    await delay(200);
    
    try {
      const decoded = JSON.parse(atob(token));
      const user = MOCK_USERS.find(u => u.id === decoded.userId);
      
      if (!user) {
        throw new Error('Token invalide');
      }

      return {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      };
    } catch (error) {
      throw new Error('Token invalide');
    }
  } else {
    const response = await fetch(`${API_BASE_URL}/auth/verify`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Token invalide');
    }

    return response.json();
  }
};

export const logoutUser = async () => {
  if (USE_MOCK) {
    await delay(200);
    return true;
  } else {
    const token = localStorage.getItem('token');
    
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    return response.ok;
  }
};

export const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};
