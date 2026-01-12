import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { 
  Scissors, 
  Star, 
  Users, 
  Clock, 
  MapPin, 
  Home, 
  Calendar, 
  ChevronRight, 
  ChevronLeft,
  Phone,
  User,
  Check,
  Crown,
  Sparkles
} from "lucide-react";

// Types
interface Service {
  id: string;
  name: string;
  price: number;
  duration: number;
  description: string;
  icon: React.ReactNode;
  isVip?: boolean;
}

interface BookingState {
  service: Service | null;
  modality: "barbershop" | "home" | null;
  date: string | null;
  time: string | null;
  name: string;
  phone: string;
  address: string;
}

// Services Data
const services: Service[] = [
  {
    id: "corte-caballero",
    name: "Corte Caballero",
    price: 25,
    duration: 30,
    description: "Corte clásico o moderno con acabado profesional",
    icon: <Scissors className="w-6 h-6" />,
  },
  {
    id: "barba-toalla",
    name: "Barba & Toalla Caliente",
    price: 20,
    duration: 25,
    description: "Afeitado tradicional con toalla caliente",
    icon: <Sparkles className="w-6 h-6" />,
  },
  {
    id: "combo-full",
    name: "Combo Full",
    price: 40,
    duration: 50,
    description: "Corte + Barba completo",
    icon: <Star className="w-6 h-6" />,
  },
  {
    id: "corte-nino",
    name: "Corte Niño",
    price: 18,
    duration: 25,
    description: "Corte para los más pequeños",
    icon: <User className="w-4 h-4" />,
  },
  {
    id: "paquete-vip",
    name: "Paquete VIP",
    price: 75,
    duration: 90,
    description: "Corte + Barba + Tratamiento Facial + Masaje",
    icon: <Crown className="w-6 h-6" />,
    isVip: true,
  },
];

// Time slots
const timeSlots = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "14:00", "14:30", "15:00", "15:30", "16:00",
  "16:30", "17:00", "17:30", "18:00", "18:30", "19:00"
];

// Generate next 5 days
const generateDates = () => {
  const days = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
  const dates = [];
  
  for (let i = 0; i < 5; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    dates.push({
      day: days[date.getDay()],
      number: date.getDate(),
      full: date.toISOString().split('T')[0],
      month: date.toLocaleDateString('es', { month: 'short' })
    });
  }
  
  return dates;
};

