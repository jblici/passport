function ClientNameModal({ isOpen, onClose, onSubmit }) {
  const [name, setName] = useState('');

  const handleSubmit = () => {
    onSubmit(name);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Ingresa nombre de cliente:</h2>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Client's Name"
        />
        <button onClick={handleSubmit}>Submit</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
}