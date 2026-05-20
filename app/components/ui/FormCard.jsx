const FormCard = ({ icon, title, subtitle, children, className = "" }) => {
  return (
    <div className={`bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow ${className}`}>
      <div className="p-4 space-y-4">
        {children}
      </div>
    </div>
  );
};

export default FormCard;
