const CountSelect = ({ index, value, onChange }) => (
  <input
    type="number"
    min="1"
    value={value}
    onChange={(e) => {
      const val = parseInt(e.target.value, 10);
      if (val >= 1) onChange(index, val);
    }}
    className="w-16 px-2 py-1 border rounded"
  />
);

export default CountSelect;
