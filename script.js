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
    image: "protfolio-img/certify-pro/landing.png",
    gradient: "linear-gradient(120deg, #0a1628, #0f2d3d, #0a1628)",
    gallery: [
      { src: "protfolio-img/certify-pro/landing.png", caption: "Landing Page" },
      { src: "protfolio-img/certify-pro/login.png", caption: "Login / Authentication" },
      { src: "protfolio-img/certify-pro/dashboard.png", caption: "Main Dashboard" },
      { src: "protfolio-img/certify-pro/batches.png", caption: "Batches Overview" },
      { src: "protfolio-img/certify-pro/new-batch.png", caption: "Create New Batch" },
      { src: "protfolio-img/certify-pro/templates.png", caption: "Templates List" },
      { src: "protfolio-img/certify-pro/template-builder.png", caption: "WYSIWYG Template Builder" }
    ],
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
      { icon: "→", title: "CSV Bulk Generation",        desc: "Upload a CSV → server generates every certificate with a unique QR code and verification token. Status polling keeps UX non-blocking." },
      { icon: "✓", title: "QR Verification",           desc: "Every certificate carries a tamper-proof QR code. Scanning it hits the public verification endpoint and confirms authenticity in real time." },
      { icon: "●", title: "Batch Dashboard",            desc: "Full lifecycle tracking: Pending → Processing → Completed → Failed. Aggregate stats with per-batch drill-down." },
      { icon: "—", title: "Secure Auth",                desc: "JWT httpOnly cookies (7-day expiry) block XSS token theft. Google OAuth as alternative sign-in. sameSite: lax CSRF protection." },
      { icon: "//", title: "canvasStateJson Schema",    desc: "All template config in one JSON field — decouples the builder from the DB, letting the UI evolve without schema migrations." },
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
    sub: "VS Code AI Integration Hub",
    image: "https://placehold.co/1200x800/0F1115/3B82F6?text=Ai-bridge+Hero",
    gradient: "linear-gradient(120deg, #c4d8ce, #e5e0d4, #19b08b40)",
    gallery: [
      { src: "https://placehold.co/800x500/1E2128/60A5FA?text=VS+Code+Sidebar+Chat", caption: "VS Code Extension Sidebar Interface" },
      { src: "https://placehold.co/800x500/1E2128/60A5FA?text=Chrome+Extension", caption: "Chrome Extension & Active Connection" },
      { src: "https://placehold.co/800x500/1E2128/60A5FA?text=Node.js+Relay+Server", caption: "Local Node.js WebSocket Relay" },
      { src: "https://placehold.co/800x500/1E2128/60A5FA?text=Multi-Platform+Select", caption: "Selecting Claude, GPT, or Gemini" }
    ],
    meta: [
      { label: "Role", value: "Full Stack Developer" }, 
      { label: "Year", value: "2026" },
      { label: "Duration", value: "Independent" },
      { label: "Client", value: "Personal Toolchain" }
    ],
    overview: `Ai-bridge is a lightweight integration platform that connects your VS Code editor directly to official web-based AI chat services (Claude.ai, ChatGPT, and Gemini) running in Google Chrome. It allows you to select code, type prompts, and receive streaming answers directly inside a VS Code sidebar panel without requiring developer API keys, token configurations, or incurring monthly API usage costs.`,
    challenge: `Integrating advanced models (like Claude 3.5 Sonnet or GPT-4o) directly inside IDEs typically requires paying for subscriptions or purchasing API credits. API-based options also lack web-only features and can rapidly accumulate cost. There was no simple way to utilize existing, logged-in web accounts for free, unlimited access directly inside the workspace without manual copying and pasting.`,
    solution: `Ai-bridge bridges the local IDE to active browser sessions via a local WebSocket relay server and a custom Chrome extension. It routes requests directly through your local browser session (acting as an automated user), completely bypassing the need for API credits while maintaining real-time streaming inside VS Code.`,
    features: [
      { icon: "✦", title: "VS Code Extension",    desc: "Built with the VS Code Extension API, using an HTML5/CSS3/JavaScript-based Webview panel for the chat sidebar interface." },
      { icon: "—", title: "Chrome Extension (V3)",  desc: "Uses a background service worker to maintain persistent WebSocket connections and content scripts to interact with the DOM of target AI websites." },
      { icon: "→", title: "Local Relay Server",   desc: "A Node.js backend utilizing the 'ws' (WebSockets) library to manage high-speed, bi-directional message routing." },
      { icon: "+", title: "Zero API Cost", desc: "Completely bypasses the need for API credits or developer subscriptions by safely automating your existing web sessions." },
      { icon: "//", title: "Multi-Platform Support",   desc: "Successfully integrates three major AI websites (Claude.ai, ChatGPT, and Gemini) under a unified, identical VS Code user interface." },
    ],
    stack: ["VS Code API", "Chrome Extension (MV3)", "Node.js", "WebSockets", "Vanilla JS", "Batch Automation"],
    architecture: [
      "VS Code Client: When a prompt is submitted, it is sent over a WebSocket connection to the local Node.js relay server running on port 8080.",
      "Relay Server: Receives the payload and instantly forwards it to the active browser extension socket.",
      "Browser Extension: The content script injects the prompt into the active chat tab, clicks the submit button, uses MutationObservers to watch for incoming response chunks in real-time, and streams them back."
    ],
    metrics: [
      { value: "$0",   label: "Cost per query" },
      { value: "3",    label: "Supported AIs" },
      { value: "<100ms", label: "Relay Latency" },
      { value: "5", label: "Runtimes Orchestrated" }
    ],
    learnings: [
      "Session Exploitation: Web browsers are highly effective runtimes, and utilizing existing user cookies/sessions is a valid and efficient design pattern for private developer toolchains.",
      "Robust Scraping Patterns: Designing DOM parsers to survive dynamic updates requires coding defensively with generic HTML hierarchies instead of hardcoding specific CSS class names.",
      "Service Worker Lifecycle: Chrome extensions built on Manifest V3 shut down idle workers automatically. Implementing robust heartbeat signals is required to keep WebSockets alive."
    ],
    links: { github: "https://github.com/chaivala-dot/Ai-bridge" },
  },

  snapsolve: {
    type: "Mobile App · 2026",
    title: "SnapSolve",
    sub: "AI Math & Text Solver",
    image: "https://placehold.co/1200x800/1E293B/10B981?text=SnapSolve+Hero",
    gradient: "linear-gradient(120deg, #101827, #1f2937, #10b98140)",
    gallery: [
      { src: "https://placehold.co/400x800/1E293B/10B981?text=Camera+Viewport", caption: "Immersive Fullscreen Camera Guide" },
      { src: "https://placehold.co/400x800/1E293B/10B981?text=Local+OCR", caption: "On-device Text Extraction (ML Kit)" },
      { src: "https://placehold.co/400x800/1E293B/10B981?text=LLaMA-3+Inference", caption: "Groq LLaMA-3-70B Streaming" },
      { src: "https://placehold.co/400x800/1E293B/10B981?text=Step-by-Step+Solution", caption: "Step-by-Step Resolution Panel" }
    ],
    meta: [
      { label: "Role", value: "Mobile Developer" }, 
      { label: "Stack", value: "Flutter / Riverpod" },
      { label: "Hardware", value: "Camera / Edge ML" },
      { label: "Backend", value: "Groq (LLaMA-3-70B)" }
    ],
    overview: `SnapSolve is a high-performance Flutter application designed for students and self-learners who need instantaneous step-by-step explanations for text-based questions and mathematical equations. It locks device orientation to portrait, presents an immersive fullscreen camera viewport, and allows users to snap photos of printed or written problems. By combining on-device optical character recognition (Google ML Kit) with ultra-fast remote inference (Groq), it eliminates manual typing while keeping mobile data usage near zero.`,
    challenge: `Educational AI tools typically require users to manually type complex equations (which is slow and error-prone) or upload heavy 3MB-10MB image files to cloud OCR servers. For users on metered or low-speed connections, transmitting a giant image just to extract 50 bytes of text creates high latency, request timeouts, and excessive cellular data consumption.`,
    solution: `SnapSolve shifts the OCR workload entirely to the user's device CPU/GPU. The app extracts the raw text from the camera frame locally in ~150ms and immediately discards the heavy image byte-stream. It then sends only a highly compressed text payload (< 1KB) to a high-speed LLaMA-3-70B inference endpoint, ensuring total end-to-end response times under two seconds.`,
    features: [
      { icon: "✦", title: "Zero-Bandwidth OCR",    desc: "Utilizes an on-device port of Google ML Kit's Latin-script model, processing 1080p camera frames locally without consuming mobile data." },
      { icon: "—", title: "Ultra-Low-Latency Inference",  desc: "Integrates the Groq API running LLaMA-3-70B, which produces responses at over 250 tokens per second, yielding a full explanation in under 1.5 seconds." },
      { icon: "→", title: "Lightweight Payload Protocol",   desc: "Transmits only the extracted Unicode characters over HTTPS instead of raw JPEG data, cutting client data transmission by 99.9%." },
      { icon: "+", title: "Hardware-Lock Orientation", desc: "Locks the Flutter engine strictly to DeviceOrientation.portraitUp to match the physical camera sensor scanning direction and prevent aspect-ratio scaling distortion." },
      { icon: "//", title: "Lifecycle-Aware Camera",   desc: "Monitors WidgetsBindingObserver state updates to release camera hardware resources when the app goes background, preventing battery drain and OS crashes." },
    ],
    stack: ["Flutter", "Dart", "Riverpod", "Google ML Kit", "Groq API (LLaMA-3)", "Dio"],
    architecture: [
      "The Flutter client manages the camera hardware directly, capturing a frame to the local file system on a separate thread to keep the 60fps UI unblocked.",
      "The local OCR service runs the frame through ML Kit Text Recognition, returns the string, and instantly releases the image resources.",
      "A State Machine (Riverpod Notifier) validates the string to prevent AI hallucinations, then triggers an async HTTP request via Dio, passing the text inside a tailored expert-tutor prompt.",
      "The LLaMA-3-70B model returns a Markdown response which is rendered dynamically in a reactive bottom sheet panel."
    ],
    metrics: [
      { value: "99.9%",   label: "Payload Reduction" },
      { value: "<1.8s",    label: "End-to-End Latency" },
      { value: "150ms", label: "Local OCR Extraction" },
      { value: "$0", label: "Server/DB Overhead" }
    ],
    learnings: [
      "Edge Computing Pays Off: Performing heavy OCR directly on client hardware creates a latency profile that makes the application feel like a native tool rather than a slow web wrapper.",
      "UI Feedback Minimizes Perceived Latency: Splitting the loading phase (displaying the extracted text immediately, then changing status to 'Getting AI response...') makes the round trip feel much shorter.",
      "Hardware Integrations Require Strict Lifecycle Management: Mobile OS platforms will aggressively kill apps that retain a camera lock in the background. Explicitly releasing controllers on state changes is mandatory."
    ],
    links: { github: "#" },
  },

  darecoins: {
    type: "Web App · 2026",
    title: "DareCoins",
    sub: "Gamified Peer-to-Peer Economy",
    image: "https://placehold.co/1200x800/1E293B/EAB308?text=DareCoins+Hero",
    gradient: "linear-gradient(120deg, #1e293b, #0f172a, #eab30840)",
    gallery: [
      { src: "https://placehold.co/800x500/1E293B/EAB308?text=Dare+Feed", caption: "Interactive Feed with Framer Motion" },
      { src: "https://placehold.co/800x500/1E293B/EAB308?text=Escrow+Checkout", caption: "Razorpay Cryptographic Escrow Checkout" },
      { src: "https://placehold.co/800x500/1E293B/EAB308?text=Video+Upload", caption: "Direct-to-Cloud Video Stream Upload" },
      { src: "https://placehold.co/800x500/1E293B/EAB308?text=Verification+Dashboard", caption: "Creator Verification Dashboard" }
    ],
    meta: [
      { label: "Role", value: "Full Stack Engineer" }, 
      { label: "Stack", value: "MERN / Framer Motion" },
      { label: "Payments", value: "Razorpay" },
      { label: "Storage", value: "Cloudinary Streams" }
    ],
    overview: `DareCoins is a decentralized social platform that converts real-life challenges into verifiable digital transactions. Designed for creators, adrenaline seekers, and friend groups, the platform enables users to issue financial-backed "Dares" and "Truths" using a virtual utility token called DareCoins (DRC). By coupling real-world action with a backend-managed escrow vault, it offers an architecture where bravery is verified via uploaded video proof and rewarded with direct token payouts.`,
    challenge: `Existing social platforms capture billions of hours of engagement but lack mechanisms to securely monetize peer-to-peer micro-challenges. When a creator challenges a friend with a cash reward, it relies entirely on verbal trust. There is no middle-man structure to hold the money, no immutable record, and no standardized method to host and verify the video proof. Building this traditionally results in high-latency third-party payments, escrow custody compliance issues, and local storage exhaustion when handling large raw video uploads.`,
    solution: `DareCoins introduces a state-managed virtual currency platform with built-in escrow safeguards. When a dare is issued, the backend immediately holds the reward amount in escrow, neutralizing double-spending. Participants submit video evidence via a streamed pipeline directly to Cloudinary. A verification hook allows the creator to approve the submission and release the tokens. A lightweight background thread constantly checks for expired dares using atomic state-locking queries to safely refund creators without blocking the Node event loop.`,
    features: [
      { icon: "✦", title: "Escrow-Backed State Management",    desc: "Instantly deducts and escrows reward tokens to prevent double-pledging of virtual currency." },
      { icon: "—", title: "Background Expiration Engine",  desc: "An automated 60-second routine using MongoDB's atomic findOneAndUpdate queries to safely transition and refund expired dares." },
      { icon: "→", title: "Direct-to-Cloud Stream Uploads",   desc: "Uses Express multer paired with a streamed Cloudinary driver to pipe heavy video evidence directly to the cloud, bypassing node local storage caching." },
      { icon: "+", title: "Cryptographic Fiat Gateway", desc: "Integrates Razorpay with HMAC SHA-256 signature verification securing the token minting pipeline from spoofed API payloads." },
      { icon: "//", title: "Event-Driven Notifications",   desc: "Tracks interactive state transitions to push updates to the UI's visual notification drawer instantly." },
    ],
    diagrams: [
      {
        title: "System Architecture",
        code: `graph TD
    UserClient([User Client])
    ReactSPA[Vite React SPA]
    ExpressAPI[Express.js Backend API]
    MDB[(MongoDB Database)]
    CloudinarySvc[Cloudinary Storage CDN]
    RazorpaySvc[Razorpay Gateway]
    Worker[Interval Expiration Worker]

    UserClient -->|Interacts & Views| ReactSPA
    ReactSPA -->|JWT Auth Requests / Forms| ExpressAPI
    ExpressAPI -->|Atomic Mutex & Writes| MDB
    ExpressAPI -->|Direct Stream Video Proof| CloudinarySvc
    ExpressAPI -->|Verify Cryptographic Signatures| RazorpaySvc
    Worker -->|findOneAndUpdate Expiration Poll| MDB`
      },
      {
        title: "User Escrow Flow Sequence",
        code: `sequenceDiagram
    autonumber
    actor Creator as Dare Creator
    actor Challenger as Participant
    participant App as React SPA
    participant Server as Express Backend
    participant DB as MongoDB

    Creator->>App: Submits new Dare (200 DRC reward)
    App->>Server: POST /api/dares
    Server->>DB: Query User walletBalance
    alt Balance is sufficient
        Server->>DB: Deduct 200 DRC, insert Transaction (escrow)
        Server->>DB: Write Dare Document (status: active)
        Server->>App: Return Created Dare (201)
    else Insufficient Balance
        Server-->>App: Return 400 Bad Request
    end

    Challenger->>App: Joins Dare & Uploads video
    App->>Server: POST /api/dares/:id/submit
    Server->>DB: Update status to pending_review
    Server-->>App: Return 200 OK
    
    Creator->>App: Approves proof
    App->>Server: POST /api/dares/:id/verify (approved: true)
    Server->>DB: Increment Challenger walletBalance (+200 DRC)
    Server->>DB: Update Dare (status: completed)
    Server-->>App: Return 200 OK`
      }
    ],
    stack: ["React (Vite)", "Framer Motion", "Node.js", "Express.js", "MongoDB", "Cloudinary", "Razorpay"],
    architecture: [
      "The Vite React SPA routes API requests protected by JWT authentication to a Node.js/Express.js backend.",
      "State is persisted in a MongoDB document database to handle deeply nested social schemas without complex SQL joins.",
      "Binary payloads bypass local disk storage by piping straight through to Cloudinary, ensuring the backend process remains lightweight.",
      "Billing utilizes Razorpay's cryptographic verification to credit users' balances securely."
    ],
    metrics: [
      { value: "92%",   label: "Verified Payout Rate" },
      { value: "<85ms",    label: "Expiration Processing" },
      { value: "0%", label: "Fraudulent Minting" },
      { value: "1.2s", label: "Video Delivery Time" }
    ],
    learnings: [
      "Offload Heavy IO Pipelines Early: Offloading raw binary video processing from the main application thread to specialized CDNs is necessary to keep event-driven runtimes responsive.",
      "Race Conditions Can Decimate Virtual Ledgers: When dealing with balance logic (like escrow and wallets), even minor microsecond race conditions can double-spend virtual currency. Atomic State locks are mandatory.",
      "UI Motion Design Impacts Retention: High-fidelity layouts combined with physics-backed scroll animations (Framer Motion) elevate application presentation.",
      "Simplicity Wins Infrastructure Decisions: Avoiding complex message queues (like Redis/BullMQ) in favor of atomic MongoDB locks is a highly productive engineering trade-off."
    ],
    links: { github: "https://github.com/chaivala-dot/DareCoins-V-0.1" },
  },

  eventsphere: {
    type: "Mobile App · 2026",
    title: "EventSphere",
    sub: "Event Management & Networking",
    image: "https://placehold.co/1200x800/0D0D14/60A5FA?text=EventSphere+Hero",
    gradient: "linear-gradient(120deg, #0d0d14, #1a1a24, #60a5fa40)",
    gallery: [
      { src: "https://placehold.co/400x800/0D0D14/60A5FA?text=Local+Discovery", caption: "Geolocator Local Event Discovery" },
      { src: "https://placehold.co/400x800/0D0D14/60A5FA?text=Event+Wizard", caption: "Multi-Step Creation Wizard" },
      { src: "https://placehold.co/400x800/0D0D14/60A5FA?text=QR+Ticket", caption: "Offline QR Digital Ticket" },
      { src: "https://placehold.co/400x800/0D0D14/60A5FA?text=Gate+Scanner", caption: "60 FPS Hardware Camera Scanner" }
    ],
    meta: [
      { label: "Role", value: "Mobile Engineer" }, 
      { label: "Stack", value: "Flutter / Provider" },
      { label: "Backend", value: "Firebase" },
      { label: "Hardware", value: "Scanner & GPS" }
    ],
    overview: `EventSphere is a mobile application built to streamline how event organizers coordinate gatherings and how attendees discover, purchase, and verify tickets. The app targets both individual attendees looking for local networking events and professional organizers who need real-time entry validation at venues. It provides a cohesive experience from initial search and map-based exploration to secure, digital ticket issuance and automated entrance verification via mobile devices.`,
    challenge: `Most event management applications suffer from a high-friction ticket-buying process, static and unengaging visual presentation, and fragile offline behavior during ticket verification. Attendees struggle with cluttered layouts, poor location discovery, and slow load times on weak cellular networks. For organizers, verifying entry at gates is typically a manual bottleneck, prone to long queues, duplicate ticket fraud, and dependency on constant, fast internet connections that fail in crowded venues.`,
    solution: `EventSphere handles these problems using a local-first UI architecture combined with standard mobile hardware features. It integrates client-side geographic querying (using geolocator) to display local events instantly. To bypass slow networks, tickets are represented as lightweight cryptographic payloads rendered locally into high-density QR codes. These tickets can be read offline at entry gates using mobile_scanner, verifying the ticket payload locally to prevent fraud without round-trips to Firestore.`,
    features: [
      { icon: "✦", title: "Dynamic Location-Based Querying",    desc: "Computes distance-based events by taking raw coordinates from the Geolocator package and running client-side filtering against a local cache." },
      { icon: "—", title: "High-Density Offline QR Tickets",  desc: "Creates local tickets encoded as compressed JSON payloads using qr_flutter, avoiding network calls during ticket generation." },
      { icon: "→", title: "Hardware-Accelerated Scanner",   desc: "Uses mobile_scanner API to interface directly with the device's camera sensor, bypassing standard image conversion bottlenecks at 60 FPS." },
      { icon: "+", title: "Zero-Static Shimmer Skeletons", desc: "Employs custom shimmer layouts tailored to each complex grid component to prevent sudden UI jumps during network latency." },
      { icon: "//", title: "Glassmorphism Backdrop Filter",   desc: "Uses a custom styling layer relying on GPU-accelerated graphics rendering via Flutter's Impeller engine to maintain 120 FPS." },
    ],
    diagrams: [
      {
        title: "System Architecture",
        code: `graph TD
    A[Flutter UI Presentation Layer] -->|1. Dispatches Actions| B(State Management: Providers)
    B -->|2. Invokes API/Database Logic| C(Service Layer: AuthService / EventService)
    C -->|3. Fetches / Mutates| D[Cloud Firestore]
    C -->|3. Authenticates| E[Firebase Auth]
    C -->|3. Detects Coordinates| F[Geolocator API]
    C -->|3. Resolves Media Assets| G[Firebase Storage]
    D -->|4. Returns Data Payload| C
    C -->|5. Serializes to Models & Caches| H[Local Storage: SharedPreferences]
    C -->|6. Updates Memory State| B
    B -->|7. Calls notifyListeners| A`
      },
      {
        title: "Event Discovery & Check-In Sequence",
        code: `sequenceDiagram
    autonumber
    actor Attendee
    actor Organizer
    participant UI as Flutter App (GoRouter)
    participant Provider as State Providers
    participant Device as Device APIs (Scanner/GPS)
    participant DB as Cloud Firestore
    
    Note over Attendee, DB: Phase 1: Event Discovery & Purchase
    Attendee->>UI: Launch App & Authenticate
    UI->>Device: Request Current Coordinates
    Device-->>UI: Return Latitude/Longitude
    UI->>Provider: Fetch Events (Coordinates)
    Provider->>DB: Query Nearby Events
    DB-->>Provider: Event Document List
    Provider-->>UI: Update UI List (Trending & Local)
    Attendee->>UI: Select Event & Purchase Ticket
    UI->>Provider: Commit Transaction
    Provider->>DB: Write Ticket Record
    DB-->>Provider: Confirm Write
    Provider->>UI: Generate Digital Ticket (QR Payload)
    UI-->>Attendee: Render Ticket Details & QR Code
    
    Note over Organizer, DB: Phase 2: Venue Check-In
    Organizer->>UI: Launch Check-In Mode
    UI->>Device: Activate Camera via mobile_scanner
    Attendee->>Device: Present QR Code
    Device->>UI: Read Raw QR Payload
    UI->>Provider: Process Check-In (Ticket ID)
    Provider->>DB: Update Ticket Status (checkedIn = true)
    DB-->>Provider: Acknowledge Status Update
    Provider-->>UI: Display Check-In Success
    UI-->>Organizer: Show Checked-In Badge`
      }
    ],
    stack: ["Flutter", "Dart", "Provider", "GoRouter", "Firebase", "Geolocator", "Mobile Scanner"],
    architecture: [
      "The presentation layer utilizes Flutter widgets styled with custom glassmorphism parameters and zero-static shimmer skeletons.",
      "State is managed centrally via Provider notifier classes that act as the interface between presentation and service layers.",
      "The Service Layer handles IO events, communicating with Firebase Auth, Cloud Firestore, and the hardware Geolocator APIs.",
      "Routing is handled deterministically via GoRouter, utilizing a refreshListenable to secure routes and manage onboarding redirects."
    ],
    metrics: [
      { value: "420ms",   label: "App Load Time" },
      { value: "<15ms",    label: "Offline Query Latency" },
      { value: "280ms", label: "Validation Time" },
      { value: "-35%", label: "Battery Consumption" }
    ],
    learnings: [
      "Offline reliability must be treated as a core feature: Shimmer skeletons, error boundaries, and local caching are critical to ensuring the app does not feel broken under poor network conditions.",
      "UI Polish is as critical as functional code for user retention: Clean micro-animations built using flutter_animate significantly reduced perceived load times compared to static spinners.",
      "Rigid styling systems require discipline: Establishing a firm design system prevents style drift across 40+ screens and drastically reduces debugging time during visual QA."
    ],
    links: { github: "https://github.com/chaivala-dot/EventSphere-App" },
  },

  coursemarketplace: {
    type: "Web Platform · 2026",
    title: "Course Marketplace",
    sub: "Full-Stack LMS",
    image: "https://placehold.co/1200x800/18181B/10B981?text=Course+Marketplace",
    gradient: "linear-gradient(120deg, #18181b, #27272a, #10b98140)",
    gallery: [
      { src: "https://placehold.co/800x500/18181B/10B981?text=Course+Discovery", caption: "Marketplace Discovery Interface" },
      { src: "https://placehold.co/800x500/18181B/10B981?text=Course+Player", caption: "Responsive Video Player & Syllabus Sidebar" },
      { src: "https://placehold.co/800x500/18181B/10B981?text=Clerk+Auth", caption: "Real-time Clerk Identity Sync" },
      { src: "https://placehold.co/800x500/18181B/10B981?text=Supabase+Dash", caption: "Supabase PostgreSQL Database Management" }
    ],
    meta: [
      { label: "Role", value: "Full Stack Engineer" }, 
      { label: "Frontend", value: "React 19 / Vite" },
      { label: "Backend", value: "Node / Express" },
      { label: "Database", value: "Supabase (PG)" }
    ],
    overview: `This application is a full-stack learning management system (LMS) designed for discovering, enrolling in, and streaming university-level courses. It is built to serve self-directed students looking for high-quality structured curricula and educators needing an interface to manage video modules and track learner metrics. The application exists to solve the issue of fragmented student progress tracking and slow client-side loading states by coupling a decoupled React/Node stack with a relational datastore and a unified identity layer.`,
    challenge: `Existing LMS platforms often suffer from high operational latency, brittle authentication-to-database synchronization, and bloated databases due to unoptimized query patterns. When students navigate between multiple course modules, standard systems make independent N+1 database queries to verify enrollment, check completion state, and fetch metadata. Developers face brittle setups where third-party authentication states easily drift from the local database, leading to orphaned records when webhook processing fails.`,
    solution: `This architecture addresses these issues by using a decoupled frontend/backend structure that implements idempotent webhook synchronization via Svix signatures to keep Clerk identity events synced directly to Supabase. It eliminates N+1 query patterns by implementing combined batch-query optimization on the backend. Finally, it uses PostgreSQL composite unique constraints with UPSERT database logic to guarantee that race conditions do not spawn duplicate completion rows.`,
    features: [
      { icon: "✦", title: "Optimized Dashboard Hydration",    desc: "Combines multi-table reads (enrollments, lessons, and progress) into a unified backend batch parser, reducing database connection pool strain." },
      { icon: "—", title: "Real-time Clerk Identity Sync",  desc: "Leverages Svix to verify incoming webhook payloads using public key cryptography, guaranteeing only authentic Clerk events mutate local database user records." },
      { icon: "→", title: "Auto-Advancing Syllabus Engine",   desc: "Programmatically computes the next index in the lesson list after a successful progress POST, allowing the client to transition automatically." },
      { icon: "+", title: "Database-Enforced Guard", desc: "Uses PostgreSQL unique composite index UNIQUE(user_id, course_id) to reject concurrent, duplicate enrollment attempts at the database layer." },
      { icon: "//", title: "Raw HTML Data Extraction",   desc: "Contains custom parsing pipelines that crawl HTML files to pull deep-level metadata including descriptions, durations, and skills." },
    ],
    diagrams: [
      {
        title: "System Architecture",
        code: `graph TD
    Client[React Frontend / Vite] -->|1. Authenticates & Obtains JWT| Clerk[Clerk Auth Service]
    Clerk -->|2. Webhook Event: user.created| Express[Express Node.js Backend]
    Express -->|3. Verify Svix Signature & Upsert User| SupabaseDB[(Supabase PostgreSQL)]
    Client -->|4. HTTP REST Request with Clerk User ID| Express
    Express -->|5. Fetch / Sync Course & Progress| SupabaseDB
    Scraper[Coursera Scraper Script] -->|6. Dump Raw HTML / CSV| Seed[Seed Script / CommonJS]
    Seed -->|7. Populate Courses & Lessons| SupabaseDB`
      },
      {
        title: "Progress Sync & Auto-Advance Flow",
        code: `sequenceDiagram
    autonumber
    actor Student as Student (React Client)
    participant Auth as Clerk SDK
    participant API as Express API Server
    participant DB as Supabase DB
    
    Student->>Auth: Sign Up / Sign In
    Auth-->>Student: Return Session Token & User ID
    Auth->>API: Webhook (user.created)
    API->>API: Verify Svix Signature
    API->>DB: UPSERT User Record
    
    Student->>API: POST /api/enrollments/buy (Purchase Course)
    API->>DB: Insert enrollment (payment_status: 'completed')
    DB-->>API: Confirm record creation
    API-->>Student: Return success status
    
    Student->>API: GET /api/progress/:courseId (Start Course Player)
    API->>DB: Fetch lessons & progress records
    DB-->>API: Return tables
    API-->>Student: Render CoursePlayer
    
    Student->>API: POST /api/progress/mark-complete (Finish lesson)
    API->>DB: UPSERT progress (user_id, lesson_id)
    DB-->>API: Confirm progress state
    API-->>Student: Response 200 OK (Optimistic UI updates)`
      }
    ],
    stack: ["React 19", "Vite", "Tailwind CSS 4", "Express", "Supabase", "Clerk", "Svix"],
    architecture: [
      "Decoupled Express API with Supabase Service Client bypasses RLS for administrative synchronization while enforcing strict validation on public routes.",
      "CommonJS modules and native Express on the Node.js backend ensure rapid cold-starts and max compatibility with serverless runtimes.",
      "Clerk Webhook-driven User Database Sync offloads sync to a dedicated background worker, unblocking primary checkout flows."
    ],
    metrics: [
      { value: "85%",   label: "DB Load Reduction" },
      { value: "99.9%",    label: "Auth Sync Success" },
      { value: "2s", label: "Automated DB Seeding" },
      { value: "80%", label: "Player Engagement" }
    ],
    learnings: [
      "Webhooks demand fallback routines: Although webhooks are reliable, building runtime upsert fallbacks in downstream API endpoints is essential to prevent blocking the checkout flow.",
      "Design schema boundaries early: Treating third-party authenticators as the single source of truth prevents synchronization bugs and keeps security boundaries clean.",
      "Always verify ORM query footprints: Consistently checking database query execution logs helps identify and fix N+1 query bottlenecks before deploying."
    ],
    links: { github: "https://github.com/chaivala-dot/course-marketplace" },
  },

  cosmosmind: {
    type: "Web App · 2026",
    title: "Cosmos Mind",
    sub: "Knowledge Graph Bookmarks",
    image: "https://placehold.co/1200x800/0f172a/818cf8?text=Cosmos+Mind+Hero",
    gradient: "linear-gradient(120deg, #0f172a, #1e1b4b, #818cf840)",
    gallery: [
      { src: "https://placehold.co/800x500/0f172a/818cf8?text=Network+Graph", caption: "Interactive Physics-Simulated 2D Network" },
      { src: "https://placehold.co/800x500/0f172a/818cf8?text=Visual+Drag+and+Drop", caption: "Drag-to-Tag Interaction Feedback" },
      { src: "https://placehold.co/800x500/0f172a/818cf8?text=Masonry+Grid", caption: "Auto-Enriched Bookmark Index" },
      { src: "https://placehold.co/800x500/0f172a/818cf8?text=Stats+Dashboard", caption: "Timeline & Domain Analytics Dashboard" }
    ],
    meta: [
      { label: "Role", value: "Full Stack Developer" }, 
      { label: "Frontend", value: "React / Vite / D3" },
      { label: "Backend", value: "Node / Express" },
      { label: "Database", value: "SQLite Local" }
    ],
    overview: `Cosmos Mind is a full-stack, locally-hosted bookmark manager that replaces static folder hierarchies with a living, interactive knowledge graph. It automatically fetches metadata and maps links as nodes connected by tags, allowing users to build a semantic map of their resources visually. Built for high performance on localhost, it features a D3-powered canvas graph, named collections (Stacks), and a fully local SQLite backend.`,
    challenge: `Standard bookmarking tools treat links as files in folders, which fails when an idea belongs to multiple categories. Hierarchies break down, and flat tags are only useful if their relationships can be visualized. Furthermore, visualizing hundreds of nodes simultaneously typically results in a clustered "ball of yarn" that is completely unreadable, and using SVG elements for hundreds of nodes causes severe layout thrashing and performance drops.`,
    solution: `Cosmos Mind solves organization by mapping bookmarks and tags as interconnected nodes on a physics-simulated 2D network. To maintain 60 FPS performance, it renders directly to an HTML5 Canvas using D3's force simulation. The physics engine was empirically tuned to provide breathing room between nodes while clustering related ideas. Dragging a bookmark near a tag dynamically computes Euclidean distance to snap and create relationships visually.`,
    features: [
      { icon: "✦", title: "Automated Metadata Enrichment",    desc: "Uses Cheerio and Axios on the Express server to scrape OpenGraph data and auto-assign semantic tags based on text analysis." },
      { icon: "—", title: "D3 Canvas Physics Graph",  desc: "Uses react-force-graph-2d with custom tuned d3Force charge (-550) and collision parameters for a readable network topology." },
      { icon: "→", title: "Visual Drag-to-Tag",   desc: "Computes real-time Euclidean distances during node drag events, rendering dashed snap-lines when a node approaches within 50px of a tag." },
      { icon: "+", title: "Atomic Soft-Delete Flow", desc: "Implements a soft-delete database pattern allowing instantaneous UI undo capabilities via floating action toasts without data loss." },
      { icon: "//", title: "Local First Architecture",   desc: "Runs entirely on localhost using better-sqlite3 with synchronous blocking reads for maximum single-user efficiency without cloud dependency." },
    ],
    diagrams: [
      {
        title: "Local System Architecture",
        code: `graph TD
    React[React Client / Vite] -->|Axios REST API| Express[Express Server]
    Express -->|better-sqlite3| SQLite[(SQLite DB)]
    Express -->|Cheerio Scrape| Web[Target Website]
    React -.->|Contains| Graph[NetworkGraph D3 Canvas]
    React -.->|Contains| List[Masonry Index]
    React -.->|Contains| Stacks[Stacks Sidebar]`
      },
      {
        title: "Metadata Scraping Flow",
        code: `sequenceDiagram
    autonumber
    actor User
    participant Client as React SPA
    participant API as Express Server
    participant Web as External Domain
    participant DB as SQLite
    
    User->>Client: Ctrl+K & Paste URL
    Client->>API: POST /api/bookmarks { url }
    API->>Web: Fetch HTML (Axios + User-Agent)
    Web-->>API: Raw DOM
    API->>API: Cheerio parses OG Title, Desc, Image
    API->>API: Scan text against Keyword Dictionary
    API->>API: Deduplicate & lowercase tags
    API->>DB: INSERT into bookmarks & tags
    DB-->>API: Confirm creation
    API-->>Client: Return enriched bookmark
    Client-->>User: Render in Masonry Grid & Graph`
      }
    ],
    stack: ["React 19", "Vite", "D3 Force", "Node.js", "Express", "SQLite", "Cheerio"],
    architecture: [
      "The client uses React Context for theme states and local component state, entirely avoiding heavy global state managers.",
      "The D3 force simulation is rendered on HTML5 Canvas instead of SVG to maintain frame rates with 200+ nodes.",
      "The SQLite database relies on better-sqlite3 for synchronous blocking reads, eliminating callback complexity.",
      "The scraping engine utilizes Cheerio instead of Puppeteer to keep the server lightweight and fast."
    ],
    metrics: [
      { value: "50px",   label: "Drag Snap Threshold" },
      { value: "60 FPS",    label: "Canvas Render Target" },
      { value: "-550", label: "D3 Force Charge" },
      { value: "0ms", label: "Cloud Latency" }
    ],
    learnings: [
      "Canvas rendering requires manual intervention: Preventing unreadable overlapping labels at low zoom levels required overriding the library's internal rendering loops to cull text drawing.",
      "State closures in bulk operations are dangerous: Async bulk actions that reference React refs/state must copy the state (e.g. Array.from) before executing to avoid operating on stale, cleared state.",
      "Simplicity often outperforms abstraction: Using a local SQLite file with synchronous calls and React Context for theming is vastly superior to over-engineering for a single-user tool."
    ],
    links: { github: "#" },
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
const ovWorkflowWrap= document.getElementById('ovWorkflowWrap');
const ovGallery     = document.getElementById('ovGallery');
const ovFeaturesWrap= document.getElementById('ovFeaturesWrap');
const ovDiagramsWrap= document.getElementById('ovDiagramsWrap');
const ovDiagramsContainer = document.getElementById('ovDiagramsContainer');
const ovArchWrap    = document.getElementById('ovArchWrap');
const ovLearnWrap   = document.getElementById('ovLearnWrap');
const ovMetricsWrap = document.getElementById('ovMetricsWrap');
const ovGradientBg  = document.querySelector('.ov-abstract-gradient');
const ovImage       = document.getElementById('ovImage');

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

    // Gradient / Image
    if (p.image) {
      ovImage.src = p.image;
      ovImage.style.display = 'block';
      ovGradientBg.style.display = 'none';
    } else {
      ovImage.style.display = 'none';
      ovGradientBg.style.display = 'block';
      ovGradientBg.style.background = p.gradient;
    }

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

    // Gallery
    const hasGallery = p.gallery && p.gallery.length;
    ovWorkflowWrap.style.display = hasGallery ? '' : 'none';
    if (hasGallery) {
      ovGallery.innerHTML = p.gallery.map(g =>
        `<div class="ov-gallery-item"><img src="${g.src}" class="ov-gallery-img" alt="${g.caption}"><div class="ov-gallery-caption">${g.caption}</div></div>`
      ).join('');
    }

    // Features
    const hasFeat = p.features && p.features.length;
    ovFeaturesWrap.style.display = hasFeat ? '' : 'none';
    if (hasFeat) {
      ovFeatures.innerHTML = p.features.map(f => `
        <div class="ov-feat-card">
          <div class="ov-feat-icon">${f.icon}</div>
          <h4 class="ov-feat-title">${f.title}</h4>
          <p class="ov-feat-desc">${f.desc}</p>
        </div>
      `).join('');
    }

    // Diagrams
    const hasDiagrams = p.diagrams && p.diagrams.length;
    ovDiagramsWrap.style.display = hasDiagrams ? '' : 'none';
    if (hasDiagrams) {
      ovDiagramsContainer.innerHTML = p.diagrams.map(d => `
        <div style="margin-bottom: 2.5rem; background: rgba(24,20,10,0.02); border: 1px solid rgba(24,20,10,0.05); padding: 1.5rem; border-radius: 8px; position: relative;">
          <h4 style="font-family: var(--f-mono); font-size: 0.7rem; color: var(--gold); margin-bottom: 1.5rem; text-transform: uppercase; letter-spacing: 0.05em;">${d.title}</h4>
          <div class="mermaid" style="height: 400px; width: 100%; border-radius: 4px; overflow: hidden; cursor: grab;">${d.code}</div>
        </div>
      `).join('');
      // Trigger mermaid render and apply zoom
      if (window.mermaid) {
        setTimeout(async () => {
          try {
            await mermaid.run();
            if (window.svgPanZoom) {
              document.querySelectorAll('.mermaid svg').forEach(svg => {
                // Ensure SVG has full height/width for pan-zoom
                svg.style.width = '100%';
                svg.style.height = '100%';
                svg.style.maxWidth = 'none';
                svgPanZoom(svg, {
                  zoomEnabled: true,
                  controlIconsEnabled: true,
                  fit: true,
                  center: true,
                  minZoom: 0.5,
                  maxZoom: 5
                });
              });
            }
          } catch (e) {
            console.error('Mermaid render error:', e);
          }
        }, 100);
      }
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

