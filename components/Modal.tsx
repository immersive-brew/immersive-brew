import { useEffect } from 'react';

interface ModalProps {
  title: string;
  content: string;
  onClose: () => void;
}

export default function Modal({ title, content, onClose }: ModalProps) {
  // Close modal on ESC key press
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
        style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          width: '90%',
          maxWidth: '600px',
          maxHeight: '80vh',
          overflowY: 'auto',
          position: 'relative'
        }}
      >
        <div className="modal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {/* Close Button on the Left */}
          <button 
            className="close-btn" 
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer',
              padding: '5px',
              color: 'black'
            }}
          >
            ✖
          </button>
        </div>

        <h3>{title}</h3>
        <p>{content}</p>
      </div>
    </div>
  );
}
