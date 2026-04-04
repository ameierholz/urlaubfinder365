"use client";

import { useState } from "react";
import ReiseplanerForm from "./ReiseplanerForm";
import ReiseplanerErgebnis from "./ReiseplanerErgebnis";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function UrlaubsplanerClient() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [plan, setPlan]       = useState<any | null>(null);
  const [ziel, setZiel]       = useState("");
  const [loading, setLoading] = useState(false);
  // Erhöhen → Form remountet bei Schritt 1 (nur bei "Neue Reise planen")
  const [formKey, setFormKey] = useState(0);

  const handleNeu = () => {
    setPlan(null);
    setZiel("");
    setFormKey((k) => k + 1);
  };

  return (
    <>
      {/* Form bleibt immer im DOM – nur per CSS ausgeblendet wenn Ergebnis da.
          So geht der schritt-State nicht verloren falls plan kurzzeitig null wird. */}
      <div className={plan ? "hidden" : undefined}>
        <ReiseplanerForm
          key={formKey}
          onResult={(p, z) => { setPlan(p); setZiel(z); }}
          onLoading={setLoading}
          loading={loading}
        />
      </div>

      {plan && (
        <ReiseplanerErgebnis plan={plan} ziel={ziel} onNeu={handleNeu} />
      )}
    </>
  );
}
