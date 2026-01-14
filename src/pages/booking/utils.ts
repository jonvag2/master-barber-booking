// Small utilities for booking pages
export const generateDates = () => {
  const days = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
  const dates = [] as { day: string; number: number; full: string; month: string }[];

  for (let i = 0; i < 5; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    dates.push({
      day: days[date.getDay()],
      number: date.getDate(),
      full: date.toISOString().split("T")[0],
      month: date.toLocaleDateString("es", { month: "short" }),
    });
  }

  return dates;
};

export const TOTAL_STEPS = 5;
