import React from 'react';
import './App.css'; // นำเข้า CSS สำหรับ Popup

const LogoutPopup = ({ onClose, onConfirm }) => {
  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h2>คุณต้องการออกจากระบบใช่ไหม?</h2>
        <div className="popup-actions">
          <button onClick={onConfirm}>Confirm</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default LogoutPopup;
