import { useState, useEffect } from 'react';

export default function SheetData() {
  const [sheetData, setSheetData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('/api/getSheetData', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sheetID: "1VErMXh9Z6Uq9e8ZXL1bONjvpNZaOac5JBE1BGfXyalA",
          sheetName: "Estadia",
          query: "SELECT *"
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setSheetData(data);
        console.log("sheet data: ", data);
        // Add your code to work with sheetData here
      } else {
        console.error('Failed to fetch sheet data');
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Sheet Data</h1>
      {sheetData ? (
        <pre>{JSON.stringify(sheetData, null, 2)}</pre>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}