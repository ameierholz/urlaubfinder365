export interface Expert {
  name: string;
  role: string;
  /** KI-generiertes Foto (thispersondoesnotexist.com) – kein echtes Foto */
  image: string;
}

export const EXPERTS: Record<string, Expert> = {
  manuel: {
    name: "Manuel Richter",
    role: "Reiseexperte Türkei & Ägypten",
    image: "/images/experts/manuel.jpg",
  },
  susanne: {
    name: "Susanne Weber",
    role: "Reiseexpertin Balearen & Wellness",
    image: "/images/experts/susanne.jpg",
  },
  thomas: {
    name: "Thomas Berger",
    role: "Reiseexperte Fernreisen & Kreuzfahrten",
    image: "/images/experts/thomas.jpg",
  },
  julia: {
    name: "Julia Hoffmann",
    role: "Reiseexpertin Familien & All Inclusive",
    image: "/images/experts/julia.jpg",
  },
};
