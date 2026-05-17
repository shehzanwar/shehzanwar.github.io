// src/components/islands/Nav.tsx
// client:load — React island. Zero external animation libraries.
// Pointer events: onPointerEnter / onPointerLeave only (never onMouseEnter).
// Panel: single shared container, all panels always in DOM (opacity-switched).
// will-change: transform present only while panel is open.

import { useState, useRef, useEffect, useLayoutEffect, useCallback } from 'react';
import { cn } from '../../lib/cn';

// ─── Types ────────────────────────────────────────────────────────

type PanelKey = 'Projects';

interface PanelDims {
  width: number;
  height: number;
}

const PANEL_KEYS: readonly PanelKey[] = ['Projects'] as const;

const NAV_LINKS: Array<{ label: string; href: string; panelKey: PanelKey | null }> = [
  { label: 'Projects', href: '/projects', panelKey: 'Projects' },
  { label: 'About',    href: '/about',    panelKey: null        },
  { label: 'Contact',  href: '/contact',  panelKey: null        },
];

// ─── Panel content ────────────────────────────────────────────────
// Static for Pathway C; wired to content collections in M11.

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        margin: '0 0 0.625rem',
        fontSize: 'var(--text-xs)',
        fontWeight: 600,
        letterSpacing: '0.07em',
        textTransform: 'uppercase',
        color: 'var(--color-text-tertiary)',
      }}
    >
      {children}
    </p>
  );
}

function PanelLink({ href, title, sub }: { href: string; title: string; sub?: string }) {
  return (
    <a
      href={href}
      style={{ display: 'block', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-md)', textDecoration: 'none', color: 'inherit' }}
      onPointerEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--color-border)'; }}
      onPointerLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
    >
      <span style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--color-text-primary)' }}>
        {title}
      </span>
      {sub && (
        <span style={{ display: 'block', marginTop: '0.125rem', fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>
          {sub}
        </span>
      )}
    </a>
  );
}

function AllLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      style={{ fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--color-accent)', textDecoration: 'none', paddingLeft: '0.75rem' }}
    >
      {children} <span aria-hidden="true">→</span>
    </a>
  );
}

function ProjectsPanelContent() {
  return (
    <div style={{ padding: '1.25rem 1.5rem', width: 460, boxSizing: 'border-box' }}>
      <SectionLabel>Featured</SectionLabel>
      <PanelLink
        href="/projects/geopolitical-stress-commodity-pipeline"
        title="Geopolitical Stress Pipeline"
        sub="Data Engineering & API Integration"
      />
      <PanelLink
        href="/projects/f1-prediction"
        title="Formula One: Statistical Learning"
        sub="Statistical Modeling & Telemetry"
      />
      <PanelLink
        href="/projects/premier-league-classification"
        title="Forecasting Football"
        sub="Classification & Predictive Analytics"
      />
      <div style={{ marginTop: '0.75rem' }}>
        <AllLink href="/projects">All projects</AllLink>
      </div>
    </div>
  );
}

const PANEL_CONTENT: Record<PanelKey, React.ReactNode> = {
  Projects: <ProjectsPanelContent />,
};

// ─── Social icons ─────────────────────────────────────────────────
// Inline SVGs required — astro-icon is Astro-only, cannot be used in React islands.

function GitHubIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

// ─── Hamburger icon ───────────────────────────────────────────────
// Inline SVG is necessary here: the icon must toggle state (☰ ↔ ✕)
// and astro-icon's <Icon> is Astro-only, not usable inside React islands.

function HamburgerIcon({ open }: { open: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" aria-hidden="true">
      {open ? (
        <>
          <line x1="4" y1="4" x2="16" y2="16" />
          <line x1="16" y1="4" x2="4"  y2="16" />
        </>
      ) : (
        <>
          <line x1="3" y1="6"  x2="17" y2="6"  />
          <line x1="3" y1="10" x2="17" y2="10" />
          <line x1="3" y1="14" x2="17" y2="14" />
        </>
      )}
    </svg>
  );
}

// ─── Nav component ────────────────────────────────────────────────

