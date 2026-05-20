/* Portfolio v3 — script.js
   Live time · Navbar sticky · Scroll reveal
   No custom cursor (taste-design: banned)
   No heavy parallax — spring feel only
*/

// ── LIVE TIME ─────────────────────────────
const timeEl = document.getElementById('liveTime');
function tick() {
  if (!timeEl) return;
  const now = new Date();
  const h = String(now.getHours()).padStart(2,'0');
  const m = String(now.getMinutes()).padStart(2,'0');
  const s = String(now.getSeconds()).padStart(2,'0');
  timeEl.textContent = `${h}:${m}:${s}`;
}
tick();
setInterval(tick, 1000);


// ── NAVBAR STICKY ──────────────────────────
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('stuck', window.scrollY > 50);
}, { passive: true });


// ── SCROLL REVEAL ─────────────────────────
const revealItems = document.querySelectorAll('.reveal');

const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const delay = parseInt(entry.target.dataset.delay) || 0;
    setTimeout(() => entry.target.classList.add('in'), delay);
    io.unobserve(entry.target);
  });
}, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

revealItems.forEach(el => io.observe(el));


// ── PAGE ENTRANCE ─────────────────────────
window.addEventListener('load', () => {
  const page = document.getElementById('page');
  if (page) {
    page.style.opacity = '0';
    page.style.transform = 'rotate(-1.2deg) translateY(20px)';
    page.style.transition = 'opacity 1s ease, transform 1s cubic-bezier(0.34,1.1,0.64,1)';
    requestAnimationFrame(() => {
      setTimeout(() => {
        page.style.opacity = '1';
        page.style.transform = 'rotate(-1.2deg) translateY(0)';
      }, 150);
    });
  }
});


// ── SCROLL-BASED PAGE TILT ────────────────
// Notebook page responds very slightly to scroll — feels alive
let lastY = 0;
window.addEventListener('scroll', () => {
  const page = document.getElementById('page');
  if (!page) return;
  const y = window.scrollY;
  const delta = Math.min(Math.max((y - lastY) / 40, -0.4), 0.4);
  page.style.transform = `rotate(${-1.2 + delta * 0.3}deg) translateY(${y * -0.04}px)`;
}, { passive: true });

// ── SCATTER PHOTO PARALLAX (CSS Variables) ──────────────────
document.addEventListener('mousemove', (e) => {
  const cx = window.innerWidth / 2;
  const cy = window.innerHeight / 2;
  const dx = e.clientX - cx;
  const dy = e.clientY - cy;

  // Pass mouse offset globally so CSS math calculates depths automatically
  document.documentElement.style.setProperty('--mx', `${dx}px`);
  document.documentElement.style.setProperty('--my', `${dy}px`);
});

// ── CLEAN / MESSY TOGGLE ──────────────────────────────────
const btnChaos = document.getElementById('btnChaos');
const btnClean = document.getElementById('btnClean');

// Reset inline styles to snap back to CSS rules
function resetDeskLayout() {
  const allSimgs = document.querySelectorAll('.simg');
  allSimgs.forEach(el => {
    el.style.left = '';
    el.style.top = '';
  });
}

if (btnChaos && btnClean) {
  btnChaos.addEventListener('click', () => {
    document.body.classList.remove('desk-clean');
    btnChaos.classList.add('active');
    btnClean.classList.remove('active');
    resetDeskLayout();
  });
  
  btnClean.addEventListener('click', () => {
    document.body.classList.add('desk-clean');
    btnClean.classList.add('active');
    btnChaos.classList.remove('active');
    resetDeskLayout();
  });
}

// ── DESK DRAG PHYSICS ──────────────────────────────────
const simgs = document.querySelectorAll('.simg');
let dragZ = 50; // Starting z-index for dragged items

