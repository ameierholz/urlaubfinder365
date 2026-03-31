// Types
export type {
  Database,
  Json,
  Destination,
  DestinationInsert,
  Offer,
  OfferInsert,
  OfferType,
  User,
  UserInsert,
  Report,
  ReportInsert,
  Achievement,
  Favorite,
  FavoriteInsert,
  PriceAlert,
  PriceAlertInsert,
  UserAchievement,
  TravelApiParams,
  TravelApiOffer,
} from "./types";

// API
export {
  createTravelApiClient,
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
} from "./api";

// Utils
export {
  formatPrice,
  formatPriceExact,
  calcDiscount,
  formatDate,
  formatDateShort,
  formatDateRange,
  formatRelativeDate,
  DEPARTURE_AIRPORTS,
  BOARD_TYPES,
  OFFER_TYPES,
  CONTINENTS,
  HOTEL_STARS,
} from "./utils";
