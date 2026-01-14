// Types used by the booking pages
export interface Barbershop {
  id: string;
  name: string;
  address: string;
  rating: number;
  image: string;
  phone: string;
  description: string;
}

export interface Barber {
  id: string;
  username: string;
  name: string;
  specialty: string;
  rating: number;
  experience: string;
  barbershopId: string;
  availableSlots: string[];
  clients: number;
}

import React from "react";
export interface Service {
  id: string;
  name: string;
  price: number;
  duration: number;
  description: string;
  // icon is optional because services from the API may not include a React node
  icon?: React.ReactNode;
  isVip?: boolean;
}

export interface BookingState {
  service: Service | null;
  modality: "barbershop" | "home" | null;
  date: string | null;
  time: string | null;
  name: string;
  phone: string;
  address: string;
}
