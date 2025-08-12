// CinematicCharacterHub.jsx
// Upgraded: cinematic intro, powerful transition, spotlight carousel for 6 characters
// - 6 characters: first unlocked (launch), rest locked
// - Intro has parallax particles, breathing title, subtle boom (placeholder)
// - Begin Story morphs into spotlight carousel (center focus, blurred side cards)
// - Locked characters show lock overlay and cannot be opened
// - Color palette: Deep Violet (#4B2E83), Gold (#FFD700), Midnight gradient, Cyan glow (#38E3FF)

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// --------------------------
// Dynamic characters data
// --------------------------
const charactersData = [
  {
    id: 'char-1',
    name: 'Astra Valen',
    tagline: 'The First Dawn',
    unlocked: true, // LAUNCHED
    color: '#FFD700', // gold accent for launched
    backdrop: '/assets/char1-bg.jpg',
    portrait: '/assets/char1.png',
    chapters: [
      { title: 'Chapter 1', excerpt: 'Dummy chapter content — replace later easily.' },
    ],
  },
  // Locked characters
  { id: 'char-2', name: 'Boros Kade', unlocked: false, color: '#7b4ba6', backdrop: '/assets/char2-bg.jpg', portrait: '/assets/char2.png', chapters: [] },
  { id: 'char-3', name: 'Celia Marrow', unlocked: false, color: '#6f3f98', backdrop: '/assets/char3-bg.jpg', portrait: '/assets/char3.png', chapters: [] },
  { id: 'char-4', name: 'Dax Hallow', unlocked: false, color: '#5e2f7a', backdrop: '/assets/char4-bg.jpg', portrait: '/assets/char4.png', chapters: [] },
  { id: 'char-5', name: 'Eris Nyx', unlocked: false, color: '#4b2e83', backdrop: '/assets/char5-bg.jpg', portrait: '/assets/char5.png', chapters: [] },
  { id: 'char-6', name: 'Fen Roe', unlocked: false, color: '#3b2166', backdrop: '/assets/char6-bg.jpg', portrait: '/assets/char6.png', chapters: [] },
];

