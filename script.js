/**
 * VIP BEAUTY SALON — RAJKOT
 * Premium Interactive Controller & Booking Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  // Set current year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Initialize features
  initNavigation();
  initServiceTabs();
  initGallery();
  initReviewsSlider();
  initBookingSystem();
  initDateConstraints();
  syncManagedServices();
  syncManagedOffers();
  syncManagedGallery();
  syncManagedImages();
});

/* ==========================================================================
   ADMIN-MANAGED SERVICES
   ========================================================================== */

function syncManagedServices() {
  let services;
  try {
    services = JSON.parse(localStorage.getItem("vip_salon_services") || "null");
  } catch (_) {
    return;
  }
  if (!Array.isArray(services)) return;

  const grid = document.getElementById("services-grid");
  if (!grid) return;

  const existingCards = [...grid.querySelectorAll(".service-card")];
  const existingNames = new Set(existingCards.map(card =>
    card.querySelector(".service-title")?.textContent.trim()
  ).filter(Boolean));

  existingCards.forEach(card => {
    const title = card.querySelector(".service-title");
    const name = title?.textContent.trim();
    const managed = services.find(service => service.name === name);

    if (!managed) {
      card.remove();
      return;
    }

    existingNames.delete(name);
    existingNames.add(managed.name);
    card.dataset.category = managed.category;
    if (title) title.textContent = managed.name;

    const description = card.querySelector(".service-desc");
    if (description) description.textContent = managed.description || "";

    const price = card.querySelector(".service-price");
    if (price) {
      price.textContent = managed.price;
      price.classList.toggle("text-muted-gold", managed.price.toLowerCase().includes("contact"));
    }

    const img = card.querySelector(".service-img-wrap img");
    if (img && managed.image) {
      img.src = managed.image;
      img.alt = managed.name;
    }

    const bookButton = card.querySelector(".service-footer button");
    if (bookButton) bookButton.setAttribute("onclick", `openBookingModal('${managed.name.replace(/'/g, "\\'")}')`);
  });

  services.forEach(service => {
    if (existingNames.has(service.name)) return;

    const template = existingCards.find(card => card.querySelector(".service-category")) || existingCards[0];
    if (!template) return;

    const card = template.cloneNode(true);
    card.dataset.category = service.category;
    card.style.display = "none";
    card.querySelector(".service-title").textContent = service.name;

    const description = card.querySelector(".service-desc");
    if (description) description.textContent = service.description || "";

    const price = card.querySelector(".service-price");
    if (price) {
      price.textContent = service.price;
      price.classList.toggle("text-muted-gold", service.price.toLowerCase().includes("contact"));
    }

    const img = card.querySelector(".service-img-wrap img");
    if (img && service.image) {
      img.src = service.image;
      img.alt = service.name;
    }

    const title = card.querySelector(".service-title");
    const safeName = service.name.replace(/'/g, "\\'");
    const bookButton = card.querySelector(".service-footer button");
    if (bookButton) bookButton.setAttribute("onclick", `openBookingModal('${safeName}')`);
    if (title) title.textContent = service.name;
    grid.appendChild(card);
  });

  const activeTab = document.querySelector(".service-tabs .tab-btn.active");
  if (activeTab) switchServiceTab(activeTab.dataset.category);
}

function syncManagedImages() {
  let overrides;
  try {
    overrides = JSON.parse(localStorage.getItem("vip_salon_images") || "{}");
  } catch (_) {
    return;
  }

  const pageImages = [...document.querySelectorAll("img:not(#lightbox-img)")];
  pageImages.forEach((image, index) => {
    const saved = overrides[`page-image-${index}`];
    if (!saved) return;

    image.alt = saved.label || image.alt;
    if (saved.url) image.src = saved.url;
    image.hidden = Boolean(saved.deleted);

    const container = image.closest(".service-img-wrap, .offer-img-wrap, .booking-banner-image, .hero-visual");
    if (container) container.hidden = Boolean(saved.deleted);

    const galleryCard = image.closest(".gallery-item");
    if (galleryCard) {
      const cardImages = [...galleryCard.querySelectorAll("img")];
      galleryCard.hidden = cardImages.every(cardImage => {
        const cardIndex = pageImages.indexOf(cardImage);
        return cardIndex >= 0 && Boolean(overrides[`page-image-${cardIndex}`]?.deleted);
      });
    }
  });

  if (typeof galleryItemsData === "undefined") return;
  galleryItemsData.forEach((item, index) => {
    const saved = overrides[`gallery-image-${index}`];
    if (!saved) return;
    if (saved.url) item.src = saved.url;
    if (saved.label) item.caption = saved.label;
    item.deleted = Boolean(saved.deleted);

    const galleryCard = document.querySelectorAll(".gallery-item")[index];
    if (galleryCard) {
      if (saved.url && !galleryCard.querySelector(".split-view")) {
        const image = galleryCard.querySelector("img");
        if (image) image.src = saved.url;
      }
      if (saved.label) {
        const caption = galleryCard.querySelector(".gallery-caption");
        if (caption) caption.textContent = saved.label;
      }
      galleryCard.hidden = item.deleted;
    }
  });
}

function readManagedContent(key) {
  try {
    const items = JSON.parse(localStorage.getItem(key) || "null");
    return Array.isArray(items) ? items : null;
  } catch (_) {
    return null;
  }
}

function syncManagedOffers() {
  const offers = readManagedContent("vip_salon_offers");
  const grid = document.querySelector(".offers-grid");
  if (!offers || !grid) return;

  const template = grid.querySelector(".offer-card");
  if (!template) return;
  grid.replaceChildren();

  offers.forEach(offer => {
    const card = template.cloneNode(true);
    card.classList.toggle("popular-offer", offer.category === "popular");
    const badge = card.querySelector(".offer-badge");
    if (badge) {
      badge.textContent = offer.badge || "";
      badge.classList.toggle("gold-badge", offer.category === "popular");
      badge.style.display = offer.badge ? "" : "none";
    }

    const image = card.querySelector("img");
    if (image) {
      image.src = offer.image;
      image.alt = offer.alt || offer.title;
    }

    const title = card.querySelector(".offer-title");
    const description = card.querySelector(".offer-desc");
    const currentPrice = card.querySelector(".offer-current-price");
    const originalPrice = card.querySelector(".offer-original-price");
    const prices = card.querySelector(".offer-prices");
    const bookButton = card.querySelector(".offer-pricing-row button");
    if (title) title.textContent = offer.title;
    if (description) description.textContent = offer.description;
    if (currentPrice) currentPrice.textContent = offer.price;
    if (originalPrice) {
      originalPrice.textContent = offer.originalPrice || "";
      originalPrice.style.display = offer.originalPrice ? "" : "none";
    } else if (offer.originalPrice && prices) {
      const original = document.createElement("span");
      original.className = "offer-original-price";
      original.textContent = offer.originalPrice;
      prices.appendChild(original);
    }

    if (bookButton) {
      bookButton.addEventListener("click", () => openBookingModal(offer.bookingService || offer.title));
      bookButton.removeAttribute("onclick");
    }
    grid.appendChild(card);
  });
}

function syncManagedGallery() {
  const items = readManagedContent("vip_salon_gallery");
  const grid = document.getElementById("gallery-container");
  if (!items || !grid || typeof galleryItemsData === "undefined") return;

  galleryItemsData.splice(0, galleryItemsData.length, ...items.map(item => ({
    src: item.image,
    caption: item.caption,
    category: item.category,
    deleted: false
  })));

  const cards = items.map((item, index) => {
    const card = document.createElement("div");
    card.className = "gallery-item";
    if (item.beforeImage && item.afterImage) card.classList.add("before-after-split-card");
    card.dataset.category = item.category;
    card.addEventListener("click", () => openLightbox(index));

    if (item.beforeImage && item.afterImage) {
      const split = document.createElement("div");
      split.className = "split-view";
      [
        { source: item.beforeImage, alt: item.beforeAlt || `${item.caption} before`, label: "Before", side: "before" },
        { source: item.afterImage, alt: item.afterAlt || `${item.caption} after`, label: "After", side: "after" }
      ].forEach((imageData, imageIndex) => {
        if (imageIndex > 0) {
          const divider = document.createElement("div");
          divider.className = "split-divider";
          split.appendChild(divider);
        }
        const half = document.createElement("div");
        half.className = `split-half ${imageData.side}-half`;
        const image = document.createElement("img");
        image.src = imageData.source;
        image.alt = imageData.alt;
        image.loading = "lazy";
        const label = document.createElement("span");
        label.className = `pill-label ${imageData.side}-label`;
        label.textContent = imageData.label;
        half.append(image, label);
        split.appendChild(half);
      });
      card.appendChild(split);
    } else {
      const image = document.createElement("img");
      image.src = item.image;
      image.alt = item.alt || item.caption;
      image.loading = "lazy";
      card.appendChild(image);
    }

    const overlay = document.createElement("div");
    overlay.className = "gallery-item-overlay";
    const zoomIcon = document.createElement("span");
    zoomIcon.className = "gallery-zoom-icon";
    zoomIcon.textContent = "🔍";
    const caption = document.createElement("span");
    caption.className = "gallery-caption";
    caption.textContent = item.caption;
    overlay.append(zoomIcon, caption);
    card.appendChild(overlay);
    return card;
  });

  grid.replaceChildren(...cards);
  const activeFilter = document.querySelector(".gallery-filters .filter-pill.active")?.dataset.filter || "all";
  cards.forEach(card => {
    card.style.display = activeFilter === "all" || card.dataset.category === activeFilter ? "block" : "none";
  });
}

/* ==========================================================================
   NAVIGATION & SCROLL
   ========================================================================== */

function initNavigation() {
  const nav = document.getElementById('top-nav');
  const menuBtn = document.getElementById('menu-btn');
  const navLinks = document.getElementById('nav-links');
  const navItems = navLinks ? navLinks.querySelectorAll('a') : [];

  // Sticky header background
  window.addEventListener('scroll', () => {
    if (nav) {
      nav.classList.toggle('scrolled', window.scrollY > 20);
    }
    highlightActiveNavLink();
  }, { passive: true });

  // Mobile menu toggle
  if (menuBtn && navLinks) {
    menuBtn.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', String(isOpen));
    });

    // Close on link click
    navItems.forEach(item => {
      item.addEventListener('click', () => {
        navLinks.classList.remove('open');
        menuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Handle dropdown service links & tab switching on both desktop & mobile
  document.querySelectorAll('.dropdown-link, [data-filter]').forEach(link => {
    link.addEventListener('click', () => {
      const filter = link.getAttribute('data-filter');
      if (filter) {
        switchServiceTab(filter);
      }
      if (navLinks) {
        navLinks.classList.remove('open');
        if (menuBtn) menuBtn.setAttribute('aria-expanded', 'false');
      }
    });
  });

  // Active link scrollspy
  function highlightActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 120;

    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      const id = sec.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navItems.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else if (link.getAttribute('href')?.startsWith('#')) {
            link.classList.remove('active');
          }
        });
      }
    });
  }
}

