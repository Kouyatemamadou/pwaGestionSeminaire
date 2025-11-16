import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Html5Qrcode } from 'html5-qrcode';
import './QRScanner.css';

const QRScanner = ({ onScanSuccess }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState(null);
  const scannerRef = useRef(null);
  const isMountedRef = useRef(true);
  const navigate = useNavigate();

  useEffect(() => {
    isMountedRef.current = true;

    // Démarrer après un court délai
    const timer = setTimeout(() => {
      if (isMountedRef.current) {
        startBackCamera();
      }
    }, 500);

    return () => {
      isMountedRef.current = false;
      clearTimeout(timer);
      cleanupScanner();
    };
  }, []); // ✅ Tableau vide pour s'exécuter UNE SEULE FOIS

  const cleanupScanner = async () => {
    if (scannerRef.current) {
      try {
        const scanner = scannerRef.current;
        if (scanner.isScanning) {
          await scanner.stop();
        }
        await scanner.clear();
        console.log('🧹 Scanner nettoyé');
      } catch (err) {
        console.error('Erreur nettoyage:', err);
      }
      scannerRef.current = null;
    }
  };

  const startBackCamera = async () => {
    // ✅ Vérifier qu'il n'y a pas déjà un scanner actif
    if (scannerRef.current) {
      console.log('⚠️ Scanner déjà actif, arrêt d\'abord...');
      await cleanupScanner();
    }

    try {
      setError(null);
      console.log('🎥 Initialisation du scanner...');

      const html5QrCode = new Html5Qrcode("qr-reader");
      scannerRef.current = html5QrCode;

      const config = {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0
      };

      console.log('🎥 Démarrage caméra arrière...');

      await html5QrCode.start(
        { facingMode: "environment" },
        config,
        (decodedText) => {
          if (isMountedRef.current) {
            console.log('✅ QR Code scanné:', decodedText);
            onScanSuccess(decodedText);
            cleanupScanner();
          }
        },
        (errorMessage) => {
          // Erreurs normales de scan
        }
      );

      if (isMountedRef.current) {
        setIsScanning(true);
        console.log('✅ Scanner actif');
      }
    } catch (err) {
      console.error('❌ Erreur:', err);
      if (isMountedRef.current) {
        setError(`Erreur caméra: ${err.message}`);
        setIsScanning(false);
      }
    }
  };

  const handleCancel = async () => {
    console.log('❌ Annulation');
    await cleanupScanner();
    setIsScanning(false);
    navigate('/');
  };

  return (
    <div className="qr-scanner-container">
      <div className="scanner-header">
        <h3>📷 Scannez le QR Code</h3>
        <p className="scanner-instruction">
          Positionnez le QR code dans le cadre
        </p>
      </div>

      <div id="qr-reader"></div>

      {isScanning && (
        <button onClick={handleCancel} className="btn-secondary">
          Annuler le scan
        </button>
      )}

      {error && (
        <div className="scanner-error">
          <p>❌ {error}</p>
          <button onClick={handleCancel} className="btn-secondary">
            Retour à l'accueil
          </button>
        </div>
      )}

      {!isScanning && !error && (
        <div className="scanner-loading">
          <p>Chargement...</p>
        </div>
      )}
    </div>
  );
};

export default QRScanner;
