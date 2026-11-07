import React, { useEffect, useRef } from 'react';

/**
 * CosmicBackground - Interactive 3D cursor-reactive wireframe mesh background.
 * Procedurally generates a perspective 3D terrain grid that deforms dynamically
 * under the user's cursor with spring physics, wave propagation, and glowing node junctions.
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

    // Mouse tracking with smooth interpolation
    const mouse = {
      x: width * 0.5,
      y: height * 0.4,
      targetX: width * 0.5,
      targetY: height * 0.4,
      radius: 240,
      active: false
    };

    const handleMouseMove = (e) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
      mouse.active = true;
    };

    const handleTouchMove = (e) => {
      if (e.touches && e.touches[0]) {
        mouse.targetX = e.touches[0].clientX;
        mouse.targetY = e.touches[0].clientY;
        mouse.active = true;
      }
    };

    const handleMouseLeave = () => {
      mouse.active = false;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave, { passive: true });

    // Grid configuration
    const cols = Math.min(36, Math.max(18, Math.floor(width / 44)));
    const rows = Math.min(26, Math.max(14, Math.floor(height / 36)));

    // Initialize 3D mesh points with spring physics
    const points = [];
    for (let r = 0; r <= rows; r++) {
      points[r] = [];
      for (let c = 0; c <= cols; c++) {
        points[r][c] = {
          baseX: (c / cols) * width,
          baseY: (r / rows) * height,
          x: (c / cols) * width,
          y: (r / rows) * height,
          z: 0,
          vz: 0
        };
      }
    }

    // Floating Stardust Particles
    const starCount = 35;
    const stars = [];
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.6 + 0.6,
        alpha: Math.random() * 0.5 + 0.2,
        vy: Math.random() * 0.35 + 0.15,
        color: Math.random() > 0.4 ? 'rgba(0, 242, 254, ' : 'rgba(168, 85, 247, '
      });
    }

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      for (let r = 0; r <= rows; r++) {
        for (let c = 0; c <= cols; c++) {
          if (points[r] && points[r][c]) {
            points[r][c].baseX = (c / cols) * width;
            points[r][c].baseY = (r / rows) * height;
          }
        }
      }
    };

    window.addEventListener('resize', handleResize, { passive: true });

    // Reduced motion check
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const shouldReduce = mediaQuery.matches;

    let time = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      time += 0.02;

      // Smooth mouse follow
      mouse.x += (mouse.targetX - mouse.x) * 0.08;
      mouse.y += (mouse.targetY - mouse.y) * 0.08;

      // 1. Update 3D mesh positions and cursor reaction
      for (let r = 0; r <= rows; r++) {
        for (let c = 0; c <= cols; c++) {
          const pt = points[r][c];

          // Base harmonic wave
          const wave = shouldReduce
            ? 0
            : Math.sin(pt.baseX * 0.005 + time) * Math.cos(pt.baseY * 0.005 + time * 0.8) * 14;

          // Distance to cursor
          const dx = pt.baseX - mouse.x;
          const dy = pt.baseY - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          let targetZ = wave;

          if (dist < mouse.radius && mouse.active && !shouldReduce) {
            const factor = Math.cos((dist / mouse.radius) * (Math.PI * 0.5));
            // Cursor dynamic elevation ripple
            const ripple = Math.sin(dist * 0.05 - time * 3.5) * 26 * factor;
            targetZ += ripple + factor * 22;
          }

          // Spring damping physics
          pt.vz += (targetZ - pt.z) * 0.12;
          pt.vz *= 0.86;
          pt.z += pt.vz;

          // 3D Perspective projection offset
          const pz = pt.z;
          pt.x = pt.baseX + (dx / (width * 0.5)) * pz * 0.45;
          pt.y = pt.baseY + (dy / (height * 0.5)) * pz * 0.45 - pz * 0.65;
        }
      }

      // 2. Draw 3D Mesh Horizontal Lines
      for (let r = 0; r <= rows; r++) {
        for (let c = 0; c < cols; c++) {
          const p1 = points[r][c];
          const p2 = points[r][c + 1];

          const avgZ = (p1.z + p2.z) * 0.5;
          const distToMouse = Math.hypot((p1.x + p2.x) * 0.5 - mouse.x, (p1.y + p2.y) * 0.5 - mouse.y);
          const isNearMouse = distToMouse < mouse.radius && mouse.active;

          let alpha = Math.max(0.04, Math.min(0.38, 0.07 + (avgZ / 40) * 0.22));
          let strokeColor;

          if (isNearMouse) {
            const intensity = Math.min(1, (1 - distToMouse / mouse.radius) * 1.5);
            alpha = Math.min(0.55, alpha + intensity * 0.35);
            strokeColor = `rgba(0, 242, 254, ${alpha})`;
          } else if (avgZ > 8) {
            strokeColor = `rgba(16, 185, 129, ${alpha})`;
          } else {
            strokeColor = `rgba(0, 210, 255, ${alpha})`;
          }

          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = strokeColor;
          ctx.lineWidth = isNearMouse ? 1.4 : 0.85;
          ctx.stroke();
        }
      }

      // 3. Draw 3D Mesh Vertical Lines
      for (let c = 0; c <= cols; c++) {
        for (let r = 0; r < rows; r++) {
          const p1 = points[r][c];
          const p2 = points[r + 1][c];

          const avgZ = (p1.z + p2.z) * 0.5;
          const distToMouse = Math.hypot((p1.x + p2.x) * 0.5 - mouse.x, (p1.y + p2.y) * 0.5 - mouse.y);
          const isNearMouse = distToMouse < mouse.radius && mouse.active;

          let alpha = Math.max(0.03, Math.min(0.35, 0.06 + (avgZ / 40) * 0.2));
          let strokeColor;

          if (isNearMouse) {
            const intensity = Math.min(1, (1 - distToMouse / mouse.radius) * 1.5);
            alpha = Math.min(0.5, alpha + intensity * 0.3);
            strokeColor = `rgba(0, 242, 254, ${alpha})`;
          } else if (avgZ > 8) {
            strokeColor = `rgba(16, 185, 129, ${alpha})`;
          } else {
            strokeColor = `rgba(0, 210, 255, ${alpha})`;
          }

          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = strokeColor;
          ctx.lineWidth = isNearMouse ? 1.4 : 0.85;
          ctx.stroke();
        }
      }

      // 4. Draw glowing vertex nodes near cursor
      if (mouse.active && !shouldReduce) {
        for (let r = 0; r <= rows; r++) {
          for (let c = 0; c <= cols; c++) {
            const pt = points[r][c];
            const dist = Math.hypot(pt.x - mouse.x, pt.y - mouse.y);
            if (dist < mouse.radius * 0.75) {
              const nodeAlpha = (1 - dist / (mouse.radius * 0.75)) * 0.7;
              ctx.beginPath();
              ctx.arc(pt.x, pt.y, 2.2, 0, Math.PI * 2);
              ctx.fillStyle = `rgba(0, 242, 254, ${nodeAlpha})`;
              ctx.fill();
            }
          }
        }
      }

      // 5. Draw floating stardust particles
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        if (!shouldReduce) {
          s.y -= s.vy;
          if (s.y < 0) {
            s.y = height;
            s.x = Math.random() * width;
          }
        }

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `${s.color}${s.alpha})`;
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className={`relative h-screen w-screen bg-[#07090e] text-[#f1f5f9] select-none overflow-hidden ${className}`}>
      {/* Deep Obsidian Backdrop */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-[#080b12] via-[#06080e] to-[#040508] z-0" />

      {/* Living Aurora Horizon Light Wave */}
      <div 
        aria-hidden="true" 
        className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-25"
      >
        <div className="aurora-beam-1 absolute top-[-10%] left-[-10%] w-[110%] h-[60%] bg-gradient-to-br from-cyan-500/15 via-transparent to-purple-600/10 blur-[130px] rounded-full" />
        <div className="aurora-beam-2 absolute bottom-[-15%] right-[-10%] w-[90%] h-[55%] bg-gradient-to-tl from-emerald-500/10 via-transparent to-blue-600/15 blur-[120px] rounded-full" />
      </div>

      {/* Interactive 3D Cursor-Reactive Mesh Canvas */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none z-0"
      />

      {/* Foreground UI Content */}
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  );
}
