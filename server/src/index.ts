import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import prisma from "./prisma";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/barbershops", async (req, res) => {
  const shops = await prisma.barbershop.findMany();
  res.json(shops);
});

app.get("/api/barbers", async (req, res) => {
  const list = await prisma.barber.findMany();
  res.json(list);
});

app.get("/api/services", async (req, res) => {
  const sv = await prisma.service.findMany();
  res.json(sv);
});

app.post("/api/bookings", async (req, res) => {
  try {
    const { serviceId, barberId, modality, date, time, name, phone, address } = req.body;
    const booking = await prisma.booking.create({
      data: {
        serviceId: serviceId || null,
        barberId: barberId || null,
        modality,
        date: new Date(date),
        time,
        name,
        phone,
        address: address || "",
      },
    });
    res.status(201).json(booking);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error creating booking" });
  }
});

const port = process.env.PORT ? Number(process.env.PORT) : 4000;
app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
