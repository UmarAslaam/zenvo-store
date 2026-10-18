// Mock product data (no database needed)
const FALLBACK = "data:image/svg+xml;utf8," + encodeURIComponent("<svg xmlns='http://www.w3.org/2000/svg' width='800' height='600'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='#6C4DFF'/><stop offset='1' stop-color='#FF6B57'/></linearGradient></defs><rect width='800' height='600' fill='url(#g)'/><text x='400' y='330' font-size='64' text-anchor='middle' fill='white' font-family='Arial'>Zenvo</text></svg>");
const u = id => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=900&q=80`;

const CATEGORIES = [
  { name: "Audio", img: u("1505740420928-5e560c06d30e"), icon: "bi-headphones", text: "Headphones & speakers" },
  { name: "Wearables", img: u("1523275335684-37898b6baf30"), icon: "bi-smartwatch", text: "Watches, shades & sneakers" },
  { name: "Work & Travel", img: u("1496181133206-80ce9b88a853"), icon: "bi-briefcase", text: "Laptops, cameras & carry" }
];

const PRODUCTS = [
  { id: 1, name: "Aura ANC Headphones", category: "Audio", price: 129, old: 159, rating: 4.8, reviews: 2310, badge: "Best seller", img: u("1505740420928-5e560c06d30e"),
    short: "Wireless noise-cancelling headphones with 40-hour battery.",
    desc: "Block out the world with adaptive noise cancelling, then switch to transparency mode when you need to hear it. Soft memory-foam cushions keep long sessions comfortable.",
    details: ["40-hour battery life", "Adaptive noise cancelling", "Bluetooth 5.3, multipoint", "USB-C fast charge: 10 min = 5 hours"] },
  { id: 2, name: "Pulse S2 Smartwatch", category: "Wearables", price: 179, rating: 4.6, reviews: 980, badge: "New", img: u("1523275335684-37898b6baf30"),
    short: "Fitness tracking, calls and notifications on your wrist.",
    desc: "A bright AMOLED display, built-in GPS and sleep tracking in a slim aluminium case. Swap bands in seconds to match any outfit.",
    details: ["1.4\" AMOLED display", "GPS + heart-rate sensor", "5 ATM water resistance", "7-day battery life"] },
  { id: 3, name: "Stride Runner Sneakers", category: "Wearables", price: 89, old: 110, rating: 4.5, reviews: 640, img: u("1542291026-7eec264c27ff"),
    short: "Lightweight everyday runners with a cushioned sole.",
    desc: "Breathable mesh upper, responsive foam midsole and a grippy outsole make these the pair you reach for every morning.",
    details: ["Breathable mesh upper", "Responsive foam midsole", "Sizes 6 - 13", "Machine-washable laces"] },
  { id: 4, name: "Snap Instant Camera", category: "Work & Travel", price: 99, rating: 4.7, reviews: 520, badge: "Gift pick", img: u("1516035069371-29a1b244cc32"),
    short: "Retro-style camera that prints photos in seconds.",
    desc: "Point, shoot and hold a real photo moments later. Built-in flash and selfie mirror make it perfect for trips and parties.",
    details: ["Prints in under 90 seconds", "Auto flash + selfie mirror", "Uses standard instant film", "Includes wrist strap"] },
  { id: 5, name: "Nomad Daily Backpack", category: "Work & Travel", price: 69, rating: 4.7, reviews: 1120, img: u("1553062407-98eeb64c6a62"),
    short: "Water-resistant 24L pack with a padded laptop sleeve.",
    desc: "Smart pockets, a hidden passport slot and comfortable straps. Fits a 15-inch laptop, a jacket and your lunch with room to spare.",
    details: ["24L capacity", "Fits 15\" laptop", "Water-resistant fabric", "Hidden anti-theft pocket"] },
  { id: 6, name: "Solis Polarized Sunglasses", category: "Wearables", price: 59, old: 75, rating: 4.4, reviews: 410, img: u("1572635196237-14b3f281503f"),
    short: "UV400 polarized lenses in a lightweight frame.",
    desc: "Cut glare on the road or the beach. The flexible frame stays comfortable all day and comes with a hard case.",
    details: ["UV400 polarized lenses", "Flexible lightweight frame", "Hard case included", "Unisex fit"] },
  { id: 7, name: "Boom Mini Speaker", category: "Audio", price: 79, rating: 4.6, reviews: 1500, img: u("1608043152269-423dbba4e7e6"),
    short: "Pocket-size Bluetooth speaker with big, clear sound.",
    desc: "Deep bass and crisp highs from a speaker small enough for your bag. IP67 rating means rain, sand and splashes are no problem.",
    details: ["12-hour playtime", "IP67 waterproof", "Pairs two speakers for stereo", "Built-in microphone"] },
  { id: 8, name: "Slate Ultrabook 14", category: "Work & Travel", price: 899, old: 999, rating: 4.8, reviews: 305, badge: "Top rated", img: u("1496181133206-80ce9b88a853"),
    short: "Thin 14-inch laptop for work, study and travel.",
    desc: "A sharp 2.2K display, fast SSD storage and all-day battery in a 1.2 kg body. Built for people who work wherever they land.",
    details: ["14\" 2.2K display", "16 GB RAM / 512 GB SSD", "Up to 14 hours battery", "Weighs 1.2 kg"] },
  { id: 9, name: "Click Pro Keyboard", category: "Work & Travel", price: 119, rating: 4.7, reviews: 760, img: u("1587829741301-dc798b83add3"),
    short: "Compact mechanical keyboard with hot-swap switches.",
    desc: "Satisfying tactile switches, PBT keycaps and per-key RGB lighting. Connect by cable or Bluetooth and swap switches without soldering.",
    details: ["Hot-swappable switches", "PBT keycaps", "USB-C + Bluetooth", "Per-key RGB lighting"] }
];

const SLIDES = [
  { id: 1, tag: "New season", icon: "bi-stars", title: "Gear that keeps up with you.", text: "Headphones, watches, bags and laptops picked for everyday life. Fair prices and a 30-day return promise.", cta: ["Shop now", "shop.html"], cta2: ["Our story", "about.html"] },
  { id: 2, tag: "Just landed", icon: "bi-lightning-charge-fill", title: "Upgrade your wrist.", text: "The Pulse S2 tracks workouts, sleep and calls, with a battery that lasts a full week.", cta: ["View smartwatch", "product.html?id=2"], cta2: ["Shop Wearables", "shop.html?cat=Wearables"] },
  { id: 8, tag: "Autumn sale", icon: "bi-percent", title: "Work smart, travel light.", text: "The Slate Ultrabook 14 is now $899 instead of $999. Thin, fast and ready for anywhere.", cta: ["Shop Work & Travel", "shop.html?cat=Work%20%26%20Travel"], cta2: ["View laptop", "product.html?id=8"] }
];

const REVIEWS = [
  { name: "Ayesha Khan", city: "Karachi", product: "Aura ANC Headphones", rating: 5, color: "#6C4DFF", text: "The noise cancelling is unreal on my daily commute. Battery easily lasts the week and delivery took only two days." },
  { name: "Hamza Ali", city: "Lahore", product: "Pulse S2 Smartwatch", rating: 5, color: "#FF6B57", text: "Great screen, accurate tracking and the strap is comfortable. Setup took five minutes. Worth every rupee." },
  { name: "Sara Ahmed", city: "Islamabad", product: "Nomad Daily Backpack", rating: 4.5, color: "#1FCB9B", text: "Fits my laptop, lunch and a jacket with space left. The hidden pocket is a smart touch for travel." },
  { name: "Bilal Raza", city: "Karachi", product: "Slate Ultrabook 14", rating: 5, color: "#8E6CFF", text: "Light enough to carry all day and fast enough for my work. Support answered my question within an hour." },
  { name: "Fatima Noor", city: "Faisalabad", product: "Snap Instant Camera", rating: 4.5, color: "#FF9A5A", text: "Bought it as a gift and everyone loved it. The photos look lovely and the packaging was beautiful." },
  { name: "Usman Tariq", city: "Multan", product: "Click Pro Keyboard", rating: 5, color: "#14123A", text: "Typing feels amazing and the hot-swap switches are fun to experiment with. Build quality is excellent." }
];

/* ===== Easy settings: edit these ===== */
// Social links in the footer. Replace each url with your own page when you have one.
const SOCIAL = [
  { name: "Facebook", icon: "bi-facebook", url: "https://www.facebook.com/" },
  { name: "Instagram", icon: "bi-instagram", url: "https://www.instagram.com/" },
  { name: "YouTube", icon: "bi-youtube", url: "https://www.youtube.com/" },
  { name: "LinkedIn", icon: "bi-linkedin", url: "https://www.linkedin.com/" }
];
// Optional "Built by" credit in the footer. Leave builder empty to hide it.
const SITE = { builder: "", github: "", linkedin: "" };
// Optional: give any product its own 3 photos with  gallery: ["url1", "url2", "url3"]

// Contact details (used in the top bar, footer and contact page)
const CONTACT = { email: "umaraslaam2001@gmail.com", phone: "+92 331 2127072", whatsapp: "923312127072", address: "12 Market Street, Karachi, Pakistan" };
