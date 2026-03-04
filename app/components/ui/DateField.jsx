import DatePicker from "react-datepicker";
import { Label } from "./label";
import { CalendarDaysIcon } from "../svg/svg";
import "react-datepicker/dist/react-datepicker.css";

const DateField = ({
  label,
  value,
  onChange,
  minDate,
  maxDate,
  required,
  id,
  disabled,
  filterDate,
}) => {
  return (
    <div className="flex flex-col space-y-2 w-full sm:w-1/2">
      <Label htmlFor={id} className="font-semibold">
        <span className="flex items-center gap-1">
          <CalendarDaysIcon /> {label}
          {required && <span className="text-red-500">*</span>}
        </span>
      </Label>
      <DatePicker
        id={id}
        selected={value}
        onChange={onChange}
        minDate={minDate}
        maxDate={maxDate}
        dateFormat="dd/MM/yyyy"
        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholderText="Seleccionar fecha"
        disabled={disabled}
        withPortal
        filterDate={filterDate}
      />
    </div>
  );
};

export default DateField;
