import React, { useEffect } from 'react';
import './Message.css';

const Message = ({ text, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => onClose(), 4000);
    return () => clearTimeout(timer);
  }, [text, onClose]);

  if (!text) return null;

  return (
    <div className={`custom-message-popup ${type}`}>
      <div className="message-content">
        <span className="icon">{type === 'error' ? '⚠️' : '✅'}</span>
        <p>{text}</p>
      </div>
      <button className="close-btn" onClick={onClose}>&times;</button>
      <div className="progress-bar-container">
        <div className={`progress-bar-fill ${type}`}></div>
      </div>
    </div>
  );
};

export default Message;