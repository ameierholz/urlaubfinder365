import { TravelOffer } from "@/types";
import OfferCard from "./OfferCard";

interface Props {
  offers: TravelOffer[];
  savedProductCodes?: string[];
}

export default function OffersGrid({ offers, savedProductCodes = [] }: Props) {
  if (offers.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400">
        <p className="text-lg">Keine Angebote gefunden.</p>
        <p className="text-sm mt-1">Bitte versuche es später erneut.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {offers.map((offer) => (
        <OfferCard
          key={offer.product_code}
          offer={offer}
          savedProductCodes={savedProductCodes}
        />
      ))}
    </div>
  );
}