simgs.forEach(el => {
  let isDragging = false;
  let startX, startY, initialLeft, initialTop;

  el.addEventListener('pointerdown', (e) => {
    isDragging = true;
    el.setPointerCapture(e.pointerId);
    
    // Disable CSS transitions during drag
    el.classList.add('dragging');
    el.style.zIndex = ++dragZ; // Bring to front immediately
    
    startX = e.clientX;
    startY = e.clientY;
    
    // Convert current CSS percentage coordinates strictly to pixels for stable dragging
    const computed = window.getComputedStyle(el);
    initialLeft = parseFloat(computed.left);
    initialTop = parseFloat(computed.top);
  });

  el.addEventListener('pointermove', (e) => {
    if (!isDragging) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    el.style.left = `${initialLeft + dx}px`;
    el.style.top = `${initialTop + dy}px`;
  });

  el.addEventListener('pointerup', (e) => {
    isDragging = false;
    el.releasePointerCapture(e.pointerId);
    el.classList.remove('dragging');
  });
  
  el.addEventListener('pointercancel', () => {
    isDragging = false;
    el.classList.remove('dragging');
  });
});


// ── SMOOTH ANCHOR SCROLL ──────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* === PRETEXT CAT TEXT WRAP === */
(async function initPretextCat() {
  const { prepareWithSegments, layoutNextLine } = await import('https://esm.sh/@chenglou/pretext');
  
  const aboutBody = document.querySelector('.about-body');
  if (!aboutBody) return;
  
  // Find all paragraphs to replace
  const paragraphs = Array.from(aboutBody.querySelectorAll('.about-p'));
  if (!paragraphs.length) return;
  
  // Combine all text, adding standard newlines
  const fullText = paragraphs.map(p => p.textContent.trim()).join('\n\n');
  
  // Hide actual paragraphs but keep them in DOM for layout height
  paragraphs.forEach(p => {
    p.style.opacity = '0';
    p.style.pointerEvents = 'none';
  });
  
  // Create Canvas overlay
  const canvas = document.createElement('canvas');
  canvas.style.position = 'absolute';
  canvas.style.top = paragraphs[0].offsetTop + 'px';
  canvas.style.left = '0';
  canvas.style.width = '100%';
  canvas.style.zIndex = '10';
  aboutBody.style.position = 'relative';
  aboutBody.appendChild(canvas);
  
  const ctx = canvas.getContext('2d');
  
  let width, height;
  const dpr = window.devicePixelRatio || 1;
  
  // Sync the font perfectly with Bodoni Moda (matching .about-p CSS)
  const fontSize = 15;
  const lineHeight = 27; // 15px * 1.8 line height = 27
  const fontStyle = `300 ${fontSize}px "Bodoni Moda", serif`;
  
  let prepared = prepareWithSegments(fullText, fontStyle, { whiteSpace: 'pre-wrap' });
  
  // Cat object
  const cat = {
    x: 100,
    y: 100,
    targetX: 100,
    targetY: 100,
    radius: 75, // Repulsion field radius
    emoji: '🐈',
    speed: 0.1,
    isFacingRight: true
  };
  
  function resize() {
    width = aboutBody.clientWidth;
    // Set explicit height to cover the paragraphs
    height = aboutBody.clientHeight - paragraphs[0].offsetTop + 20; 
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.height = height + 'px';
    ctx.scale(dpr, dpr);
  }
  window.addEventListener('resize', resize);
  setTimeout(resize, 100);

// ONEKO.JS DOM TRACKING
  function render() {
    // Sync pretext collision with the actual animated DOM cat 
    const onekoEl = document.getElementById('oneko');
    if (onekoEl) {
      const onekoRect = onekoEl.getBoundingClientRect();
      const canvasRect = canvas.getBoundingClientRect();
      cat.x = (onekoRect.left + (onekoRect.width / 2)) - canvasRect.left;
      cat.y = (onekoRect.top + (onekoRect.height / 2)) - canvasRect.top;
      cat.radius = 75; // Image bounding sphere
    }
    
    // Clear
    ctx.clearRect(0, 0, width, height);
    
    // Draw text with PRETEXT!
    ctx.font = fontStyle;
    ctx.fillStyle = 'rgba(237,234,222,0.6)'; // matching var(--t-paper-m)
    ctx.textBaseline = 'top';
    
    let cursor = { segmentIndex: 0, graphemeIndex: 0 };
    let y = 0;
    
    while (true) {
      if (y > height + 100) break; // Optimization
      
      const lineCenterY = y + (lineHeight / 2);
      const dyCat = lineCenterY - cat.y;
      
      if (Math.abs(dyCat) < cat.radius) {
        const xOffset = Math.sqrt(cat.radius*cat.radius - dyCat*dyCat);
        const blockLeft = Math.max(0, cat.x - xOffset);
        const blockRight = Math.min(width, cat.x + xOffset);
        
        // Render Left segment
        if (blockLeft > 30) {
          let lineLeft = layoutNextLine(prepared, cursor, blockLeft);
          if (!lineLeft) break;
          ctx.fillText(lineLeft.text, 0, y);
          cursor = lineLeft.end;
          
          if (lineLeft.text.endsWith('\n')) {
             y += lineHeight; 
             continue; // Ignore gap if line breaks anyway
          }
        }
        
        // Render Right segment
        if (width - blockRight > 30) {
          let lineRight = layoutNextLine(prepared, cursor, width - blockRight);
          if (!lineRight) break;
          ctx.fillText(lineRight.text, blockRight, y);
          cursor = lineRight.end;
        }
      } else {
        let lineFull = layoutNextLine(prepared, cursor, width);
        if (!lineFull) break;
        ctx.fillText(lineFull.text, 0, y);
        cursor = lineFull.end;
      }
      y += lineHeight;
    }
    
    // (Oneko handles drawing the actual animated cat image globally, so we don't draw an emoji here!)
    
    requestAnimationFrame(render);
  }
  
  // Kickstart
  setTimeout(() => {
    cat.targetX = width ? width - 40 : 200;
    cat.targetY = height ? height - 60 : 200;
    cat.x = cat.targetX;
    cat.y = cat.targetY;
    render();
  }, 100);
  
})();

