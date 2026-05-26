<!DOCTYPE html>
<html lang="sl">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Ujete Bedarije — Photo Booth za vaše dogodke</title>
<meta name="description" content="Photo Booth Ujete Bedarije. Neomejen tisk, rekviziti, album, prihod gratis. Poroke, zabave, firmni dogodki po vsej Sloveniji. Od 250€." />

<meta property="og:title" content="Ujete Bedarije — Photo Booth" />
<meta property="og:description" content="Photo booth za nepozabne večere. Neomejen tisk, rekviziti, album. Od 250€." />
<meta property="og:type" content="website" />

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">

<style>
:root {
  --bg: #faf8f5;
  --surface: #ffffff;
  --ink: #1a1d24;
  --ink-soft: #4a4f5c;
  --muted: #8a8f99;
  --line: #e8e6e1;
  --accent: #c9a96e;
  --accent-dark: #a8895a;
  --rose: #d4a5a5;
  --sage: #a8b5a0;
  --shadow-sm: 0 2px 12px rgba(26, 29, 36, 0.06);
  --shadow-md: 0 8px 32px rgba(26, 29, 36, 0.08);
  --shadow-lg: 0 16px 48px rgba(26, 29, 36, 0.12);
  --radius: 16px;
  --radius-sm: 10px;
}

* { margin: 0; padding: 0; box-sizing: border-box; }
html { scroll-behavior: smooth; }
body {
  font-family: 'Poppins', sans-serif;
  background: var(--bg);
  color: var(--ink);
  font-weight: 400;
  line-height: 1.6;
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
}
a { color: inherit; text-decoration: none; }
img { max-width: 100%; display: block; }

/* NAV */
nav {
  position: fixed; top: 0; left: 0; right: 0; z-index: 100;
  padding: 20px 40px;
  display: flex; justify-content: space-between; align-items: center;
  background: rgba(250, 248, 245, 0.85);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid transparent;
  transition: border-color 0.3s;
}
nav.scrolled { border-bottom-color: var(--line); }
nav .logo img { height: 64px; width: auto; }
nav ul { display: flex; gap: 36px; list-style: none; }
nav ul a { font-size: 14px; font-weight: 500; color: var(--ink-soft); transition: color 0.2s; }
nav ul a:hover { color: var(--ink); }
nav .cta {
  background: var(--ink); color: var(--bg);
  padding: 11px 22px; border-radius: 999px;
  font-weight: 500; font-size: 14px; transition: all 0.2s;
}
nav .cta:hover { background: var(--accent-dark); transform: translateY(-1px); }
@media (max-width: 760px) {
  nav { padding: 16px 20px; }
  nav ul { display: none; }
  nav .logo img { height: 52px; }
}

/* HERO */
.hero {
  min-height: 100vh;
  padding: 140px 40px 100px;
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 80px; align-items: center;
  max-width: 1320px; margin: 0 auto; position: relative;
}
.hero::before {
  content: ''; position: absolute; top: 20%; right: -10%;
  width: 500px; height: 500px;
  background: radial-gradient(circle, var(--rose) 0%, transparent 65%);
  opacity: 0.25; filter: blur(60px); z-index: -1;
}
.hero::after {
  content: ''; position: absolute; bottom: 10%; left: -10%;
  width: 400px; height: 400px;
  background: radial-gradient(circle, var(--accent) 0%, transparent 65%);
  opacity: 0.2; filter: blur(60px); z-index: -1;
}
.hero-content .eyebrow {
  display: inline-flex; align-items: center; gap: 8px;
  font-size: 13px; font-weight: 500; color: var(--accent-dark);
  letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 24px;
}
.hero-content .eyebrow::before {
  content: ''; width: 28px; height: 1px; background: var(--accent-dark);
}
.hero-content h1 {
  font-size: clamp(44px, 6vw, 84px);
  font-weight: 700; line-height: 1.05;
  letter-spacing: -0.03em; margin-bottom: 28px;
}
.hero-content h1 .italic {
  font-weight: 400; color: var(--accent-dark);
}
.hero-content .lede {
  font-size: 18px; color: var(--ink-soft);
  margin-bottom: 40px; max-width: 520px;
}
.hero-content .ctas {
  display: flex; gap: 14px; flex-wrap: wrap; margin-bottom: 48px;
}

.btn {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 16px 32px; border-radius: 999px;
  font-weight: 500; font-size: 15px;
  font-family: inherit; transition: all 0.2s; cursor: pointer; border: none;
}
.btn-primary { background: var(--ink); color: var(--bg); }
.btn-primary:hover { background: var(--accent-dark); transform: translateY(-2px); box-shadow: var(--shadow-md); }
.btn-ghost { background: transparent; color: var(--ink); border: 1px solid var(--line); }
.btn-ghost:hover { border-color: var(--ink); transform: translateY(-2px); }

.hero-stats {
  display: flex; gap: 40px;
  padding-top: 32px; border-top: 1px solid var(--line);
}
.stat .num {
  font-size: 32px; font-weight: 700;
  letter-spacing: -0.02em; line-height: 1;
}
.stat .lbl { font-size: 13px; color: var(--muted); margin-top: 4px; }

.hero-collage { position: relative; height: 560px; }
.hero-collage .img-frame {
  position: absolute; border-radius: var(--radius);
  overflow: hidden; box-shadow: var(--shadow-lg);
  background: var(--surface);
}
.hero-collage .img-frame img { width: 100%; height: 100%; object-fit: cover; }
.hero-collage .img-1 { top: 0; left: 0; width: 60%; height: 65%; transform: rotate(-3deg); z-index: 2; }
.hero-collage .img-2 { top: 8%; right: 0; width: 50%; height: 55%; transform: rotate(4deg); z-index: 1; }
.hero-collage .img-3 { bottom: 0; left: 18%; width: 55%; height: 50%; transform: rotate(2deg); z-index: 3; }
.hero-collage .floating-badge {
  position: absolute; bottom: 12%; right: 4%;
  background: var(--surface); padding: 16px 22px;
  border-radius: 999px; box-shadow: var(--shadow-lg);
  display: flex; align-items: center; gap: 10px; z-index: 4;
  font-size: 14px; font-weight: 600;
  animation: subtle-float 4s ease-in-out infinite;
}
.hero-collage .floating-badge .dot {
  width: 8px; height: 8px; border-radius: 50%;
  background: var(--sage);
  box-shadow: 0 0 0 4px rgba(168, 181, 160, 0.25);
}
@keyframes subtle-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}
@media (max-width: 960px) {
  .hero { grid-template-columns: 1fr; padding: 120px 24px 60px; gap: 60px; }
  .hero-collage { height: 440px; }
  .hero-stats { gap: 24px; flex-wrap: wrap; }
}

