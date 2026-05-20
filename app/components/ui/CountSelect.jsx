const COUNT_OPTIONS = [1, 2, 3, 4, 5];

const CountSelect = ({ index, value, onChange }) => (
  <select
    value={value}
    onChange={(e) => onChange(index, e.target.value)}
    className="px-2 py-1 border rounded"
  >
    {COUNT_OPTIONS.map((num) => (
      <option key={num} value={num}>
        {num}
      </option>
    ))}
  </select>
);

export default CountSelect;
