import StripeConnectButton from "@/components/stripe/StripeConnectButton";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Stripe Connect | Anbieter-Portal", robots: { index: false, follow: false } };

export default function StripeOnboardingPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 max-w-md w-full p-10 text-center">
        <div className="text-5xl mb-4">⚡</div>
        <h1 className="text-2xl font-black text-gray-900 mb-2">Stripe Connect einrichten</h1>
        <p className="text-gray-500 text-sm mb-8">
          Verbinde dein Bankkonto mit Stripe, um Auszahlungen von Urlaubfinder365 zu empfangen.
          Das Onboarding dauert ca. 5 Minuten.
        </p>
        <div className="flex justify-center">
          <StripeConnectButton complete={false} />
        </div>
      </div>
    </div>
  );
}
