import { GoAlert } from "react-icons/go";

const InfoAlert = ({ children, title }) => {
  return (
    <div className="flex border-l-4 border-blue-400 bg-blue-50 p-4 rounded-r-lg gap-3">
      <GoAlert className="text-blue-500 flex-shrink-0 mt-0.5 h-5 w-5" />
      <div className="flex flex-col space-y-1">
        {title && <p className="font-semibold text-blue-800">{title}</p>}
        <div className="text-sm text-blue-700 space-y-1">{children}</div>
      </div>
    </div>
  );
};

export default InfoAlert;
