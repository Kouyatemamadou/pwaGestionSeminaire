import { useState, useRef } from 'react';
import './PhotoCapture.css';

const PhotoCapture = ({ onPhotoCapture, currentPhoto }) => {
  const [preview, setPreview] = useState(currentPhoto || null);
  const cameraInputRef = useRef(null);
  const galleryInputRef = useRef(null);

  const handleCameraInput = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
        onPhotoCapture(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGalleryInput = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
        onPhotoCapture(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const openCamera = () => {
    cameraInputRef.current?.click();
  };

  const openGallery = () => {
    galleryInputRef.current?.click();
  };

  const resetPhoto = () => {
    setPreview(null);
    onPhotoCapture(null);
  };

  return (
    <div className="photo-capture-container">
      <h3>📷 Photo du séminariste</h3>

      {!preview ? (
        <div className="photo-actions">
          <button 
            onClick={openCamera}
            className="btn-camera"
            type="button"
          >
            📷 Prendre une photo
          </button>
          
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleCameraInput}
            style={{ display: 'none' }}
          />

          <button 
            onClick={openGallery}
            className="btn-gallery"
            type="button"
          >
            🖼️ Choisir depuis la galerie
          </button>
          
          <input
            ref={galleryInputRef}
            type="file"
            accept="image/*"
            onChange={handleGalleryInput}
            style={{ display: 'none' }}
          />
        </div>
      ) : (
        <div className="photo-preview">
          <img src={preview} alt="Photo" />
          <button 
            onClick={resetPhoto}
            className="btn-change"
            type="button"
          >
            🔄 Changer la photo
          </button>
        </div>
      )}
    </div>
  );
};

export default PhotoCapture;
