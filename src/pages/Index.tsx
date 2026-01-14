import { useState, useMemo, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
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
  Sparkles,
  Building2,
  Share2
} from "lucide-react";

import type { Barbershop, Barber, Service, BookingState } from "./booking/types";
import { generateDates, TOTAL_STEPS } from "./booking/utils";
import { getBarbershops, getBarbers, getServices, createBooking } from "../lib/api";
import { useBarbershops } from "../hooks/useBarbershops";
import { useBarbers } from "../hooks/useBarbers";
import { useServices } from "../hooks/useServices";

const Index = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const barbershopId = searchParams.get("barbershop");
  const barberUsername = searchParams.get("barber");

  const getServiceIcon = (id: string) => {
    switch (id) {
      case 'corte-caballero':
        return <Scissors className="w-6 h-6" />;
      case 'barba-toalla':
        return <Sparkles className="w-6 h-6" />;
      case 'combo-full':
        return <Star className="w-6 h-6" />;
      case 'corte-nino':
        return <User className="w-4 h-4" />;
      case 'paquete-vip':
        return <Crown className="w-6 h-6" />;
      default:
        return <Scissors className="w-6 h-6" />;
    }
  };


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

  const { data: barbershopsData = [], isLoading: shopsLoading } = useBarbershops();
  const { data: barbersData = [], isLoading: barbersLoading } = useBarbers();
  const { data: servicesData = [], isLoading: servicesLoading } = useServices();

  const dates = useMemo(() => generateDates(), []);

  // Resolve current barbershop and barber from fetched data (used by subsequent memos)
  const currentBarbershop = barbershopsData.find(b => b.id === barbershopId);
  const currentBarber = barbersData.find(b => b.username === barberUsername && b.barbershopId === barbershopId);

  // Get barbers for selected barbershop
  const availableBarbers = useMemo(() => {
    if (!currentBarbershop) return [];
    return barbersData.filter(b => b.barbershopId === currentBarbershop.id);
  }, [currentBarbershop, barbersData]);

  // Get available time slots based on barber
  const availableTimeSlots = useMemo(() => {
    if (!currentBarber) return [];
    return currentBarber.availableSlots;
  }, [currentBarber]);

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, TOTAL_STEPS));
  const prevStep = () => {
    if (currentStep === 0) {
      // Go back to barbershop landing
      navigate(`/?barbershop=${barbershopId}`);
    } else {
      setCurrentStep((prev) => Math.max(prev - 1, 0));
    }
  };

  const updateBooking = (updates: Partial<BookingState>) => {
    setBooking((prev) => ({ ...prev, ...updates }));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return booking.service !== null;
      case 2: return booking.modality !== null;
      case 3: return booking.date !== null && booking.time !== null;
        case 4: {
          const hasBasicInfo = booking.name.trim() !== "" && booking.phone.trim() !== "";
          if (booking.modality === "home") {
            return hasBasicInfo && booking.address.trim() !== "";
          }
          return hasBasicInfo;
        }
      default: return true;
    }
  };

  const generateWhatsAppMessage = () => {
    const message = `🪒 *RESERVA MASTER BARBER*

🏢 *Sucursal:* ${currentBarbershop?.name}
✂️ *Barbero:* ${currentBarber?.name}

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
    const phoneNumber = "1234567890";
    window.open(`https://wa.me/${phoneNumber}?text=${generateWhatsAppMessage()}`, "_blank");
  };

  const copyBarberLink = () => {
    const url = `${window.location.origin}/?barbershop=${barbershopId}&barber=${barberUsername}`;
    navigator.clipboard.writeText(url);
  };

  const selectedDate = dates.find(d => d.full === booking.date);
  const totalPrice = (booking.service?.price || 0) + (booking.modality === "home" ? 10 : 0);

  

  // ========== LANDING: No barbershop selected ==========
  if (!barbershopId) {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 fade-in">
          <div className="mb-8 relative">
            <div className="w-28 h-28 rounded-full bg-gradient-to-br from-primary to-gold-dark flex items-center justify-center mb-6 mx-auto shadow-gold animate-pulse-gold">
              <Scissors className="w-14 h-14 text-primary-foreground" />
            </div>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-2">
              MASTER <span className="gold-text">BARBER</span>
            </h1>
            <p className="text-xl text-muted-foreground">Red de Barberías Premium</p>
          </div>

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
              <span>+10,000 clientes</span>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 pb-12">
          <h2 className="font-display text-2xl font-bold text-center mb-8">
            Nuestras <span className="gold-text">Sucursales</span>
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {shopsLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="card-premium animate-pulse h-40" />
              ))
            ) : (
              barbershopsData.map((shop) => (
                <button
                  key={shop.id}
                  onClick={() => navigate(`/?barbershop=${shop.id}`)}
                  className="card-premium text-left hover:scale-[1.02] transition-transform"
                >
                  <div className="text-5xl mb-4">{shop.image}</div>
                  <h3 className="font-display text-xl font-semibold mb-2">{shop.name}</h3>
                  <p className="text-muted-foreground text-sm flex items-center gap-1 mb-2">
                    <MapPin className="w-3 h-3" /> {shop.address}
                  </p>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-primary text-primary" />
                    <span className="text-primary font-medium">{shop.rating}</span>
                  </div>
                  <div className="mt-4 flex items-center gap-2 text-primary font-medium">
                    Ver barberos <ChevronRight className="w-4 h-4" />
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      </div>
    );
  }

  // ========== BARBERSHOP LANDING: Show barbers ==========
  if (currentBarbershop && !barberUsername) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
          <div className="container mx-auto px-4 py-4">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              Todas las sucursales
            </button>
          </div>
        </header>

        {/* Barbershop Hero */}
        <div className="text-center py-12 px-4 fade-in border-b border-border">
          <div className="text-6xl mb-4">{currentBarbershop.image}</div>
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
            {currentBarbershop.name}
          </h1>
          <p className="text-muted-foreground flex items-center justify-center gap-2 mb-2">
            <MapPin className="w-4 h-4" /> {currentBarbershop.address}
          </p>
          <div className="flex items-center justify-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-primary text-primary" />
              <span className="text-primary font-medium">{currentBarbershop.rating}</span>
            </div>
            <div className="w-px h-4 bg-border" />
            <span className="text-muted-foreground">{currentBarbershop.phone}</span>
          </div>
          <p className="text-muted-foreground mt-4 max-w-md mx-auto">
            {currentBarbershop.description}
          </p>
        </div>

        {/* Barbers List */}
        <div className="container mx-auto px-4 py-8">
          <h2 className="font-display text-2xl font-bold text-center mb-8">
            Nuestros <span className="gold-text">Barberos</span>
          </h2>

          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {availableBarbers.map((barber) => (
              <button
                key={barber.id}
                onClick={() => navigate(`/?barbershop=${barbershopId}&barber=${barber.username}`)}
                className="card-premium text-left hover:scale-[1.02] transition-transform"
              >
                <div className="flex items-start gap-4">
                  <div className="w-20 h-20 rounded-xl gradient-gold flex items-center justify-center flex-shrink-0">
                    <Scissors className="w-10 h-10 text-primary-foreground" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-display text-xl font-semibold">{barber.name}</h3>
                    <p className="text-primary text-sm">@{barber.username}</p>
                    <p className="text-muted-foreground text-sm mt-1">{barber.specialty}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm">
                      <span className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-primary text-primary" />
                        <span className="text-primary font-medium">{barber.rating}</span>
                      </span>
                      <span className="text-muted-foreground">{barber.experience}</span>
                      <span className="text-muted-foreground flex items-center gap-1">
                        <Users className="w-3 h-3" /> {barber.clients}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2 text-primary font-medium">
                  Reservar cita <ChevronRight className="w-4 h-4" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ========== BARBER PAGE: Landing + Booking Wizard ==========
  if (!currentBarber) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Barbero no encontrado</p>
          <button 
            onClick={() => navigate("/")}
            className="btn-primary"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  // Render booking steps
  const renderStepContent = () => {
    switch (currentStep) {
      // Step 0: Barber Landing
      case 0:
        return (
          <div className="fade-in">
            {/* Barber Hero */}
            <div className="text-center pb-8 border-b border-border mb-8">
              <div className="w-28 h-28 rounded-full gradient-gold flex items-center justify-center mx-auto mb-4 shadow-gold">
                <Scissors className="w-14 h-14 text-primary-foreground" />
              </div>
              <h1 className="font-display text-3xl md:text-4xl font-bold mb-1">
                {currentBarber.name}
              </h1>
              <p className="text-primary text-lg mb-2">@{currentBarber.username}</p>
              <p className="text-muted-foreground">{currentBarber.specialty}</p>
              
              <div className="flex items-center justify-center gap-6 mt-4 text-sm">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 fill-primary text-primary" />
                  <span className="text-primary font-semibold text-lg">{currentBarber.rating}</span>
                </div>
                <div className="w-px h-6 bg-border" />
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Users className="w-4 h-4" />
                  <span>{currentBarber.clients.toLocaleString()} clientes</span>
                </div>
                <div className="w-px h-6 bg-border" />
                <span className="text-muted-foreground">{currentBarber.experience}</span>
              </div>

              {/* Share Button */}
              <button
                onClick={copyBarberLink}
                className="mt-6 btn-secondary inline-flex items-center gap-2"
              >
                <Share2 className="w-4 h-4" />
                Compartir perfil
              </button>
            </div>

            {/* Barbershop Info */}
            <div className="card-premium mb-8 flex items-center gap-4">
              <div className="text-4xl">{currentBarbershop?.image}</div>
              <div>
                <p className="text-muted-foreground text-sm">Ubicación</p>
                <p className="font-semibold">{currentBarbershop?.name}</p>
                <p className="text-muted-foreground text-sm flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> {currentBarbershop?.address}
                </p>
              </div>
            </div>

            {/* CTA */}
            <button
              onClick={nextStep}
              className="btn-primary w-full text-lg flex items-center justify-center gap-3 shine"
            >
              Reservar Cita
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 mt-10">
              {[
                { icon: <Clock className="w-5 h-5" />, label: "Sin esperas" },
                { icon: <MapPin className="w-5 h-5" />, label: "A domicilio" },
                { icon: <Crown className="w-5 h-5" />, label: "Servicio VIP" },
              ].map((feature, i) => (
                <div key={i} className="flex flex-col items-center gap-2 text-muted-foreground">
                  <div className="text-primary">{feature.icon}</div>
                  <span className="text-sm">{feature.label}</span>
                </div>
              ))}
            </div>
          </div>
        );

      // Step 1: Service Selection
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
              {servicesData.map((service) => (
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
                      {service.icon || getServiceIcon(service.id)}
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

      // Step 2: Modality
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
                  <Building2 className="w-10 h-10 text-primary" />
                </div>
                <h3 className="font-display text-2xl font-semibold mb-2">En la Barbería</h3>
                <p className="text-muted-foreground text-sm mb-2">
                  {currentBarbershop?.name}
                </p>
                <p className="text-muted-foreground text-xs">
                  {currentBarbershop?.address}
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
                  Llevamos la experiencia a tu puerta
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

      // Step 3: Date & Time
      case 3:
        return (
          <div className="slide-up">
            <h2 className="font-display text-3xl font-bold text-center mb-2">
              Elige <span className="gold-text">Fecha y Hora</span>
            </h2>
            <p className="text-muted-foreground text-center mb-8">
              Disponibilidad de {currentBarber.name}
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
              <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                {availableTimeSlots.map((time) => (
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

      // Step 4: Client Data
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

      // Step 5: Confirmation
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
              {/* Barbershop & Barber */}
              <div className="pb-4 border-b border-border">
                <p className="text-muted-foreground text-sm">Sucursal</p>
                <p className="font-semibold">{currentBarbershop?.name}</p>
                <p className="text-muted-foreground text-sm mt-2">Barbero</p>
                <p className="font-semibold text-primary">{currentBarber.name}</p>
              </div>

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
                        <Building2 className="w-4 h-4 text-primary" />
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
      {/* Progress Header - Only show during booking steps */}
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
                Paso {currentStep} de {TOTAL_STEPS}
              </span>
            </div>

            {/* Step Indicators */}
            <div className="flex items-center justify-center gap-1.5">
              {Array.from({ length: TOTAL_STEPS }, (_, i) => i + 1).map((step) => (
                <div
                  key={step}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-300 ${
                    step === currentStep
                      ? "bg-primary text-primary-foreground"
                      : step < currentStep
                      ? "bg-primary/20 text-primary border border-primary"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {step < currentStep ? (
                    <Check className="w-3 h-3" />
                  ) : (
                    step
                  )}
                </div>
              ))}
            </div>
          </div>
        </header>
      )}

      {/* Back button for barber landing */}
      {currentStep === 0 && (
        <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
          <div className="container mx-auto px-4 py-4">
            <button
              onClick={() => navigate(`/?barbershop=${barbershopId}`)}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              Todos los barberos
            </button>
          </div>
        </header>
      )}

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        {renderStepContent()}
      </main>

      {/* Footer Navigation - Only during booking steps 1-4 */}
      {currentStep > 0 && currentStep < TOTAL_STEPS && (
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
