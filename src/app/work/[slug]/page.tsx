'use client';

import { use } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const projects: Record<
    string,
    {
        title: string;
        year: string;
        tagline: string;
        role: string;
        stack: string[];
        desc: string;
        gradient: string;
    }
> = {
    'ecommerce-platform': {
        title: 'E-Commerce Platform',
        year: '2024',
        tagline: 'A full-stack shopping experience built for scale.',
        role: 'Full Stack Developer',
        stack: ['Next.js', 'Node.js', 'PostgreSQL', 'Stripe'],
        desc: 'Built a production-ready e-commerce platform with real-time inventory, multi-currency Stripe checkout, and an admin dashboard. Architected the backend with a microservice-inspired approach — separate services for auth, catalogue, and payments. Achieved sub-200ms TTFB globally via ISR and edge caching.',
        gradient: 'linear-gradient(135deg, #1a1a2e, #16213e)',
    },
    'realtime-collab': {
        title: 'Real-time Collaboration Tool',
        year: '2023',
        tagline: 'Google Docs meets Figma, engineered from scratch.',
        role: 'Full Stack Developer',
        stack: ['React', 'WebSockets', 'Redis', 'TypeScript'],
        desc: 'Designed a multiplayer editing environment with operational transform–style conflict resolution. Used Redis pub/sub to fan-out document changes across server instances. Built a rich-text editor with cursor presence, selection broadcasting, and offline-first sync.',
        gradient: 'linear-gradient(135deg, #0d1117, #161b22)',
    },
    'ai-dashboard': {
        title: 'AI-Powered Dashboard',
        year: '2023',
        tagline: 'Turning raw data into actionable intelligence.',
        role: 'Full Stack Developer',
        stack: ['Python', 'FastAPI', 'OpenAI', 'D3.js'],
        desc: 'Integrated GPT-4 to generate natural language summaries of complex business metrics. Users could query charts via chat. Built a Python microservice for ML inference and a D3.js-driven frontend that animated insights as the AI responded in real time.',
        gradient: 'linear-gradient(135deg, #0f0c29, #302b63)',
    },
    'cloud-infra-cli': {
        title: 'Cloud Infrastructure CLI',
        year: '2022',
        tagline: 'Deploy your entire stack with a single command.',
        role: 'Backend Engineer',
        stack: ['Go', 'AWS', 'Docker', 'Terraform'],
        desc: 'A CLI tool written in Go that abstracts Terraform and AWS SDK calls behind a clean interface. Supports multi-environment deployments, blue-green releases, automatic rollback on health-check failure, and Slack/webhook notifications for pipeline events.',
        gradient: 'linear-gradient(135deg, #1a1a1a, #2d2d2d)',
    },
};

// Reusable animated block — avoids Variants type-narrowing issues
function FadeUp({ delay = 0, children, style }: { delay?: number; children: React.ReactNode; style?: React.CSSProperties }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay, ease: 'easeOut' }}
            style={style}
        >
            {children}
        </motion.div>
    );
}

export default function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);
    const project = projects[slug];

    if (!project) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 24 }}>
                <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.8rem', color: 'var(--text-muted)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                    Project not found
                </p>
                <Link href="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 24px', background: 'var(--accent)', color: '#000', fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '0.8rem', letterSpacing: '0.08em', textTransform: 'uppercase', borderRadius: 100 }}>
                    ← Back Home
                </Link>
            </div>
        );
    }

    return (
        <article style={{ minHeight: '100vh', padding: '140px 48px 120px', maxWidth: 900, margin: '0 auto' }}>
            {/* Back */}
            <FadeUp delay={0} style={{ marginBottom: 64 }}>
                <Link
                    href="/"
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 8,
                        fontFamily: 'DM Mono, monospace',
                        fontSize: '0.72rem',
                        letterSpacing: '0.15em',
                        textTransform: 'uppercase',
                        color: 'var(--text-muted)',
                        transition: 'color 0.3s ease',
                        cursor: 'none',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent)')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
                >
                    ← Back to Work
                </Link>
            </FadeUp>

            {/* Hero banner */}
            <FadeUp delay={0.08} style={{ marginBottom: 72 }}>
                <div
                    style={{
                        width: '100%',
                        aspectRatio: '16/7',
                        borderRadius: 12,
                        background: project.gradient,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '1px solid var(--border)',
                        fontSize: '0.7rem',
                        fontFamily: 'DM Mono, monospace',
                        color: 'rgba(255,255,255,0.18)',
                        letterSpacing: '0.15em',
                        textTransform: 'uppercase',
                    }}
                >
                    Project Preview
                </div>
            </FadeUp>

            {/* Meta row */}
            <FadeUp delay={0.15}>
                <div
                    style={{
                        display: 'flex',
                        gap: 48,
                        paddingBottom: 40,
                        borderBottom: '1px solid var(--border)',
                        marginBottom: 56,
                        flexWrap: 'wrap',
                    }}
                >
                    <div>
                        <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 6 }}>Year</div>
                        <div style={{ fontFamily: 'DM Serif Display, serif', fontSize: '1.2rem', color: 'var(--text-primary)' }}>{project.year}</div>
                    </div>
                    <div>
                        <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 6 }}>Role</div>
                        <div style={{ fontFamily: 'DM Serif Display, serif', fontSize: '1.2rem', color: 'var(--text-primary)' }}>{project.role}</div>
                    </div>
                    <div>
                        <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 6 }}>Stack</div>
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                            {project.stack.map(t => (
                                <span key={t} className="tag">{t}</span>
                            ))}
                        </div>
                    </div>
                </div>
            </FadeUp>

            {/* Title */}
            <FadeUp delay={0.22} style={{ marginBottom: 20, fontFamily: 'DM Mono, monospace', fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                Case Study
            </FadeUp>

            <FadeUp delay={0.28}>
                <h1
                    style={{
                        fontFamily: 'DM Serif Display, serif',
                        fontSize: 'clamp(2.5rem, 6vw, 5rem)',
                        lineHeight: 1,
                        letterSpacing: '-0.03em',
                        color: 'var(--text-primary)',
                        marginBottom: 24,
                    }}
                >
                    {project.title}
                </h1>
                <p style={{ fontFamily: 'DM Serif Display, serif', fontSize: 'clamp(1.1rem, 2.5vw, 1.5rem)', fontStyle: 'italic', color: 'var(--text-secondary)', marginBottom: 56 }}>
                    {project.tagline}
                </p>
            </FadeUp>

            {/* Body */}
            <FadeUp delay={0.35}>
                <p style={{ fontSize: '1.05rem', lineHeight: 1.8, color: 'var(--text-secondary)', maxWidth: 680 }}>
                    {project.desc}
                </p>
            </FadeUp>
        </article>
    );
}
