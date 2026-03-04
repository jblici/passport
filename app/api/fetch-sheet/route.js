// /app/api/fetch-sheet/route.js o en tu hook como server action
export async function GET(req) {
  const sheetUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vT-gGbA9MsMsA-hsqYrvM8-icwqvPPQjMmvpAg3ArQmxQLwZShRw24K0uw5Y4Ot5cMItedJm-txLNfU/pub?gid=0&output=csv";
  const res = await fetch(sheetUrl, { redirect: "follow" });

  const text = await res.text();
  return new Response(text, {
    headers: {
      "Content-Type": "text/csv",
      "Access-Control-Allow-Origin": "*", // opcional si querés exponerlo
    },
  });
}