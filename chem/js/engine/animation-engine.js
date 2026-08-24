/**
 * AnimationEngine - Interactive Canvas 2D Chemistry Simulation Engine
 * Renders atomic structures, nucleus packing physics, quantum electron shells,
 * smooth camera transitions (zoom & pan), visual particle highlights, and bonding models.
 */

class AnimationEngine {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.dpr = window.devicePixelRatio || 1;

    // Viewport & Dimensions
    this.width = 0;
    this.height = 0;
    this.centerX = 0;
    this.centerY = 0;

    // Camera state (interpolated smoothly)
    this.camera = {
      zoom: 1.0,
      targetZoom: 1.0,
      x: 0,
      y: 0,
      targetX: 0,
      targetY: 0,
      lerpSpeed: 0.06
    };

    // Subatomic particles model (Carbon-12: 6 protons, 6 neutrons, 6 electrons)
    this.nucleusRadius = 38;
    this.protons = [];
    this.neutrons = [];
    this.electrons = [];
    this.shells = [
      { radius: 110, count: 2, speed: 0.024, tilt: 0.2 }, // K-Shell
      { radius: 190, count: 4, speed: 0.016, tilt: -0.15 } // L-Shell
    ];

    // Current topic & step visual config
    this.currentVisualState = null;
    this.highlightedTargets = new Set();
    this.pulsePhase = 0;
    this.globalTime = 0;

    // Interaction / Inspection
    this.inspectMode = false;
    this.hoveredParticle = null;
    this.mousePos = { x: 0, y: 0 };

    // Mode: 'atom', 'bonding', 'solutions'
    this.topicMode = 'atom';

