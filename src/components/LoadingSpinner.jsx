import './LoadingSpinner.css';

const LoadingSpinner = ({ message = 'Chargement...' }) => {
  return (
    <div className="loading-overlay">
      <div className="loading-spinner">
        <div className="spinner"></div>
        <p className="loading-message">{message}</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
