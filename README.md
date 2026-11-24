# VIP Beauty Salon — Premium Redesign & Feature Upgrade

A luxury, fully responsive salon website for **VIP Beauty Salon**, Raiya Road, Rajkot, Gujarat. Built with modern editorial aesthetics, Champagne Gold accents, and an interactive 5-step appointment booking workflow.

---

## 🌟 Brand Design Direction
- **Primary Color:** Luxury Black (`#111111`)
- **Accent Color:** Champagne Gold (`#D4AF37`) & Gold Gradients
- **Backgrounds:** Warm Beige (`#F5F0E8`) & Soft Ivory (`#FAF7F2`)
- **Typography:** Editorial Serif (*Playfair Display*) paired with clean modern sans (*Plus Jakarta Sans*)
- **Aesthetic:** Editorial whitespace, modern rounded cards, subtle hover micro-interactions, and premium photography.

---

## 🚀 Key Sections & Features

1. **Sticky Luxury Navigation**
   - Gold crown emblem + VIP Beauty Salon brand.
   - Quick links (`Home`, `About`, `Services ▾`, `Offers`, `Gallery`, `Reviews`, `Contact`).
   - Direct CTA button: `📅 Book Appointment`.
   - Mobile-responsive sliding navigation drawer.

2. **Luxury Hero Section**
   - Brand tag: `✦ VIP BEAUTY SALON`.
   - Heading: *"Your Beauty. Your Style. Your VIP Experience."*
   - CTA buttons: `Book Appointment`, `Explore Services →`, `💬 WhatsApp Booking`.
   - Announcement banner: `🎉 New Opening! | VIP Beauty Salon is now open at Raiya Road, Rajkot!`.
   - Arched luxury bridal portrait with golden ambient lighting.

3. **About Us & Why Choose Us**
   - Salon interior photography with illuminated arch mirrors and styling stations.
   - 4 Pillars: Beauty Philosophy, Professional Experience, Customer Satisfaction, and Hygiene & Quality Standards.
   - Trust Bar: Expert Stylists (👑), Premium Products (💎), Hygienic & Safe (🌿), Personalized Care (💖), Trusted in Rajkot (⭐).

4. **Professional Services (Interactive Category Menu)**
   - Filter tabs: `✂️ Hair Services`, `🧴 Skin Care`, `✨ Beauty Services`, `💅 Hands & Feet`, `👰 Bridal & Special`.
   - Retains all verified confirmed prices (₹99 services, ₹199 haircuts, ₹499 hair spa, ₹599 keratin, ₹399 manicure + pedicure combo).
   - "Book Now" buttons on every card that launch the booking wizard with that service pre-selected.

5. **Online Appointment Booking System (5-Step Wizard)**
   - Step 1: Select Service (with categorized optgroups).
   - Step 2: Pick Date (past dates disabled) & Time Slot chips (10:00 AM, 11:30 AM, 01:00 PM, etc.).
   - Step 3: Customer Details (Name, Phone number validation, Notes).
   - Step 4: Summary Review & WhatsApp confirmation link generation.
   - Step 5: Success confirmation view with unique Booking ID.
   - All booking requests are stored in `localStorage` for salon reception review.

6. **Special Offers**
   - Manicure + Pedicure Special: ₹399 (Original ₹599) [Limited Offer].
   - Keratin Treatment: ₹599 (Original ₹999) [Most Popular].
   - Selected Services starting at ₹99 [Starting at].

7. **Our Gallery with Interactive Lightbox**
   - Filter pills: `All`, `Hair`, `Skin`, `Bridal`, `Beauty`, `Salon Interior`.
   - Before & After split transformation card with pill tags.
   - Click-to-zoom Lightbox with captions and keyboard controls (`Esc`, `←`, `→`).

8. **VIP Membership System**
   - 3 Loyalty tiers: `Silver Membership`, `Gold Membership`, and `VIP Membership`.
   - Benefits breakdown, crown badges, and WhatsApp enrollment inquiries.

9. **Customer Reviews**
   - Google Reviews Trust card with verified **4.9 ★★★★★** rating and link to Google Maps.
   - Testimonial slider featuring verified client feedback and navigation controls.

10. **Contact & Location**
    - Verified salon address: Shop No. 3, Shreeji Heights, Opp. Pramukh Swami Auditorium, Raiya Road, Rajkot, Gujarat – 360004.
    - Phone: `+91 93276 00839`.
    - Instagram: `@vipbeautysalonrajkot`.
    - Operating hours: Mon – Sun : 10:00 AM – 8:00 PM.
    - Embedded Google Maps with pin overlay badge.
    - Quick actions: `Call Now`, `WhatsApp`, `Get Directions`.

11. **Floating WhatsApp Button**
    - Persistent circular green WhatsApp button with pulsating glow effect and pre-filled message.

12. **Admin Dashboard**
    - Accessible after selecting Admin on `login.html` and signing in (Username: `@Vip_Beauty_Parlour`, Password: `Vip@2006`).
    - Add, update, and delete services, prices, and descriptions.
    - Preview, update, delete, or restore website and gallery images.
    - Content changes are stored in the browser's `localStorage` and appear on the public site in that same browser and origin.
    - `image-manifest.js` supplies the default service and image catalog when the site is opened directly from disk.
    - This static demo login is not production authentication; use a server-side authentication system before deploying admin access publicly.

13. **SEO & Performance**
    - LocalBusiness Schema (JSON-LD) with geographical coordinates for Rajkot.
    - Open Graph & Twitter Cards.
    - `sitemap.xml` and `robots.txt` included.

---

## 🛠️ How to Run
1. Open `index.html` directly in any modern browser (Chrome, Edge, Safari, Firefox).
2. To test admin edits across the public site, serve the folder locally (for example, `python -m http.server 8000`) and open `http://localhost:8000/`. Keep the admin dashboard and public site on the same origin so browser storage is shared.
3. Ready for instant deployment on Vercel, Netlify, or GitHub Pages. The current static demo stores edits only in each visitor's browser; persistent shared admin updates require a backend.
