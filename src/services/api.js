const API_URL = import.meta.env.VITE_API_URL || '/api/v1';

// Helper pour construire l'URL des images via le proxy
export const getImageUrl = (photoUrl) => {
  if (!photoUrl) return null;
  
  // URL complète → extraire le chemin pour le proxy
  if (photoUrl.startsWith('http://') || photoUrl.startsWith('https://')) {
    try {
      const url = new URL(photoUrl);
      return url;
    } catch {
      return photoUrl;
    }
  }
  
  // Data URL base64 → retourner tel quel
  if (photoUrl.startsWith('data:')) {
    return photoUrl;
  }
  
  // Chemin relatif → le proxy Vite gère
  return photoUrl;
};

// Helper pour parser les réponses
async function parseResponse(response) {
  const contentType = response.headers.get('content-type');
  
  if (contentType && contentType.includes('application/json')) {
    return await response.json();
  }
  
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch {
    return { error: text };
  }
}

// Conversion base64 vers Blob
function base64ToBlob(base64Data, contentType = 'image/jpeg') {
  let base64String = base64Data;
  
  if (base64String.includes(',')) {
    base64String = base64String.split(',')[1];
  }
  
  base64String = base64String.replace(/\s/g, '');
  
  const binaryString = atob(base64String);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  
  return new Blob([bytes], { type: contentType });
}

// Récupérer un séminariste
export const getSeminaristeById = async (identifier) => {
  const url = `${API_URL}/registrations/${identifier}`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    signal: AbortSignal.timeout(15000)
  });
  
  if (!response.ok) {
    const errorData = await parseResponse(response);
    
    if (response.status === 404) {
      throw new Error(`Matricule "${identifier}" non trouvé`);
    }
    
    throw new Error(errorData.detail || `Erreur ${response.status}`);
  }
  
  return await parseResponse(response);
};

// Upload photo
export const uploadSeminaristePhoto = async (matricule, photoBase64) => {
  if (!photoBase64) {
    throw new Error('Photo manquante');
  }
  
  // Détecter le type MIME
  let mimeType = 'image/jpeg';
  if (photoBase64.startsWith('data:')) {
    const match = photoBase64.match(/data:([^;]+);/);
    if (match) mimeType = match[1];
  }
  
  const blob = base64ToBlob(photoBase64, mimeType);
  
  const formData = new FormData();
  formData.append('photo', blob, `${matricule}.jpg`);
  
  const url = `${API_URL}/registrations/${matricule}/photo`;
  
  const response = await fetch(url, {
    method: 'POST',
    body: formData,
    signal: AbortSignal.timeout(30000)
  });
  
  if (!response.ok) {
    const errorData = await parseResponse(response);
    throw new Error(errorData.detail || `Erreur upload: ${response.status}`);
  }
  
  return await parseResponse(response);
};

// Mise à jour des infos
export const updateSeminariste = async (identifier, updateData) => {
  const url = `${API_URL}/registrations/${identifier}`;
  
  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updateData)
  });
  
  if (!response.ok) {
    const errorData = await parseResponse(response);
    throw new Error(errorData.detail || `Erreur ${response.status}`);
  }
  
  return await response.json();
};
