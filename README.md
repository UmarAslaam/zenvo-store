# Zenvo - E-Commerce Website

**MTech Solutions - Frontend Development Internship, Batch 01, Task 02**

Zenvo is a frontend-only online store for smart everyday gear (headphones, watches, bags, laptops). Visitors can browse products, view details, save favourites, manage a cart, apply a promo code and complete a simulated checkout. It is a demo project: there is no backend, database or real payment.

- Live website: https://zenvoonlinestore.netlify.app
- GitHub repository: _add your repository link here_

## Pages
| Page | File |
|------|------|
| Home (hero carousel, categories, featured products, reviews) | `index.html` |
| Shop (search, category filters, sorting) | `shop.html` |
| Product details (3-photo gallery, quantity, add to cart) | `product.html?id=1` |
| About | `about.html` |
| Contact (validated form, FAQ) | `contact.html` |
| Cart | `cart.html` |
| Checkout | `checkout.html` |
| Wishlist | `wishlist.html` |
| 404 page | `404.html` |

## Features
- 9 products with images, prices, descriptions and details
- Search, category filters and sorting
- Product gallery with 3 clickable thumbnails
- Add to cart, quantity controls, remove item, subtotal, shipping and total
- Promo codes in the cart: `ZENVO10` (10% off), `WELCOME5` (5% off)
- Wishlist with heart buttons and a count in the navbar
- Cart, wishlist and promo code saved in `localStorage` (they survive a refresh)
- Checkout and contact forms with validation and success messages
- Checkout progress steps and an order receipt
- Empty states for cart, wishlist, checkout and search
- Hero carousel and customer reviews slider
- Scroll animations, hover and focus states
- Fully responsive (checked at 360px, 768px and 1280px, no sideways scrolling) with a slide-in mobile menu
- Clickable contact details: email opens Gmail, phone opens WhatsApp, address opens Google Maps
- Skip-to-content link, labelled buttons and visible focus states for accessibility

## Technologies
HTML5, CSS3, JavaScript (ES6, no framework), Bootstrap 5.3, Bootstrap Icons, Google Fonts (Sora, DM Sans). Product photos come from Unsplash.

## Project structure
```
index.html  shop.html  product.html  about.html  contact.html
cart.html   checkout.html  wishlist.html  404.html  favicon.svg
css/style.css     theme, buttons, navbar, footer, components
js/data.js        mock product data, reviews, carousel slides, settings
js/app.js         cart and wishlist logic, shared header/footer, page scripts
```

## Run locally
Open `index.html` in a browser, or use the VS Code **Live Server** extension. An internet connection is needed for Bootstrap, fonts and product photos.

## Deploy
1. Push the project to a GitHub repository.
2. In Vercel or Netlify choose **Add new site / project** and import the repository.
3. No build command is needed. Leave the publish directory as the project root.

## Customise
All settings are in `js/data.js`:
- `PRODUCTS` - edit names, prices, descriptions and images. Add `gallery: ["url1", "url2", "url3"]` to a product to show your own 3 photos.
- `CONTACT` - your email, phone/WhatsApp number and address. They appear in the top bar, footer and contact page (the contact page also has the same details written in `contact.html`, so update both).
- `SOCIAL` - replace the footer social media links with your own pages.
- `SITE` - set `builder`, `github` and `linkedin` to show a "Built by" credit in the footer.
- `COUPONS` (in `js/app.js`) - change or add promo codes.

## Notes
- Checkout is a demo UI. No real payment details are collected.
- Customer reviews, contact details and the store itself are sample content.
