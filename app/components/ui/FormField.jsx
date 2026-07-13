import { Label } from "./label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select";

const FormField = ({
  label,
  value,
  onChange,
  options,
  placeholder,
  required,
  id,
  fullWidth = false,
}) => {
  return (
    <div className={`flex flex-col space-y-2 ${fullWidth ? "w-full" : "w-full sm:w-1/2"}`}>
      <Label htmlFor={id} className="font-semibold">
        {label}
        {required && <span className="text-red-500">*</span>}
      </Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id={id}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default FormField;
