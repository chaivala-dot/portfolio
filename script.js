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
    type: "Full Stack / 2026",
    title: "CertifyPro",
    sub: "Certificate Generator",
    desc: `<p>CertifyPro is a complete full-stack environment built to automate and manage the generation of professional certificates.</p><p>Instead of manually creating certificates for course attendees or event participants, this application provides highly customizable templates which can bulk-generate personalized, print-ready certificates in seconds.</p><p>Built entirely on a modern Node.js and TypeScript architecture to ensure strict typing and robust data handling.</p>`,
    stack: ["TypeScript", "Node.js", "React", "MongoDB"],
    gradient: "linear-gradient(120deg, #d8d2c4, #e5e0d4, #b0721940)"
  },
  aibridge: {
    type: "Web App / 2026",
    title: "Ai-bridge",
    sub: "AI Integration Platform",
    desc: `<p>Ai-bridge serves as the missing link between powerful foundational AI models and every-day productivity tools.</p><p>It is designed to cleanly expose a flexible API and interface that lets developers plug large language model reasoning capabilities directly into their local development environments or custom web apps.</p><p>Responsive, modular, and built natively in JavaScript for high accessibility and fast prototyping.</p>`,
    stack: ["JavaScript", "Web APIs", "AI Models", "Vite"],
    gradient: "linear-gradient(120deg, #c4d8ce, #e5e0d4, #19b08b40)"
  },
  darecoins: {
    type: "Web App / 2026",
    title: "DareCoins",
    sub: "Gamified Economy",
    desc: `<p>DareCoins turns social dares into a fun, gamified digital economy.</p><p>Users can publicly challenge friends or colleagues to complete dares. Upon satisfying the proof of completion, users are rewarded with "DareCoins", which can be collected and tracked on global leaderboards.</p><p>The platform required implementing real-time state synchronization and a highly interactive, animated user interface to keep engagement very high.</p>`,
    stack: ["JavaScript", "HTML5 Canvas", "CSS Animations", "Sockets"],
    gradient: "linear-gradient(120deg, #d8c4c4, #e5e0d4, #b0193140)"
  },
  eventsphere: {
    type: "Mobile App / 2026",
    title: "EventSphere",
    sub: "Event Discovery App",
    desc: `<p>EventSphere is a single, unified cross-platform mobile application natively compiled for both iOS and Android via Flutter.</p><p>The app enables users to seamlessly discover local workshops, tech meetups, and creative gatherings around the world. It provides real-time maps, integrated ticketing, and robust searching mechanisms.</p><p>The UI relies heavily on beautiful imagery, smooth page transitions, and heavily optimized Dart code to maintain 60FPS scrolling across all devices.</p>`,
    stack: ["Flutter", "Dart", "Firebase", "Google Maps API"],
    gradient: "linear-gradient(120deg, #c4c5d8, #e5e0d4, #4019b040)"
  },
  coursemarketplace: {
    type: "Web Platform / 2026",
    title: "Course Marketplace",
    sub: "Educational Hub",
    desc: `<p>Course Marketplace is an architectural exploration of how to build a scalable content platform using fundamental web primitives.</p><p>By relying tightly on semantic HTML and vanilla JavaScript rather than a heavy framework, the application boots instantly and achieves a perfect 100 Lighthouse performance score.</p><p>It features a clean catalogue grid, persistent cart state, a minimal video player interface, and elegant fluid typography.</p>`,
    stack: ["HTML5", "Vanilla JavaScript", "CSS3 Grid", "LocalStorage"],
    gradient: "linear-gradient(120deg, #d8d0c4, #e5e0d4, #a3b01940)"
  },
  portfolio: {
    type: "Web / 2026",
    title: "Portfolio Setup",
    sub: "Creative Directory",
    desc: `<p>This very website. Rather than using generic templates or Bootstrap, this portfolio was built entirely from scratch to enforce a strict editorial and print-inspired design language.</p><p>It utilizes specific constraints: no equal column grids, heavy usage of the beautiful Bodoni Moda serif, and a physics-based interactive 'messy desk' hero element that forces the user to engage with the DOM.</p><p>A personal playground for exploring anti-generic UI theory.</p>`,
    stack: ["DOM Physics", "Vanilla CSS", "Intersection Observer API", "HTML5"],
    gradient: "linear-gradient(120deg, #d8c4d5, #e5e0d4, #a119b040)"
  }
};

const overlay = document.getElementById('projectOverlay');
const btnClose = document.getElementById('btnCloseOverlay');

const ovType = document.getElementById('ovType');
const ovTitle = document.getElementById('ovTitle');
const ovSub = document.getElementById('ovSub');
const ovDesc = document.getElementById('ovDesc');
const ovStack = document.getElementById('ovStack');
const ovGithub = document.getElementById('ovGithub');
const ovGradientBg = document.querySelector('.ov-abstract-gradient');

// Attach listeners to all "View Case Study" buttons
document.querySelectorAll('.open-case').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const id = btn.getAttribute('data-id');
    const ghLink = btn.getAttribute('data-github');
    const p = projectData[id];
    
    if (p) {
      ovType.textContent = p.type;
      ovTitle.textContent = p.title;
      ovSub.textContent = p.sub;
      ovDesc.innerHTML = p.desc;
      
      // Build stack list
      ovStack.innerHTML = p.stack.map(s => `<div class="ov-stack-item">${s}</div>`).join('');
      
      ovGithub.href = ghLink;
      ovGradientBg.style.background = p.gradient;
      
      // Open overlay and prevent page scroll
      overlay.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
  });
});

// Close logic
if (btnClose) {
  btnClose.addEventListener('click', () => {
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  });
}

// Close on background click
if (overlay) {
  overlay.addEventListener('click', (e) => {
    if (e.target.classList.contains('overlay-bg')) {
      overlay.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  });
}



