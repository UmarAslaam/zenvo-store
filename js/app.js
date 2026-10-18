/* Zenvo store - plain JavaScript (no React). Uses PRODUCTS from data.js */
const $ = (s, r = document) => r.querySelector(s);
const money = n => '$' + n.toFixed(2);
const byId = id => PRODUCTS.find(p => p.id === +id);
const params = new URLSearchParams(location.search);
const KEY = 'zenvo_cart';
const FREE_SHIP = 100, SHIP_FEE = 8;

/* ---------- Cart (saved in localStorage) ---------- */
const Cart = {
  get() { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { return []; } },
  save(c) { localStorage.setItem(KEY, JSON.stringify(c)); updateBadge(); },
  add(id, q = 1) {
    const c = this.get(), item = c.find(x => x.id === id);
    item ? item.qty = Math.min(10, item.qty + q) : c.push({ id, qty: q });
    this.save(c);
  },
  setQty(id, q) {
    let c = this.get();
    if (q < 1) c = c.filter(x => x.id !== id); else c.find(x => x.id === id).qty = Math.min(10, q);
    this.save(c);
  },
  remove(id) { this.save(this.get().filter(x => x.id !== id)); },
  clear() { localStorage.removeItem('zenvo_coupon'); this.save([]); },
  count() { return this.get().reduce((s, x) => s + x.qty, 0); },
  subtotal() { return this.get().reduce((s, x) => s + byId(x.id).price * x.qty, 0); },
  shipping() { const s = this.subtotal(); return s === 0 || s >= FREE_SHIP ? 0 : SHIP_FEE; },
  coupon() { const c = localStorage.getItem('zenvo_coupon'); return COUPONS[c] ? c : null; },
  discount() { const c = this.coupon(); return c ? +(this.subtotal() * COUPONS[c] / 100).toFixed(2) : 0; },
  total() { return this.subtotal() - this.discount() + this.shipping(); }
};

/* ---------- Wishlist (saved in localStorage) ---------- */
const COUPONS = { ZENVO10: 10, WELCOME5: 5 };   // code -> percent off
const CART_LINK = '<a class="toast-link" href="cart.html">View cart</a>';
const Wish = {
  get() { try { return (JSON.parse(localStorage.getItem('zenvo_wish')) || []).filter(byId); } catch (e) { return []; } },
  has(id) { return this.get().includes(+id); },
  toggle(id) {
    id = +id; let w = this.get(); const on = !w.includes(id);
    w = on ? [...w, id] : w.filter(x => x !== id);
    localStorage.setItem('zenvo_wish', JSON.stringify(w)); return on;
  },
  count() { return this.get().length; }
};
function syncWish() {
  document.querySelectorAll('[data-wish]').forEach(b => {
    const on = Wish.has(b.dataset.wish); b.classList.toggle('on', on); b.setAttribute('aria-pressed', on);
    const i = b.querySelector('i'); if (i) i.className = 'bi ' + (on ? 'bi-heart-fill' : 'bi-heart');
  });
}

/* ---------- Small helpers ---------- */
const stars = r => {
  let h = '';
  for (let i = 1; i <= 5; i++) h += `<i class="bi ${r >= i ? 'bi-star-fill' : r >= i - .5 ? 'bi-star-half' : 'bi-star'}"></i>`;
  return h;
};
const imgTag = (p, cls = '') => `<img src="${p.img}" alt="${p.name}" class="${cls}" loading="lazy" onerror="this.onerror=null;this.src=FALLBACK">`;

