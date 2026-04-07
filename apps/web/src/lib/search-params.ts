/**
 * Builds a b2b.specials.de URL with search parameters from URL search params.
 * Base URL format: https://b2b.specials.de/index/jump/{product}/{sub}/{partner}/
 */
export function buildB2bUrl(
  baseUrl: string,
  searchParams: { [key: string]: string | string[] | undefined }
): string {
  const url = new URL(baseUrl);

  // Urlaub/Last-Minute params
  if (searchParams.from) url.searchParams.set("from", String(searchParams.from));
  if (searchParams.to) url.searchParams.set("to", String(searchParams.to));
  if (searchParams.duration) url.searchParams.set("duration", String(searchParams.duration));
  if (searchParams.adults) url.searchParams.set("adults", String(searchParams.adults));
  if (searchParams.children) url.searchParams.set("children", String(searchParams.children));
  if (searchParams.airport) url.searchParams.set("dep", String(searchParams.airport));
  if (searchParams.destination) url.searchParams.set("destination", String(searchParams.destination));

  // Hotel params
  if (searchParams.checkin) url.searchParams.set("checkin", String(searchParams.checkin));
  if (searchParams.checkout) url.searchParams.set("checkout", String(searchParams.checkout));
  if (searchParams.rooms) url.searchParams.set("rooms", String(searchParams.rooms));

  // Flug params
  if (searchParams.date) url.searchParams.set("date", String(searchParams.date));
  if (searchParams.returnDate) url.searchParams.set("returndate", String(searchParams.returnDate));
  if (searchParams.tripType) url.searchParams.set("triptype", String(searchParams.tripType));

  return url.toString();
}
