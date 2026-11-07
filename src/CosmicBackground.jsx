import React, { useEffect, useRef } from 'react';

/**
 * CosmicBackground - Custom procedural background for Jeet Launcher & Horizon.
 * Combines an interactive 3D particle dust field, subtle horizon grid, and living aurora wave.
 * Optimized with requestAnimationFrame and respects prefers-reduced-motion.
 */
export default function CosmicBackground({ children, className = "" }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Particle field
    const count = Math.min(50, Math.floor((width * height) / 25000));
    const particles = [];

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.8 + 0.6,
        alpha: Math.random() * 0.45 + 0.15,
        speedY: Math.random() * 0.35 + 0.15,
        speedX: (Math.random() - 0.5) * 0.2,
        color: Math.random() > 0.5 ? 'rgba(0, 242, 254, ' : 'rgba(168, 85, 247, '
      });
    }

    // Mouse parallax
    let targetMouseX = 0;
    let targetMouseY = 0;
    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (e) => {
      targetMouseX = (e.clientX / width - 0.5) * 20;
      targetMouseY = (e.clientY / height - 0.5) * 20;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize, { passive: true });

    // Check for prefers-reduced-motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const shouldReduceMotion = mediaQuery.matches;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Smooth camera interpolation
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      // Draw dust particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (!shouldReduceMotion) {
          p.y -= p.speedY;
          p.x += p.speedX;

          if (p.y < 0) {
            p.y = height;
            p.x = Math.random() * width;
          }
          if (p.x < 0) p.x = width;
          if (p.x > width) p.x = 0;
        }

        const renderX = p.x + mouseX * (p.radius * 0.4);
        const renderY = p.y + mouseY * (p.radius * 0.4);

        ctx.beginPath();
        ctx.arc(renderX, renderY, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${p.alpha})`;
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className={`relative h-screen w-screen bg-[#07090e] text-[#f1f5f9] select-none overflow-hidden ${className}`}>
      {/* 1. Deep Atmospheric Gradient Base */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-[#090b12] via-[#07090e] to-[#040508] z-0" />

      {/* 2. Slow Living Aurora Beam (Never Freeze) */}
      <div 
        aria-hidden="true" 
        className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-25"
      >
        <div className="aurora-beam-1 absolute top-[-10%] left-[-10%] w-[110%] h-[60%] bg-gradient-to-br from-cyan-500/15 via-transparent to-purple-600/10 blur-[130px] rounded-full" />
        <div className="aurora-beam-2 absolute bottom-[-15%] right-[-10%] w-[90%] h-[55%] bg-gradient-to-tl from-emerald-500/10 via-transparent to-blue-600/15 blur-[120px] rounded-full" />
      </div>

      {/* 3. Horizon Perspective Floor Grid */}
      <div 
        aria-hidden="true"
        className="absolute bottom-0 inset-x-0 h-[35vh] pointer-events-none z-0 horizon-perspective-grid"
      />

      {/* 4. Canvas Floating Stardust / Embers Layer */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none z-0"
      />

      {/* 5. Actual Foreground UI Content */}
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  );
}