/* SECTIONS */
section { padding: 120px 40px; position: relative; }
.container { max-width: 1240px; margin: 0 auto; }
.section-head {
  text-align: center; margin-bottom: 80px;
  max-width: 680px; margin-left: auto; margin-right: auto;
}
.section-head .eyebrow {
  font-size: 13px; font-weight: 500; color: var(--accent-dark);
  letter-spacing: 0.12em; text-transform: uppercase;
  margin-bottom: 16px; display: block;
}
.section-head h2 {
  font-size: clamp(32px, 4.5vw, 52px);
  font-weight: 700; letter-spacing: -0.025em;
  line-height: 1.1; margin-bottom: 16px;
}
.section-head h2 .italic {
  font-weight: 400; color: var(--accent-dark);
}
.section-head p { font-size: 17px; color: var(--ink-soft); }

/* PRICING */
#paketi { background: var(--surface); }
.pricing {
  display: grid; grid-template-columns: 1fr 1fr;
  gap: 28px; max-width: 980px; margin: 0 auto;
}
.price-card {
  background: var(--bg); border: 1px solid var(--line);
  border-radius: var(--radius); padding: 44px 40px;
  position: relative; transition: all 0.3s ease;
}
.price-card:hover {
  transform: translateY(-6px); box-shadow: var(--shadow-lg);
  border-color: transparent;
}
.price-card.featured {
  background: var(--ink); color: var(--bg); border-color: var(--ink);
}
.price-card.featured .price-note,
.price-card.featured .features-list li { color: rgba(250, 248, 245, 0.7); }
.price-card.featured .features-list li svg { color: var(--accent); }
.price-card .ribbon {
  position: absolute; top: 20px; right: 20px;
  background: var(--accent); color: var(--ink);
  padding: 6px 14px; border-radius: 999px;
  font-weight: 600; font-size: 11px;
  text-transform: uppercase; letter-spacing: 0.08em;
}
.price-card h3 { font-size: 22px; font-weight: 600; margin-bottom: 6px; letter-spacing: -0.01em; }
.price-card .duration { font-size: 14px; color: var(--muted); margin-bottom: 28px; }
.price-card.featured .duration { color: rgba(250, 248, 245, 0.6); }
.price-card .price { display: flex; align-items: baseline; gap: 8px; margin-bottom: 6px; }
.price-card .price .amount { font-size: 60px; font-weight: 700; letter-spacing: -0.03em; line-height: 1; }
.price-card .price .currency { font-size: 24px; font-weight: 500; color: var(--ink-soft); }
.price-card.featured .price .currency { color: rgba(250, 248, 245, 0.7); }
.price-card .price-note { font-size: 13px; color: var(--muted); margin-bottom: 32px; }
.features-list { list-style: none; margin-bottom: 36px; }
.features-list li {
  display: flex; align-items: flex-start; gap: 12px;
  padding: 10px 0; font-size: 14.5px; color: var(--ink-soft);
}
.features-list li svg { flex-shrink: 0; margin-top: 3px; color: var(--accent-dark); }
.price-card .btn { width: 100%; justify-content: center; }
.price-card.featured .btn-primary { background: var(--bg); color: var(--ink); }
.price-card.featured .btn-primary:hover { background: var(--accent); }
@media (max-width: 760px) {
  .pricing { grid-template-columns: 1fr; }
  .price-card { padding: 36px 28px; }
  .price-card .price .amount { font-size: 50px; }
}

/* BONUS CARD */
.bonus-card {
  margin: 48px auto 0; max-width: 720px;
  background: linear-gradient(135deg, rgba(201, 169, 110, 0.12), rgba(212, 165, 165, 0.12));
  border: 1px solid var(--line); border-radius: var(--radius);
  padding: 28px 36px; display: flex; align-items: center; gap: 24px;
}
.bonus-card .icon-wrap {
  width: 56px; height: 56px;
  background: var(--surface); border-radius: 14px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0; box-shadow: var(--shadow-sm); color: var(--accent-dark);
}
.bonus-card h4 { font-size: 17px; font-weight: 600; margin-bottom: 4px; }
.bonus-card p { font-size: 14px; color: var(--ink-soft); }
@media (max-width: 600px) {
  .bonus-card { flex-direction: column; text-align: center; padding: 28px; }
}

/* FEATURES */
.features-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
.feature {
  background: var(--surface); border: 1px solid var(--line);
  border-radius: var(--radius); padding: 36px 32px;
  transition: all 0.3s ease;
}
.feature:hover { transform: translateY(-4px); box-shadow: var(--shadow-md); border-color: transparent; }
.feature .feat-icon {
  width: 52px; height: 52px;
  background: var(--bg); border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  color: var(--accent-dark); margin-bottom: 22px;
}
.feature h4 { font-size: 18px; font-weight: 600; margin-bottom: 8px; letter-spacing: -0.01em; }
.feature p { font-size: 14.5px; color: var(--ink-soft); }
@media (max-width: 900px) { .features-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 560px) { .features-grid { grid-template-columns: 1fr; } }

/* GALLERY */
#galerija { background: var(--surface); }
.gallery-grid {
  display: grid; grid-template-columns: repeat(4, 1fr);
  grid-auto-rows: 220px; gap: 16px;
  max-width: 1240px; margin: 0 auto;
}
.gallery-item {
  border-radius: var(--radius-sm); overflow: hidden;
  position: relative; background: var(--bg);
  transition: transform 0.4s ease;
}
.gallery-item img {
  width: 100%; height: 100%; object-fit: cover;
  transition: transform 0.6s ease;
}
.gallery-item:hover img { transform: scale(1.05); }
.gallery-item.tall { grid-row: span 2; }
@media (max-width: 900px) {
  .gallery-grid { grid-template-columns: repeat(2, 1fr); grid-auto-rows: 180px; }
}