const mailHref = () => `https://mail.google.com/mail/?view=cm&fs=1&to=${CONTACT.email}`;
const waHref = () => `https://wa.me/${CONTACT.whatsapp}`;
const mapHref = () => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(CONTACT.address)}`;
const ext = 'target="_blank" rel="noopener noreferrer"';

function credit() {
  if (!SITE.builder) return '';
  const ic = (u, n, i) => u ? ` <a href="${u}" target="_blank" rel="noopener noreferrer" aria-label="${n}"><i class="bi ${i}"></i></a>` : '';
  return ` | Built by <b>${SITE.builder}</b>${ic(SITE.github, 'GitHub', 'bi-github')}${ic(SITE.linkedin, 'LinkedIn', 'bi-linkedin')}`;
}

function logo(id) {
  return `<svg class="logo" viewBox="0 0 48 48" width="42" height="42" aria-hidden="true"><defs><linearGradient id="lg${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#6C4DFF"/><stop offset="1" stop-color="#FF6B57"/></linearGradient></defs><rect width="48" height="48" rx="14" fill="url(#lg${id})"/><path d="M14 15h20L14 33h20" fill="none" stroke="#fff" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="36" cy="12" r="3" fill="#fff"/></svg>`;
}

function toast(msg, icon = 'bi-check-circle-fill') {
  const el = document.createElement('div');
  el.className = 'toast align-items-center'; el.setAttribute('role', 'status');
  el.innerHTML = `<div class="d-flex"><div class="toast-body"><i class="bi ${icon} text-success me-2"></i>${msg}</div><button class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button></div>`;
  $('#toasts').appendChild(el);
  const t = new bootstrap.Toast(el, { delay: 2500 }); t.show();
  el.addEventListener('hidden.bs.toast', () => el.remove());
}

function updateBadge() {
  const c = $('#cartBadge'), w = $('#wishBadge');
  if (c) { c.textContent = Cart.count(); c.hidden = !Cart.count(); c.classList.remove('bump'); void c.offsetWidth; c.classList.add('bump'); }
  if (w) { w.textContent = Wish.count(); w.hidden = !Wish.count(); }
}

/* ---------- Reusable product card ---------- */
function productCard(p, col = 'col-sm-6 col-lg-4') {
  return `<div class="${col}"><article class="p-card"><button class="wish-btn ${Wish.has(p.id) ? 'on' : ''}" data-wish="${p.id}" aria-label="Save ${p.name} to wishlist" aria-pressed="${Wish.has(p.id)}"><i class="bi ${Wish.has(p.id) ? 'bi-heart-fill' : 'bi-heart'}"></i></button>
    <a class="p-img" href="product.html?id=${p.id}" aria-label="View ${p.name}">${imgTag(p)}${p.badge ? `<span class="p-badge">${p.badge}</span>` : ''}</a>
    <div class="p-body">
      <span class="p-cat">${p.category}</span>
      <a class="p-name h5" href="product.html?id=${p.id}">${p.name}</a>
      <div class="stars">${stars(p.rating)} <small>(${p.reviews.toLocaleString()})</small></div>
      <div class="price mt-1">${money(p.price)}${p.old ? `<s>${money(p.old)}</s>` : ''}</div>
      <div class="p-actions">
        <a href="product.html?id=${p.id}" class="btn btn-ghost"><i class="bi bi-eye"></i> Details</a>
        <button class="btn btn-zenvo" data-add="${p.id}"><i class="bi bi-bag-plus"></i> Add</button>
      </div></div></article></div>`;
}

/* ---------- Header & footer (shared by every page) ---------- */
function renderLayout() {
  const page = document.body.dataset.page;
  const link = (href, key, label, icon) => `<li class="nav-item"><a class="nav-link ${page === key ? 'active' : ''}" href="${href}"${page === key ? ' aria-current="page"' : ''}><i class="bi ${icon}"></i>${label}</a></li>`;
  $('#site-header').innerHTML = `<a class="skip-link" href="#main">Skip to content</a>
  <div class="topbar"><div class="container d-flex justify-content-center justify-content-md-between align-items-center gap-3">
    <span class="tb-item"><i class="bi bi-truck"></i>Free shipping on orders over <b>$${FREE_SHIP}</b></span>
    <div class="d-none d-md-flex align-items-center gap-4">
      <a class="tb-item" href="${waHref()}" ${ext}><i class="bi bi-whatsapp"></i>${CONTACT.phone}</a>
      <a class="tb-item" href="${mailHref()}" ${ext}><i class="bi bi-envelope"></i>${CONTACT.email}</a>
    </div></div></div>
  <nav class="zn-nav navbar navbar-expand-lg"><div class="container">
    <a class="brand" href="index.html" aria-label="Zenvo home">${logo('n')}<span class="brand-text">Zenvo<small>Smart gear store</small></span></a>
    <div class="offcanvas offcanvas-end" tabindex="-1" id="menu" aria-labelledby="menuLabel">
      <div class="offcanvas-header"><a class="brand" href="index.html" id="menuLabel">${logo('m')}<span class="brand-text">Zenvo<small>Smart gear store</small></span></a><button class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close menu"></button></div>
      <div class="offcanvas-body">
        <ul class="navbar-nav mx-lg-auto">
          ${link('index.html', 'home', 'Home', 'bi-house-door')}${link('shop.html', 'shop', 'Shop', 'bi-grid')}${link('about.html', 'about', 'About', 'bi-info-circle')}${link('contact.html', 'contact', 'Contact', 'bi-chat-dots')}
        </ul>
        <form class="nav-search" action="shop.html" role="search"><i class="bi bi-search"></i><input class="form-control" type="search" name="q" placeholder="Search products" aria-label="Search products"></form>
      </div></div>
    <div class="cart-area">
      <a class="cart-btn wish-link" href="wishlist.html" aria-label="Open wishlist"><i class="bi bi-heart"></i><span class="cart-badge" id="wishBadge"${Wish.count() ? '' : ' hidden'}>${Wish.count()}</span></a>
      <a class="cart-btn" href="cart.html" aria-label="Open cart"><i class="bi bi-bag"></i><span class="cart-badge" id="cartBadge"${Cart.count() ? '' : ' hidden'}>${Cart.count()}</span></a>
      <button class="navbar-toggler" data-bs-toggle="offcanvas" data-bs-target="#menu" aria-controls="menu" aria-label="Open menu"><i class="bi bi-list fs-4"></i></button>
    </div></div></nav>`;

  $('#site-footer').innerHTML = `
  <footer class="footer"><div class="container"><div class="row g-4">
    <div class="col-lg-4"><a class="brand brand-light mb-3" href="index.html">${logo('f')}<span class="brand-text">Zenvo<small>Smart gear store</small></span></a>
      <p>Smart gear for people on the move. Honest prices, fast delivery and support that actually replies.</p>
      <ul class="f-contact mb-3">
        <li><a href="${mailHref()}" ${ext}><i class="bi bi-envelope"></i>${CONTACT.email}</a></li>
        <li><a href="${waHref()}" ${ext}><i class="bi bi-whatsapp"></i>${CONTACT.phone}</a></li>
      </ul>
      <div class="social">${SOCIAL.map(s => `<a href="${s.url}" target="_blank" rel="noopener noreferrer" aria-label="${s.name}"><i class="bi ${s.icon}"></i></a>`).join('')}</div></div>
    <div class="col-6 col-lg-2"><h6>Explore</h6><ul><li><a href="index.html">Home</a></li><li><a href="shop.html">Shop</a></li><li><a href="about.html">About</a></li><li><a href="contact.html">Contact</a></li><li><a href="wishlist.html">Wishlist</a></li><li><a href="cart.html">Cart</a></li></ul></div>
    <div class="col-6 col-lg-2"><h6>Categories</h6><ul>${CATEGORIES.map(c => `<li><a href="shop.html?cat=${encodeURIComponent(c.name)}">${c.name}</a></li>`).join('')}</ul></div>
    <div class="col-lg-4"><h6>Get offers in your inbox</h6>
      <form class="input-group news" id="newsForm" novalidate><input type="email" class="form-control" placeholder="you@email.com" aria-label="Email address" required><button class="btn btn-zenvo" aria-label="Join newsletter"><i class="bi bi-send"></i> Join</button></form>
      <small class="d-block mt-2">No spam. Unsubscribe any time.</small></div>
  </div>
  <div class="footer-bottom d-flex flex-wrap justify-content-between gap-2"><span>&copy; ${new Date().getFullYear()} Zenvo. Demo store - no real payments.${credit()}</span><span><a href="contact.html">Support</a> &nbsp;|&nbsp; <a href="about.html">Privacy</a> &nbsp;|&nbsp; <a href="about.html">Terms</a></span></div></div></footer>
  <button class="to-top" id="toTop" aria-label="Back to top"><i class="bi bi-arrow-up"></i></button>`;

  $('#newsForm').addEventListener('submit', e => {
    e.preventDefault(); const i = e.target.querySelector('input');
    i.checkValidity() ? (toast('Thanks! You are on the list.'), e.target.reset()) : toast('Enter a valid email address.', 'bi-exclamation-circle-fill');
  });
  const top = $('#toTop');
  top.addEventListener('click', () => scrollTo({ top: 0, behavior: 'smooth' }));
  addEventListener('scroll', () => top.classList.toggle('show', scrollY > 500));
}

/* ---------- Page: Home ---------- */
function initHome() {
  // Hero carousel
  $('#slides').innerHTML = SLIDES.map((s, i) => { const p = byId(s.id); return `<div class="carousel-item ${i ? '' : 'active'}"><div class="row align-items-center g-4 g-lg-5">
    <div class="col-lg-6"><span class="hero-tag"><i class="bi ${s.icon}"></i>${s.tag}</span><h1>${s.title}</h1><p class="mt-3">${s.text}</p>
      <div class="d-flex flex-wrap gap-3 mt-4"><a class="btn btn-coral btn-lg" href="${s.cta[1]}">${s.cta[0]} <i class="bi bi-arrow-right"></i></a><a class="btn btn-ghost-light btn-lg" href="${s.cta2[1]}">${s.cta2[0]}</a></div></div>
    <div class="col-lg-6"><div class="hero-frame">${imgTag(p)}
      <div class="chip two"><i class="bi bi-star-fill" style="color:#FFB020"></i>${p.rating} (${p.reviews.toLocaleString()})</div>
      <div class="chip one"><i class="bi bi-tag-fill"></i>${p.name} - ${money(p.price)}</div></div></div></div></div>`; }).join('');
  $('#dots').innerHTML = SLIDES.map((s, i) => `<button type="button" data-bs-target="#heroCarousel" data-bs-slide-to="${i}" class="${i ? '' : 'active'}" ${i ? '' : 'aria-current="true"'} aria-label="Slide ${i + 1}"></button>`).join('');

  // Category cards with photos
  $('#cats').innerHTML = CATEGORIES.map(c => { const n = PRODUCTS.filter(p => p.category === c.name).length; return `<div class="col-md-4"><a class="cat-photo" href="shop.html?cat=${encodeURIComponent(c.name)}">
    <img src="${c.img}" alt="" loading="lazy" onerror="this.onerror=null;this.src=FALLBACK"><span class="cat-count">${n} products</span>
    <div class="cat-info"><div><h4>${c.name}</h4><p>${c.text}</p></div><span class="cat-arrow"><i class="bi bi-arrow-right"></i></span></div></a></div>`; }).join('');

  $('#featured').innerHTML = PRODUCTS.filter(p => p.badge).slice(0, 4).map(p => productCard(p, 'col-sm-6 col-lg-3')).join('');

  // Client reviews slider
  const track = $('#revTrack');
  track.innerHTML = REVIEWS.map(r => `<article class="rev-card"><div class="stars">${stars(r.rating)}</div><i class="bi bi-quote rev-quote"></i><p>${r.text}</p>
    <div class="d-flex align-items-center gap-3 mt-auto"><span class="avatar" style="background:${r.color}">${r.name.split(' ').map(w => w[0]).join('')}</span>
    <div><b>${r.name}</b><div class="small lead-muted">${r.city} | ${r.product}</div></div></div></article>`).join('');
  const go = d => {
    const max = track.scrollWidth - track.clientWidth, step = track.querySelector('.rev-card').offsetWidth + 16;
    if (d > 0 && track.scrollLeft >= max - 4) track.scrollTo({ left: 0, behavior: 'smooth' });
    else if (d < 0 && track.scrollLeft <= 4) track.scrollTo({ left: max, behavior: 'smooth' });
    else track.scrollBy({ left: d * step, behavior: 'smooth' });
  };
  $('#revPrev').onclick = () => go(-1); $('#revNext').onclick = () => go(1);
  let timer; const stop = () => clearInterval(timer);
  const play = () => { stop(); if (!matchMedia('(prefers-reduced-motion: reduce)').matches) timer = setInterval(() => go(1), 5000); };
  ['mouseenter', 'focusin', 'touchstart'].forEach(ev => track.addEventListener(ev, stop, { passive: true }));
  ['mouseleave', 'focusout', 'touchend'].forEach(ev => track.addEventListener(ev, play, { passive: true }));
  play();
}

/* ---------- Page: Shop (search, filter, sort) ---------- */
function initShop() {
  let cat = params.get('cat') || 'All', q = (params.get('q') || '').toLowerCase(), sort = 'featured';
  const search = $('#shopSearch'); search.value = params.get('q') || '';
  $('#pills').innerHTML = ['All', ...CATEGORIES.map(c => c.name)].map(c => `<button class="filter-pill" data-cat="${c}"><i class="bi ${c === 'All' ? 'bi-grid-fill' : CATEGORIES.find(x => x.name === c).icon}"></i>${c}</button>`).join('');
  const draw = () => {
    document.querySelectorAll('.filter-pill').forEach(b => b.classList.toggle('active', b.dataset.cat === cat));
    let list = PRODUCTS.filter(p => (cat === 'All' || p.category === cat) && (p.name + p.short + p.category).toLowerCase().includes(q));
    if (sort === 'low') list.sort((a, b) => a.price - b.price);
    if (sort === 'high') list.sort((a, b) => b.price - a.price);
    if (sort === 'rating') list.sort((a, b) => b.rating - a.rating);
    $('#count').textContent = `${list.length} product${list.length === 1 ? '' : 's'}`;
    $('#grid').innerHTML = list.length ? list.map(p => productCard(p)).join('')
      : `<div class="empty"><i class="bi bi-search"></i><h3 class="mt-3">No products found</h3><p class="lead-muted">Try a different word or clear the filters.</p><button class="btn btn-zenvo" id="clear"><i class="bi bi-arrow-counterclockwise"></i> Clear filters</button></div>`;
  };
  $('#pills').addEventListener('click', e => { const b = e.target.closest('[data-cat]'); if (b) { cat = b.dataset.cat; draw(); } });
  search.addEventListener('input', () => { q = search.value.toLowerCase(); draw(); });
  $('#sort').addEventListener('change', e => { sort = e.target.value; draw(); });
  document.addEventListener('click', e => { if (e.target.closest('#clear')) { cat = 'All'; q = ''; search.value = ''; draw(); } });
  draw();
}

/* ---------- Page: Product details ---------- */
function initProduct() {
  const p = byId(params.get('id')); const box = $('#product');
  if (!p) { box.innerHTML = `<div class="empty"><i class="bi bi-emoji-frown"></i><h3 class="mt-3">Product not found</h3><a class="btn btn-zenvo mt-2" href="shop.html">Back to shop</a></div>`; return; }
  document.title = p.name + ' | Zenvo'; $('#crumbName').textContent = p.name;
  let qty = 1;
  // 3 views: own gallery photos if given, otherwise full photo + two close-up crops
  const views = p.gallery ? p.gallery.map(src => ({ src, s: 1, o: '50% 50%' }))
    : [{ s: 1, o: '50% 50%' }, { s: 1.8, o: '25% 30%' }, { s: 1.8, o: '78% 72%' }].map(v => ({ ...v, src: p.img }));
  const fb = 'onerror="this.onerror=null;this.src=FALLBACK"';
  box.innerHTML = `<div class="row g-4 g-lg-5 align-items-center">
    <div class="col-lg-6"><div class="gallery">
      <div class="gal-main"><img id="galImg" src="${views[0].src}" alt="${p.name}" ${fb}></div>
      <div class="gal-thumbs">${views.map((v, i) => `<button type="button" class="gal-thumb ${i ? '' : 'active'}" data-i="${i}" aria-label="Show photo ${i + 1} of ${views.length}"><img src="${v.src}" alt="" style="transform:scale(${v.s});transform-origin:${v.o}" ${fb}></button>`).join('')}</div></div></div>
    <div class="col-lg-6"><span class="p-cat">${p.category}</span><h1 class="h2 mt-1">${p.name}</h1>
      <div class="stars mb-2">${stars(p.rating)} <small>${p.rating} (${p.reviews.toLocaleString()} reviews)</small></div>
      <div class="price fs-2 mb-3">${money(p.price)}${p.old ? `<s>${money(p.old)}</s>` : ''}</div>
      <p class="lead-muted">${p.desc}</p>
      <ul class="spec">${p.details.map(d => `<li><i class="bi bi-check-circle-fill"></i>${d}</li>`).join('')}</ul>
      <div class="d-flex flex-wrap align-items-center gap-3 mt-3">
        <div class="qty" aria-label="Quantity"><button id="minus" aria-label="Decrease quantity"><i class="bi bi-dash-lg"></i></button><span id="q">1</span><button id="plus" aria-label="Increase quantity"><i class="bi bi-plus-lg"></i></button></div>
        <button class="btn btn-zenvo btn-lg" id="addBtn"><i class="bi bi-bag-plus"></i> Add to cart</button>
        <button class="btn btn-ghost btn-lg ${Wish.has(p.id) ? 'on' : ''}" data-wish="${p.id}" aria-pressed="${Wish.has(p.id)}"><i class="bi ${Wish.has(p.id) ? 'bi-heart-fill' : 'bi-heart'}"></i> Wishlist</button></div>
      <div class="trust"><div><i class="bi bi-truck"></i><span>Free shipping<br><small>over $${FREE_SHIP}</small></span></div><div><i class="bi bi-arrow-repeat"></i><span>30-day returns<br><small>no questions asked</small></span></div><div><i class="bi bi-shield-check"></i><span>1-year warranty<br><small>on every item</small></span></div></div></div></div>`;
  box.querySelectorAll('.gal-thumb').forEach(b => b.onclick = () => {
    const v = views[+b.dataset.i], m = $('#galImg');
    m.src = v.src; m.style.transform = `scale(${v.s})`; m.style.transformOrigin = v.o;
    box.querySelectorAll('.gal-thumb').forEach(x => x.classList.toggle('active', x === b));
  });
  const show = () => $('#q').textContent = qty;
  $('#minus').onclick = () => { qty = Math.max(1, qty - 1); show(); };
  $('#plus').onclick = () => { qty = Math.min(10, qty + 1); show(); };
  $('#addBtn').onclick = () => { Cart.add(p.id, qty); toast(`${qty} x ${p.name} added to cart ${CART_LINK}`); };
  $('#related').innerHTML = PRODUCTS.filter(x => x.category === p.category && x.id !== p.id).slice(0, 3).concat(PRODUCTS.filter(x => x.category !== p.category)).slice(0, 4).map(x => productCard(x, 'col-sm-6 col-lg-3')).join('');
}

/* ---------- Page: Cart ---------- */
function initCart() {
  const draw = () => {
    const items = Cart.get(), box = $('#cartBox');
    if (!items.length) { box.innerHTML = `<div class="empty"><i class="bi bi-bag-heart"></i><h3 class="mt-4">Your cart is empty</h3><p class="lead-muted mb-4">Looks like you have not added anything yet. Let us find something you will love.</p><a class="btn btn-zenvo btn-lg" href="shop.html"><i class="bi bi-shop"></i> Start shopping</a></div><h4 class="h-icon mt-5 mb-3"><i class="bi bi-fire"></i>Popular right now</h4><div class="row g-4">${PRODUCTS.filter(p => p.badge).slice(0, 4).map(p => productCard(p, 'col-sm-6 col-lg-3')).join('')}</div>`; return; }
    const need = Math.max(0, FREE_SHIP - Cart.subtotal());
    box.innerHTML = `<div class="row g-4"><div class="col-lg-8"><div class="panel">
      ${items.map(i => { const p = byId(i.id); return `<div class="cart-row">${imgTag(p)}
        <div class="flex-grow-1"><a class="fw-bold text-decoration-none text-dark" href="product.html?id=${p.id}">${p.name}</a><div class="lead-muted small">${money(p.price)} each</div>
          <button class="remove-btn small p-0 mt-1" data-remove="${p.id}"><i class="bi bi-trash3"></i> Remove</button></div>
        <div class="qty"><button data-dec="${p.id}" aria-label="Decrease quantity"><i class="bi bi-dash-lg"></i></button><span>${i.qty}</span><button data-inc="${p.id}" aria-label="Increase quantity"><i class="bi bi-plus-lg"></i></button></div>
        <div class="fw-bold text-end" style="min-width:80px">${money(p.price * i.qty)}</div></div>`; }).join('')}
      <div class="d-flex flex-wrap gap-2 justify-content-between mt-3"><a class="btn btn-ghost btn-sm" href="shop.html"><i class="bi bi-arrow-left"></i> Keep shopping</a><button class="btn btn-ghost btn-sm" id="clearCart"><i class="bi bi-x-circle"></i> Clear cart</button></div></div></div>
    <div class="col-lg-4"><div class="panel"><h4 class="mb-3 h-icon"><i class="bi bi-receipt"></i>Order summary</h4>
      <form id="couponForm" class="d-flex gap-2 mb-2" novalidate><input class="form-control" id="couponIn" placeholder="Promo code (try ZENVO10)" aria-label="Promo code"><button class="btn btn-ghost" type="submit">Apply</button></form>
      ${Cart.coupon() ? `<div class="coupon-ok mb-3"><span><i class="bi bi-ticket-perforated-fill"></i> ${Cart.coupon()} applied</span><button type="button" class="remove-btn" data-nocoupon>Remove</button></div>` : '<div class="mb-3"></div>'}
      <div class="d-flex justify-content-between mb-2"><span>Subtotal</span><b>${money(Cart.subtotal())}</b></div>
      ${Cart.discount() ? `<div class="d-flex justify-content-between mb-2 text-success"><span>Discount (${COUPONS[Cart.coupon()]}%)</span><b>-${money(Cart.discount())}</b></div>` : ''}
      <div class="d-flex justify-content-between mb-2"><span>Shipping</span><b>${Cart.shipping() ? money(Cart.shipping()) : 'Free'}</b></div><hr>
      <div class="d-flex justify-content-between fs-5 mb-3"><b>Total</b><b>${money(Cart.total())}</b></div>
      ${need ? `<p class="small lead-muted"><i class="bi bi-truck"></i> Add ${money(need)} more for free shipping.</p>` : `<p class="small text-success"><i class="bi bi-check-circle-fill"></i> You get free shipping!</p>`}
      <a class="btn btn-zenvo btn-lg w-100" href="checkout.html"><i class="bi bi-lock"></i> Secure checkout</a></div></div></div>`;
  };
  $('#cartBox').addEventListener('submit', e => {
    if (e.target.id !== 'couponForm') return; e.preventDefault();
    const code = $('#couponIn').value.trim().toUpperCase();
    if (COUPONS[code]) { localStorage.setItem('zenvo_coupon', code); toast(`Promo ${code} applied: ${COUPONS[code]}% off`, 'bi-ticket-perforated-fill'); }
    else toast('That promo code is not valid.', 'bi-exclamation-circle-fill');
    draw();
  });
  $('#cartBox').addEventListener('click', e => {
    const t = e.target.closest('button'); if (!t) return;
    const d = t.dataset, cur = id => Cart.get().find(x => x.id === +id).qty;
    if (d.inc) Cart.setQty(+d.inc, cur(d.inc) + 1);
    else if (d.dec) Cart.setQty(+d.dec, cur(d.dec) - 1);
    else if (d.remove) { Cart.remove(+d.remove); toast('Item removed', 'bi-trash3-fill'); }
    else if ('nocoupon' in d) localStorage.removeItem('zenvo_coupon');
    else if (t.id === 'clearCart') Cart.clear();
    else return;
    draw();
  });
  draw();
}

/* ---------- Page: Checkout (demo only - no real payment) ---------- */
function initCheckout() {
  const items = Cart.get(), box = $('#checkoutBox');
  if (!items.length) { box.innerHTML = `<div class="empty"><i class="bi bi-bag-x"></i><h3 class="mt-3">Nothing to check out</h3><a class="btn btn-zenvo mt-3" href="shop.html"><i class="bi bi-shop"></i> Browse products</a></div>`; return; }
  $('#summary').innerHTML = items.map(i => { const p = byId(i.id); return `<div class="d-flex justify-content-between small mb-2"><span>${p.name} x ${i.qty}</span><b>${money(p.price * i.qty)}</b></div>`; }).join('') +
    `<hr><div class="d-flex justify-content-between mb-1"><span>Subtotal</span><b>${money(Cart.subtotal())}</b></div>${Cart.discount() ? `<div class="d-flex justify-content-between mb-1 text-success"><span>Discount (${Cart.coupon()})</span><b>-${money(Cart.discount())}</b></div>` : ''}<div class="d-flex justify-content-between mb-1"><span>Shipping</span><b>${Cart.shipping() ? money(Cart.shipping()) : 'Free'}</b></div><div class="d-flex justify-content-between fs-5 mt-2"><b>Total</b><b>${money(Cart.total())}</b></div>`;
  $('#checkoutForm').addEventListener('submit', e => {
    e.preventDefault(); const f = e.target; f.classList.add('was-validated');
    if (!f.checkValidity()) { toast('Please fix the highlighted fields.', 'bi-exclamation-circle-fill'); return; }
    const id = 'ZNV-' + Math.floor(100000 + Math.random() * 900000), total = money(Cart.total()), name = $('#fname').value.split(' ')[0];
    const rows = items.map(i => { const p = byId(i.id); return `<div class="d-flex justify-content-between small mb-1"><span>${p.name} x ${i.qty}</span><b>${money(p.price * i.qty)}</b></div>`; }).join('');
    Cart.clear();
    document.querySelectorAll('#steps li').forEach(li => { li.className = 'done'; const ic = li.querySelector('i'); ic.className = 'bi bi-check-lg'; ic.textContent = ''; });
    box.innerHTML = `<div class="empty"><div class="success-ring"><i class="bi bi-check-lg"></i></div><h2>Thank you, ${name}!</h2>
      <p class="lead-muted">Your demo order <b>${id}</b> has been placed. No payment was taken.</p>
      <div class="panel text-start mx-auto my-4" style="max-width:420px"><h5 class="h-icon mb-3"><i class="bi bi-receipt"></i>Order ${id}</h5>${rows}<hr><div class="d-flex justify-content-between"><b>Total (demo)</b><b>${total}</b></div></div>
      <a class="btn btn-zenvo btn-lg" href="shop.html"><i class="bi bi-shop"></i> Continue shopping</a></div>`;
    scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ---------- Page: Wishlist ---------- */
function initWishlist() {
  const ids = Wish.get(), box = $('#wishBox');
  if (!ids.length) { box.innerHTML = `<div class="empty"><i class="bi bi-heart"></i><h3 class="mt-4">Your wishlist is empty</h3><p class="lead-muted mb-4">Tap the heart on any product to save it here for later.</p><a class="btn btn-zenvo btn-lg" href="shop.html"><i class="bi bi-shop"></i> Explore products</a></div>`; return; }
  box.innerHTML = `<div class="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4"><p class="lead-muted mb-0">${ids.length} saved item${ids.length === 1 ? '' : 's'}</p><button class="btn btn-zenvo" data-addall><i class="bi bi-bag-plus"></i> Add all to cart</button></div><div class="row g-4">${ids.map(id => productCard(byId(id), 'col-sm-6 col-lg-3')).join('')}</div>`;
}

/* ---------- Page: Contact ---------- */
function initContact() {
  const set = { map: [mapHref(), CONTACT.address], email: [mailHref(), CONTACT.email], phone: [waHref(), CONTACT.phone] };
  document.querySelectorAll('[data-contact]').forEach(a => { const v = set[a.dataset.contact]; a.href = v[0]; a.textContent = v[1]; });
  $('#contactForm').addEventListener('submit', e => {
    e.preventDefault(); const f = e.target; f.classList.add('was-validated');
    if (!f.checkValidity()) return;
    $('#sent').classList.remove('d-none'); f.reset(); f.classList.remove('was-validated');
  });
}

/* ---------- Scroll reveal animation ---------- */
function reveal() {
  if (!('IntersectionObserver' in window)) return;
  const io = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } }), { threshold: .1 });
  document.querySelectorAll('.section-title, .p-card, .cat-photo, .feature, .promo, .rev-track, .panel').forEach(el => {
    const col = el.closest('[class*="col"]') || el, idx = [...col.parentElement.children].indexOf(col);
    el.style.setProperty('--d', Math.min(idx, 5) * 80 + 'ms'); el.classList.add('reveal'); io.observe(el);
  });
}

/* ---------- Start ---------- */
document.addEventListener('DOMContentLoaded', () => {
  renderLayout();
  document.addEventListener('click', e => {
    const w = e.target.closest('[data-wish]');
    if (w) {
      const on = Wish.toggle(w.dataset.wish); syncWish(); updateBadge();
      toast(on ? 'Saved to your wishlist' : 'Removed from wishlist', on ? 'bi-heart-fill' : 'bi-heart');
      if (document.body.dataset.page === 'wishlist') initWishlist();
      return;
    }
    if (e.target.closest('[data-addall]')) { Wish.get().forEach(id => Cart.add(id)); toast(`All saved items added to cart ${CART_LINK}`); return; }
    const b = e.target.closest('[data-add]'); if (!b) return;
    const p = byId(b.dataset.add); Cart.add(p.id); toast(`${p.name} added to cart ${CART_LINK}`);
  });
  const init = { home: initHome, shop: initShop, product: initProduct, cart: initCart, checkout: initCheckout, contact: initContact, wishlist: initWishlist }[document.body.dataset.page];
  if (init) init();
  reveal();
});
