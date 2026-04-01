import type { Metadata } from "next";
import FeedClient from "./FeedClient";

export const metadata: Metadata = {
  title: "Reise-Feed – Urlaubsfinder365",
  description: "Entdecke täglich neue Reiseinspirationen, Fotos und Videos aus aller Welt.",
};

export default function FeedPage() {
  return <FeedClient />;
}