/* EVENTS */
.events-grid {
  display: grid; grid-template-columns: repeat(4, 1fr);
  gap: 20px; max-width: 1100px; margin: 0 auto;
}
.event-card {
  background: var(--surface); border: 1px solid var(--line);
  border-radius: var(--radius); padding: 36px 24px;
  text-align: center; transition: all 0.3s ease;
}
.event-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-md); border-color: transparent; }
.event-card .ev-icon {
  width: 56px; height: 56px;
  background: var(--bg); border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  margin: 0 auto 18px; color: var(--accent-dark);
}
.event-card h4 { font-size: 16px; font-weight: 600; margin-bottom: 4px; }
.event-card p { font-size: 13px; color: var(--muted); }
@media (max-width: 700px) { .events-grid { grid-template-columns: repeat(2, 1fr); } }

/* REVIEWS */
#ocene { background: var(--surface); position: relative; overflow: hidden; }

.reviews-header {
  display: flex; align-items: center; justify-content: center;
  gap: 32px; margin-bottom: 60px; flex-wrap: wrap;
}
.reviews-score {
  display: flex; align-items: center; gap: 16px;
  background: var(--bg); border: 1px solid var(--line);
  border-radius: var(--radius); padding: 20px 28px;
}
.reviews-score .big-num {
  font-size: 48px; font-weight: 700;
  letter-spacing: -0.02em; line-height: 1; color: var(--ink);
}
.reviews-score .meta { font-size: 13px; color: var(--ink-soft); }
.reviews-score .meta .stars {
  display: flex; gap: 2px; margin-bottom: 4px; color: var(--accent);
}

.reviews-marquee {
  position: relative;
  -webkit-mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);
  mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);
  padding: 10px 0;
}
.reviews-track {
  display: flex; gap: 20px; width: max-content;
  animation: scroll-reviews 90s linear infinite;
}
.reviews-track.row-2 {
  animation: scroll-reviews-reverse 75s linear infinite;
  margin-top: 20px;
}
.reviews-marquee:hover .reviews-track { animation-play-state: paused; }

@keyframes scroll-reviews {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}
@keyframes scroll-reviews-reverse {
  from { transform: translateX(-50%); }
  to { transform: translateX(0); }
}