/* ==========================================================================
   SERVICE CATEGORY TABS
   ========================================================================== */

function initServiceTabs() {
  const tabButtons = document.querySelectorAll('.service-tabs .tab-btn');
  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const category = btn.getAttribute('data-category');
      switchServiceTab(category);
    });
  });
}

function switchServiceTab(category) {
  const tabButtons = document.querySelectorAll('.service-tabs .tab-btn');
  const serviceCards = document.querySelectorAll('.services-grid .service-card');

  // Update tabs state
  tabButtons.forEach(b => {
    const isTarget = b.getAttribute('data-category') === category;
    b.classList.toggle('active', isTarget);
    b.setAttribute('aria-selected', String(isTarget));
  });

  // Filter service cards with fade effect
  serviceCards.forEach(card => {
    const cardCat = card.getAttribute('data-category');
    if (cardCat === category) {
      card.style.display = 'flex';
      card.style.opacity = '0';
      card.style.transform = 'translateY(12px)';
      requestAnimationFrame(() => {
        card.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      });
    } else {
      card.style.display = 'none';
    }
  });
}

/* ==========================================================================
   OUR GALLERY & LIGHTBOX
   ========================================================================== */

const galleryItemsData = [
  {
    src: "https://images.unsplash.com/photo-1560869713-7d0a29430803?auto=format&fit=crop&w=1200&q=85",
    caption: "Hair Transformation — Balayage & Silk Waves",
    category: "hair"
  },
  {
    src: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=1200&q=85",
    caption: "Facial Skin Radiance & Deep Clean-up Transformation",
    category: "skin"
  },
  {
    src: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1200&q=85",
    caption: "Luxury Indian Bridal Makeover & Hair Styling",
    category: "bridal"
  },
  {
    src: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=85",
    caption: "VIP Beauty Salon Luxury Interior — Raiya Road, Rajkot",
    category: "salon"
  },
  {
    src: "https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=1200&q=85",
    caption: "Deluxe Manicure & Nail Polish Artistry",
    category: "beauty"
  },
  {
    src: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1200&q=85",
    caption: "Hydra Glow Facial & Herbal Nourishment",
    category: "skin"
  }
];

