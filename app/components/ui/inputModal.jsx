import { useState } from 'react';

function InputModal({ isOpen, onClose, onSubmit, title, placeholder }) {
  const [value, setValue] = useState('');

  const handleSubmit = () => {
    onSubmit(value);
    setValue(''); // Reset input
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{title}</h2>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
        />
        <button onClick={handleSubmit}>Submit</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
}

export default InputModal;