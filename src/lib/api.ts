const BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";

export async function getBarbershops() {
  const res = await fetch(`${BASE}/api/barbershops`);
  if (!res.ok) throw new Error("Failed to fetch barbershops");
  return res.json();
}

export async function getBarbers() {
  const res = await fetch(`${BASE}/api/barbers`);
  if (!res.ok) throw new Error("Failed to fetch barbers");
  return res.json();
}

export async function getServices() {
  const res = await fetch(`${BASE}/api/services`);
  if (!res.ok) throw new Error("Failed to fetch services");
  return res.json();
}

export async function createBooking(payload: any) {
  const res = await fetch(`${BASE}/api/bookings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to create booking");
  return res.json();
}