// --------------------------
// Component
// --------------------------
export default function CinematicCharacterHub() {
  const [phase, setPhase] = useState('intro'); // 'intro' | 'carousel' | 'story'
  const [currentIndex, setCurrentIndex] = useState(0); // spotlight index for carousel
  const [selected, setSelected] = useState(null);
  const introRef = useRef(null);

  // Parallax tilt on intro
  useEffect(() => {
    const el = introRef.current;
    if (!el) return;
    const onMove = (e) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 10; // gentler tilt
      const y = (e.clientY / innerHeight - 0.5) * 10;
      el.style.transform = `perspective(1200px) rotateX(${ -y }deg) rotateY(${ x }deg)`;
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  // keyboard controls
  useEffect(() => {
    const onKey = (e) => {
      if (phase === 'carousel') {
        if (e.key === 'ArrowLeft') prev();
        if (e.key === 'ArrowRight') next();
        if (e.key === 'Escape') setPhase('intro');
      } else if (phase === 'story') {
        if (e.key === 'Escape') closeStory();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [phase, currentIndex]);

  const next = () => setCurrentIndex((i) => (i + 1) % charactersData.length);
  const prev = () => setCurrentIndex((i) => (i - 1 + charactersData.length) % charactersData.length);

  // touch/swipe for carousel
  useEffect(() => {
    let startX = null;
    const onTouchStart = (e) => (startX = e.touches ? e.touches[0].clientX : e.clientX);
    const onTouchEnd = (e) => {
      if (startX == null) return;
      const endX = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
      const dx = endX - startX;
      if (Math.abs(dx) > 40) dx > 0 ? prev() : next();
      startX = null;
    };
    window.addEventListener('touchstart', onTouchStart);
    window.addEventListener('mousedown', onTouchStart);
    window.addEventListener('touchend', onTouchEnd);
    window.addEventListener('mouseup', onTouchEnd);
    return () => {
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('mousedown', onTouchStart);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('mouseup', onTouchEnd);
    };
  }, []);

  const openStory = (char) => {
    if (!char.unlocked) return; // locked
    setSelected(char);
    setPhase('story');
  };
  const closeStory = () => {
    setSelected(null);
    setPhase('carousel');
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#0D0D0D] to-[#1B1B1B] text-white overflow-hidden font-sans">
      {/* INTRO */}
      <AnimatePresence>
        {phase === 'intro' && (
          <motion.section
            key="intro"
            className="fixed inset-0 flex items-center justify-center z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.5 } }}
          >
            {/* background layers */}
            <div ref={introRef} className="absolute inset-0 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-[#0b0820] to-[#151026]" />

              {/* moving clouds / parallax layer (CSS animated) */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="h-full w-[200%] animate-pan-left opacity-20 bg-[url('/assets/intro-clouds.png')] bg-repeat-x bg-top" />
              </div>

              {/* subtle particle dots */}
              <Particles />
            </div>

            <div className="absolute inset-0 bg-black/50" />

            <div className="relative z-50 max-w-4xl px-6 text-center">
              <motion.h1
                className="text-6xl md:text-8xl font-extrabold tracking-tight leading-tight"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: [0, 1], scale: [0.96, 1.02, 1] }}
                transition={{ delay: 0.15, duration: 1.2, times: [0, 0.6, 1] }}
                style={{ color: '#FFD700', textTransform: 'uppercase', textShadow: '0 8px 40px rgba(75,46,131,0.35)' }}
              >
                <GlitchText text="Character Chronicles" accent="#38E3FF" />
              </motion.h1>

              <motion.p
                className="mt-6 text-lg md:text-xl text-slate-200/90 max-w-2xl mx-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.6 }}
              >
                A cinematic launchpad for heroes. The first character is live — the rest are sealed behind destiny.
              </motion.p>

              <motion.div
                className="mt-10 flex items-center justify-center gap-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
              >
                <motion.button
                  onClick={() => setPhase('carousel')}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-10 py-4 rounded-full bg-gradient-to-r from-[#4B2E83] to-[#2a1548] shadow-2xl text-lg font-semibold border border-white/10 ring-2 ring-transparent hover:ring-[#38E3FF]/40"
                >
                  Begin Story
                </motion.button>
              </motion.div>

              <div className="mt-6 opacity-60 text-sm">Use ← → keys or swipe to rotate • First character unlocked</div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* CAROUSEL SPOTLIGHT */}
      <AnimatePresence>
        {phase === 'carousel' && (
          <motion.section
            key="carousel"
            className="relative z-30 min-h-screen flex flex-col items-center justify-center px-6 py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* dynamic backdrop */}
            <motion.div
              className="absolute inset-0 bg-cover bg-center filter blur-sm"
              style={{ backgroundImage: `url(${charactersData[currentIndex].backdrop})` }}
              initial={{ opacity: 0.2 }}
              animate={{ opacity: 1 }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

            <div className="relative z-40 w-full max-w-6xl">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-sm uppercase tracking-wider text-[#FFD700]">Spotlight</h3>
                  <h2 className="text-3xl font-bold text-white">Character Showcase</h2>
                </div>
                <div className="flex gap-3">
                  <button onClick={prev} className="p-3 rounded-full bg-black/30 border border-white/10">◀</button>
                  <button onClick={next} className="p-3 rounded-full bg-black/30 border border-white/10">▶</button>
                </div>
              </div>

              <div className="relative h-[420px] flex items-center justify-center">
                {/* render cards: center, left, right with transforms */}
                {charactersData.map((char, idx) => {
                  const offset = ((idx - currentIndex) + charactersData.length) % charactersData.length;
                  // map offsets to positions: 0=center, 1=right, n-1=left, others hidden
                  let pos = 'hidden';
                  if (offset === 0) pos = 'center';
                  else if (offset === 1) pos = 'right';
                  else if (offset === charactersData.length - 1) pos = 'left';

                  const isCenter = pos === 'center';

                  return (
                    <motion.div
                      key={char.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: pos === 'hidden' ? 0 : 1, scale: isCenter ? 1.02 : 0.9, x: pos === 'left' ? -380 : pos === 'right' ? 380 : 0 }}
                      transition={{ type: 'spring', stiffness: 120, damping: 20 }}
                      className={`absolute w-[560px] h-[360px] rounded-3xl overflow-hidden shadow-2xl border border-white/6 ${isCenter ? 'z-50' : 'z-30'}`}
                      onClick={() => isCenter && openStory(char)}
                      style={{ cursor: char.unlocked ? 'pointer' : 'not-allowed' }}
                    >
                      <div className={`absolute inset-0 bg-cover bg-center`} style={{ backgroundImage: `url(${char.backdrop})`, filter: isCenter ? 'none' : 'grayscale(40%) blur(3px)', transform: isCenter ? 'scale(1.02)' : 'scale(1)' }} />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                      {/* card content */}
                      <div className="absolute bottom-6 left-6 right-6 text-left">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-xl font-extrabold" style={{ color: isCenter ? '#FFD700' : '#ddd' }}>{char.name}</h4>
                            <p className="text-sm opacity-80 mt-1">{char.tagline}</p>
                          </div>
                          <div className="text-sm opacity-80">{char.unlocked ? `${char.chapters.length} Chapters` : 'Locked'}</div>
                        </div>

                        {/* lock overlay for locked chars */}
                        {!char.unlocked && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                            <div className="text-center">
                              <div className="text-4xl">🔒</div>
                              <div className="mt-2 text-sm opacity-80">Unlock soon</div>
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              <div className="mt-8 flex items-center justify-center gap-4">
                <button onClick={() => setPhase('intro')} className="px-4 py-2 rounded-full bg-black/30 border border-white/10">Back</button>
                <div className="text-sm opacity-70">Click center card to open (locked cards disabled)</div>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* STORY PANEL */}
      <AnimatePresence>
        {phase === 'story' && selected && (
          <motion.section key="story" className="fixed inset-0 z-50 flex items-stretch" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="relative w-1/2 hidden md:block">
              <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${selected.backdrop})` }} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
            </div>

            <motion.div className="flex-1 p-8 md:p-16 overflow-y-auto" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', stiffness: 120, damping: 24 }}>
              <div className="max-w-3xl mx-auto">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-4xl font-extrabold" style={{ color: '#FFD700' }}>{selected.name}</h2>
                    <p className="opacity-80 mt-1">{selected.tagline}</p>
                  </div>
                  <div className="ml-auto flex gap-3">
                    <button onClick={closeStory} className="px-4 py-2 rounded-md bg-black/30 border border-white/10">Close</button>
                  </div>
                </div>

                <div className="mt-8 grid grid-cols-1 gap-6">
                  {selected.chapters.length === 0 ? (
                    <div className="p-8 rounded-2xl bg-gradient-to-r from-black/60 to-black/30 border border-white/6 shadow-lg text-center">No chapters yet. Content coming soon.</div>
                  ) : (
                    selected.chapters.map((ch, idx) => (
                      <motion.article key={idx} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.12 * idx, duration: 0.5 }} className="p-6 rounded-2xl bg-gradient-to-r from-black/60 to-black/30 border border-white/6 shadow-lg">
                        <div className="flex items-start gap-4">
                          <div className="w-16 h-16 rounded-xl bg-white/6 flex items-center justify-center text-2xl font-bold">{idx + 1}</div>
                          <div>
                            <h3 className="text-xl font-semibold">{ch.title}</h3>
                            <p className="mt-1 opacity-75">{ch.excerpt}</p>
                            <div className="mt-3 flex items-center gap-3">
                              <button className="px-3 py-1 rounded-md bg-gradient-to-r from-[#38E3FF] to-[#4B2E83] text-sm font-medium">Read</button>
                            </div>
                          </div>
                        </div>
                      </motion.article>
                    ))
                  )}
                </div>

                <div className="mt-12 opacity-60 text-sm">Tip: press ESC to close</div>
              </div>
            </motion.div>
          </motion.section>
        )}
      </AnimatePresence>

    </div>
  );
}

// --------------------------
// Small UI helpers
// --------------------------
function GlitchText({ text, accent = '#38E3FF' }) {
  return (
    <span className="relative inline-block">
      <span className="relative z-20" style={{ color: '#FFD700' }}>{text}</span>
      <span className="absolute left-0 top-0 z-10 text-transparent drop-shadow-[2px_0_12px_rgba(56,227,255,0.14)]" style={{ WebkitTextStroke: `1px ${accent}` }}>{text}</span>
      <span className="absolute left-0 top-0 z-0 text-transparent drop-shadow-[-2px_0_12px_rgba(255,215,0,0.06)]" style={{ WebkitTextStroke: '1px rgba(255,215,0,0.06)' }}>{text}</span>
    </span>
  );
}

function Particles() {
  // simple css-based floating dots
  return (
    <div aria-hidden className="absolute inset-0 pointer-events-none">
      <div className="absolute w-full h-full">
        <div className="particle" style={{ left: '10%', top: '20%' }} />
        <div className="particle" style={{ left: '25%', top: '70%' }} />
        <div className="particle" style={{ left: '60%', top: '40%' }} />
        <div className="particle" style={{ left: '80%', top: '10%' }} />
        <div className="particle" style={{ left: '45%', top: '85%' }} />
      </div>
      <style>{`
        .particle{position:absolute;width:8px;height:8px;background:radial-gradient(circle,#38E3FF,#4B2E83);border-radius:50%;opacity:0.8;animation:float 6s ease-in-out infinite}
        @keyframes float{0%{transform:translateY(0)}50%{transform:translateY(-18px)}100%{transform:translateY(0)}}
        .animate-pan-left{animation:pan 40s linear infinite}
        @keyframes pan{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
      `}</style>
    </div>
  );
}

// End of file
