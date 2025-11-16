import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import QRScanner from '../components/QRScanner';
import SeminaristeForm from '../components/SeminaristeForm';
import LoadingSpinner from '../components/LoadingSpinner';
import { getSeminaristeById } from '../services/api';
import './ScanPage.css';

const ScanPage = () => {
  const [seminaristeData, setSeminaristeData] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleScanSuccess = async (decodedText) => {
    let matricule = decodedText.trim();
    
    // Si c'est du JSON, extraire le matricule
    try {
      const qrData = JSON.parse(decodedText);
      if (qrData.matricule) {
        matricule = qrData.matricule;
      }
    } catch {
      // Pas du JSON, c'est directement le matricule
    }

    if (!matricule) {
      alert('❌ QR Code invalide');
      return;
    }

    setLoading(true);

    try {
      const data = await getSeminaristeById(matricule);
      setSeminaristeData(data);
    } catch (error) {
      alert(`❌ Erreur: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSuccess = () => {
    setSeminaristeData(null);
  };

  const handleCancel = () => {
    setSeminaristeData(null);
  };

  return (
    <div className="scan-page">
      {loading && <LoadingSpinner message="Récupération des informations..." />}

      {!seminaristeData ? (
        <QRScanner onScanSuccess={handleScanSuccess} />
      ) : (
        <SeminaristeForm 
          seminaristeData={seminaristeData}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
};

export default ScanPage;