    this._initParticles();
    this._handleResize();
    window.addEventListener('resize', () => this._handleResize());
    this._bindEvents();
    this._startLoop();
  }

  _initParticles() {
    // Generate stable packed positions inside spherical nucleus
    const numProtons = 6;
    const numNeutrons = 6;
    const total = numProtons + numNeutrons;

    this.protons = [];
    this.neutrons = [];

    // Golden spiral sphere distribution projected onto 2D with depth
    for (let i = 0; i < total; i++) {
      const phi = Math.acos(1 - 2 * (i + 0.5) / total);
      const theta = Math.PI * (1 + Math.sqrt(5)) * (i + 0.5);
      
      const r = (this.nucleusRadius - 10) * Math.cbrt((i + 1) / total);
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi); // depth layer

      const particle = {
        x, y, z,
        baseX: x, baseY: y, baseZ: z,
        radius: 12,
        jitterX: 0, jitterY: 0,
        pulseScale: 1.0
      };

      // Alternate protons and neutrons for realistic nuclear lattice
      if (i % 2 === 0 && this.protons.length < numProtons) {
        this.protons.push(particle);
      } else if (this.neutrons.length < numNeutrons) {
        this.neutrons.push(particle);
      } else {
        this.protons.push(particle);
      }
    }

    // Initialize electrons across shells
    this.electrons = [];
    let electronIndex = 0;
    this.shells.forEach((shell, shellIdx) => {
      for (let i = 0; i < shell.count; i++) {
        const baseAngle = (i / shell.count) * Math.PI * 2;
        this.electrons.push({
          id: `e-${electronIndex++}`,
          shellIndex: shellIdx,
          radius: shell.radius,
          angle: baseAngle,
          speed: shell.speed * (shellIdx % 2 === 0 ? 1 : -1),
          particleRadius: 6.5,
          trail: []
        });
      }
    });
  }

  _handleResize() {
    const rect = this.canvas.parentElement.getBoundingClientRect();
    this.width = rect.width;
    this.height = rect.height;

    this.canvas.width = this.width * this.dpr;
    this.canvas.height = this.height * this.dpr;
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;

    this.centerX = this.width / 2;
    this.centerY = this.height / 2;
  }

  _bindEvents() {
    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mousePos.x = e.clientX - rect.left;
      this.mousePos.y = e.clientY - rect.top;
      this._checkHover();
    });

    this.canvas.addEventListener('click', () => {
      if (this.hoveredParticle) {
        this.triggerParticleHighlight(this.hoveredParticle.type);
      }
    });
  }

  _checkHover() {
    // Transform mouse coordinate into simulation space
    const sx = (this.mousePos.x - this.centerX) / this.camera.zoom - this.camera.x;
    const sy = (this.mousePos.y - this.centerY) / this.camera.zoom - this.camera.y;

    this.hoveredParticle = null;

    // Check protons
    for (const p of this.protons) {
      const dist = Math.hypot(sx - (p.x + p.jitterX), sy - (p.y + p.jitterY));
      if (dist <= p.radius + 3) {
        this.hoveredParticle = { type: 'protons', label: 'Proton (p⁺)', charge: '+1', mass: '1.0073 amu', item: p };
        this.canvas.style.cursor = 'pointer';
        return;
      }
    }

    // Check neutrons
    for (const n of this.neutrons) {
      const dist = Math.hypot(sx - (n.x + n.jitterX), sy - (n.y + n.jitterY));
      if (dist <= n.radius + 3) {
        this.hoveredParticle = { type: 'neutrons', label: 'Neutron (n⁰)', charge: '0', mass: '1.0087 amu', item: n };
        this.canvas.style.cursor = 'pointer';
        return;
      }
    }

    // Check electrons
    if (this.currentVisualState?.showElectrons !== false) {
      for (const e of this.electrons) {
        const ex = Math.cos(e.angle) * e.radius;
        const ey = Math.sin(e.angle) * e.radius * 0.7; // slight elliptical perspective
        const dist = Math.hypot(sx - ex, sy - ey);
        if (dist <= e.particleRadius + 5) {
          this.hoveredParticle = { type: 'electrons', label: 'Electron (e⁻)', charge: '-1', mass: '0.00055 amu', item: e };
          this.canvas.style.cursor = 'pointer';
          return;
        }
      }
    }

    // Check nucleus core
    const centerDist = Math.hypot(sx, sy);
    if (centerDist <= this.nucleusRadius + 15) {
      this.hoveredParticle = { type: 'nucleus', label: 'Atomic Nucleus', charge: '+6', desc: 'Dense center' };
      this.canvas.style.cursor = 'pointer';
      return;
    }

    this.canvas.style.cursor = 'default';
  }

  setVisualState(state, topicMode = 'atom') {
    this.currentVisualState = state;
    this.topicMode = topicMode;

    if (state.cameraZoom !== undefined) {
      this.camera.targetZoom = state.cameraZoom;
    }
    if (state.cameraOffset) {
      this.camera.targetX = state.cameraOffset.x;
      this.camera.targetY = state.cameraOffset.y;
    }

    this.highlightedTargets.clear();
    if (state.highlightedParticles) {
      state.highlightedParticles.forEach(h => this.highlightedTargets.add(h));
    }

    this._updateConceptCard(state.focusOverlay);
  }

  triggerParticleHighlight(targetName, durationMs = 2500) {
    this.highlightedTargets.add(targetName);
    
    // Highlight legend pills
    document.querySelectorAll('.legend-item').forEach(item => {
      const p = item.dataset.particle;
      if (targetName === p || (targetName === 'protons' && p === 'proton') || (targetName === 'neutrons' && p === 'neutron') || (targetName === 'electrons' && p === 'electron')) {
        item.classList.add('highlighted');
        setTimeout(() => item.classList.remove('highlighted'), durationMs);
      }
    });

    if (durationMs > 0) {
      setTimeout(() => {
        if (this.currentVisualState && !this.currentVisualState.highlightedParticles?.includes(targetName)) {
          this.highlightedTargets.delete(targetName);
        }
      }, durationMs);
    }
  }

  _updateConceptCard(focusOverlay) {
    const card = document.getElementById('concept-focus-card');
    const iconEl = document.getElementById('focus-icon');
    const titleEl = document.getElementById('focus-title');
    const descEl = document.getElementById('focus-desc');

    if (!card || !iconEl || !titleEl || !descEl) return;

    if (focusOverlay) {
      iconEl.textContent = focusOverlay.icon || '⚛️';
      titleEl.textContent = focusOverlay.title || 'Key Concept';
      descEl.textContent = focusOverlay.desc || '';
      card.classList.remove('hidden');
    } else {
      card.classList.add('hidden');
    }
  }

  _startLoop() {
    const render = (time) => {
      this.globalTime = time * 0.001;
      this._updatePhysics();
      this._draw();
      requestAnimationFrame(render);
    };
    requestAnimationFrame(render);
  }

  _updatePhysics() {
    // Camera smooth lerp
    this.camera.zoom += (this.camera.targetZoom - this.camera.zoom) * this.camera.lerpSpeed;
    this.camera.x += (this.camera.targetX - this.camera.x) * this.camera.lerpSpeed;
    this.camera.y += (this.camera.targetY - this.camera.y) * this.camera.lerpSpeed;

    this.pulsePhase = (this.pulsePhase + 0.05) % (Math.PI * 2);

    const speedMultiplier = this.currentVisualState?.electronSpeed || 1.0;

    // Electron orbital update
    this.electrons.forEach(e => {
      e.angle += e.speed * speedMultiplier * 0.8;
      
      const ex = Math.cos(e.angle) * e.radius;
      const ey = Math.sin(e.angle) * e.radius * 0.7;

      // Maintain trail
      e.trail.push({ x: ex, y: ey, alpha: 0.8 });
      if (e.trail.length > 14) {
        e.trail.shift();
      }
    });

    // Nucleus quantum vibration/jitter
    const jitterAmount = 0.4;
    [...this.protons, ...this.neutrons].forEach((p, idx) => {
      p.jitterX = Math.sin(this.globalTime * 3 + idx) * jitterAmount;
      p.jitterY = Math.cos(this.globalTime * 2.5 + idx * 2) * jitterAmount;
    });
  }

  _draw() {
    const ctx = this.ctx;
    ctx.save();
    ctx.scale(this.dpr, this.dpr);

    // Clear background
    ctx.clearRect(0, 0, this.width, this.height);

    // Draw deep space subtle quantum grid
    this._drawBackgroundGrid(ctx);

    // Apply Camera Transform
    ctx.save();
    ctx.translate(this.centerX, this.centerY);
    ctx.scale(this.camera.zoom, this.camera.zoom);
    ctx.translate(this.camera.x, this.camera.y);

    if (this.topicMode === 'atom') {
      this._drawAtomicSimulation(ctx);
    } else if (this.topicMode === 'bonding') {
      this._drawBondingSimulation(ctx);
    } else {
      this._drawSolutionsSimulation(ctx);
    }

    // Hover tooltip in simulation space
    if (this.hoveredParticle) {
      this._drawParticleTooltip(ctx, this.hoveredParticle);
    }

    ctx.restore();
    ctx.restore();
  }

  _drawBackgroundGrid(ctx) {
    ctx.save();
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.03)';
    ctx.lineWidth = 1;
    const gridSize = 40;
    for (let x = 0; x < this.width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, this.height);
      ctx.stroke();
    }
    for (let y = 0; y < this.height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(this.width, y);
      ctx.stroke();
    }
    ctx.restore();
  }

  _drawAtomicSimulation(ctx) {
    const showShells = this.currentVisualState?.showShells !== false;
    const showElectrons = this.currentVisualState?.showElectrons !== false;
    const showProtons = this.currentVisualState?.showProtons !== false;
    const showNeutrons = this.currentVisualState?.showNeutrons !== false;
    const isHighlightNucleus = this.highlightedTargets.has('nucleus');
    const isHighlightProtons = this.highlightedTargets.has('protons');
    const isHighlightNeutrons = this.highlightedTargets.has('neutrons');
    const isHighlightElectrons = this.highlightedTargets.has('electrons');
    const isHighlightAtom = this.highlightedTargets.has('atom');

    // 1. Draw Outer Electron Shell Tracks & Energy Levels
    if (showShells) {
      this.shells.forEach((shell, idx) => {
        ctx.save();
        const isShellHighlighted = isHighlightElectrons || this.highlightedTargets.has('shells');
        
        ctx.beginPath();
        ctx.ellipse(0, 0, shell.radius, shell.radius * 0.7, shell.tilt, 0, Math.PI * 2);
        ctx.strokeStyle = isShellHighlighted 
          ? `rgba(56, 189, 248, ${0.4 + Math.sin(this.pulsePhase) * 0.2})` 
          : 'rgba(255, 255, 255, 0.12)';
        ctx.lineWidth = isShellHighlighted ? 2.5 : 1.2;
        ctx.setLineDash([6, 4]);
        ctx.stroke();

        // Energy shell label
        ctx.font = '9px Outfit, sans-serif';
        ctx.fillStyle = isShellHighlighted ? '#38bdf8' : 'rgba(255, 255, 255, 0.35)';
        ctx.fillText(idx === 0 ? 'K-Shell (n=1)' : 'L-Shell (n=2)', shell.radius + 6, 4);
        ctx.restore();
      });
    }

    // 2. Draw Electron Trails and Moving Electrons
    if (showElectrons) {
      this.electrons.forEach(e => {
        // Trails
        for (let i = 0; i < e.trail.length; i++) {
          const pt = e.trail[i];
          const alpha = (i / e.trail.length) * 0.4;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, e.particleRadius * (i / e.trail.length), 0, Math.PI * 2);
          ctx.fillStyle = `rgba(251, 191, 36, ${alpha})`;
          ctx.fill();
        }

        // Electron Particle
        const ex = Math.cos(e.angle) * e.radius;
        const ey = Math.sin(e.angle) * e.radius * 0.7;

        ctx.save();
        const eGlow = isHighlightElectrons ? 16 + Math.sin(this.pulsePhase * 2) * 6 : 8;
        ctx.shadowColor = '#fbbf24';
        ctx.shadowBlur = eGlow;

        // Gradient sphere
        const grad = ctx.createRadialGradient(ex - 2, ey - 2, 1, ex, ey, e.particleRadius);
        grad.addColorStop(0, '#ffffff');
        grad.addColorStop(0.4, '#fbbf24');
        grad.addColorStop(1, '#d97706');

        ctx.beginPath();
        ctx.arc(ex, ey, e.particleRadius, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        // Negative sign (-)
        ctx.shadowBlur = 0;
        ctx.font = 'bold 8px Outfit, sans-serif';
        ctx.fillStyle = '#090d16';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('-', ex, ey - 0.5);
        ctx.restore();
      });
    }

    // 3. Draw Central Nucleus Aura Glow
    ctx.save();
    const nGlow = isHighlightNucleus ? 40 : (isHighlightAtom ? 25 : 15);
    const nRadGrad = ctx.createRadialGradient(0, 0, 5, 0, 0, this.nucleusRadius + 18);
    nRadGrad.addColorStop(0, 'rgba(129, 140, 248, 0.45)');
    nRadGrad.addColorStop(0.6, 'rgba(56, 189, 248, 0.15)');
    nRadGrad.addColorStop(1, 'rgba(56, 189, 248, 0)');
    ctx.beginPath();
    ctx.arc(0, 0, this.nucleusRadius + 18, 0, Math.PI * 2);
    ctx.fillStyle = nRadGrad;
    ctx.fill();

    // Nucleus boundary ring when zoomed or highlighted
    if (isHighlightNucleus || this.camera.zoom > 2) {
      ctx.beginPath();
      ctx.arc(0, 0, this.nucleusRadius + 6, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(129, 140, 248, ${0.4 + Math.sin(this.pulsePhase) * 0.3})`;
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 4]);
      ctx.stroke();
    }
    ctx.restore();

    // 4. Combine and depth-sort Nucleus particles (Protons & Neutrons)
    const nucleusParticles = [];
    if (showProtons) {
      this.protons.forEach(p => nucleusParticles.push({ ...p, type: 'proton' }));
    }
    if (showNeutrons) {
      this.neutrons.forEach(n => nucleusParticles.push({ ...n, type: 'neutron' }));
    }
    nucleusParticles.sort((a, b) => a.z - b.z);

    // Draw Nucleus Particles with realistic 3D shading & charge labels
    nucleusParticles.forEach(p => {
      const px = p.x + p.jitterX;
      const py = p.y + p.jitterY;
      const isProton = p.type === 'proton';
      const isHighlighted = isProton ? isHighlightProtons : isHighlightNeutrons;
      
      let pr = p.radius;
      if (isHighlighted) {
        pr += Math.sin(this.pulsePhase * 2) * 2;
      }

      ctx.save();
      if (isHighlighted) {
        ctx.shadowColor = isProton ? '#f43f5e' : '#38bdf8';
        ctx.shadowBlur = 18;
      } else {
        ctx.shadowColor = 'rgba(0,0,0,0.5)';
        ctx.shadowBlur = 6;
      }

      // Radial sphere shading
      const pGrad = ctx.createRadialGradient(px - pr * 0.35, py - pr * 0.35, pr * 0.1, px, py, pr);
      if (isProton) {
        // Red / Rose Proton
        pGrad.addColorStop(0, '#ffffff');
        pGrad.addColorStop(0.3, '#f43f5e');
        pGrad.addColorStop(0.8, '#e11d48');
        pGrad.addColorStop(1, '#881337');
      } else {
        // Cyan / Teal Neutral Neutron
        pGrad.addColorStop(0, '#ffffff');
        pGrad.addColorStop(0.3, '#38bdf8');
        pGrad.addColorStop(0.8, '#0284c7');
        pGrad.addColorStop(1, '#0f172a');
      }

      ctx.beginPath();
      ctx.arc(px, py, pr, 0, Math.PI * 2);
      ctx.fillStyle = pGrad;
      ctx.fill();

      // Particle Charge Badge
      ctx.shadowBlur = 0;
      ctx.font = `bold ${Math.round(pr * 0.85)}px Outfit, sans-serif`;
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(isProton ? '+' : '0', px, py - 0.5);
      ctx.restore();
    });
  }

  _drawBondingSimulation(ctx) {
    const subMode = this.currentVisualState?.subMode || 'covalent';

    if (subMode === 'covalent') {
      // Draw 2 Hydrogen atoms sharing electrons with Oxygen (H2O)
      this._drawCovalentWater(ctx);
    } else if (subMode === 'ionic') {
      // Draw Na+ and Cl- electron transfer (NaCl)
      this._drawIonicSalt(ctx);
    } else {
      this._drawCovalentWater(ctx);
    }
  }

  _drawCovalentWater(ctx) {
    // Oxygen in center
    ctx.save();
    // Oxygen Core
    ctx.beginPath();
    ctx.arc(0, 0, 36, 0, Math.PI * 2);
    ctx.fillStyle = '#ef4444';
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 16px Outfit';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('O (Oxygen)', 0, 0);

    // Hydrogen 1
    const h1x = -120, h1y = -60;
    ctx.beginPath();
    ctx.arc(h1x, h1y, 22, 0, Math.PI * 2);
    ctx.fillStyle = '#38bdf8';
    ctx.fill();
    ctx.fillStyle = '#090d16';
    ctx.font = 'bold 12px Outfit';
    ctx.fillText('H', h1x, h1y);

    // Hydrogen 2
    const h2x = 120, h2y = -60;
    ctx.beginPath();
    ctx.arc(h2x, h2y, 22, 0, Math.PI * 2);
    ctx.fillStyle = '#38bdf8';
    ctx.fill();
    ctx.fillStyle = '#090d16';
    ctx.fillText('H', h2x, h2y);

    // Shared Electron pairs
    const bondAngle = this.globalTime * 2;
    const b1x = -60 + Math.cos(bondAngle) * 12;
    const b1y = -30 + Math.sin(bondAngle) * 6;
    ctx.beginPath();
    ctx.arc(b1x, b1y, 7, 0, Math.PI * 2);
    ctx.fillStyle = '#fbbf24';
    ctx.fill();

    const b2x = 60 + Math.cos(bondAngle + Math.PI) * 12;
    const b2y = -30 + Math.sin(bondAngle + Math.PI) * 6;
    ctx.beginPath();
    ctx.arc(b2x, b2y, 7, 0, Math.PI * 2);
    ctx.fillStyle = '#fbbf24';
    ctx.fill();

    ctx.font = '12px Outfit';
    ctx.fillStyle = '#38bdf8';
    ctx.fillText('Shared Pair (Covalent)', 0, 70);
    ctx.restore();
  }

  _drawIonicSalt(ctx) {
    // Sodium (Na+) on Left, Chlorine (Cl-) on Right
    ctx.save();
    const nax = -90, cly = 0, clx = 90;

    // Sodium Cation
    ctx.beginPath();
    ctx.arc(nax, cly, 32, 0, Math.PI * 2);
    ctx.fillStyle = '#818cf8';
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 14px Outfit';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Na⁺', nax, cly);

    // Chlorine Anion
    ctx.beginPath();
    ctx.arc(clx, cly, 44, 0, Math.PI * 2);
    ctx.fillStyle = '#10b981';
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.fillText('Cl⁻', clx, cly);

    // Transferred electron
    const t = (Math.sin(this.globalTime * 2) + 1) / 2;
    const ex = nax + (clx - nax) * t;
    const ey = -30 * Math.sin(t * Math.PI);
    ctx.beginPath();
    ctx.arc(ex, ey, 6.5, 0, Math.PI * 2);
    ctx.fillStyle = '#fbbf24';
    ctx.fill();

    ctx.font = '12px Outfit';
    ctx.fillStyle = '#fbbf24';
    ctx.fillText('e⁻ Electron Transfer', 0, 75);
    ctx.restore();
  }

  _drawSolutionsSimulation(ctx) {
    // Acids / Bases demonstration
    ctx.save();
    ctx.font = 'bold 16px Outfit';
    ctx.fillStyle = '#38bdf8';
    ctx.textAlign = 'center';
    ctx.fillText('HCl + NaOH → NaCl + H₂O (Neutralization)', 0, -80);

    // Beaker simulation
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 3;
    ctx.strokeRect(-90, -40, 180, 140);

    // Fluid
    ctx.fillStyle = 'rgba(56, 189, 248, 0.25)';
    ctx.fillRect(-88, 0, 176, 98);

    // Floating ions (H+, OH-, Na+, Cl-)
    const ions = [
      { text: 'H⁺', x: -40 + Math.sin(this.globalTime * 2) * 10, y: 30, color: '#f43f5e' },
      { text: 'OH⁻', x: 40 + Math.cos(this.globalTime * 2) * 10, y: 30, color: '#38bdf8' },
      { text: 'Na⁺', x: -20, y: 65, color: '#818cf8' },
      { text: 'Cl⁻', x: 30, y: 70, color: '#34d399' }
    ];

    ions.forEach(ion => {
      ctx.beginPath();
      ctx.arc(ion.x, ion.y, 14, 0, Math.PI * 2);
      ctx.fillStyle = ion.color;
      ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 10px Outfit';
      ctx.fillText(ion.text, ion.x, ion.y + 3);
    });

    ctx.restore();
  }

  _drawParticleTooltip(ctx, particle) {
    const px = this.mousePos.x - this.centerX;
    const py = this.mousePos.y - this.centerY;

    ctx.save();
    ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1;

    const boxW = 140;
    const boxH = 54;
    const bx = px + 12;
    const by = py - 30;

    ctx.beginPath();
    ctx.roundRect(bx, by, boxW, boxH, 6);
    ctx.fill();
    ctx.stroke();

    ctx.font = 'bold 11px Outfit, sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'left';
    ctx.fillText(particle.label, bx + 10, by + 18);

    ctx.font = '10px JetBrains Mono, monospace';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText(`Charge: ${particle.charge}`, bx + 10, by + 34);
    if (particle.mass) {
      ctx.fillText(`Mass: ${particle.mass}`, bx + 10, by + 46);
    }
    ctx.restore();
  }
}

window.AnimationEngine = AnimationEngine;