let currentLightboxIndex = 0;

function initGallery() {
  const filterButtons = document.querySelectorAll('.gallery-filters .filter-pill');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');
      const galleryCards = document.querySelectorAll('.gallery-grid .gallery-item');
      galleryCards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Keyboard navigation for lightbox
  document.addEventListener('keydown', (e) => {
    const lightbox = document.getElementById('gallery-lightbox');
    if (!lightbox || !lightbox.classList.contains('open')) return;

    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') navigateLightbox(-1);
    if (e.key === 'ArrowRight') navigateLightbox(1);
  });
}

function openLightbox(index) {
  if (index < 0 || index >= galleryItemsData.length) return;
  if (galleryItemsData[index].deleted) return;
  currentLightboxIndex = index;

  const lightbox = document.getElementById('gallery-lightbox');
  const img = document.getElementById('lightbox-img');
  const caption = document.getElementById('lightbox-caption');

  const item = galleryItemsData[index];
  img.src = item.src;
  caption.textContent = item.caption;

  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  const lightbox = document.getElementById('gallery-lightbox');
  if (lightbox) {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }
}

function navigateLightbox(direction) {
  const availableIndexes = galleryItemsData
    .map((item, index) => item.deleted ? -1 : index)
    .filter(index => index >= 0);
  if (availableIndexes.length === 0) {
    closeLightbox();
    return;
  }
  const currentPosition = availableIndexes.indexOf(currentLightboxIndex);
  const nextPosition = (currentPosition + direction + availableIndexes.length) % availableIndexes.length;
  currentLightboxIndex = availableIndexes[nextPosition];
  openLightbox(currentLightboxIndex);
}

