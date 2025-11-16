import { useState, useEffect } from 'react';
import { uploadSeminaristePhoto, getImageUrl } from '../services/api';
import PhotoCapture from './PhotoCapture';
import LoadingSpinner from './LoadingSpinner';
import './SeminaristeForm.css';

const SeminaristeForm = ({ seminaristeData, onSuccess, onCancel }) => {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);
  const [photoValidated, setPhotoValidated] = useState(false);

  useEffect(() => {
    if (seminaristeData?.photo_url) {
      const fullPhotoUrl = getImageUrl(seminaristeData.photo_url);
      setPhoto(fullPhotoUrl);
      setPhotoValidated(false);
    }
  }, [seminaristeData]);

  const handlePhotoCapture = (photoData) => {
    setPhoto(photoData);
    setPhotoValidated(false);
    setError(null);
  };

  const handleChangePhotoClick = () => {
    setPhoto(null);
    setPhotoValidated(false);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!photo) {
      alert('⚠️ Veuillez ajouter une photo');
      return;
    }

    const currentPhotoUrl = getImageUrl(seminaristeData?.photo_url);
    if (photo === currentPhotoUrl) {
      alert('ℹ️ Aucune modification détectée');
      return;
    }

    setSaving(true);
    setError(null);
    setSuccessMessage('');
    setShowSuccessBanner(false);

    try {
      await uploadSeminaristePhoto(seminaristeData.matricule, photo);

      setSuccessMessage('📸 Photo enregistrée avec succès !');
      setShowSuccessBanner(true);
      setPhotoValidated(true);

      setTimeout(() => {
        setShowSuccessBanner(false);
        setSuccessMessage('');
      }, 3000);

    } catch (err) {
      setError(err.message || 'Erreur lors de l\'upload');
    } finally {
      setSaving(false);
    }
  };

  if (!seminaristeData) return null;

  const getInitials = () => {
    const nom = seminaristeData.nom || '';
    const prenom = seminaristeData.prenom || '';
    return (nom.charAt(0) || '').toUpperCase() + (prenom.charAt(0) || '').toUpperCase();
  };

  return (
    <>
      {saving && <LoadingSpinner message="Upload de la photo..." />}

      {showSuccessBanner && (
        <div className="success-banner">
          ✅ Photo enregistrée avec succès !
        </div>
      )}

      <div className="seminariste-form-container">
        <h2>📋 {seminaristeData.prenom} {seminaristeData.nom}</h2>
        <p className="matricule-display">Matricule: <strong>{seminaristeData.matricule}</strong></p>

        {successMessage && (
          <div className="success-message">{successMessage}</div>
        )}

        <div className="info-card">
          <div className="info-header">
            <h3>Données du séminariste</h3>

            <div className="profile-avatar">
              {photo ? (
                <img src={photo} alt="Photo" className="avatar-photo" />
              ) : (
                <div className="avatar-initials">{getInitials()}</div>
              )}
            </div>
          </div>

          <div className="info-grid">
            <div className="info-item"><span className="label">Genre:</span><span className="value">{seminaristeData.sexe === 'M' ? 'Masculin' : 'Féminin'}</span></div>
            <div className="info-item"><span className="label">Âge:</span><span className="value">{seminaristeData.age} ans</span></div>
            <div className="info-item"><span className="label">Niveau:</span><span className="value">{seminaristeData.niveau_academique}</span></div>
            <div className="info-item"><span className="label">Commune:</span><span className="value">{seminaristeData.commune_habitation}</span></div>
            <div className="info-item"><span className="label">Dortoir:</span><span className="value">{seminaristeData.dortoir_name}</span></div>
            <div className="info-item"><span className="label">Code:</span><span className="value">{seminaristeData.dortoir_code}</span></div>
          </div>
        </div>

        {!photo && (
          <PhotoCapture 
            onPhotoCapture={handlePhotoCapture} 
            currentPhoto={photo}
          />
        )}

        {photo && (
          <div className="photo-section">
            <h3>📷 Photo actuelle</h3>
            <div className="photo-preview-large">
              <img src={photo} alt="Photo du séminariste" />
            </div>

            <button 
              type="button"
              onClick={handleChangePhotoClick}
              className="btn-change-photo"
              disabled={saving}
            >
              🔄 Changer la photo
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="photo-form">

          {error && <div className="error-message">❌ {error}</div>}

          <div className="form-actions">
            <button 
              type="button"
              onClick={onCancel}
              className="btn-cancel-form"
              disabled={saving}
            >
              Annuler
            </button>
            
            <button 
              type="submit" 
              className="btn-submit" 
              disabled={
                saving || 
                !photo || 
                photo === getImageUrl(seminaristeData?.photo_url) ||
                photoValidated
              }
            >
              {saving ? 'Upload...' : photoValidated ? '✔ Photo validée' : '💾 Valider la photo'}
            </button>
          </div>
        </form>

        {/* 🔥 Bouton ajouté : renvoyer vers la page de scan */}
        <div style={{ marginTop: 20, textAlign: 'center' }}>
          <button 
            className="btn-new-scan"
            onClick={onSuccess} 
          >
            📡 Scanner un nouveau QR Code
          </button>
        </div>

      </div>
    </>
  );
};

export default SeminaristeForm;