const Index = () => {
  const [searchParams] = useSearchParams();
  const barberName = searchParams.get("barber") || "Elite";
  
  const [currentStep, setCurrentStep] = useState(0);
  const [booking, setBooking] = useState<BookingState>({
    service: null,
    modality: null,
    date: null,
    time: null,
    name: "",
    phone: "",
    address: "",
  });

  const dates = useMemo(() => generateDates(), []);

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 5));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  const updateBooking = (updates: Partial<BookingState>) => {
    setBooking((prev) => ({ ...prev, ...updates }));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return booking.service !== null;
      case 2: return booking.modality !== null;
      case 3: return booking.date !== null && booking.time !== null;
      case 4: 
        const hasBasicInfo = booking.name.trim() !== "" && booking.phone.trim() !== "";
        if (booking.modality === "home") {
          return hasBasicInfo && booking.address.trim() !== "";
        }
        return hasBasicInfo;
      default: return true;
    }
  };

  const generateWhatsAppMessage = () => {
    const message = `🪒 *RESERVA MASTER BARBER ${barberName.toUpperCase()}*

📋 *Servicio:* ${booking.service?.name}
💰 *Precio:* $${booking.service?.price}
⏱️ *Duración:* ${booking.service?.duration} min

📍 *Modalidad:* ${booking.modality === "home" ? "A Domicilio 🏠" : "En la Barbería 💈"}
${booking.modality === "home" ? `🏠 *Dirección:* ${booking.address}` : ""}

📅 *Fecha:* ${booking.date}
🕐 *Hora:* ${booking.time}

👤 *Cliente:* ${booking.name}
📞 *Teléfono:* ${booking.phone}

_Confirmación pendiente_`;

    return encodeURIComponent(message);
  };

  const openWhatsApp = () => {
    const phoneNumber = "1234567890"; // Replace with actual number
    window.open(`https://wa.me/${phoneNumber}?text=${generateWhatsAppMessage()}`, "_blank");
  };

  const selectedDate = dates.find(d => d.full === booking.date);
  const totalPrice = (booking.service?.price || 0) + (booking.modality === "home" ? 10 : 0);

  // Render step content directly
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4 fade-in">
            {/* Logo */}
            <div className="mb-8 relative">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-gold-dark flex items-center justify-center mb-6 mx-auto shadow-gold animate-pulse-gold">
                <Scissors className="w-16 h-16 text-primary-foreground" />
              </div>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-2">
                MASTER <span className="gold-text">BARBER</span>
              </h1>
              <p className="text-2xl md:text-3xl font-display text-primary">{barberName}</p>
            </div>

            {/* Trust indicators */}
            <div className="flex items-center gap-6 mb-12 text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                  ))}
                </div>
                <span className="font-medium">4.9</span>
              </div>
              <div className="w-px h-6 bg-border" />
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                <span>+2,500 clientes</span>
              </div>
            </div>

            {/* CTA Button */}
            <button
              onClick={nextStep}
              className="btn-primary text-lg flex items-center gap-3 shine"
            >
              Reservar Cita
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 mt-16 max-w-md w-full">
              {[
                { icon: <Clock className="w-5 h-5" />, label: "Sin esperas" },
                { icon: <MapPin className="w-5 h-5" />, label: "Servicio a domicilio" },
                { icon: <Crown className="w-5 h-5" />, label: "Experiencia VIP" },
              ].map((feature, i) => (
                <div key={i} className="flex flex-col items-center gap-2 text-muted-foreground">
                  <div className="text-primary">{feature.icon}</div>
                  <span className="text-sm">{feature.label}</span>
                </div>
              ))}
            </div>
          </div>
        );

      case 1:
        return (
          <div className="slide-up">
            <h2 className="font-display text-3xl font-bold text-center mb-2">
              Selecciona tu <span className="gold-text">Servicio</span>
            </h2>
            <p className="text-muted-foreground text-center mb-8">
              Elige el tratamiento que mejor se adapte a ti
            </p>

            <div className="space-y-4 max-w-lg mx-auto">
              {services.map((service) => (
                <button
                  key={service.id}
                  onClick={() => updateBooking({ service })}
                  className={`card-premium w-full text-left flex items-center gap-4 ${
                    booking.service?.id === service.id ? "card-selected" : ""
                  } ${service.isVip ? "border-primary/50" : ""}`}
                >
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                    service.isVip ? "gradient-gold" : "bg-secondary"
                  }`}>
                    <span className={service.isVip ? "text-primary-foreground" : "text-primary"}>
                      {service.icon}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-lg">{service.name}</h3>
                      {service.isVip && (
                        <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                          VIP
                        </span>
                      )}
                    </div>
                    <p className="text-muted-foreground text-sm">{service.description}</p>
                    <div className="flex items-center gap-4 mt-1 text-sm">
                      <span className="text-primary font-semibold">${service.price}</span>
                      <span className="text-muted-foreground flex items-center gap-1">
                        <Clock className="w-4 h-4" /> {service.duration} min
                      </span>
                    </div>
                  </div>
                  {booking.service?.id === service.id && (
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                      <Check className="w-5 h-5 text-primary-foreground" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="slide-up">
            <h2 className="font-display text-3xl font-bold text-center mb-2">
              ¿Dónde te <span className="gold-text">Atendemos</span>?
            </h2>
            <p className="text-muted-foreground text-center mb-8">
              Elige la modalidad que prefieras
            </p>

            <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              {/* Barbershop Option */}
              <button
                onClick={() => updateBooking({ modality: "barbershop", address: "" })}
                className={`card-premium text-center py-10 ${
                  booking.modality === "barbershop" ? "card-selected" : ""
                }`}
              >
                <div className="w-20 h-20 rounded-2xl bg-secondary flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-10 h-10 text-primary" />
                </div>
                <h3 className="font-display text-2xl font-semibold mb-2">En la Barbería</h3>
                <p className="text-muted-foreground">
                  Visítanos en nuestro local con ambiente premium
                </p>
                {booking.modality === "barbershop" && (
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center mx-auto mt-4">
                    <Check className="w-6 h-6 text-primary-foreground" />
                  </div>
                )}
              </button>

              {/* Home Option */}
              <button
                onClick={() => updateBooking({ modality: "home" })}
                className={`card-premium text-center py-10 relative overflow-hidden ${
                  booking.modality === "home" ? "card-selected" : ""
                }`}
              >
                <div className="absolute top-4 right-4 bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                  PREMIUM
                </div>
                <div className="w-20 h-20 rounded-2xl gradient-gold flex items-center justify-center mx-auto mb-4">
                  <Home className="w-10 h-10 text-primary-foreground" />
                </div>
                <h3 className="font-display text-2xl font-semibold mb-2">A Domicilio</h3>
                <p className="text-muted-foreground">
                  Llevamos la experiencia barbería a tu puerta
                </p>
                <p className="text-primary text-sm mt-2 font-medium">
                  +$10 cargo por servicio
                </p>
                {booking.modality === "home" && (
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center mx-auto mt-4">
                    <Check className="w-6 h-6 text-primary-foreground" />
                  </div>
                )}
              </button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="slide-up">
            <h2 className="font-display text-3xl font-bold text-center mb-2">
              Elige <span className="gold-text">Fecha y Hora</span>
            </h2>
            <p className="text-muted-foreground text-center mb-8">
              Selecciona el momento perfecto para tu cita
            </p>

            {/* Date Selection */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Fecha
              </h3>
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {dates.map((date) => (
                  <button
                    key={date.full}
                    onClick={() => updateBooking({ date: date.full })}
                    className={`flex-shrink-0 w-20 py-4 rounded-xl border transition-all duration-300 ${
                      booking.date === date.full
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-card border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="text-xs uppercase tracking-wide opacity-70">
                      {date.day}
                    </div>
                    <div className="text-2xl font-bold">{date.number}</div>
                    <div className="text-xs uppercase">{date.month}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Time Selection */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                Hora Disponible
              </h3>
              <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
                {timeSlots.map((time) => (
                  <button
                    key={time}
                    onClick={() => updateBooking({ time })}
                    className={`py-3 rounded-xl border font-medium transition-all duration-300 ${
                      booking.time === time
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-card border-border hover:border-primary/50"
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="slide-up max-w-md mx-auto">
            <h2 className="font-display text-3xl font-bold text-center mb-2">
              Tus <span className="gold-text">Datos</span>
            </h2>
            <p className="text-muted-foreground text-center mb-8">
              Para confirmar tu reserva
            </p>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <User className="w-4 h-4 text-primary" />
                  Nombre Completo
                </label>
                <input
                  type="text"
                  value={booking.name}
                  onChange={(e) => updateBooking({ name: e.target.value })}
                  placeholder="Tu nombre"
                  className="input-premium"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-primary" />
                  Teléfono
                </label>
                <input
                  type="tel"
                  value={booking.phone}
                  onChange={(e) => updateBooking({ phone: e.target.value })}
                  placeholder="+1 234 567 8900"
                  className="input-premium"
                />
              </div>

              {booking.modality === "home" && (
                <div className="slide-up">
                  <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    Dirección Exacta
                    <span className="text-primary text-xs">(Requerido)</span>
                  </label>
                  <textarea
                    value={booking.address}
                    onChange={(e) => updateBooking({ address: e.target.value })}
                    placeholder="Calle, número, colonia, referencias..."
                    rows={3}
                    className="input-premium resize-none"
                  />
                </div>
              )}
            </div>
          </div>
        );

      case 5:
        return (
          <div className="slide-up max-w-md mx-auto">
            <div className="text-center mb-8">
              <div className="w-20 h-20 rounded-full gradient-gold flex items-center justify-center mx-auto mb-4 shadow-gold">
                <Check className="w-10 h-10 text-primary-foreground" />
              </div>
              <h2 className="font-display text-3xl font-bold mb-2">
                Confirma tu <span className="gold-text">Cita</span>
              </h2>
              <p className="text-muted-foreground">
                Revisa los detalles antes de confirmar
              </p>
            </div>

            <div className="card-premium space-y-4 mb-8">
              {/* Service */}
              <div className="flex justify-between items-start pb-4 border-b border-border">
                <div>
                  <p className="text-muted-foreground text-sm">Servicio</p>
                  <p className="font-semibold text-lg">{booking.service?.name}</p>
                  <p className="text-muted-foreground text-sm">
                    {booking.service?.duration} min
                  </p>
                </div>
                <p className="text-primary font-bold text-xl">
                  ${booking.service?.price}
                </p>
              </div>

              {/* Modality */}
              <div className="flex justify-between items-center pb-4 border-b border-border">
                <div>
                  <p className="text-muted-foreground text-sm">Modalidad</p>
                  <p className="font-semibold flex items-center gap-2">
                    {booking.modality === "home" ? (
                      <>
                        <Home className="w-4 h-4 text-primary" />
                        A Domicilio
                      </>
                    ) : (
                      <>
                        <MapPin className="w-4 h-4 text-primary" />
                        En Barbería
                      </>
                    )}
                  </p>
                </div>
                {booking.modality === "home" && (
                  <p className="text-primary font-semibold">+$10</p>
                )}
              </div>

              {/* Address if home */}
              {booking.modality === "home" && (
                <div className="pb-4 border-b border-border">
                  <p className="text-muted-foreground text-sm">Dirección</p>
                  <p className="font-medium">{booking.address}</p>
                </div>
              )}

              {/* Date & Time */}
              <div className="flex justify-between items-center pb-4 border-b border-border">
                <div>
                  <p className="text-muted-foreground text-sm">Fecha y Hora</p>
                  <p className="font-semibold">
                    {selectedDate?.day} {selectedDate?.number} {selectedDate?.month}
                  </p>
                </div>
                <p className="text-xl font-bold">{booking.time}</p>
              </div>

              {/* Client */}
              <div className="pb-4 border-b border-border">
                <p className="text-muted-foreground text-sm">Cliente</p>
                <p className="font-semibold">{booking.name}</p>
                <p className="text-muted-foreground">{booking.phone}</p>
              </div>

              {/* Total */}
              <div className="flex justify-between items-center pt-2">
                <p className="text-lg font-semibold">Total</p>
                <p className="text-2xl font-bold gold-text">${totalPrice}</p>
              </div>
            </div>

            <button
              onClick={openWhatsApp}
              className="btn-primary w-full text-lg flex items-center justify-center gap-3 shine"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Confirmar por WhatsApp
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Progress Header */}
      {currentStep > 0 && (
        <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={prevStep}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
                Atrás
              </button>
              <span className="text-sm text-muted-foreground">
                Paso {currentStep} de 5
              </span>
            </div>

            {/* Step Indicators */}
            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map((step) => (
                <div
                  key={step}
                  className={`step-indicator ${
                    step === currentStep
                      ? "step-active"
                      : step < currentStep
                      ? "step-completed"
                      : "step-pending"
                  }`}
                >
                  {step < currentStep ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    step
                  )}
                </div>
              ))}
            </div>
          </div>
        </header>
      )}

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {renderStepContent()}
      </main>

      {/* Footer Navigation */}
      {currentStep > 0 && currentStep < 5 && (
        <footer className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-xl border-t border-border p-4">
          <div className="container mx-auto max-w-md">
            <button
              onClick={nextStep}
              disabled={!canProceed()}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              Continuar
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </footer>
      )}
    </div>
  );
};

export default Index;
