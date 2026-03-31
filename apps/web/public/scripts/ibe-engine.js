/**
 * IBE Engine – Urlaubfinder365
 * Lädt Reiseangebote von /api/teaser und rendert sie als Karussell.
 * Steuert das globale Buchungs-Modal (#ibe-modal-overlay).
 */
(function () {
  "use strict";

  // ── Hilfsfunktionen ─────────────────────────────────────────────────────────

  const AGENT = "993243";

  function stars(n) {
    const full = Math.round(n);
    return "★".repeat(Math.min(full, 5)) + "☆".repeat(Math.max(0, 5 - full));
  }

  function boardLabel(code) {
    const map = {
      RO: "Nur Übernachtung", BB: "Frühstück", HB: "Halbpension",
      FB: "Vollpension", AI: "All Inclusive", UAI: "Ultra All Inclusive",
      HP: "Halbpension", VP: "Vollpension",
    };
    return map[(code || "").toUpperCase()] || code || "";
  }

  function formatDate(isoStr) {
    if (!isoStr) return "";
    const d = new Date(isoStr);
    return d.toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "2-digit" });
  }

  function formatPrice(cents) {
    return (cents / 100).toLocaleString("de-DE", { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + " €";
  }

  function isLastMinute(dateStr) {
    if (!dateStr) return false;
    const diff = (new Date(dateStr) - new Date()) / 86400000;
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

    // Close on overlay click
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

  // ESC-Taste schließt Modal
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") window.ibeCloseModal();
  });

  // ── Globaler Angebots-Cache ─────────────────────────────────────────────────

  window._ibeOffers = window._ibeOffers || {};

  // ── Karten-Renderer ─────────────────────────────────────────────────────────

  function buildBookingUrl(offer) {
    const base = "https://b2b.specials.de/deeplink/package";
    const params = new URLSearchParams({
      agent: AGENT,
      productCode: offer.product_code || "",
    });
    return `${base}?${params}`;
  }

  function renderSkeleton() {
    return '<div class="ibe-skeleton"></div>'.repeat(4);
  }

  function renderCard(offer) {
    const ok = offer.product_code;
    window._ibeOffers[ok] = offer;

    const bookUrl  = buildBookingUrl(offer);
    const imgSrc   = offer.images?.medium || offer.images?.large || "";
    const imgFallback = `https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&h=240&q=60`;
    const lm       = isLastMinute(offer.offer_from);
    const ai       = isAI(offer.board_code);
    const rec      = offer.rating?.recommendation ? Math.round(offer.rating.recommendation) : null;
    const ratingOv = offer.rating?.overall ? (offer.rating.overall / 10).toFixed(1) : null;
    const ratingCt = offer.rating?.count || 0;
    const priceEur = offer.offer_price_adult || 0;
    const nights   = offer.offer_duration || 7;

    return `
<div class="offer-card" role="article">
  <div class="hotel-img-wrap">
    <img src="${imgSrc || imgFallback}"
         onerror="this.src='${imgFallback}'"
         alt="${offer.hotel_name || ''}"
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
    ${ratingOv ? `
    <div class="rating-box" onclick="window.ibeOpenBooking('${bookUrl}', '${(offer.hotel_name || "").replace(/'/g, "\\'")}')">
      <div class="rating-row">
        <span class="rating-score">
          <span style="color:#f59e0b">★</span> ${ratingOv}
          ${rec ? `<span class="rating-sep">|</span><span class="rating-rec">${rec}% empfehlen</span>` : ""}
        </span>
      </div>
      ${ratingCt ? `<span class="rating-count">${ratingCt.toLocaleString("de-DE")} Bewertungen</span>` : ""}
    </div>` : ""}

    <div class="detail-list">
      ${offer.board_name || offer.board_code ? `<div class="detail-item detail-board"><i class="fa fa-utensils" aria-hidden="true"></i>${boardLabel(offer.board_code)}</div>` : ""}
      ${offer.lodging_name ? `<div class="detail-item detail-room"><i class="fa fa-bed" aria-hidden="true"></i>${offer.lodging_name}</div>` : ""}
      ${offer.offer_from ? `<div class="detail-item"><i class="fa fa-calendar" aria-hidden="true"></i>${formatDate(offer.offer_from)}</div>` : ""}
    </div>

    <div class="card-bottom">
      <div class="tag-row">
        <span class="tag tag-nights"><i class="fa fa-moon"></i> ${nights} Nächte</span>
        <span class="tag tag-flight"><i class="fa fa-plane"></i> inkl. Flug</span>
      </div>
      <div class="price-row">
        <div>
          <div class="price-label">ab p.P.</div>
          <div class="price-total">${priceEur.toLocaleString("de-DE")} €</div>
        </div>
        <button class="btn-booking"
                onclick="window.ibeOpenBooking('${bookUrl}', '${(offer.hotel_name || "").replace(/'/g, "\\'")}')">
          Buchen
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

    const regionId     = el.dataset.region     || "";
    const cityId       = el.dataset.city       || "";
    const headline     = el.dataset.headline   || "";
    const boardCode    = el.dataset.boardCode  || "";
    const from         = el.dataset.from       || "14";
    const to           = el.dataset.to         || "42";
    const duration     = el.dataset.duration   || "7-7";
    const adults       = el.dataset.adults     || "2";
    const children     = el.dataset.children   || "";
    const category     = el.dataset.category   || "3";
    const minRec       = el.dataset.minrecommrate || "50";
    const excludeAi    = el.dataset.excludeAi  === "true";
    const sortBy       = el.dataset.sortBy     || "";
    const diverse      = el.dataset.diverseResults === "true";
    const keywords     = el.dataset.keywords   || "";
    const maxPrice     = el.dataset.maxPrice   || "";
    const noHeading    = el.dataset.noHeading  === "true";

    // Wrapper
    const wrapper = document.createElement("div");
    wrapper.className = "ibe-engine-instance";
    el.parentNode.insertBefore(wrapper, el);
    wrapper.appendChild(el);

    // Heading
    if (headline && !noHeading) {
      const h = document.createElement("div");
      h.innerHTML = `<h2 class="ibe-heading">${headline.replace(/\*(.*?)\*/g, '<span class="ibe-heading-accent">$1</span>')}</h2>`;
      wrapper.insertBefore(h, el);
    }

    // Carousel shell
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

    // Build query
    const params = new URLSearchParams({ from, to, duration, adults });
    if (regionId) params.set("regionId", regionId);
    if (cityId)   params.set("cityId",   cityId);
    if (boardCode && !excludeAi) params.set("boardCode", boardCode);
    if (category)  params.set("category",     category);
    if (minRec)    params.set("minRecommrate", minRec);
    if (children)  params.set("children",      children);
    if (keywords)  params.set("keywords",      keywords);
    if (maxPrice)  params.set("maxPrice",      maxPrice);
    if (sortBy)    params.set("hSort",         sortBy);

    try {
      const res  = await fetch(`/api/teaser?${params}`);
      const json = await res.json();
      let offers = Array.isArray(json.data) ? json.data : [];

      // Filter AI boards if excludeAi
      if (excludeAi) {
        offers = offers.filter(o => !isAI(o.board_code));
      }

      // Diverse: max 2 per city
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

      // Carousel navigation
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

  // ── IntersectionObserver: lazy load ────────────────────────────────────────

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        loadTeaser(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { rootMargin: "300px" });

  function scan() {
    document.querySelectorAll(".ibe-auto-teaser:not([data-ibe-observed])").forEach(el => {
      el.dataset.ibeObserved = "1";
      observer.observe(el);
    });
  }

  // ── Init ─────────────────────────────────────────────────────────────────────

  window._ibeScan = scan;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", scan);
  } else {
    scan();
  }

  // MutationObserver für dynamisch hinzugefügte Elemente (Next.js navigation)
  new MutationObserver(scan).observe(document.body, { childList: true, subtree: true });

})();