// ── PROJECT OVERLAY LOGIC ──────────────────────────────────
const projectData = {
  certifypro: {
    type: "Full Stack · 2026",
    title: "CertifyPro",
    sub: "Certificate Generator & Verification Platform",
    gradient: "linear-gradient(120deg, #0a1628, #0f2d3d, #0a1628)",
    meta: [
      { label: "Role",     value: "Full Stack Developer" },
      { label: "Year",     value: "2026" },
      { label: "Duration", value: "3 months" },
      { label: "Client",   value: "Personal / Open Source" },
    ],
    overview: `CertifyPro is a full-stack certificate management platform that lets organisations design certificate templates, bulk-generate them from CSV data, and distribute tamper-proof, QR-verified certificates — all from a single web app. It unifies the entire lifecycle: WYSIWYG template design → server-side bulk generation → real-time QR verification → batch tracking dashboard.`,
    challenge: `Most teams handle certificates through a fragile mix of Figma, spreadsheets, and manual emails. A batch of 500 certificates means 500 manual sends, zero audit trail, and no verification story. There was no single product that unified template design → bulk generation → verification without needing a designer or developer for every run.`,
    solution: `CertifyPro gives any team a self-service pipeline: a WYSIWYG builder with live DOM preview (no API calls), CSV upload triggering server-side bulk generation with unique QR codes per certificate, real-time verification by scanning any QR code, and a batch tracking dashboard (Pending → Processing → Completed → Failed).`,
    features: [
      { icon: "✦", title: "WYSIWYG Template Builder",   desc: "Live DOM preview updates on every keystroke — zero round trips. Configure typography, borders, seal, and signature lines." },
      { icon: "⚡", title: "CSV Bulk Generation",        desc: "Upload a CSV → server generates every certificate with a unique QR code and verification token. Status polling keeps UX non-blocking." },
      { icon: "🔒", title: "QR Verification",           desc: "Every certificate carries a tamper-proof QR code. Scanning it hits the public verification endpoint and confirms authenticity in real time." },
      { icon: "📊", title: "Batch Dashboard",            desc: "Full lifecycle tracking: Pending → Processing → Completed → Failed. Aggregate stats with per-batch drill-down." },
      { icon: "🔑", title: "Secure Auth",                desc: "JWT httpOnly cookies (7-day expiry) block XSS token theft. Google OAuth as alternative sign-in. sameSite: lax CSRF protection." },
      { icon: "🗄️", title: "canvasStateJson Schema",    desc: "All template config in one JSON field — decouples the builder from the DB, letting the UI evolve without schema migrations." },
    ],
    stack: ["React", "TypeScript", "Vite", "TanStack Router", "Zustand", "Framer Motion", "Radix UI", "Tailwind CSS", "Node.js", "Express", "Prisma", "PostgreSQL", "JWT", "Google OAuth"],
    architecture: [
      "The frontend is a Vite + React SPA with type-safe file-based routing via TanStack Router. The template builder renders previews client-side as real DOM — instant updates, no round trips.",
      "The backend is Node.js + Express. Template data is stored as a canvasStateJson blob — a flexible JSON column covering all design options, avoiding schema migrations as the UI evolves.",
      "Auth uses JWT httpOnly cookies (7-day expiry) + Google OAuth. Batch generation is queued server-side; the frontend polls every few seconds, keeping the UX non-blocking for large runs.",
    ],
    metrics: [
      { value: "500+", label: "Certs per batch" },
      { value: "0ms",  label: "Preview latency" },
      { value: "5",    label: "Prisma DB models" },
      { value: "7d",   label: "JWT expiry window" },
    ],
    learnings: [
      "A JSON blob schema (canvasStateJson) decouples UI from DB — when design options evolve, you skip migrations. Tradeoff: weaker queryability, but for a builder that reads the full blob anyway, it's a net win.",
      "Client-side DOM-based preview beats canvas for live editing: CSS applies instantly, text reflows naturally, browser-native font rendering for free.",
      "Cookie-based auth (httpOnly, sameSite) is materially more secure than localStorage tokens for SPAs — and barely more complex to implement.",
      "Polling beats WebSockets for low-frequency batch jobs. A 3-second poll interval is imperceptible to users and eliminates the operational complexity of a persistent connection layer.",
    ],
    links: {
      live:   "https://certify-pro-frontend.vercel.app/",
      github: "https://github.com/chaivala-dot/CertifyPro",
    },
  },

  aibridge: {
    type: "Web App · 2026",
    title: "Ai-bridge",
    sub: "AI Integration Platform",
    gradient: "linear-gradient(120deg, #c4d8ce, #e5e0d4, #19b08b40)",
    meta: [{ label: "Role", value: "Developer" }, { label: "Year", value: "2026" }],
    overview: `Ai-bridge serves as the missing link between powerful foundational AI models and every-day productivity tools. It exposes a flexible API and interface that lets developers plug large language model reasoning directly into local environments or custom web apps.`,
    challenge: `Integrating AI models into existing workflows requires wiring up APIs, managing context, and building UI — all from scratch, every time. There was no lightweight, drop-in bridge that made this fast.`,
    solution: `Ai-bridge wraps the complexity behind a clean API and modular UI. Responsive, modular, and built natively in JavaScript for high accessibility and fast prototyping.`,
    features: [
      { icon: "🤖", title: "Model Agnostic",    desc: "Plug in any LLM via a unified interface — swap providers without rewriting application logic." },
      { icon: "⚡", title: "Fast Prototyping",  desc: "Built in vanilla JavaScript — no heavy framework, boots instantly, integrates everywhere." },
    ],
    stack: ["JavaScript", "Web APIs", "AI Models", "Vite"],
    architecture: ["Modular API wrapper abstracts provider differences.", "Lightweight vanilla JS UI with zero runtime dependencies."],
    metrics: [],
    learnings: ["Provider abstraction layers pay off when models change — and they always do."],
    links: { github: "https://github.com/chaivala-dot/Ai-bridge" },
  },

  darecoins: {
    type: "Web App · 2026",
    title: "DareCoins",
    sub: "Gamified Economy",
    gradient: "linear-gradient(120deg, #d8c4c4, #e5e0d4, #b0193140)",
    meta: [{ label: "Role", value: "Developer" }, { label: "Year", value: "2026" }],
    overview: `DareCoins turns social dares into a fun, gamified digital economy. Users challenge each other to dares and earn DareCoins on completion — tracked on global leaderboards.`,
    challenge: `Keeping users engaged in a dare economy requires real-time state sync, satisfying animations, and a reward loop that feels genuinely fun rather than mechanical.`,
    solution: `Real-time state synchronisation with socket-driven updates, CSS animations for reward moments, and a leaderboard that updates live to trigger competitiveness.`,
    features: [
      { icon: "🎯", title: "Dare Economy",   desc: "Issue dares, accept challenges, earn DareCoins on verified completion." },
      { icon: "🏆", title: "Leaderboard",    desc: "Real-time global ranking updates as DareCoins are earned." },
    ],
    stack: ["JavaScript", "HTML5 Canvas", "CSS Animations", "Sockets"],
    architecture: ["Socket-driven state keeps all clients in sync without polling.", "Canvas-based animations for dare completion reward moments."],
    metrics: [],
    learnings: ["Real-time UX lives or dies by the perceived latency — even a 50ms delay breaks the feel of 'live'."],
    links: { github: "https://github.com/chaivala-dot/DareCoins-V-0.1" },
  },

  eventsphere: {
    type: "Mobile App · 2026",
    title: "EventSphere",
    sub: "Event Discovery App",
    gradient: "linear-gradient(120deg, #c4c5d8, #e5e0d4, #4019b040)",
    meta: [{ label: "Role", value: "Mobile Developer" }, { label: "Year", value: "2026" }],
    overview: `EventSphere is a cross-platform mobile app for discovering and managing events globally. Built with Flutter for a native-feeling experience on both iOS and Android from a single codebase.`,
    challenge: `Building a single codebase that feels truly native on both iOS and Android — with smooth animations, maps integration, and 60fps scrolling — is deceptively hard.`,
    solution: `Flutter with heavily optimised Dart code, real-time maps via Google Maps API, integrated ticketing, and smooth page transitions that respect each platform's motion conventions.`,
    features: [
      { icon: "🗺️", title: "Real-time Maps",   desc: "Discover nearby events on an interactive Google Maps integration." },
      { icon: "📱", title: "Cross-platform",    desc: "Single Dart codebase compiled natively for iOS and Android." },
    ],
    stack: ["Flutter", "Dart", "Firebase", "Google Maps API"],
    architecture: ["Flutter widget tree with lazy rendering for smooth 60fps list scrolling.", "Firebase real-time database for live event updates."],
    metrics: [],
    learnings: ["Dart's strong typing catches integration bugs early — especially useful across platform boundary code."],
    links: { github: "https://github.com/chaivala-dot/EventSphere-App" },
  },

  coursemarketplace: {
    type: "Web Platform · 2026",
    title: "Course Marketplace",
    sub: "Educational Hub",
    gradient: "linear-gradient(120deg, #d8d0c4, #e5e0d4, #a3b01940)",
    meta: [{ label: "Role", value: "Developer" }, { label: "Year", value: "2026" }],
    overview: `Course Marketplace is an architectural exploration of how to build a scalable content platform using fundamental web primitives — no heavy framework, semantic HTML, and vanilla JavaScript.`,
    challenge: `Most course platforms are over-engineered with heavy frameworks that add latency. The challenge was proving that fundamental web primitives could deliver a great experience with perfect Lighthouse scores.`,
    solution: `Semantic HTML, CSS Grid catalogue, persistent cart via LocalStorage, minimal video player interface, and fluid typography — all with zero framework overhead.`,
    features: [
      { icon: "📚", title: "Course Catalogue",  desc: "CSS Grid layout with fluid typography and semantic HTML structure." },
      { icon: "🛒", title: "Persistent Cart",   desc: "LocalStorage-backed cart state survives page refreshes without a backend." },
    ],
    stack: ["HTML5", "Vanilla JavaScript", "CSS3 Grid", "LocalStorage"],
    architecture: ["Zero-framework approach: pure DOM APIs for all interactivity.", "LocalStorage for cart persistence with serialised JSON state."],
    metrics: [],
    learnings: ["Removing the framework removes the abstraction tax — sometimes that's exactly what a project needs."],
    links: { github: "https://github.com/chaivala-dot/course-marketplace" },
  },

  portfolio: {
    type: "Web · 2026",
    title: "Portfolio v3",
    sub: "Editorial Personal Site",
    gradient: "linear-gradient(120deg, #d8c4d5, #e5e0d4, #a119b040)",
    meta: [{ label: "Role", value: "Designer + Developer" }, { label: "Year", value: "2026" }],
    overview: `This very site. Built entirely from scratch to enforce a strict editorial and print-inspired design language — no generic templates, no Bootstrap, no equal column grids.`,
    challenge: `Most developer portfolios look identical — centered cards, Inter font, purple gradients. The challenge was designing something that felt genuinely different without being illegible.`,
    solution: `Heavy usage of Bodoni Moda serif, asymmetric hero, physics-based 'messy desk' element with draggable photos, anti-generic layout rules, and Intersection Observer-driven scroll reveals.`,
    features: [
      { icon: "🖼️", title: "Messy Desk Hero",  desc: "Draggable scattered photos with CSS parallax depth — each photo has its own parallax depth variable." },
      { icon: "🐱", title: "Pretext Cat",       desc: "Text wraps around the Oneko cat in real time using a custom canvas-based layout engine." },
    ],
    stack: ["DOM Physics", "Vanilla CSS", "Intersection Observer API", "HTML5"],
    architecture: ["CSS custom properties drive parallax depth per element — no JS in the hot render path.", "Pretext canvas layout engine re-flows text around the animated DOM cat in real time."],
    metrics: [],
    learnings: ["Anti-generic design constraints force creativity — restrictions are a feature, not a limitation."],
    links: { github: "https://github.com/chaivala-dot/portfolio" },
  },
};

