import type { Metadata } from "next";
import ReiseroutenClient from "./ReiseroutenClient";

export const metadata: Metadata = {
  title: "Reiserouten – Inspiration & Planung | Urlaubfinder365",
  description: "Entdecke Reiserouten anderer Urlauber und klone sie mit einem Klick für deine eigene Planung.",
};

export default function ReiseroutenPage() {
  return <ReiseroutenClient />;
}
