import { Tour } from "@/types";
import TourCard from "./TourCard";

interface ToursGridProps {
  tours: Tour[];
}

export default function ToursGrid({ tours }: ToursGridProps) {
  if (tours.length === 0) {
    return (
      <div className="text-center py-16 text-[#64929E]">
        <p>Скоро появятся новые туры. Следите за обновлениями!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
      {tours.map((tour) => (
        <TourCard key={tour.id} tour={tour} />
      ))}
    </div>
  );
}