// ── DOM refs ──
const overlay       = document.getElementById('projectOverlay');
const btnClose      = document.getElementById('btnCloseOverlay');
const ovType        = document.getElementById('ovType');
const ovTitle       = document.getElementById('ovTitle');
const ovSub         = document.getElementById('ovSub');
const ovDesc        = document.getElementById('ovDesc');
const ovMeta        = document.getElementById('ovMeta');
const ovChallenge   = document.getElementById('ovChallenge');
const ovSolution    = document.getElementById('ovSolution');
const ovFeatures    = document.getElementById('ovFeatures');
const ovStack       = document.getElementById('ovStack');
const ovArch        = document.getElementById('ovArch');
const ovLearn       = document.getElementById('ovLearn');
const ovMetrics     = document.getElementById('ovMetrics');
const ovLinks       = document.getElementById('ovLinks');
const ovCSWrap      = document.getElementById('ovCSWrap');
const ovFeaturesWrap= document.getElementById('ovFeaturesWrap');
const ovArchWrap    = document.getElementById('ovArchWrap');
const ovLearnWrap   = document.getElementById('ovLearnWrap');
const ovMetricsWrap = document.getElementById('ovMetricsWrap');
const ovGradientBg  = document.querySelector('.ov-abstract-gradient');

// Attach listeners to all "View Case Study" buttons
document.querySelectorAll('.open-case').forEach(btn => {
  btn.addEventListener('click', () => {
    const id = btn.getAttribute('data-id');
    const p  = projectData[id];
    if (!p) return;

    // Header
    ovType.textContent  = p.type;
    ovTitle.textContent = p.title;
    ovSub.textContent   = p.sub;

    // Gradient
    ovGradientBg.style.background = p.gradient;

    // Meta row
    ovMeta.innerHTML = (p.meta || []).map(m =>
      `<div class="ov-meta-cell"><span class="ov-meta-label mono">${m.label}</span><span class="ov-meta-val">${m.value}</span></div>`
    ).join('');

    // Overview
    ovDesc.innerHTML = `<p>${p.overview}</p>`;

    // Challenge / Solution
    const hasCS = p.challenge && p.solution;
    ovCSWrap.style.display = hasCS ? '' : 'none';
    if (hasCS) {
      ovChallenge.innerHTML = `<p>${p.challenge}</p>`;
      ovSolution.innerHTML  = `<p>${p.solution}</p>`;
    }

    // Features
    const hasFeat = p.features && p.features.length;
    ovFeaturesWrap.style.display = hasFeat ? '' : 'none';
    if (hasFeat) {
      ovFeatures.innerHTML = p.features.map(f =>
        `<div class="ov-feat-card"><div class="ov-feat-icon">${f.icon}</div><div class="ov-feat-title mono">${f.title}</div><div class="ov-feat-desc">${f.desc}</div></div>`
      ).join('');
    }

    // Stack
    ovStack.innerHTML = p.stack.map(s => `<div class="ov-stack-item">${s}</div>`).join('');

    // Architecture
    const hasArch = p.architecture && p.architecture.length;
    ovArchWrap.style.display = hasArch ? '' : 'none';
    if (hasArch) {
      ovArch.innerHTML = p.architecture.map((pt, i) =>
        `<div class="ov-arch-step"><span class="ov-arch-num mono">${String(i+1).padStart(2,'0')}</span><p>${pt}</p></div>`
      ).join('');
    }

    // Learnings
    const hasLearn = p.learnings && p.learnings.length;
    ovLearnWrap.style.display = hasLearn ? '' : 'none';
    if (hasLearn) {
      ovLearn.innerHTML = p.learnings.map((l, i) =>
        `<div class="ov-learn-item"><span class="ov-learn-num mono">${String(i+1).padStart(2,'0')}</span><p>${l}</p></div>`
      ).join('');
    }

    // Metrics
    const hasMetrics = p.metrics && p.metrics.length;
    ovMetricsWrap.style.display = hasMetrics ? '' : 'none';
    if (hasMetrics) {
      ovMetrics.innerHTML = p.metrics.map(m =>
        `<div class="ov-metric"><div class="ov-metric-val">${m.value}</div><div class="ov-metric-label mono">${m.label}</div></div>`
      ).join('');
    }

    // Links
    let linksHTML = '';
    if (p.links?.live)   linksHTML += `<a href="${p.links.live}"   target="_blank" class="proj-cta mono ov-link-live">Live Demo →</a>`;
    if (p.links?.github) linksHTML += `<a href="${p.links.github}" target="_blank" class="proj-cta mono ov-link-gh">View on GitHub →</a>`;
    ovLinks.innerHTML = linksHTML;

    // Scroll overlay back to top, then open
    overlay.querySelector('.overlay-content').scrollTop = 0;
    overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  });
});

// Close logic
if (btnClose) {
  btnClose.addEventListener('click', () => {
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  });
}
if (overlay) {
  overlay.addEventListener('click', e => {
    if (e.target.classList.contains('overlay-bg')) {
      overlay.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  });
}

// ── CUSTOM CURSOR ──────────────────────────────────────────
const cursorEl = document.getElementById('customCursor');
if (cursorEl) {
  document.addEventListener('mousemove', e => {
    cursorEl.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
  });
  document.querySelectorAll('a, button, .cb-group label').forEach(el => {
    el.addEventListener('mouseenter', () => cursorEl.classList.add('hover'));
    el.addEventListener('mouseleave', () => cursorEl.classList.remove('hover'));
  });
}

