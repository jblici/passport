import React, { useState } from "react";

const ToggleYesNo = ({ options, onValueChange }) => {
  const [selectedValue, setSelectedValue] = useState(options[0].label); // Inicializa con la primera opción

  const handleClick = (currentValue) => {
    setSelectedValue(currentValue);
    onValueChange(currentValue); // Pasa el nuevo valor
  };

  return (
    <div className="w-full">
      <button type="button" className="w-full flex justify-between items-center py-2 bg-white rounded-t-md focus:outline-none transition">
        <div className="relative w-full h-8 rounded-lg border p-1 bg-gray-200">
          <div className="relative w-full h-full flex items-center">
            {options.map((option) => (
              <span
                key={option.label}
                className="w-1/2 flex justify-center text-gray-600 cursor-pointer text-sm"
                role="button"
                tabIndex="0"
                onClick={() => handleClick(option.label)} // Llama a handleClick con la opción actual
              >
                {option.label}
              </span>
            ))}
          </div>

          <span
            className={`bg-white text-black rounded-lg md:text-sm text-xs flex items-center justify-center w-1/2 h-[1.75rem] transition-all duration-150 ease-linear top-[1px] absolute
            ${selectedValue === options[0].label ? "left-1" : "left-1/2 -ml-1"}`}
          >
            {selectedValue}
          </span>
        </div>
      </button>
    </div>
  );
};

export default ToggleYesNo;