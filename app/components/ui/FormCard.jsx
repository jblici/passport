const FormCard = ({ icon, title, subtitle, children, className = "" }) => {
  return (
    <div className={`bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow ${className}`}>
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-gray-200 p-4 flex items-center gap-3">
        <span className="text-2xl">{icon}</span>
        <div>
          <h3 className="text-lg font-bold text-gray-800">{title}</h3>
          {subtitle && <p className="text-xs text-gray-600 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      <div className="p-6 space-y-4">
        {children}
      </div>
    </div>
  );
};

export default FormCard;
