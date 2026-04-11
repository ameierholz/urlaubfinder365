"use client";

import { useState } from "react";

export interface FaqItem {
  question: string;
  answer: string;
}

interface Props {
  faqs: FaqItem[];
  title?: string;
}

// HINWEIS: Die FAQPage-JSON-LD muss vom Eltern-Server-Component
// gerendert werden (siehe @/components/seo/JsonLd), damit der CSP-Nonce
// korrekt gesetzt wird. Dieses Client-Component rendert nur die UI.

export default function FaqSection({ faqs, title = "Häufige Fragen" }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <>
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">{title}</h2>
        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
              >
                <button
                  onClick={() => toggle(index)}
                  className="w-full flex items-center justify-between px-6 py-5 text-left gap-4 hover:bg-gray-50 transition-colors"
                  aria-expanded={isOpen}
                >
                  <span className="font-semibold text-gray-900 text-base leading-snug">
                    {faq.question}
                  </span>
                  <span
                    className={`shrink-0 w-6 h-6 flex items-center justify-center rounded-full text-white text-sm font-bold transition-transform ${
                      isOpen ? "bg-[#1db682] rotate-45" : "bg-[#6991d8]"
                    }`}
                    aria-hidden="true"
                  >
                    +
                  </span>
                </button>
                {isOpen && (
                  <div className="px-6 pb-5 text-gray-600 leading-relaxed text-sm border-t border-gray-100 pt-4">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}