.review-card {
  flex-shrink: 0; width: 340px;
  background: var(--bg); border: 1px solid var(--line);
  border-radius: var(--radius); padding: 26px;
  display: flex; flex-direction: column; gap: 14px;
}
.review-stars { display: flex; gap: 2px; color: var(--accent); }
.review-text {
  font-size: 14.5px; color: var(--ink-soft);
  line-height: 1.6; flex-grow: 1;
}
.review-author {
  display: flex; align-items: center; gap: 12px;
  padding-top: 14px; border-top: 1px solid var(--line);
}
.review-avatar {
  width: 40px; height: 40px; border-radius: 50%;
  background: linear-gradient(135deg, var(--accent), var(--accent-dark));
  color: var(--bg); display: flex; align-items: center; justify-content: center;
  font-weight: 600; font-size: 15px; flex-shrink: 0;
}
.review-avatar.var-2 { background: linear-gradient(135deg, var(--rose), #b88c8c); }
.review-avatar.var-3 { background: linear-gradient(135deg, var(--sage), #8a9682); }
.review-avatar.var-4 { background: linear-gradient(135deg, #b8a5c4, #9080a0); }
.review-info .name { font-size: 14px; font-weight: 600; color: var(--ink); }
.review-info .event { font-size: 12px; color: var(--muted); margin-top: 2px; }

@media (max-width: 600px) {
  .review-card { width: 280px; padding: 22px; }
  .reviews-track { animation-duration: 60s; }
  .reviews-track.row-2 { animation-duration: 50s; }
}


#faq { background: var(--surface); }
.faq-list { max-width: 760px; margin: 0 auto; }
.faq-item { border-bottom: 1px solid var(--line); }
.faq-item:first-child { border-top: 1px solid var(--line); }
.faq-question {
  padding: 24px 0; font-size: 17px; font-weight: 500;
  cursor: pointer; display: flex;
  justify-content: space-between; align-items: center;
  gap: 24px; transition: color 0.2s;
}
.faq-question:hover { color: var(--accent-dark); }
.faq-question .icon {
  flex-shrink: 0; width: 32px; height: 32px;
  border-radius: 50%; background: var(--bg);
  display: flex; align-items: center; justify-content: center;
  transition: all 0.3s; color: var(--ink-soft);
}
.faq-item.open .icon {
  background: var(--ink); color: var(--bg); transform: rotate(180deg);
}
.faq-answer {
  max-height: 0; overflow: hidden;
  transition: max-height 0.4s ease, padding 0.4s ease;
  color: var(--ink-soft); font-size: 15px;
}
.faq-item.open .faq-answer { max-height: 300px; padding-bottom: 24px; }

/* CONTACT */
#kontakt { background: var(--ink); color: var(--bg); text-align: center; }
#kontakt .section-head h2 { color: var(--bg); }
#kontakt .section-head h2 .italic { color: var(--accent); }
#kontakt .section-head .eyebrow { color: var(--accent); }
#kontakt .section-head p { color: rgba(250, 248, 245, 0.7); }
.contact-grid {
  display: grid; grid-template-columns: repeat(3, 1fr);
  gap: 16px; max-width: 760px; margin: 0 auto;
}
.contact-card {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius); padding: 32px 24px;
  transition: all 0.3s;
  display: flex; flex-direction: column; align-items: center; gap: 12px;
}
.contact-card:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: var(--accent); transform: translateY(-4px);
}
.contact-card .c-icon {
  width: 48px; height: 48px;
  background: rgba(201, 169, 110, 0.15); border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  color: var(--accent); margin-bottom: 4px;
}
.contact-card .label {
  font-size: 12px; color: rgba(250, 248, 245, 0.6);
  letter-spacing: 0.08em; text-transform: uppercase;
}
.contact-card .value { font-size: 16px; font-weight: 500; }
@media (max-width: 700px) { .contact-grid { grid-template-columns: 1fr; } }

/* FOOTER */
footer {
  background: var(--ink); color: rgba(250, 248, 245, 0.6);
  padding: 50px 40px 40px; text-align: center;
  font-size: 13px; border-top: 1px solid rgba(255, 255, 255, 0.08);
}
footer img {
  height: 70px; margin: 0 auto 20px;
  filter: brightness(0) invert(1); opacity: 0.85;
}
footer p { margin-bottom: 6px; }

.reveal {
  opacity: 0; transform: translateY(24px);
  transition: opacity 0.7s ease, transform 0.7s ease;
}
.reveal.visible { opacity: 1; transform: translateY(0); }
</style>
</head>
<body>

<nav id="navbar">
  <a href="#" class="logo">
    <img src="https://assets.cdn.filesafe.space/x59KaDfsCMuhMlks5lOI/media/6a15a1b3ecd67a415b8a1964.png" alt="Ujete Bedarije" />
  </a>
  <ul>
    <li><a href="#paketi">Paketi</a></li>
    <li><a href="#kaj-dobis">Vključeno</a></li>
    <li><a href="#galerija">Galerija</a></li>
    <li><a href="#ocene">Ocene</a></li>
    <li><a href="#faq">FAQ</a></li>
  </ul>
  <a href="#kontakt" class="cta">Rezerviraj</a>
</nav>

<header class="hero">
  <div class="hero-content">
    <span class="eyebrow">Photo Booth · Slovenija</span>
    <h1>
      Trenutki, <span class="italic">ki jih boste<br/>obujali</span> še desetletja.
    </h1>
    <p class="lede">
      Premium photo booth za poroke, zabave in firmne dogodke. Neomejen tisk, prilagojen okvir, album in vsi rekviziti — vse vključeno.
    </p>
    <div class="ctas">
      <a href="#paketi" class="btn btn-primary">
        Poglej pakete
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
      </a>
      <a href="#kontakt" class="btn btn-ghost">Rezerviraj termin</a>
    </div>
    <div class="hero-stats">
      <div class="stat"><div class="num">2–3h</div><div class="lbl">Trajanje</div></div>
      <div class="stat"><div class="num">∞</div><div class="lbl">Tiskane fotografije</div></div>
      <div class="stat"><div class="num">0€</div><div class="lbl">Prihod do 31.12.2026</div></div>
    </div>
  </div>

  <div class="hero-collage">
    <div class="img-frame img-1"><img src="https://assets.cdn.filesafe.space/x59KaDfsCMuhMlks5lOI/media/6a158aaf999f3b10088ab257.jpeg" alt="" /></div>
    <div class="img-frame img-2"><img src="https://assets.cdn.filesafe.space/x59KaDfsCMuhMlks5lOI/media/6a158aaf5e09acb033cec865.jpeg" alt="" /></div>
    <div class="img-frame img-3"><img src="https://assets.cdn.filesafe.space/x59KaDfsCMuhMlks5lOI/media/6a158aaf79d918ba609dc44b.jpeg" alt="" /></div>
    <div class="floating-badge">
      <div class="dot"></div>
      <span>Na voljo za 2026</span>
    </div>
  </div>
</header>

<section id="paketi">
  <div class="container">
    <div class="section-head reveal">
      <span class="eyebrow">Cene</span>
      <h2>Dva paketa, <span class="italic">ena izkušnja</span></h2>
      <p>Izberite trajanje — vse ostalo je že vključeno. Brez skritih stroškov.</p>
    </div>

    <div class="pricing">
      <div class="price-card reveal">
        <h3>Mali paket</h3>
        <p class="duration">2 uri photo bootha</p>
        <div class="price"><span class="amount">250</span><span class="currency">€</span></div>
        <p class="price-note">+ DDV · velja do konca 2026</p>
        <ul class="features-list">
          <li><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 13l4 4L19 7"/></svg>Neomejen tisk fotografij</li>
          <li><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 13l4 4L19 7"/></svg>Digitalni album na email</li>
          <li><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 13l4 4L19 7"/></svg>Fizični album s pisali in nalepkami</li>
          <li><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 13l4 4L19 7"/></svg>Rekviziti za fotografiranje</li>
          <li><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 13l4 4L19 7"/></svg>Različna barvna ozadja</li>
          <li><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 13l4 4L19 7"/></svg>Prilagojen okvir z napisom</li>
        </ul>
        <a href="#kontakt" class="btn btn-ghost">Izberi paket</a>
      </div>

      <div class="price-card featured reveal">
        <div class="ribbon">Priporočamo</div>
        <h3>Veliki paket</h3>
        <p class="duration">3 ure photo bootha</p>
        <div class="price"><span class="amount">350</span><span class="currency">€</span></div>
        <p class="price-note">+ DDV · velja do konca 2026</p>
        <ul class="features-list">
          <li><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 13l4 4L19 7"/></svg>Vse iz malega paketa</li>
          <li><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 13l4 4L19 7"/></svg>Dodatna ura snemanja</li>
          <li><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 13l4 4L19 7"/></svg>Več časa za vse goste</li>
          <li><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 13l4 4L19 7"/></svg>Idealno za večje dogodke</li>
          <li><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 13l4 4L19 7"/></svg>Polnejši album spominov</li>
          <li><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 13l4 4L19 7"/></svg>Najboljša izbira za poroke</li>
        </ul>
        <a href="#kontakt" class="btn btn-primary">Izberi paket</a>
      </div>
    </div>

    <div class="bonus-card reveal">
      <div class="icon-wrap">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M20 12v10H4V12M2 7h20v5H2zM12 22V7M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z"/></svg>
      </div>
      <div>
        <h4>Prihod na lokacijo — brezplačno</h4>
        <p>Kjerkoli po Sloveniji. Velja za vse rezervacije do 31. 12. 2026.</p>
      </div>
    </div>
  </div>
</section>

<section id="kaj-dobis">
  <div class="container">
    <div class="section-head reveal">
      <span class="eyebrow">Vključeno v ceno</span>
      <h2>Vse, kar potrebujete <span class="italic">za nepozaben večer</span></h2>
      <p>Brez doplačil, brez presenečenj. Pridemo, postavimo, poskrbimo za vse.</p>
    </div>

    <div class="features-grid">
      <div class="feature reveal">
        <div class="feat-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg></div>
        <h4>Neomejen tisk</h4>
        <p>Profesionalni tiskalnik na lokaciji. Vsak gost gre domov z natisnjenim spominom.</p>
      </div>
      <div class="feature reveal">
        <div class="feat-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg></div>
        <h4>Fizični album</h4>
        <p>Premium album, kamor gostje prilepijo fotografije in napišejo voščila — popoln spomin.</p>
      </div>
      <div class="feature reveal">
        <div class="feat-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg></div>
        <h4>Digitalni album</h4>
        <p>Po dogodku vam vse fotografije pošljemo po emailu v visoki ločljivosti.</p>
      </div>
      <div class="feature reveal">
        <div class="feat-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01"/></svg></div>
        <h4>Rekviziti</h4>
        <p>Klobuki, očala, napisi in dodatki — vse, kar potrebujete za zabavne posnetke.</p>
      </div>
      <div class="feature reveal">
        <div class="feat-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/><circle cx="8.5" cy="7.5" r=".5"/><circle cx="6.5" cy="12.5" r=".5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 011.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg></div>
        <h4>Barvna ozadja</h4>
        <p>Različna ozadja po izbiri — od elegantnih do razigranih, prilagojenih vašemu stilu.</p>
      </div>
      <div class="feature reveal">
        <div class="feat-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg></div>
        <h4>Prilagojen okvir</h4>
        <p>Vaš logo, imena ali datum na vsaki fotografiji. Brezplačno.</p>
      </div>
    </div>
  </div>
</section>

<section id="galerija">
  <div class="container">
    <div class="section-head reveal">
      <span class="eyebrow">Galerija</span>
      <h2>Iz naših <span class="italic">dogodkov</span></h2>
      <p>Vsaka slika je zgodba. Vsak nasmeh je razlog, zakaj to počnemo.</p>
    </div>

    <div class="gallery-grid">
      <div class="gallery-item tall reveal"><img src="https://assets.cdn.filesafe.space/x59KaDfsCMuhMlks5lOI/media/6a158aaf999f3b10088ab257.jpeg" alt="" /></div>
      <div class="gallery-item reveal"><img src="https://assets.cdn.filesafe.space/x59KaDfsCMuhMlks5lOI/media/6a158aaf5e09acb033cec865.jpeg" alt="" /></div>
      <div class="gallery-item reveal"><img src="https://assets.cdn.filesafe.space/x59KaDfsCMuhMlks5lOI/media/6a158aaf79d918ba609dc44b.jpeg" alt="" /></div>
      <div class="gallery-item tall reveal"><img src="https://assets.cdn.filesafe.space/x59KaDfsCMuhMlks5lOI/media/6a158aaf79d918ba609dc44a.jpeg" alt="" /></div>
      <div class="gallery-item reveal"><img src="https://assets.cdn.filesafe.space/x59KaDfsCMuhMlks5lOI/media/6a158aaf999f3b10088ab256.jpeg" alt="" /></div>
      <div class="gallery-item reveal"><img src="https://assets.cdn.filesafe.space/x59KaDfsCMuhMlks5lOI/media/6a158aaf5a7f2177766ae9bd.jpeg" alt="" /></div>
      <div class="gallery-item reveal"><img src="https://assets.cdn.filesafe.space/x59KaDfsCMuhMlks5lOI/media/6a158a6979d918ba609dbdc5.png" alt="" /></div>
      <div class="gallery-item reveal"><img src="https://assets.cdn.filesafe.space/x59KaDfsCMuhMlks5lOI/media/6a158a69ecd67a415b88c243.png" alt="" /></div>
    </div>
  </div>
</section>

<section id="dogodki">
  <div class="container">
    <div class="section-head reveal">
      <span class="eyebrow">Za vse priložnosti</span>
      <h2>Kjerkoli je <span class="italic">zabava</span></h2>
      <p>Photo booth, ki se prilagodi vašemu dogodku — od intimnih praznovanj do velikih svatb.</p>
    </div>

    <div class="events-grid">
      <div class="event-card reveal">
        <div class="ev-icon"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg></div>
        <h4>Poroke</h4>
        <p>Najlepši dan, ujet v nasmehe</p>
      </div>
      <div class="event-card reveal">
        <div class="ev-icon"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M20 12v10H4V12M2 7h20v5H2zM12 22V7"/></svg></div>
        <h4>Rojstni dnevi</h4>
        <p>Praznujte z vsemi najljubšimi</p>
      </div>
      <div class="event-card reveal">
        <div class="ev-icon"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/></svg></div>
        <h4>Firmni dogodki</h4>
        <p>Team building s tvistom</p>
      </div>
      <div class="event-card reveal">
        <div class="ev-icon"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg></div>
        <h4>Valete & maturanti</h4>
        <p>Spomin na konec ene ere</p>
      </div>
    </div>
  </div>
</section>

<section id="ocene">
  <div class="container">
    <div class="section-head reveal">
      <span class="eyebrow">Mnenja strank</span>
      <h2>Kaj pravijo <span class="italic">naši gostje</span></h2>
      <p>Več kot 100 dogodkov, neštete fotografije in en sam cilj — da se ljudje smejijo.</p>
    </div>

    <div class="reviews-header reveal">
      <div class="reviews-score">
        <div class="big-num">4.9</div>
        <div class="meta">
          <div class="stars">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          </div>
          povprečna ocena · 23 mnenj
        </div>
      </div>
    </div>

    <!-- ROW 1 -->
    <div class="reviews-marquee reveal">
      <div class="reviews-track">

        <!-- 1 -->
        <div class="review-card">
          <div class="review-stars">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          </div>
          <p class="review-text">Najela sem jih za poroko in to je bil definitivno hit večera. Babice in dedki so se fotkali kot mladi, fotografije pa še vedno krožijo po družinskih klepetih. Hvala!</p>
          <div class="review-author">
            <div class="review-avatar">N</div>
            <div class="review-info">
              <div class="name">Nina B.</div>
              <div class="event">Poroka · Maribor</div>
            </div>
          </div>
        </div>

        <!-- 2 -->
        <div class="review-card">
          <div class="review-stars">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          </div>
          <p class="review-text">Profesionalno od začetka do konca. Postavili so se hitro, brez kakršnegakoli kompliciranja. Album s sporočili gostov pa zdaj stoji na vidnem mestu doma.</p>
          <div class="review-author">
            <div class="review-avatar var-2">M</div>
            <div class="review-info">
              <div class="name">Matej P.</div>
              <div class="event">Poroka · Bled</div>
            </div>
          </div>
        </div>

        <!-- 3 -->
        <div class="review-card">
          <div class="review-stars">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          </div>
          <p class="review-text">Naročila sem jih za 30. rojstni dan in nismo obžalovali niti minute. Rekvizitov je bilo ogromno, vsi smo se zabavali. Edina pripomba — premalo časa smo izbrali, naslednjič 3 ure!</p>
          <div class="review-author">
            <div class="review-avatar var-3">A</div>
            <div class="review-info">
              <div class="name">Ana K.</div>
              <div class="event">Rojstni dan · Ljubljana</div>
            </div>
          </div>
        </div>

        <!-- 4 -->
        <div class="review-card">
          <div class="review-stars">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          </div>
          <p class="review-text">Organizirali smo firmni event za 80 ljudi in to je bila absolutna popestritev. Kolegi, ki se običajno držijo zase, so se na koncu fotkali skupaj. Priporočam vsakemu HR-ovcu.</p>
          <div class="review-author">
            <div class="review-avatar var-4">T</div>
            <div class="review-info">
              <div class="name">Tjaša R.</div>
              <div class="event">Firmni dogodek · Kranj</div>
            </div>
          </div>
        </div>

        <!-- 5 -->
        <div class="review-card">
          <div class="review-stars">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          </div>
          <p class="review-text">Top ekipa, top oprema, top fotke. Pripeljali so se prej kot smo dogovorili, vse postavili in res si nisem rabila ničesar belit z njimi. Še enkrat hvala!</p>
          <div class="review-author">
            <div class="review-avatar">S</div>
            <div class="review-info">
              <div class="name">Sara M.</div>
              <div class="event">Poroka · Ptuj</div>
            </div>
          </div>
        </div>

        <!-- 6 -->
        <div class="review-card">
          <div class="review-stars">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          </div>
          <p class="review-text">Mami je dopolnila 70 let, mi pa nismo imeli pojma kako bi popestrili kosilo. Photo booth je bil zadetek v polno — tete in strici niso šli stran od njega.</p>
          <div class="review-author">
            <div class="review-avatar var-2">J</div>
            <div class="review-info">
              <div class="name">Jure H.</div>
              <div class="event">Rojstni dan · Celje</div>
            </div>
          </div>
        </div>

        <!-- 7 -->
        <div class="review-card">
          <div class="review-stars">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          </div>
          <p class="review-text">Komunikacija je bila odlična, vse so pripravili točno tako kot sem si predstavljala. Okvir z imeni naju z možem je bil res lep detajl, ki ga gostje opazijo.</p>
          <div class="review-author">
            <div class="review-avatar var-3">K</div>
            <div class="review-info">
              <div class="name">Katja L.</div>
              <div class="event">Poroka · Postojna</div>
            </div>
          </div>
        </div>

        <!-- 8 -->
        <div class="review-card">
          <div class="review-stars">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          </div>
          <p class="review-text">Naročili smo jih za valeto in otroci so jih čisto obožavali. Še lepše je bilo, da starši lahko dobimo te fotke za spomin. Cena je čisto poštena za to kar dobiš.</p>
          <div class="review-author">
            <div class="review-avatar var-4">D</div>
            <div class="review-info">
              <div class="name">Damjana V.</div>
              <div class="event">Valeta · Novo mesto</div>
            </div>
          </div>
        </div>

        <!-- 9 -->
        <div class="review-card">
          <div class="review-stars">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          </div>
          <p class="review-text">Vrhunsko. Album s posnetki in komentarji gostov je nepogrešljiv del poročnih spominov. Že večkrat smo ga prelistali in vedno najdemo nekaj, kar nas spravi v smeh.</p>
          <div class="review-author">
            <div class="review-avatar">L</div>
            <div class="review-info">
              <div class="name">Luka Č.</div>
              <div class="event">Poroka · Koper</div>
            </div>
          </div>
        </div>

        <!-- 10 -->
        <div class="review-card">
          <div class="review-stars">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          </div>
          <p class="review-text">Zelo prijazni in fleksibilni. V zadnjem trenutku smo spremenili lokacijo zaradi vremena in se niso niti malo razburjali. Vse je teklo gladko.</p>
          <div class="review-author">
            <div class="review-avatar var-2">P</div>
            <div class="review-info">
              <div class="name">Petra Z.</div>
              <div class="event">Rojstni dan · Domžale</div>
            </div>
          </div>
        </div>

        <!-- 11 -->
        <div class="review-card">
          <div class="review-stars">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          </div>
          <p class="review-text">Sin je imel 18. rojstni dan in midva s soprogo sva sprva mislila da je booth za otroke. Pa smo se midva starši najbolj zabavali in čisto noro fotkali. Hvala za smeh.</p>
          <div class="review-author">
            <div class="review-avatar var-3">B</div>
            <div class="review-info">
              <div class="name">Boštjan M.</div>
              <div class="event">18. rojstni dan · Velenje</div>
            </div>
          </div>
        </div>

        <!-- 12 -->
        <div class="review-card">
          <div class="review-stars">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          </div>
          <p class="review-text">Fotografije se natisnejo res hitro in v lepi kvaliteti. Tudi po dveh mesecih barve niso zbledele. Drobtinica, ki dela razliko.</p>
          <div class="review-author">
            <div class="review-avatar var-4">M</div>
            <div class="review-info">
              <div class="name">Mojca T.</div>
              <div class="event">Poroka · Murska Sobota</div>
            </div>
          </div>
        </div>

        <!-- DUPLICATE for seamless loop -->
        <div class="review-card">
          <div class="review-stars">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          </div>
          <p class="review-text">Najela sem jih za poroko in to je bil definitivno hit večera. Babice in dedki so se fotkali kot mladi, fotografije pa še vedno krožijo po družinskih klepetih. Hvala!</p>
          <div class="review-author">
            <div class="review-avatar">N</div>
            <div class="review-info">
              <div class="name">Nina B.</div>
              <div class="event">Poroka · Maribor</div>
            </div>
          </div>
        </div>
        <div class="review-card">
          <div class="review-stars">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          </div>
          <p class="review-text">Profesionalno od začetka do konca. Postavili so se hitro, brez kakršnegakoli kompliciranja. Album s sporočili gostov pa zdaj stoji na vidnem mestu doma.</p>
          <div class="review-author">
            <div class="review-avatar var-2">M</div>
            <div class="review-info">
              <div class="name">Matej P.</div>
              <div class="event">Poroka · Bled</div>
            </div>
          </div>
        </div>
        <div class="review-card">
          <div class="review-stars">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          </div>
          <p class="review-text">Naročila sem jih za 30. rojstni dan in nismo obžalovali niti minute. Rekvizitov je bilo ogromno, vsi smo se zabavali. Edina pripomba — premalo časa smo izbrali, naslednjič 3 ure!</p>
          <div class="review-author">
            <div class="review-avatar var-3">A</div>
            <div class="review-info">
              <div class="name">Ana K.</div>
              <div class="event">Rojstni dan · Ljubljana</div>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- ROW 2 -->
    <div class="reviews-marquee reveal">
      <div class="reviews-track row-2">

        <!-- 13 -->
        <div class="review-card">
          <div class="review-stars">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          </div>
          <p class="review-text">Najboljša odločitev za poroko, takoj za izbrano lokacijo. Vsi gostje so dobili spomin domov, midva pa imava album, ki ga bova prebirala še 50 let.</p>
          <div class="review-author">
            <div class="review-avatar">E</div>
            <div class="review-info">
              <div class="name">Eva S.</div>
              <div class="event">Poroka · Nova Gorica</div>
            </div>
          </div>
        </div>

        <!-- 14 -->
        <div class="review-card">
          <div class="review-stars">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" opacity="0.25"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          </div>
          <p class="review-text">Vse skupaj je bilo zelo v redu, edino mogoče bi si želela še kakšen rekvizit več. Drugače pa fotografije super, hitra dostava digitalnega albuma.</p>
          <div class="review-author">
            <div class="review-avatar var-2">U</div>
            <div class="review-info">
              <div class="name">Urška F.</div>
              <div class="event">Rojstni dan · Škofja Loka</div>
            </div>
          </div>
        </div>

        <!-- 15 -->
        <div class="review-card">
          <div class="review-stars">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          </div>
          <p class="review-text">Za team building smo iskali nekaj drugačnega in to je bil polni zadetek. Kolegi se še vedno hecajo o klobukih in brkih. Priporočam za večje firme.</p>
          <div class="review-author">
            <div class="review-avatar var-3">G</div>
            <div class="review-info">
              <div class="name">Gregor T.</div>
              <div class="event">Firmni dogodek · Ljubljana</div>
            </div>
          </div>
        </div>

        <!-- 16 -->
        <div class="review-card">
          <div class="review-stars">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          </div>
          <p class="review-text">Punce smo si na dekliščini privoščile photo booth in se odlično odločile. Norili smo cele dve uri, ena je celo zlomila peto od smeha. Hvala za nepozaben večer.</p>
          <div class="review-author">
            <div class="review-avatar var-4">Ž</div>
            <div class="review-info">
              <div class="name">Živa K.</div>
              <div class="event">Dekliščina · Bohinj</div>
            </div>
          </div>
        </div>

        <!-- 17 -->
        <div class="review-card">
          <div class="review-stars">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          </div>
          <p class="review-text">Vse pohvale za odzivnost. Vprašala sem cca 10 različnih ponudnikov in samo oni so odgovorili v dveh urah. Tudi v živo so se izkazali za res profesionalno ekipo.</p>
          <div class="review-author">
            <div class="review-avatar">T</div>
            <div class="review-info">
              <div class="name">Tina O.</div>
              <div class="event">Poroka · Logatec</div>
            </div>
          </div>
        </div>

        <!-- 18 -->
        <div class="review-card">
          <div class="review-stars">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          </div>
          <p class="review-text">Hvala za res lepo izkušnjo. Tašča je bila prepričana da bo to nekaj cenenega, zdaj pa s ponosom kaže fotke vsem prijateljicam.</p>
          <div class="review-author">
            <div class="review-avatar var-2">R</div>
            <div class="review-info">
              <div class="name">Rok J.</div>
              <div class="event">Poroka · Trbovlje</div>
            </div>
          </div>
        </div>

        <!-- 19 -->
        <div class="review-card">
          <div class="review-stars">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          </div>
          <p class="review-text">Sestrica se je poročila in mi smo ji organizirali presenečenje. Photo booth je popolnoma razbil led med dvema družinama, ki se prej nikoli nista videli.</p>
          <div class="review-author">
            <div class="review-avatar var-3">I</div>
            <div class="review-info">
              <div class="name">Iva P.</div>
              <div class="event">Poroka · Idrija</div>
            </div>
          </div>
        </div>

        <!-- 20 -->
        <div class="review-card">
          <div class="review-stars">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" opacity="0.25"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          </div>
          <p class="review-text">Storitev super, lokacijsko pa malo težje za nas ker smo bili daleč proč. Ampak ker je prihod gratis, je to bil precej manjši problem kot bi sicer bil.</p>
          <div class="review-author">
            <div class="review-avatar var-4">A</div>
            <div class="review-info">
              <div class="name">Aleš N.</div>
              <div class="event">Rojstni dan · Brežice</div>
            </div>
          </div>
        </div>

        <!-- 21 -->
        <div class="review-card">
          <div class="review-stars">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          </div>
          <p class="review-text">Najemali smo za promocijo izdelka na sejmu. Photo booth z našim logom je naredil čudeže za fotke na družbenih omrežjih. Definitivno ponovimo.</p>
          <div class="review-author">
            <div class="review-avatar">B</div>
            <div class="review-info">
              <div class="name">Barbara M.</div>
              <div class="event">Firmni dogodek · Celje</div>
            </div>
          </div>
        </div>

        <!-- 22 -->
        <div class="review-card">
          <div class="review-stars">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          </div>
          <p class="review-text">Bratova obletnica poroke in vsi smo si želeli nekaj posebnega. Pomagal je da gostje, ki se redko vidijo, naredijo fotko skupaj. Sicer enostavna stvar, pa res lepo nazaj na pogled.</p>
          <div class="review-author">
            <div class="review-avatar var-2">M</div>
            <div class="review-info">
              <div class="name">Maja Š.</div>
              <div class="event">Obletnica · Radovljica</div>
            </div>
          </div>
        </div>

        <!-- 23 -->
        <div class="review-card">
          <div class="review-stars">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          </div>
          <p class="review-text">Prijateljica je priporočila in jaz sedaj priporočam naprej. Cena je vredna vsakega centa. Album in fotografije bom hranila kot dragocenost.</p>
          <div class="review-author">
            <div class="review-avatar var-3">N</div>
            <div class="review-info">
              <div class="name">Neža D.</div>
              <div class="event">Poroka · Vrhnika</div>
            </div>
          </div>
        </div>

        <!-- DUPLICATE for seamless loop -->
        <div class="review-card">
          <div class="review-stars">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          </div>
          <p class="review-text">Najboljša odločitev za poroko, takoj za izbrano lokacijo. Vsi gostje so dobili spomin domov, midva pa imava album, ki ga bova prebirala še 50 let.</p>
          <div class="review-author">
            <div class="review-avatar">E</div>
            <div class="review-info">
              <div class="name">Eva S.</div>
              <div class="event">Poroka · Nova Gorica</div>
            </div>
          </div>
        </div>
        <div class="review-card">
          <div class="review-stars">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" opacity="0.25"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          </div>
          <p class="review-text">Vse skupaj je bilo zelo v redu, edino mogoče bi si želela še kakšen rekvizit več. Drugače pa fotografije super, hitra dostava digitalnega albuma.</p>
          <div class="review-author">
            <div class="review-avatar var-2">U</div>
            <div class="review-info">
              <div class="name">Urška F.</div>
              <div class="event">Rojstni dan · Škofja Loka</div>
            </div>
          </div>
        </div>
        <div class="review-card">
          <div class="review-stars">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          </div>
          <p class="review-text">Za team building smo iskali nekaj drugačnega in to je bil polni zadetek. Kolegi se še vedno hecajo o klobukih in brkih. Priporočam za večje firme.</p>
          <div class="review-author">
            <div class="review-avatar var-3">G</div>
            <div class="review-info">
              <div class="name">Gregor T.</div>
              <div class="event">Firmni dogodek · Ljubljana</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</section>

<section id="faq">
  <div class="container">
    <div class="section-head reveal">
      <span class="eyebrow">Vprašanja</span>
      <h2>Pogosta <span class="italic">vprašanja</span></h2>
      <p>Vse, kar morate vedeti pred rezervacijo.</p>
    </div>

    <div class="faq-list">
      <div class="faq-item reveal">
        <div class="faq-question">
          <span>Koliko prostora potrebujete na lokaciji?</span>
          <div class="icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg></div>
        </div>
        <div class="faq-answer"><p>Za postavitev potrebujemo približno 2×2 m prostora in dostop do elektrike. Postavimo se lahko v dvorani, šotoru ali pod streho na vrtu.</p></div>
      </div>
      <div class="faq-item reveal">
        <div class="faq-question">
          <span>Ali pridete tudi izven Ljubljane?</span>
          <div class="icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg></div>
        </div>
        <div class="faq-answer"><p>Pokrivamo celotno Slovenijo. Prihod je za vse rezervacije do 31. 12. 2026 popolnoma brezplačen, ne glede na oddaljenost lokacije.</p></div>
      </div>
      <div class="faq-item reveal">
        <div class="faq-question">
          <span>Kako dolgo traja postavitev?</span>
          <div class="icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg></div>
        </div>
        <div class="faq-answer"><p>Postavitev običajno traja 30 do 45 minut. Pridemo dovolj zgodaj, da je vse pripravljeno pred prihodom prvih gostov. Postavitev in pospravljanje nista del plačanega časa.</p></div>
      </div>
      <div class="faq-item reveal">
        <div class="faq-question">
          <span>Kako se rezervira termin?</span>
          <div class="icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg></div>
        </div>
        <div class="faq-answer"><p>Pišite nam prek WhatsAppa ali emaila — povejte datum, lokacijo in želeni paket. Vrnemo se vam v 24 urah s potrditvijo in podrobnostmi za rezervacijo.</p></div>
      </div>
      <div class="faq-item reveal">
        <div class="faq-question">
          <span>Ali lahko prilagodimo okvir fotografij?</span>
          <div class="icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg></div>
        </div>
        <div class="faq-answer"><p>Seveda — to je vključeno v ceno. Pošljite nam logo, imena, datum ali poljuben napis, in pripravimo unikaten okvir za vaš dogodek.</p></div>
      </div>
    </div>
  </div>
</section>

<section id="kontakt">
  <div class="container">
    <div class="section-head reveal">
      <span class="eyebrow">Kontakt</span>
      <h2>Rezervirajte <span class="italic">danes</span></h2>
      <p>Pošljite nam datum, lokacijo in izbrani paket. Odgovorimo v 24 urah.</p>
    </div>

    <div class="contact-grid">
      <a href="https://wa.me/38630654002?text=Pozdravljeni%2C%20%C5%BEelim%20rezervirati%20Photo%20Booth.%20Datum%3A%20%2C%20Lokacija%3A%20%2C%20Paket%3A%20" target="_blank" rel="noopener" class="contact-card reveal">
        <div class="c-icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/></svg></div>
        <div class="label">WhatsApp · Stane</div>
        <div class="value">030 654 002</div>
      </a>
      <a href="mailto:ujete.bedarije@gmail.com?subject=Povpra%C5%A1evanje%20za%20Photo%20Booth&body=Pozdravljeni%2C%0A%0A%C5%BEelim%20rezervirati%20Photo%20Booth.%0A%0ADatum%20dogodka%3A%20%0ALokacija%3A%20%0AIzbran%20paket%3A%20%0A%0AHvala%2C%0A" class="contact-card reveal">
        <div class="c-icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg></div>
        <div class="label">Email</div>
        <div class="value">ujete.bedarije@gmail.com</div>
      </a>
      <a href="tel:+38630654002" class="contact-card reveal">
        <div class="c-icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/></svg></div>
        <div class="label">Telefon · Stane</div>
        <div class="value">030 654 002</div>
      </a>
    </div>
  </div>
</section>

<footer>
  <img src="https://assets.cdn.filesafe.space/x59KaDfsCMuhMlks5lOI/media/6a15a1b3ecd67a415b8a1964.png" alt="Ujete Bedarije" />
  <p>© 2026 Ujete Bedarije · Photo Booth</p>
  <p style="opacity: 0.5; margin-top: 8px; font-size: 12px;">Cene veljajo do 31. 12. 2026 in so brez DDV.</p>
</footer>

<script>
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 20) navbar.classList.add('scrolled');
  else navbar.classList.remove('scrolled');
});

document.querySelectorAll('.faq-question').forEach(q => {
  q.addEventListener('click', () => q.parentElement.classList.toggle('open'));
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('visible'); });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
</script>

</body>
</html>