/* ==========================================================================
   CUSTOMER REVIEWS SLIDER
   ========================================================================== */

function initReviewsSlider() {
  const slides = document.querySelectorAll('#testimonial-container .testimonial-slide');
  const prevBtn = document.getElementById('prev-review');
  const nextBtn = document.getElementById('next-review');
  let currentSlide = 0;
  let autoTimer = null;

  function showSlide(index) {
    slides.forEach((s, i) => {
      s.classList.toggle('active', i === index);
    });
  }

  function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
  }

  function prevSlide() {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(currentSlide);
  }

  if (nextBtn && prevBtn) {
    nextBtn.addEventListener('click', () => {
      nextSlide();
      resetTimer();
    });
    prevBtn.addEventListener('click', () => {
      prevSlide();
      resetTimer();
    });
  }

  function startTimer() {
    autoTimer = setInterval(nextSlide, 7000);
  }

  function resetTimer() {
    clearInterval(autoTimer);
    startTimer();
  }

  startTimer();
}

/* ==========================================================================
   ONLINE APPOINTMENT BOOKING SYSTEM (5-STEP WIZARD)
   ========================================================================== */

let currentWizardStep = 1;

function initBookingSystem() {
  // Close modal when clicking backdrop
  const modal = document.getElementById('booking-modal');
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeBookingModal();
    });
  }

  // Prevent past dates in booking calendar
  initDateConstraints();
}