export default function Nav() {
  const [activeKey, setActiveKey]     = useState<PanelKey | null>(null);
  const [isMobileOpen, setMobile]     = useState(false);
  const [panelDims, setPanelDims]     = useState<PanelDims>({ width: 0, height: 0 });
  const [panelLeft, setPanelLeft]     = useState(0);

  const navRef        = useRef<HTMLElement>(null);
  const itemRefs      = useRef<Partial<Record<PanelKey, HTMLElement>>>({});
  const contentRefs   = useRef<Partial<Record<PanelKey, HTMLDivElement>>>({});
  const measuredDims  = useRef<Partial<Record<PanelKey, PanelDims>>>({});
  const roRefs        = useRef<Partial<Record<PanelKey, ResizeObserver>>>({});

  const isOpen = activeKey !== null;

  // ── Measure all panels with ResizeObserver after first mount ───
  useLayoutEffect(() => {
    PANEL_KEYS.forEach((key) => {
      const el = contentRefs.current[key];
      if (!el) return;

      // Initial measurement via scrollWidth/scrollHeight (works inside hidden parents)
      measuredDims.current[key] = {
        width:  el.scrollWidth,
        height: el.scrollHeight,
      };

      const ro = new ResizeObserver(() => {
        if (!contentRefs.current[key]) return;
        const t = contentRefs.current[key]!;
        measuredDims.current[key] = { width: t.scrollWidth, height: t.scrollHeight };
      });
      ro.observe(el);
      roRefs.current[key] = ro;
    });

    return () => {
      Object.values(roRefs.current).forEach((ro) => ro?.disconnect());
    };
  }, []);

  // ── Recalculate panel dims + horizontal offset when activeKey changes ──
  useEffect(() => {
    if (!activeKey) return;

    const dims     = measuredDims.current[activeKey];
    const itemEl   = itemRefs.current[activeKey];
    const navEl    = navRef.current;
    if (!dims || !itemEl || !navEl) return;

    setPanelDims(dims);

    const navRect  = navEl.getBoundingClientRect();
    const itemRect = itemEl.getBoundingClientRect();
    const center   = itemRect.left - navRect.left + itemRect.width / 2;
    const raw      = center - dims.width / 2;
    setPanelLeft(Math.max(0, Math.min(raw, navRect.width - dims.width)));
  }, [activeKey]);

  // ── Escape key → close both dropdown and mobile sheet ─────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveKey(null);
        setMobile(false);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  // ── Auto-close mobile sheet on resize to desktop ───────────────
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const handler = (e: MediaQueryListEvent) => { if (e.matches) setMobile(false); };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const closeDropdown    = useCallback(() => setActiveKey(null), []);
  const openPanel        = useCallback((key: PanelKey) => setActiveKey(key), []);
  const toggleMobile     = useCallback(() => setMobile((v) => !v), []);
  const closeMobile      = useCallback(() => setMobile(false), []);

  // ── Inline style helpers (avoid repetition) ───────────────────
  const S = {
    navBar: {
      position: 'sticky' as const,
      top: 0,
      zIndex: 50,
      backgroundColor: 'var(--color-surface)',
      borderBottom: '1px solid var(--color-border)',
    },
    inner: {
      maxWidth: 1200,
      margin: '0 auto',
      padding: '0 1.5rem',
      position: 'relative' as const,
    },
    bar: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: '3.5rem',
    },
  };

  return (
    <>
      {/* ── Header / Nav bar ──────────────────────────────────── */}
      <header style={S.navBar}>
        <nav
          ref={navRef}
          aria-label="Main navigation"
          onPointerLeave={closeDropdown}
          style={S.inner}
        >
          <div style={S.bar}>
            {/* Wordmark */}
            <a
              href="/"
              aria-label="Shehzad Anwar — home"
              style={{ color: 'var(--color-text-primary)', textDecoration: 'none' }}
            >
              <span className="font-display font-bold text-xl tracking-tight">SA.</span>
            </a>

            {/* Desktop links — hidden below md breakpoint via class */}
            <div
              role="list"
              aria-label="Site sections"
              className={cn('hidden md:flex')}
              style={{ alignItems: 'center', gap: '0.25rem' }}
            >
              {NAV_LINKS.map(({ label, href, panelKey }) => (
                <div key={label} role="listitem">
                  <a
                    href={href}
                    ref={(el) => { if (panelKey && el) itemRefs.current[panelKey] = el; }}
                    onPointerEnter={panelKey ? () => openPanel(panelKey) : undefined}
                    aria-expanded={panelKey ? activeKey === panelKey : undefined}
                    aria-haspopup={panelKey ? 'true' : undefined}
                    style={{
                      display: 'block',
                      padding: '0.375rem 0.75rem',
                      borderRadius: 'var(--radius-md)',
                      fontSize: 'var(--text-sm)',
                      fontWeight: activeKey === panelKey ? 500 : 400,
                      color: activeKey === panelKey ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                      textDecoration: 'none',
                      backgroundColor: activeKey === panelKey ? 'var(--color-border)' : 'transparent',
                      transition: `color var(--duration-fast) var(--ease-out-expo), background-color var(--duration-fast) var(--ease-out-expo)`,
                    }}
                  >
                    {label}
                  </a>
                </div>
              ))}
            </div>

            {/* Desktop social links — hidden below md breakpoint */}
            <div className={cn('hidden md:flex')} style={{ alignItems: 'center', gap: '0.25rem' }}>
              <a
                href="https://github.com/shehzanwar"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub profile"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.375rem', borderRadius: 'var(--radius-md)', color: 'var(--color-text-secondary)', transition: 'color var(--duration-fast) var(--ease-out-expo)' }}
                onPointerEnter={(e) => { e.currentTarget.style.color = 'var(--color-text-primary)'; }}
                onPointerLeave={(e) => { e.currentTarget.style.color = 'var(--color-text-secondary)'; }}
              >
                <GitHubIcon />
              </a>
              <a
                href="https://linkedin.com/in/shehzanwar"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn profile"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.375rem', borderRadius: 'var(--radius-md)', color: 'var(--color-text-secondary)', transition: 'color var(--duration-fast) var(--ease-out-expo)' }}
                onPointerEnter={(e) => { e.currentTarget.style.color = 'var(--color-text-primary)'; }}
                onPointerLeave={(e) => { e.currentTarget.style.color = 'var(--color-text-secondary)'; }}
              >
                <LinkedInIcon />
              </a>
            </div>

            {/* Mobile hamburger — shown below md breakpoint */}
            <button
              type="button"
              onClick={toggleMobile}
              aria-label={isMobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={isMobileOpen}
              aria-controls="mobile-nav-sheet"
              className={cn('flex md:hidden')}
              style={{ padding: '0.5rem', border: 'none', background: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer', color: 'var(--color-text-primary)', alignItems: 'center', justifyContent: 'center' }}
            >
              <HamburgerIcon open={isMobileOpen} />
            </button>
          </div>

          {/* ── Morphing dropdown panel ───────────────────────── */}
          {/* Height transitions to active panel's measured height.
              All content panels stay in the DOM — only opacity switches. */}
          <div
            role="region"
            aria-label="Navigation detail panel"
            aria-hidden={!isOpen}
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              height: isOpen ? panelDims.height : 0,
              overflow: 'hidden',
              transition: `height var(--duration-base) var(--ease-out-expo)`,
              pointerEvents: isOpen ? 'auto' : 'none',
              zIndex: 40,
            }}
          >
            {/* Translate track: slides horizontally under the active nav item.
                will-change: transform applied only while open. */}
            <div
              style={{
                display: 'inline-block',
                transform: `translate3d(${panelLeft}px, 0, 0)`,
                transition: `transform var(--duration-base) var(--ease-out-expo)`,
                ...(isOpen ? { willChange: 'transform' } : {}),
              }}
            >
              {/* Panel box */}
              <div
                style={{
                  position: 'relative',
                  backgroundColor: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  borderTop: 'none',
                  borderRadius: `0 0 var(--radius-lg) var(--radius-lg)`,
                  boxShadow: 'var(--shadow-card-hover)',
                  overflow: 'hidden',
                }}
              >
                {/* All panels stacked — no mount/unmount, pure opacity switch */}
                {PANEL_KEYS.map((key) => (
                  <div
                    key={key}
                    ref={(el) => { if (el) contentRefs.current[key] = el; }}
                    aria-hidden={activeKey !== key}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      opacity: activeKey === key ? 1 : 0,
                      pointerEvents: activeKey === key ? 'auto' : 'none',
                      transition: `opacity var(--duration-fast) var(--ease-out-expo)`,
                    }}
                  >
                    {PANEL_CONTENT[key]}
                  </div>
                ))}
                {/* Sizing ghost: visible but aria-hidden; keeps the box wide enough */}
                <div aria-hidden="true" style={{ visibility: 'hidden', pointerEvents: 'none' }}>
                  {PANEL_CONTENT[PANEL_KEYS[0]]}
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>

      {/* ── Mobile sheet backdrop ──────────────────────────────── */}
      <div
        aria-hidden="true"
        onClick={closeMobile}
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'oklch(0 0 0 / 0.35)',
          zIndex: 40,
          opacity: isMobileOpen ? 1 : 0,
          pointerEvents: isMobileOpen ? 'auto' : 'none',
          transition: `opacity var(--duration-base) var(--ease-out-expo)`,
        }}
      />

      {/* ── Mobile sheet ─────────────────────────────────────── */}
      <div
        id="mobile-nav-sheet"
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: 'min(320px, 85vw)',
          backgroundColor: 'var(--color-surface)',
          borderLeft: '1px solid var(--color-border)',
          zIndex: 50,
          overflowY: 'auto',
          padding: '1.25rem 1.5rem 2rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0',
          transform: isMobileOpen ? 'translate3d(0, 0, 0)' : 'translate3d(100%, 0, 0)',
          transition: `transform var(--duration-base) var(--ease-out-expo)`,
          ...(isMobileOpen ? { willChange: 'transform' } : {}),
        }}
      >
        {/* Close button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
          <button
            type="button"
            onClick={closeMobile}
            aria-label="Close navigation menu"
            style={{ padding: '0.5rem', border: 'none', background: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer', color: 'var(--color-text-primary)' }}
          >
            <HamburgerIcon open={true} />
          </button>
        </div>

        {/* Flat navigation list — no sub-menus on mobile, per M05 spec */}
        <nav aria-label="Mobile navigation">
          <SheetSection label="Navigation">
            {NAV_LINKS.map(({ label, href }) => (
              <SheetLink key={label} href={href} onClick={closeMobile} size="base">
                {label}
              </SheetLink>
            ))}
          </SheetSection>

          <SheetSection label="Featured Projects">
            <SheetLink href="/projects/geopolitical-stress-commodity-pipeline" onClick={closeMobile} size="sm">Geopolitical Stress Pipeline</SheetLink>
            <SheetLink href="/projects/f1-prediction" onClick={closeMobile} size="sm">Formula One: Statistical Learning</SheetLink>
            <SheetLink href="/projects/premier-league-classification" onClick={closeMobile} size="sm">Forecasting Football</SheetLink>
          </SheetSection>

          <SheetSection label="Connect">
            <SheetLink href="https://github.com/shehzanwar" onClick={closeMobile} size="sm" external>GitHub</SheetLink>
            <SheetLink href="https://linkedin.com/in/shehzanwar" onClick={closeMobile} size="sm" external>LinkedIn</SheetLink>
          </SheetSection>

        </nav>
      </div>
    </>
  );
}

// ─── Mobile sheet helpers ─────────────────────────────────────────

function SheetSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: '1.5rem' }}>
      <p
        style={{
          margin: '0 0 0.5rem',
          fontSize: 'var(--text-xs)',
          fontWeight: 600,
          letterSpacing: '0.07em',
          textTransform: 'uppercase',
          color: 'var(--color-text-tertiary)',
        }}
      >
        {label}
      </p>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.125rem' }}>
        {children}
      </ul>
    </section>
  );
}

function SheetLink({
  href,
  onClick,
  size,
  external,
  children,
}: {
  href: string;
  onClick: () => void;
  size: 'base' | 'sm';
  external?: boolean;
  children: React.ReactNode;
}) {
  return (
    <li>
      <a
        href={href}
        onClick={onClick}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        style={{
          display: 'block',
          padding: '0.5rem 0.75rem',
          borderRadius: 'var(--radius-md)',
          fontSize: size === 'base' ? 'var(--text-base)' : 'var(--text-sm)',
          fontWeight: size === 'base' ? 500 : 400,
          color: size === 'base' ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
          textDecoration: 'none',
        }}
        onPointerEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--color-border)'; }}
        onPointerLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
      >
        {children}
      </a>
    </li>
  );
}
