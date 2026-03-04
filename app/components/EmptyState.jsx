const EmptyState = ({ title, description, icon = "🔍", action = null }) => {
  return (
    <div className="bg-card rounded-lg shadow-lg p-12 text-center">
      <div className="text-5xl mb-4">{icon}</div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">{title}</h2>
      <p className="text-gray-600 mb-6">{description}</p>
      {action && <div className="flex justify-center gap-4">{action}</div>}
    </div>
  );
};

export default EmptyState;
