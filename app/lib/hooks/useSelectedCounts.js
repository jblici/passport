import { useState } from "react";

const useSelectedCounts = () => {
  const [selectedCounts, setSelectedCounts] = useState({});
  const handleCountChange = (index, value) => {
    setSelectedCounts((prev) => ({ ...prev, [index]: value }));
  };
  return { selectedCounts, handleCountChange };
};

export default useSelectedCounts;
