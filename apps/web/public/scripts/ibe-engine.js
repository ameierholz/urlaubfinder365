/**
 * IBE Engine – Urlaubfinder365
 * Lädt Reiseangebote von /api/teaser und rendert sie als Karussell.
 * Steuert das globale Buchungs-Modal (#ibe-modal-overlay).
 */
(function () {
  "use strict";

  // ── Konstanten ───────────────────────────────────────────────────────────────

  const AGENT = "993243";

  // ── Hilfsfunktionen ─────────────────────────────────────────────────────────

  function stars(n) {
    const full = Math.round(n);
    return "★".repeat(Math.min(full, 5)) + "☆".repeat(Math.max(0, 5 - full));
  }

  // Preis bereits in EUR (kein /100 nötig)
  function formatPrice(euros) {
    const num = Number(euros) || 0;
    return num.toLocaleString("de-DE", { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + " €";
  }

  // Datum kommt bereits formatiert als DD.MM.YYYY von der API
  function formatDate(dateStr) {
    if (!dateStr) return "";
    // Falls ISO-Format (YYYY-MM-DD) → umwandeln
    if (/^\d{4}-\d{2}-\d{2}/.test(dateStr)) {
      const [y, m, d] = dateStr.split("-");
      return `${d}.${m}.${y}`;
    }
    return dateStr; // bereits DD.MM.YYYY
  }

  function isLastMinute(dateStr) {
    if (!dateStr) return false;
    let date;
    if (/^\d{4}-\d{2}-\d{2}/.test(dateStr)) {
      date = new Date(dateStr);
    } else {
      // DD.MM.YYYY
      const [d, m, y] = dateStr.split(".");
      date = new Date(`${y}-${m}-${d}`);
    }
    const diff = (date - new Date()) / 86400000;
    return diff >= 0 && diff <= 14;
  }

  function isAI(boardCode) {
    return ["AI", "UAI", "ALL INCLUSIVE", "ALL-INCLUSIVE"].includes((boardCode || "").toUpperCase());
  }

  // ── Modal ───────────────────────────────────────────────────────────────────

  window.ibeOpenBooking = function (url, title) {
    const overlay = document.getElementById("ibe-modal-overlay");
    const iframe  = document.getElementById("ibe-modal-iframe");
    const loader  = document.getElementById("ibe-modal-loader");
    const titleEl = document.getElementById("ibe-modal-title-text");
    if (!overlay || !iframe) return;

    if (titleEl && title) titleEl.textContent = title;
    if (loader) loader.style.display = "flex";
    iframe.src = url;
    overlay.style.display = "flex";
    document.body.style.overflow = "hidden";

    overlay.onclick = function (e) {
      if (e.target === overlay) window.ibeCloseModal();
    };
  };

  window.ibeCloseModal = function () {
    const overlay = document.getElementById("ibe-modal-overlay");
    const iframe  = document.getElementById("ibe-modal-iframe");
    if (!overlay) return;
    overlay.style.display = "none";
    document.body.style.overflow = "";
    if (iframe) iframe.src = "about:blank";
  };

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") window.ibeCloseModal();
  });

  // ── Globaler Angebots-Cache ─────────────────────────────────────────────────

  window._ibeOffers = window._ibeOffers || {};

  // ── Booking-URL ─────────────────────────────────────────────────────────────

  function buildBookingUrl(offer) {
    // Nutze offer.href falls vorhanden (enthält alle nötigen Parameter)
    if (offer.href) {
      return `https://ibe.specials.de/?${offer.href}`;
    }
    // Fallback: productCode
    const params = new URLSearchParams({
      agent: AGENT,
      product: "package",
      hotelCode: offer.product_code || "",
    });
    return `https://ibe.specials.de/?${params}`;
  }

  // ── Karten-Renderer ─────────────────────────────────────────────────────────

  function renderSkeleton() {
    return '<div class="ibe-skeleton"></div>'.repeat(4);
  }

  function renderCard(offer) {
    const ok = offer.product_code;
    window._ibeOffers[ok] = offer;

    const bookUrl    = buildBookingUrl(offer);
    const imgSrc     = offer.images?.medium || offer.images?.large || "";
    const imgFallback = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&h=240&q=60";
    const lm         = isLastMinute(offer.offer_from);
    const ai         = isAI(offer.board_code);

    // Rating: overall ist bereits Dezimalzahl (z.B. "3.4") auf 5er-Skala
    const ratingRaw  = offer.rating?.overall ? parseFloat(offer.rating.overall) : null;
    const ratingDisp = ratingRaw !== null ? ratingRaw.toFixed(1) : null;
    const rec        = offer.rating?.recommendation ? Math.round(offer.rating.recommendation) : null;
    const ratingCt   = offer.rating?.count || 0;

    // Preis: offer_price_total bereits in EUR (für 2 Erwachsene)
    const priceTotal = Number(offer.offer_price_total) || (Number(offer.offer_price_adult) * 2) || 0;
    const nights     = offer.offer_duration || 7;

    // Verpflegung: board_name bereits ausgeschrieben
    const boardText  = offer.board_name || offer.board_code || "";

    // Datum: bereits DD.MM.YYYY formatiert
    const depDate    = formatDate(offer.offer_from);

    return `
<div class="offer-card" role="article">
  <div class="hotel-img-wrap">
    <img src="${imgSrc || imgFallback}"
         onerror="this.src='${imgFallback}'"
         alt="${offer.hotel_name || ""}"
         loading="lazy" />
    <div class="hotel-name-overlay">
      <div class="hotel-stars">${stars(offer.hotel_category || 0)}</div>
      <div class="hotel-name-text">${offer.hotel_name || ""}</div>
    </div>
    <span class="badge-base location-badge">
      <i class="fa fa-map-marker-alt" aria-hidden="true"></i>
      ${offer.destination_name || offer.city_name || ""}
    </span>
    <div class="status-badges">
      ${lm ? '<span class="badge-base lm-badge"><i class="fa fa-bolt"></i> Last Minute</span>' : ""}
      ${ai ? '<span class="badge-base ai-badge"><i class="fa fa-umbrella-beach"></i> All Inclusive</span>' : ""}
    </div>
    <button class="ibe-heart-btn"
            data-ok="${ok}"
            onclick="ibeSaveOffer(this, event)"
            aria-label="Angebot merken">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
      </svg>
    </button>
  </div>

  <div class="card-content">
    ${ratingDisp ? `
    <div class="rating-box" onclick="window.ibeOpenBooking('${bookUrl}', '${(offer.hotel_name || "").replace(/'/g, "\\'")}')">
      <div class="rating-row">
        <span class="rating-score">
          <span style="color:#f59e0b">★</span> ${ratingDisp}
          ${rec ? `<span class="rating-sep">|</span><span class="rating-rec">${rec}% empfehlen</span>` : ""}
        </span>
      </div>
      <span class="rating-source">HolidayCheck${ratingCt ? ` · ${ratingCt.toLocaleString("de-DE")} Bewertungen` : ""}</span>
    </div>` : ""}

    <div class="detail-list">
      ${boardText ? `<div class="detail-item detail-board"><i class="fa fa-utensils" aria-hidden="true"></i>${boardText}</div>` : ""}
      ${offer.lodging_name ? `<div class="detail-item detail-room"><i class="fa fa-bed" aria-hidden="true"></i>${offer.lodging_name}</div>` : ""}
    </div>

    <div class="card-bottom">
      <div class="tag-row">
        <span class="tag tag-nights"><i class="fa fa-moon"></i> ${nights} Nächte</span>
        <span class="tag tag-flight"><i class="fa fa-plane"></i> Inklusive Flug</span>
      </div>
      <div class="price-row">
        <div>
          <div class="price-label">Preis für 2 Erwachsene</div>
          <div class="price-total"><span class="price-ab">ab</span> ${formatPrice(priceTotal)}</div>
        </div>
        <button class="btn-booking"
                onclick="window.ibeOpenBooking('${bookUrl}', '${(offer.hotel_name || "").replace(/'/g, "\\'")}')">
          Prüfen
        </button>
      </div>
    </div>
  </div>
</div>`;
  }

  // ── Teaser laden & rendern ──────────────────────────────────────────────────

  async function loadTeaser(el) {
    if (el.dataset.ibeLoaded === "1") return;
    el.dataset.ibeLoaded = "1";

    const regionId   = el.dataset.region     || "";
    const cityId     = el.dataset.city        || "";
    const headline   = el.dataset.headline    || "";
    const boardCode  = el.dataset.boardCode   || "";
    const from       = el.dataset.from        || "14";
    const to         = el.dataset.to          || "42";
    const duration   = el.dataset.duration    || "7-7";
    const adults     = el.dataset.adults      || "2";
    const children   = el.dataset.children    || "";
    const category   = el.dataset.category    || "3";
    const minRec     = el.dataset.minrecommrate || "50";
    const excludeAi  = el.dataset.excludeAi   === "true";
    const sortBy     = el.dataset.sortBy       || "";
    const diverse    = el.dataset.diverseResults === "true";
    const keywords   = el.dataset.keywords     || "";
    const maxPrice   = el.dataset.maxPrice     || "";
    const noHeading  = el.dataset.noHeading    === "true";

    const wrapper = document.createElement("div");
    wrapper.className = "ibe-engine-instance";
    el.parentNode.insertBefore(wrapper, el);
    wrapper.appendChild(el);

    if (headline && !noHeading) {
      const h = document.createElement("div");
      h.innerHTML = `<h2 class="ibe-heading">${headline.replace(/\*(.*?)\*/g, '<span class="ibe-heading-accent">$1</span>')}</h2>`;
      wrapper.insertBefore(h, el);
    }

    const carouselDiv = document.createElement("div");
    carouselDiv.className = "ibe-carousel-wrapper";
    carouselDiv.innerHTML = `
      <button class="ibe-nav-btn ibe-nav-prev" aria-label="Zurück" disabled>&#8249;</button>
      <div class="ibe-offers-grid ibe-carousel-min">${renderSkeleton()}</div>
      <button class="ibe-nav-btn ibe-nav-next" aria-label="Weiter">&#8250;</button>`;
    wrapper.appendChild(carouselDiv);
    el.style.display = "none";

    const grid = carouselDiv.querySelector(".ibe-offers-grid");
    const prev = carouselDiv.querySelector(".ibe-nav-prev");
    const next = carouselDiv.querySelector(".ibe-nav-next");

    const params = new URLSearchParams({ from, to, duration, adults });
    if (regionId)  params.set("regionId", regionId);
    if (cityId)    params.set("cityId",   cityId);
    if (boardCode && !excludeAi) params.set("boardCode", boardCode);
    if (category)  params.set("category",      category);
    if (minRec)    params.set("minRecommrate",  minRec);
    if (children)  params.set("children",       children);
    if (keywords)  params.set("keywords",        keywords);
    if (maxPrice)  params.set("maxPrice",        maxPrice);
    if (sortBy)    params.set("hSort",           sortBy);

    try {
      const res  = await fetch(`/api/teaser?${params}`);
      const json = await res.json();
      let offers = Array.isArray(json.data) ? json.data : [];

      if (excludeAi) {
        offers = offers.filter(o => !isAI(o.board_code));
      }

      if (diverse) {
        const seen = {};
        offers = offers.filter(o => {
          const key = o.city_code || o.city_name || "";
          if (!key) return true;
          seen[key] = (seen[key] || 0) + 1;
          return seen[key] <= 2;
        });
      }

      if (!offers.length) {
        grid.innerHTML = `
          <div class="ibe-empty-msg">
            <span style="font-size:2rem">✈️</span>
            <p style="font-weight:700;color:#334155;margin:.5rem 0 .25rem">Aktuell keine Angebote</p>
            <p style="color:#64748b;font-size:.875rem">Bitte später erneut versuchen.</p>
          </div>`;
        prev.style.display = "none";
        next.style.display = "none";
        return;
      }

      grid.innerHTML = offers.map(renderCard).join("");

      function updateNav() {
        prev.disabled = grid.scrollLeft <= 10;
        next.disabled = grid.scrollLeft + grid.clientWidth >= grid.scrollWidth - 10;
      }
      const cardW = 225 + 16;
      prev.addEventListener("click", () => { grid.scrollBy({ left: -cardW * 2, behavior: "smooth" }); });
      next.addEventListener("click", () => { grid.scrollBy({ left:  cardW * 2, behavior: "smooth" }); });
      grid.addEventListener("scroll", updateNav);
      updateNav();

    } catch (err) {
      console.warn("[ibe-engine] Ladefehler:", err);
      grid.innerHTML = `<div class="ibe-empty-msg"><p style="color:#64748b">Angebote konnten nicht geladen werden.</p></div>`;
    }
  }

  // ── Holiday Widget ───────────────────────────────────────────────────────────

  const HOLIDAY_CATEGORIES = [
    {
      key: "pauschal",
      label: "Pauschalreisen",
      desc: "Flug + Hotel zum Bestpreis",
      icon: "✈️",
      image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=400&h=200&q=70",
      params: { excludeAi: true },
    },
    {
      key: "ai",
      label: "All Inclusive",
      desc: "Rundum-sorglos-Urlaub",
      icon: "🍹",
      image: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=400&h=200&q=70",
      params: { boardCode: "AI" },
    },
    {
      key: "lastminute",
      label: "Last Minute",
      desc: "Spontan & günstig buchen",
      icon: "⚡",
      image: "https://images.unsplash.com/photo-1488085061387-422e29b40080?auto=format&fit=crop&w=400&h=200&q=70",
      params: { from: "0", to: "14" },
    },
    {
      key: "familie",
      label: "Familienurlaub",
      desc: "Urlaub mit der ganzen Familie",
      icon: "👨‍👩‍👧",
      image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=400&h=200&q=70",
      params: { children: "8,8" },
    },
    {
      key: "strand",
      label: "Strandurlaub",
      desc: "Sonne, Sand und Meer",
      icon: "🏖️",
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&h=200&q=70",
      params: {},
    },
    {
      key: "adults",
      label: "Adults Only",
      desc: "Exklusive Auszeit für Erwachsene",
      icon: "🌴",
      image: "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=400&h=200&q=70",
      params: { keywords: "adults" },
    },
  ];

  async function loadHolidayWidget(el) {
    if (el.dataset.hwLoaded === "1") return;
    el.dataset.hwLoaded = "1";

    const regionId = el.dataset.region || "";

    // Scope div
    const scope = document.createElement("div");
    scope.className = "hw-widget-scope";
    el.parentNode.insertBefore(scope, el);
    scope.appendChild(el);
    el.style.display = "none";

    const container = document.createElement("div");
    container.className = "hw-widget-container";
    scope.appendChild(container);

    // Render skeletons immediately
    const grid = document.createElement("ul");
    grid.className = "hw-grid";
    grid.innerHTML = HOLIDAY_CATEGORIES.map(() => `
      <li>
        <div class="hw-card">
          <div class="hw-card-image-wrapper" style="background:#e2e8f0"></div>
          <div class="hw-card-accent"></div>
          <div class="hw-card-content">
            <div class="hw-price-skeleton" style="margin-bottom:8px;height:20px;width:60%"></div>
            <div class="hw-price-skeleton" style="height:14px;width:80%"></div>
          </div>
        </div>
      </li>`).join("");
    container.appendChild(grid);

    // Render real cards (fire-and-forget price fetch per category)
    const destName = el.dataset.name || "";
    grid.innerHTML = "";
    HOLIDAY_CATEGORIES.forEach((cat, idx) => {
      // Build IBE search URL for this category + region
      const ibeParams = new URLSearchParams({ agent: AGENT, adults: "2", duration: "7-7" });
      if (regionId) ibeParams.set("regionId", regionId);
      if (cat.params.boardCode) ibeParams.set("boardCode", cat.params.boardCode);
      if (cat.params.children)  ibeParams.set("children", cat.params.children);
      if (cat.params.keywords)  ibeParams.set("keywords", cat.params.keywords);
      if (cat.params.to === "14") { ibeParams.set("departureFrom", "0"); ibeParams.set("departureTo", "14"); }
      const ibeUrl = `https://ibe.specials.de/?${ibeParams}`;
      const modalTitle = destName ? `${cat.label} – ${destName}` : cat.label;

      const li = document.createElement("li");
      li.innerHTML = `
        <a class="hw-card" href="${ibeUrl}" onclick="event.preventDefault(); window.ibeOpenBooking('${ibeUrl}', '${modalTitle.replace(/'/g, "\\'")}')">
          <div class="hw-card-image-wrapper">
            <img class="hw-card-image" src="${cat.image}" alt="${cat.label}" loading="lazy" />
          </div>
          <div class="hw-card-accent"></div>
          <div class="hw-card-content">
            <h3 class="hw-title">${cat.icon} ${cat.label}</h3>
            <div class="hw-subtitle">${cat.desc}</div>
            <div class="hw-price-container" id="hw-price-${idx}">
              <span class="hw-price-skeleton"></span>
            </div>
            <span class="hw-action">Angebote ansehen</span>
          </div>
        </a>`;
      grid.appendChild(li);

      // Fetch cheapest price for this category
      if (regionId) {
        const p = new URLSearchParams({
          from: cat.params.from || "14",
          to: cat.params.to || "42",
          duration: "7-7",
          adults: "2",
          category: "3",
          minRecommrate: "30",
          limit: "5",
          regionId,
        });
        if (cat.params.boardCode) p.set("boardCode", cat.params.boardCode);
        if (cat.params.children)  p.set("children", cat.params.children);
        if (cat.params.keywords)  p.set("keywords", cat.params.keywords);

        fetch(`/api/teaser?${p}`)
          .then(r => r.json())
          .then(json => {
            let offers = Array.isArray(json.data) ? json.data : [];
            if (cat.params.excludeAi) offers = offers.filter(o => !isAI(o.board_code));
            if (!offers.length) throw new Error("no offers");

            const cheapest = offers.reduce((min, o) =>
              (Number(o.offer_price_total) || Infinity) < (Number(min.offer_price_total) || Infinity) ? o : min, offers[0]);
            const price = formatPrice(cheapest.offer_price_total);

            const priceEl = document.getElementById(`hw-price-${idx}`);
            if (priceEl) priceEl.innerHTML = `ab <span class="hw-price-value">${price}</span>`;
          })
          .catch(() => {
            const priceEl = document.getElementById(`hw-price-${idx}`);
            if (priceEl) priceEl.innerHTML = `<span class="hw-price-fallback">Preise auf Anfrage</span>`;
          });
      }
    });
  }

  // ── Boarding Pass: Flugverbindungen ────────────────────────────────────────

  const GERMAN_AIRPORTS = [
    { code: "FRA", city: "Frankfurt",   name: "Frankfurt am Main" },
    { code: "MUC", city: "München",     name: "Franz Josef Strauß" },
    { code: "DUS", city: "Düsseldorf",  name: "Düsseldorf Intl." },
    { code: "BER", city: "Berlin",      name: "Berlin Brandenburg" },
    { code: "HAM", city: "Hamburg",     name: "Hamburg Airport" },
  ];

  function loadBoardingPass(el) {
    if (el.dataset.bpLoaded === "1") return;
    el.dataset.bpLoaded = "1";

    const city   = el.dataset.city   || "";
    const code   = el.dataset.code   || "";

    const grid = document.createElement("div");
    grid.className = "ibe-bp-grid-flights";

    GERMAN_AIRPORTS.forEach(ap => {
      const ibeParams = new URLSearchParams({
        depapt1: ap.code,
        dstapt1: code,
        action: "search",
        afid: AGENT,
      });
      const ibeUrl    = `https://ibe.specials.de/?${ibeParams}`;
      const cardTitle = `Flüge ab ${ap.city} nach ${city}`.replace(/'/g, "\\'");

      const card = document.createElement("div");
      card.className = "ibe-ticket-card";
      card.innerHTML = `
        <div class="ibe-header-ticket">
          <div class="ibe-bp-ticket-top">
            <span>Direktflug</span>
            <span>Urlaubfinder365</span>
          </div>
          <div class="ibe-bp-ticket-row">
            <div class="ibe-bp-ticket-col left">
              <div class="ibe-bp-ticket-code">${ap.code}</div>
              <div class="ibe-bp-ticket-city">${ap.city}</div>
            </div>
            <div class="ibe-bp-ticket-center">
              <div class="ibe-bp-ticket-nonstop">Nonstop</div>
              <div style="font-size:1.4rem;color:rgba(255,255,255,.6);line-height:1">&#x2708;</div>
            </div>
            <div class="ibe-bp-ticket-col right">
              <div class="ibe-bp-ticket-code">${code}</div>
              <div class="ibe-bp-ticket-city">${city}</div>
            </div>
          </div>
        </div>
        <div class="ibe-perforation"></div>
        <div class="ibe-bp-ticket-body">
          <div class="ibe-bp-flight-info">
            <span class="ibe-bp-flight-airport">${ap.name}</span>
          </div>
          <div class="ibe-bp-flight-dest" style="margin-bottom:.75rem">
            <span>&#x2192; ${city}</span>
          </div>
          <button class="ibe-btn-booking"
                  onclick="window.ibeOpenBooking('${ibeUrl}', '${cardTitle}')">
            Flüge ansehen
          </button>
        </div>`;
      grid.appendChild(card);
    });

    el.appendChild(grid);
  }

  // ── IntersectionObserver: lazy load ────────────────────────────────────────

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        if (el.classList.contains("holiday-widget-placeholder")) {
          loadHolidayWidget(el);
        } else if (el.id === "ibe-main-engine-root") {
          loadBoardingPass(el);
        } else {
          loadTeaser(el);
        }
        observer.unobserve(el);
      }
    });
  }, { rootMargin: "300px" });

  function scan() {
    document.querySelectorAll(".ibe-auto-teaser:not([data-ibe-observed])").forEach(el => {
      el.dataset.ibeObserved = "1";
      observer.observe(el);
    });
    document.querySelectorAll(".holiday-widget-placeholder:not([data-hw-observed])").forEach(el => {
      el.dataset.hwObserved = "1";
      observer.observe(el);
    });
    const bp = document.getElementById("ibe-main-engine-root");
    if (bp && !bp.dataset.bpObserved) {
      bp.dataset.bpObserved = "1";
      observer.observe(bp);
    }
  }

  // ── Init ─────────────────────────────────────────────────────────────────────

  window._ibeScan = scan;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", scan);
  } else {
    scan();
  }

  new MutationObserver(scan).observe(document.body, { childList: true, subtree: true });

})();
