'use client';

import { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Hero3D = dynamic(() => import('@/components/Hero3D'), { ssr: false });

export default function Home() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      // Hero words stagger
      gsap.to('.hero-title .word', {
        y: 0,
        duration: 1.1,
        stagger: 0.07,
        ease: 'expo.out',
        delay: 0.1,
      });

      gsap.to('#hero-eyebrow', { opacity: 1, y: 0, duration: 0.8, delay: 0.4, ease: 'expo.out' });
      gsap.to('#hero-subtitle', { opacity: 1, y: 0, duration: 0.8, delay: 0.7, ease: 'expo.out' });
      gsap.to('#hero-cta', { opacity: 1, y: 0, duration: 0.8, delay: 0.9, ease: 'expo.out' });

      // About heading reveal
      document.querySelectorAll('.reveal-text .inner').forEach((el) => {
        gsap.to(el, {
          y: 0,
          duration: 1,
          ease: 'expo.out',
          scrollTrigger: { trigger: el, start: 'top 88%' },
        });
      });

      // Skill bars
      document.querySelectorAll<HTMLElement>('.skill-bar-fill').forEach((bar) => {
        const w = Number.parseFloat(bar.dataset.width ?? '0');
        gsap.to(bar, {
          scaleX: Number.isFinite(w) ? w : 0,
          duration: 1.4,
          ease: 'expo.out',
          scrollTrigger: { trigger: bar, start: 'top 90%' },
        });
      });

      // Counter animation
      document.querySelectorAll<HTMLElement>('.count-num').forEach((el) => {
        const target = Number.parseInt(el.dataset.target ?? '0', 10);
        ScrollTrigger.create({
          trigger: el,
          start: 'top 85%',
          once: true,
          onEnter: () => {
            let start = 0;
            const step = () => {
              start += Math.ceil(target / 30);
              if (start >= target) {
                el.textContent = String(target);
                return;
              }
              el.textContent = String(start);
              requestAnimationFrame(step);
            };
            requestAnimationFrame(step);
          },
        });
      });

      // Timeline items
      document.querySelectorAll('.timeline-item').forEach((item) => {
        gsap.to(item, {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: 'expo.out',
          scrollTrigger: { trigger: item, start: 'top 85%' },
        });
      });

      // Project items
      document.querySelectorAll('.project-item').forEach((item, i) => {
        gsap.fromTo(
          item,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: 'expo.out',
            delay: i * 0.08,
            scrollTrigger: { trigger: item, start: 'top 88%' },
          },
        );
      });

      // Section headings
      document.querySelectorAll('.section-heading').forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'expo.out',
            scrollTrigger: { trigger: el, start: 'top 85%' },
          },
        );
      });

      // Contact heading
      gsap.fromTo(
        '.contact-heading',
        { opacity: 0, y: 60 },
        { opacity: 1, y: 0, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: '.contact-heading', start: 'top 80%' } },
      );
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef}>
      <section className="hero" id="home">
        <div className="hero-bg-grid" />
        <Hero3D />

        <div className="hero-counter">
          <span style={{ color: 'var(--accent)' }}>001</span> / 005
        </div>

        <div className="hero-scroll-indicator">
          <div className="scroll-line" />
          <span>Scroll</span>
        </div>

        <div className="hero-eyebrow" id="hero-eyebrow">
          Full Stack Developer — 2024
        </div>

        <h1 className="hero-title" id="hero-title">
          <span className="line">
            <span className="word">Building</span>
            <span className="word">&nbsp;</span>
            <span className="word">digital</span>
          </span>
          <span className="line">
            <span className="word">
              <em>experiences</em>
            </span>
          </span>
          <span className="line">
            <span className="word">that</span>
            <span className="word">&nbsp;</span>
            <span className="word">matter</span>
          </span>
        </h1>

        <div className="hero-subtitle-row">
          <p className="hero-subtitle" id="hero-subtitle">
            I&apos;m Mayank — a full stack developer who crafts clean, performant, and visually stunning web experiences from backend to browser.
          </p>
          <div className="hero-cta-group" id="hero-cta">
            <a href="#work" className="btn-primary interactive">
              View Work
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M2 7h10M7 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
            <a href="#contact" className="btn-outline interactive">
              Get in Touch
            </a>
          </div>
        </div>
      </section>

      <div className="marquee-section" aria-hidden="true">
        <div className="marquee-track">
          <div className="marquee-item">
            <div className="marquee-dot" />
            React
          </div>
          <div className="marquee-item">
            <div className="marquee-dot" />
            Node.js
          </div>
          <div className="marquee-item">
            <div className="marquee-dot" />
            TypeScript
          </div>
          <div className="marquee-item">
            <div className="marquee-dot" />
            Next.js
          </div>
          <div className="marquee-item">
            <div className="marquee-dot" />
            PostgreSQL
          </div>
          <div className="marquee-item">
            <div className="marquee-dot" />
            AWS
          </div>
          <div className="marquee-item">
            <div className="marquee-dot" />
            Docker
          </div>
          <div className="marquee-item">
            <div className="marquee-dot" />
            GraphQL
          </div>
          <div className="marquee-item">
            <div className="marquee-dot" />
            Redis
          </div>
          <div className="marquee-item">
            <div className="marquee-dot" />
            Tailwind CSS
          </div>
          <div className="marquee-item">
            <div className="marquee-dot" />
            React
          </div>
          <div className="marquee-item">
            <div className="marquee-dot" />
            Node.js
          </div>
          <div className="marquee-item">
            <div className="marquee-dot" />
            TypeScript
          </div>
          <div className="marquee-item">
            <div className="marquee-dot" />
            Next.js
          </div>
          <div className="marquee-item">
            <div className="marquee-dot" />
            PostgreSQL
          </div>
          <div className="marquee-item">
            <div className="marquee-dot" />
            AWS
          </div>
          <div className="marquee-item">
            <div className="marquee-dot" />
            Docker
          </div>
          <div className="marquee-item">
            <div className="marquee-dot" />
            GraphQL
          </div>
          <div className="marquee-item">
            <div className="marquee-dot" />
            Redis
          </div>
          <div className="marquee-item">
            <div className="marquee-dot" />
            Tailwind CSS
          </div>
        </div>
      </div>

      <section className="about-section" id="about">
        <div className="section-label">About Me</div>
        <div className="about-grid">
          <div className="about-image-wrapper">
            <div className="about-image-placeholder interactive" role="img" aria-label="Profile photo placeholder">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <circle cx="24" cy="16" r="8" stroke="currentColor" strokeWidth="1.5" />
                <path d="M6 40c0-9.941 8.059-18 18-18s18 8.059 18 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <span>
                Your photo
                <br />
                goes here
              </span>
            </div>
            <div className="about-image-tag">Open to Work ✦</div>
          </div>

          <div className="about-content">
            <div className="section-label">Who I Am</div>
            <h2 className="about-heading reveal-text">
              <span className="inner">
                Crafting code with
                <br />
                <em>purpose &amp; precision.</em>
              </span>
            </h2>
            <div className="about-body">
              <p>
                I&apos;m Mayank, a full stack developer passionate about building products that live at the intersection of engineering excellence and great design.
                I believe the best software is both technically robust and delightful to use.
              </p>
              <p>
                From architecting scalable APIs to polishing pixel-perfect interfaces, I bring a holistic approach to every project — thinking about performance,
                maintainability, and the human being on the other side of the screen.
              </p>
            </div>

            <div className="about-stats">
              <div className="stat">
                <div className="stat-num">
                  <span className="count-num" data-target="3">
                    0
                  </span>
                  <span>+</span>
                </div>
                <div className="stat-label">Years Exp.</div>
              </div>
              <div className="stat">
                <div className="stat-num">
                  <span className="count-num" data-target="24">
                    0
                  </span>
                  <span>+</span>
                </div>
                <div className="stat-label">Projects Built</div>
              </div>
              <div className="stat">
                <div className="stat-num">
                  <span className="count-num" data-target="12">
                    0
                  </span>
                  <span>+</span>
                </div>
                <div className="stat-label">Technologies</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="work-section" id="work">
        <div className="work-header">
          <div>
            <div className="section-label">Selected Work</div>
            <h2 className="section-heading">
              Featured
              <br />
              <em>Projects</em>
            </h2>
          </div>
          <a href="#work" className="work-all-link interactive">
            All Work
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3 8h10M8 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>

        <div className="project-list">
          <Link href="/work/ecommerce-platform" className="project-item interactive" style={{ textDecoration: 'none', cursor: 'none' }}>
            <div className="project-num">01</div>
            <div className="project-info">
              <div className="project-title">E-Commerce Platform</div>
              <div className="project-tags">
                <span className="tag">Next.js</span>
                <span className="tag">Node.js</span>
                <span className="tag">PostgreSQL</span>
                <span className="tag">Stripe</span>
              </div>
            </div>
            <div className="project-image-preview" aria-hidden="true">
              <div className="project-image-preview-inner proj-gradient-1">Preview</div>
            </div>
          </Link>

          <Link href="/work/realtime-collab" className="project-item interactive" style={{ textDecoration: 'none', cursor: 'none' }}>
            <div className="project-num">02</div>
            <div className="project-info">
              <div className="project-title">Real-time Collaboration Tool</div>
              <div className="project-tags">
                <span className="tag">React</span>
                <span className="tag">WebSockets</span>
                <span className="tag">Redis</span>
                <span className="tag">TypeScript</span>
              </div>
            </div>
            <div className="project-image-preview" aria-hidden="true">
              <div className="project-image-preview-inner proj-gradient-2">Preview</div>
            </div>
          </Link>

          <Link href="/work/ai-dashboard" className="project-item interactive" style={{ textDecoration: 'none', cursor: 'none' }}>
            <div className="project-num">03</div>
            <div className="project-info">
              <div className="project-title">AI-Powered Dashboard</div>
              <div className="project-tags">
                <span className="tag">Python</span>
                <span className="tag">FastAPI</span>
                <span className="tag">OpenAI</span>
                <span className="tag">D3.js</span>
              </div>
            </div>
            <div className="project-image-preview" aria-hidden="true">
              <div className="project-image-preview-inner proj-gradient-3">Preview</div>
            </div>
          </Link>

          <Link href="/work/cloud-infra-cli" className="project-item interactive" style={{ textDecoration: 'none', cursor: 'none' }}>
            <div className="project-num">04</div>
            <div className="project-info">
              <div className="project-title">Cloud Infrastructure CLI</div>
              <div className="project-tags">
                <span className="tag">Go</span>
                <span className="tag">AWS</span>
                <span className="tag">Docker</span>
                <span className="tag">Terraform</span>
              </div>
            </div>
            <div className="project-image-preview" aria-hidden="true">
              <div className="project-image-preview-inner proj-gradient-4">Preview</div>
            </div>
          </Link>
        </div>
      </section>

      <div className="horizontal-section" aria-label="Technologies I work with">
        <div className="section-label">Tech I Work With</div>
        <div className="h-scroll-track">
          <div className="h-card interactive">
            <div className="h-card-image proj-gradient-1">React + Next.js</div>
            <div className="h-card-body">
              <div className="h-card-title">Frontend Ecosystem</div>
              <div className="h-card-sub">React · Next.js · TypeScript · Tailwind</div>
            </div>
          </div>
          <div className="h-card interactive">
            <div className="h-card-image proj-gradient-2">Node.js + APIs</div>
            <div className="h-card-body">
              <div className="h-card-title">Backend &amp; APIs</div>
              <div className="h-card-sub">Node.js · Express · FastAPI · GraphQL</div>
            </div>
          </div>
          <div className="h-card interactive">
            <div className="h-card-image proj-gradient-3">Databases</div>
            <div className="h-card-body">
              <div className="h-card-title">Data Layer</div>
              <div className="h-card-sub">PostgreSQL · MongoDB · Redis · Prisma</div>
            </div>
          </div>
          <div className="h-card interactive">
            <div className="h-card-image proj-gradient-4">DevOps &amp; Cloud</div>
            <div className="h-card-body">
              <div className="h-card-title">Infra &amp; Deployment</div>
              <div className="h-card-sub">AWS · Docker · GitHub Actions · Vercel</div>
            </div>
          </div>
          <div className="h-card interactive">
            <div className="h-card-image proj-gradient-1">Testing</div>
            <div className="h-card-body">
              <div className="h-card-title">Quality Assurance</div>
              <div className="h-card-sub">Jest · Cypress · Playwright · Vitest</div>
            </div>
          </div>
          <div className="h-card interactive">
            <div className="h-card-image proj-gradient-2">React + Next.js</div>
            <div className="h-card-body">
              <div className="h-card-title">Frontend Ecosystem</div>
              <div className="h-card-sub">React · Next.js · TypeScript · Tailwind</div>
            </div>
          </div>
          <div className="h-card interactive">
            <div className="h-card-image proj-gradient-3">Node.js + APIs</div>
            <div className="h-card-body">
              <div className="h-card-title">Backend &amp; APIs</div>
              <div className="h-card-sub">Node.js · Express · FastAPI · GraphQL</div>
            </div>
          </div>
          <div className="h-card interactive">
            <div className="h-card-image proj-gradient-4">Databases</div>
            <div className="h-card-body">
              <div className="h-card-title">Data Layer</div>
              <div className="h-card-sub">PostgreSQL · MongoDB · Redis · Prisma</div>
            </div>
          </div>
          <div className="h-card interactive">
            <div className="h-card-image proj-gradient-1">DevOps &amp; Cloud</div>
            <div className="h-card-body">
              <div className="h-card-title">Infra &amp; Deployment</div>
              <div className="h-card-sub">AWS · Docker · GitHub Actions · Vercel</div>
            </div>
          </div>
          <div className="h-card interactive">
            <div className="h-card-image proj-gradient-2">Testing</div>
            <div className="h-card-body">
              <div className="h-card-title">Quality Assurance</div>
              <div className="h-card-sub">Jest · Cypress · Playwright · Vitest</div>
            </div>
          </div>
        </div>
      </div>

      <section className="skills-section" id="skills">
        <div className="section-label">Expertise</div>
        <h2 className="section-heading" style={{ marginBottom: 64 }}>
          Skills &amp;
          <br />
          <em>Capabilities</em>
        </h2>

        <div className="skills-grid">
          <div className="skill-category">
            <div className="skill-cat-title">Frontend</div>
            <div className="skill-items">
              <div className="skill-item">
                <div className="skill-row">
                  <span className="skill-name">React / Next.js</span>
                  <span className="skill-pct">95%</span>
                </div>
                <div className="skill-bar-bg">
                  <div className="skill-bar-fill" data-width="0.95" />
                </div>
              </div>
              <div className="skill-item">
                <div className="skill-row">
                  <span className="skill-name">TypeScript</span>
                  <span className="skill-pct">90%</span>
                </div>
                <div className="skill-bar-bg">
                  <div className="skill-bar-fill" data-width="0.90" />
                </div>
              </div>
              <div className="skill-item">
                <div className="skill-row">
                  <span className="skill-name">CSS / Animation</span>
                  <span className="skill-pct">88%</span>
                </div>
                <div className="skill-bar-bg">
                  <div className="skill-bar-fill" data-width="0.88" />
                </div>
              </div>
            </div>
          </div>

          <div className="skill-category">
            <div className="skill-cat-title">Backend</div>
            <div className="skill-items">
              <div className="skill-item">
                <div className="skill-row">
                  <span className="skill-name">Node.js / Express</span>
                  <span className="skill-pct">92%</span>
                </div>
                <div className="skill-bar-bg">
                  <div className="skill-bar-fill" data-width="0.92" />
                </div>
              </div>
              <div className="skill-item">
                <div className="skill-row">
                  <span className="skill-name">Python / FastAPI</span>
                  <span className="skill-pct">80%</span>
                </div>
                <div className="skill-bar-bg">
                  <div className="skill-bar-fill" data-width="0.80" />
                </div>
              </div>
              <div className="skill-item">
                <div className="skill-row">
                  <span className="skill-name">PostgreSQL / MongoDB</span>
                  <span className="skill-pct">85%</span>
                </div>
                <div className="skill-bar-bg">
                  <div className="skill-bar-fill" data-width="0.85" />
                </div>
              </div>
            </div>
          </div>

          <div className="skill-category">
            <div className="skill-cat-title">DevOps &amp; Cloud</div>
            <div className="skill-items">
              <div className="skill-item">
                <div className="skill-row">
                  <span className="skill-name">AWS / GCP</span>
                  <span className="skill-pct">78%</span>
                </div>
                <div className="skill-bar-bg">
                  <div className="skill-bar-fill" data-width="0.78" />
                </div>
              </div>
              <div className="skill-item">
                <div className="skill-row">
                  <span className="skill-name">Docker / Kubernetes</span>
                  <span className="skill-pct">75%</span>
                </div>
                <div className="skill-bar-bg">
                  <div className="skill-bar-fill" data-width="0.75" />
                </div>
              </div>
              <div className="skill-item">
                <div className="skill-row">
                  <span className="skill-name">CI/CD Pipelines</span>
                  <span className="skill-pct">82%</span>
                </div>
                <div className="skill-bar-bg">
                  <div className="skill-bar-fill" data-width="0.82" />
                </div>
              </div>
            </div>
          </div>

          <div className="skill-category">
            <div className="skill-cat-title">Soft Skills</div>
            <div className="skill-items">
              <div className="skill-item">
                <div className="skill-row">
                  <span className="skill-name">System Design</span>
                  <span className="skill-pct">87%</span>
                </div>
                <div className="skill-bar-bg">
                  <div className="skill-bar-fill" data-width="0.87" />
                </div>
              </div>
              <div className="skill-item">
                <div className="skill-row">
                  <span className="skill-name">Code Review</span>
                  <span className="skill-pct">90%</span>
                </div>
                <div className="skill-bar-bg">
                  <div className="skill-bar-fill" data-width="0.90" />
                </div>
              </div>
              <div className="skill-item">
                <div className="skill-row">
                  <span className="skill-name">Problem Solving</span>
                  <span className="skill-pct">94%</span>
                </div>
                <div className="skill-bar-bg">
                  <div className="skill-bar-fill" data-width="0.94" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="timeline-section" id="experience">
        <div className="section-label">Experience</div>
        <h2 className="section-heading" style={{ marginBottom: 80 }}>
          Work
          <br />
          <em>History</em>
        </h2>

        <div className="timeline">
          <div className="timeline-item" id="tl-1">
            <div className="timeline-date">2023 — Present</div>
            <div className="timeline-role">Full Stack Developer</div>
            <div className="timeline-company">Your Current Company · Full-time</div>
            <div className="timeline-desc">
              Building scalable web applications with React and Node.js. Architecting microservices, optimizing database performance, and leading frontend development
              across multiple product lines.
            </div>
          </div>
          <div className="timeline-item" id="tl-2">
            <div className="timeline-date">2022 — 2023</div>
            <div className="timeline-role">Frontend Developer</div>
            <div className="timeline-company">Previous Company · Full-time</div>
            <div className="timeline-desc">
              Developed complex React applications with TypeScript. Implemented design systems, performance optimizations, and worked closely with UX to ship
              delightful user experiences.
            </div>
          </div>
          <div className="timeline-item" id="tl-3">
            <div className="timeline-date">2021 — 2022</div>
            <div className="timeline-role">Junior Developer</div>
            <div className="timeline-company">Startup / Agency · Full-time</div>
            <div className="timeline-desc">
              Started my professional journey building web apps, contributing to open source, and rapidly expanding my full stack skillset across diverse client
              projects.
            </div>
          </div>
        </div>
      </section>

      <section className="contact-section" id="contact">
        <div className="contact-eyebrow">Let&apos;s Connect</div>
        <h2 className="contact-heading">
          Got a project
          <br />
          <em>in mind?</em>
        </h2>
        <p className="contact-desc">
          I&apos;m currently open to new opportunities. Whether it&apos;s a freelance project, a full-time role, or just a conversation — reach out.
        </p>
        <a href="mailto:mayank@email.com" className="contact-email interactive">
          mayank@email.com
        </a>

        <div className="social-links">
          <a href="#" className="social-link interactive" title="GitHub">
            GH
          </a>
          <a href="#" className="social-link interactive" title="LinkedIn">
            LI
          </a>
          <a href="#" className="social-link interactive" title="Twitter/X">
            TW
          </a>
          <a href="#" className="social-link interactive" title="Dribbble">
            DR
          </a>
        </div>
      </section>

      <footer>
        <div className="footer-copy">© 2024 Mayank. Built with love &amp; code.</div>
        <a href="#home" className="footer-back-top interactive">
          Back to Top
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M7 12V2M2 7l5-5 5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </footer>
    </div>
  );
}