function initDateConstraints() {
  const dateInput = document.getElementById('booking-date');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;

    // Default to tomorrow if not set
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    dateInput.value = tomorrow.toISOString().split('T')[0];
  }
}

function openBookingModal(preselectedService = null) {
  const modal = document.getElementById('booking-modal');
  const serviceSelect = document.getElementById('booking-service');

  if (preselectedService && serviceSelect) {
    // Try to match preselected service in dropdown
    let matched = false;
    for (let i = 0; i < serviceSelect.options.length; i++) {
      if (serviceSelect.options[i].text.toLowerCase().includes(preselectedService.toLowerCase()) ||
          serviceSelect.options[i].value.toLowerCase().includes(preselectedService.toLowerCase())) {
        serviceSelect.selectedIndex = i;
        matched = true;
        break;
      }
    }
    if (!matched) {
      // Append option if custom
      const customOpt = new Option(preselectedService, preselectedService, true, true);
      serviceSelect.add(customOpt);
    }
  }

  // Reset wizard to step 1
  goToStep(1);

  // Hide success panel if it was open
  const successPanel = document.getElementById('step-panel-success');
  if (successPanel) successPanel.style.display = 'none';

  const form = document.getElementById('appointment-form');
  if (form) form.style.display = 'block';

  if (modal) {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

function closeBookingModal() {
  const modal = document.getElementById('booking-modal');
  if (modal) {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }
}

function goToStep(step) {
  const serviceSelect = document.getElementById('booking-service');
  const dateInput = document.getElementById('booking-date');

  // Step 1 Validation
  if (step === 2) {
    if (!serviceSelect.value) {
      alert('Please select a salon service to proceed.');
      serviceSelect.focus();
      return;
    }
  }

  // Step 2 Validation
  if (step === 3) {
    if (!dateInput.value) {
      alert('Please choose an appointment date.');
      dateInput.focus();
      return;
    }

    // Populate summary on step 3
    updateBookingSummary();
  }

  currentWizardStep = step;

  // Toggle step panels
  for (let i = 1; i <= 3; i++) {
    const panel = document.getElementById(`step-panel-${i}`);
    const indicator = document.getElementById(`wiz-step-${i}`);
    if (panel) panel.classList.toggle('active', i === step);
    if (indicator) indicator.classList.toggle('active', i === step);
  }
}

function updateBookingSummary() {
  const service = document.getElementById('booking-service').value || 'Selected Service';
  const date = document.getElementById('booking-date').value || 'Selected Date';
  const timeSlot = document.querySelector('input[name="booking-time"]:checked')?.value || '10:00 AM';

  const summaryBox = document.getElementById('booking-summary-box');
  if (summaryBox) {
    // Format date nicely
    let formattedDate = date;
    try {
      const d = new Date(date + 'T00:00:00');
      formattedDate = d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
    } catch (_) {}

    summaryBox.innerHTML = `
      <div style="font-weight: 700; color: #111; margin-bottom: 6px;">Booking Summary:</div>
      <div><strong>Service:</strong> ${service}</div>
      <div><strong>Date:</strong> ${formattedDate}</div>
      <div><strong>Time Slot:</strong> ${timeSlot}</div>
    `;
  }
}

function handleBookingSubmit(event) {
  event.preventDefault();

  const service = document.getElementById('booking-service').value;
  const date = document.getElementById('booking-date').value;
  const timeSlot = document.querySelector('input[name="booking-time"]:checked')?.value || '10:00 AM';
  const name = document.getElementById('booking-name').value.trim();
  const phone = document.getElementById('booking-phone').value.trim();
  const notes = document.getElementById('booking-notes').value.trim();

  if (!name || !phone) {
    alert('Please enter your full name and valid 10-digit mobile number.');
    return;
  }

  // Format date
  let formattedDate = date;
  try {
    const d = new Date(date + 'T00:00:00');
    formattedDate = d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
  } catch (_) {}

  // 1. Save appointment in localStorage for Staff Desk
  const bookingRecord = {
    id: 'VIP-' + Date.now().toString().slice(-6),
    createdAt: new Date().toISOString(),
    service,
    date: formattedDate,
    time: timeSlot,
    customer: name,
    phone,
    notes,
    status: 'Pending Confirmation'
  };

  try {
    const existing = JSON.parse(localStorage.getItem('vip_salon_appointments') || '[]');
    existing.unshift(bookingRecord);
    localStorage.setItem('vip_salon_appointments', JSON.stringify(existing));
  } catch (err) {
    console.warn('Could not save to localStorage', err);
  }

  // 2. Prepare WhatsApp URL with pre-filled message
  let waMsg = `Hello VIP Beauty Salon! I would like to request an appointment:\n\n`;
  waMsg += `• Service: ${service}\n`;
  waMsg += `• Date: ${formattedDate}\n`;
  waMsg += `• Time: ${timeSlot}\n`;
  waMsg += `• Name: ${name}\n`;
  waMsg += `• Phone: ${phone}\n`;
  if (notes) waMsg += `• Note: ${notes}\n`;
  waMsg += `\nPlease confirm if this slot is available. Thank you!`;

  const waUrl = `https://wa.me/919327600839?text=${encodeURIComponent(waMsg)}`;

  // 3. Update Success Screen details
  const displayBox = document.getElementById('booked-details-display');
  if (displayBox) {
    displayBox.innerHTML = `
      <div style="margin-bottom: 4px;"><strong>Booking ID:</strong> ${bookingRecord.id}</div>
      <div style="margin-bottom: 4px;"><strong>Service:</strong> ${service}</div>
      <div style="margin-bottom: 4px;"><strong>Date & Time:</strong> ${formattedDate} at ${timeSlot}</div>
      <div style="margin-bottom: 4px;"><strong>Customer:</strong> ${name} (${phone})</div>
      <div style="color: #b38e28; font-weight: 700; margin-top: 8px;">Status: Appointment Request Prepared for Confirmation</div>
    `;
  }

  // Hide form, show success screen
  document.getElementById('appointment-form').style.display = 'none';
  document.getElementById('step-panel-success').style.display = 'block';

  // Open WhatsApp in new window/tab
  window.open(waUrl, '_blank');
}

/* ==========================================================================
   VIP MEMBERSHIP ENQUIRY
   ========================================================================== */

function enquireMembership(tierName) {
  const msg = `Hello VIP Beauty Salon! I am interested in joining the ${tierName} loyalty program at Raiya Road, Rajkot. Please share details regarding membership benefits and enrollment.`;
  const url = `https://wa.me/919327600839?text=${encodeURIComponent(msg)}`;
  window.open(url, '_blank');
}

/* ==========================================================================
   POLICIES & TERMS MODAL
   ========================================================================== */

function openPolicyModal(type) {
  const modal = document.getElementById('policy-modal');
  const title = document.getElementById('policy-modal-title');
  const body = document.getElementById('policy-modal-body');

  if (type === 'privacy') {
    title.textContent = 'Privacy Policy';
    body.innerHTML = `
      <p><strong>Last Updated:</strong> May 2025</p>
      <h4>1. Information Collection</h4>
      <p>VIP Beauty Salon collects your name, mobile contact number and appointment requests solely to schedule, manage, and confirm your salon services.</p>
      <h4>2. Communication</h4>
      <p>We use your contact details to communicate via telephone or WhatsApp regarding your requested appointment time, service inquiries, and salon reminders.</p>
      <h4>3. Data Security & Third Parties</h4>
      <p>We do not sell, rent, or distribute client contact records to third-party marketing entities. Your data is treated with confidentiality.</p>
      <h4>4. Contact</h4>
      <p>If you have any questions regarding our privacy practices, contact us at +91 93276 00839 or visit us at Shop No. 3, Shreeji Heights, Raiya Road, Rajkot.</p>
    `;
  } else {
    title.textContent = 'Terms & Conditions';
    body.innerHTML = `
      <p><strong>Last Updated:</strong> May 2025</p>
      <h4>1. Appointment Booking & Confirmation</h4>
      <p>Online booking requests submitted through this website or WhatsApp are subject to salon confirmation. An appointment is only finalized once acknowledged by our salon reception team.</p>
      <h4>2. Pricing & Offers</h4>
      <p>All prices and promotional offers are based on verified salon schedules. Prices may vary based on hair length, density, or customized treatments.</p>
      <h4>3. Punctuality & Rescheduling</h4>
      <p>Please arrive 10 minutes prior to your scheduled slot. If you need to reschedule or cancel, kindly notify us via WhatsApp or phone call at least 2 hours in advance.</p>
      <h4>4. Hygiene & Safety</h4>
      <p>VIP Beauty Salon adheres to professional salon hygiene standards, sanitized equipment, and brand-certified beauty products.</p>
    `;
  }

  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closePolicyModal() {
  const modal = document.getElementById('policy-modal');
  if (modal) {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }
}

/* ==========================================================================
   SALON STAFF PORTAL MODAL (Local Appointment Viewer)
   ========================================================================== */

function openStaffModal() {
  const modal = document.getElementById('staff-modal');
  const countEl = document.getElementById('staff-booking-count');
  const tbody = document.getElementById('staff-table-body');

  const appointments = JSON.parse(localStorage.getItem('vip_salon_appointments') || '[]');

  if (countEl) {
    countEl.textContent = `${appointments.length} appointment(s) recorded`;
  }

  if (tbody) {
    if (appointments.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" class="text-center py-4" style="text-align: center; color: #888; padding: 24px;">No appointment requests recorded in browser storage yet.</td></tr>`;
    } else {
      tbody.innerHTML = appointments.map(app => `
        <tr>
          <td><strong>${app.date}</strong></td>
          <td>${app.time}</td>
          <td>${app.customer}</td>
          <td><a href="tel:${app.phone}" style="color: #b38e28; text-decoration: underline;">${app.phone}</a></td>
          <td>${app.service}</td>
          <td><span style="background: #FFF8E7; color: #8B6B15; padding: 3px 8px; border-radius: 99px; font-size: 11px; font-weight: 700;">${app.status}</span></td>
        </tr>
      `).join('');
    }
  }

  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeStaffModal() {
  const modal = document.getElementById('staff-modal');
  if (modal) {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }
}

function exportAppointmentsCSV() {
  const appointments = JSON.parse(localStorage.getItem('vip_salon_appointments') || '[]');
  if (appointments.length === 0) {
    alert('No appointments available to export.');
    return;
  }

  let csv = 'ID,Date,Time,Customer,Phone,Service,Status\n';
  appointments.forEach(a => {
    csv += `"${a.id}","${a.date}","${a.time}","${a.customer}","${a.phone}","${a.service}","${a.status}"\n`;
  });

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `VIP_Salon_Appointments_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
