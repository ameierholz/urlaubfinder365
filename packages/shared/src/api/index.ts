export { createTravelApiClient } from "./travel-api";
export type { TravelApiConfig } from "./travel-api";
export {
  getDestinations,
  getDestinationBySlug,
  getDestinationsByContinent,
  getOffersByDestination,
  getLatestOffers,
  getLastMinuteOffers,
  getUserFavorites,
  toggleFavorite,
  getUserPriceAlerts,
  getPublishedReports,
  getReportsByDestination,
} from "./supabase-queries";
