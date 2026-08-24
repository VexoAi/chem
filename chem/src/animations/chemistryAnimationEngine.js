/**
 * ChemistryAnimationEngine - Global Reusable 2D/3D Multi-Topic Simulation Engine
 * Powers rich, distinctive, 60fps animations across all 10 School and College lessons.
 */

class ChemistryAnimationEngine {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.dpr = window.devicePixelRatio || 1;

    this.width = 0;
    this.height = 0;
    this.centerX = 0;
    this.centerY = 0;

    // Smooth Interpolated Camera
    this.camera = {
      zoom: 1.0,
      targetZoom: 1.0,
      x: 0,
      y: 0,
      targetX: 0,
      targetY: 0,
      lerpSpeed: 0.07
    };

    // State Tracking
    this.currentLessonId = 'school-atomic-structure';
    this.currentSceneIndex = 0;
    this.currentVisualState = null;
    this.highlightedTargets = new Set();
    this.pulsePhase = 0;
    this.globalTime = 0;
    this.inspectMode = false;
    this.hoveredItem = null;
    this.mousePos = { x: 0, y: 0 };

    // Simulation Data Store
    this.particles = [];
    this.electrons = [];
    this.ions = [];
    this.molecules = [];
    this.labels = [];

    this._initSharedEntities();
    this._handleResize();
    window.addEventListener('resize', () => this._handleResize());
    this._bindEvents();
    this._startLoop();
  }

  // =========================================================================
  // Standard Global API Methods (as requested in Master Prompt)
  // =========================================================================
  createAtom(config = {}) {
    return {
      type: 'atom',
      x: config.x || 0,
      y: config.y || 0,
      protons: config.protons || 6,
      neutrons: config.neutrons || 6,
      electrons: config.electrons || 6,
      shells: config.shells || [2, 4],
      symbol: config.symbol || 'C'
    };
  }

  createNucleus(protons = 6, neutrons = 6) {
    const list = [];
    const total = protons + neutrons;
    const radius = 36;
    for (let i = 0; i < total; i++) {
      const phi = Math.acos(1 - 2 * (i + 0.5) / total);
      const theta = Math.PI * (1 + Math.sqrt(5)) * (i + 0.5);
      const r = (radius - 10) * Math.cbrt((i + 1) / total);
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      list.push({
        type: i % 2 === 0 && list.filter(p => p.type === 'proton').length < protons ? 'proton' : 'neutron',
        x, y, z, radius: 11
      });
    }
    return list;
  }

  createParticle(type, x, y, options = {}) {
    return {
      type,
      x, y,
      vx: options.vx || (Math.random() - 0.5) * 2,
      vy: options.vy || (Math.random() - 0.5) * 2,
      radius: options.radius || 8,
      color: options.color || '#38bdf8',
      charge: options.charge || 0,
      label: options.label || ''
    };
  }

  createIon(symbol, charge, x, y) {
    return {
      type: 'ion',
      symbol,
      charge,
      x, y,
      radius: 16,
      color: charge > 0 ? '#f43f5e' : (charge < 0 ? '#38bdf8' : '#34d399')
    };
  }

  createMolecule(atoms = [], bonds = []) {
    return { atoms, bonds, x: 0, y: 0, rotation: 0 };
  }

  createBond(atomA, atomB, type = 'single') {
    return { atomA, atomB, type, length: 50 };
  }

  createElectron(radius, speed, angle = 0) {
    return { radius, speed, angle, trail: [], particleRadius: 6 };
  }

  createElectronShell(radius, count) {
    return { radius, count, electrons: [] };
  }

  createReaction(reactants, products, zone) {
    return { reactants, products, zone, progress: 0 };
  }

  createEnergyDiagram(type = 'exothermic', deltaH = -150) {
    return { type, deltaH, activationEnergy: 80 };
  }

  createPHScale(currentPH = 7) {
    return { currentPH, min: 0, max: 14 };
  }

  createPeriodicTable(highlightGroup = null, highlightPeriod = null) {
    return { highlightGroup, highlightPeriod };
  }

  createCell(anode = 'Zn', cathode = 'Cu', electrolyte = 'SO4') {
    return { anode, cathode, electrolyte, currentFlow: true };
  }

  createOrganicMolecule(type = 'alcohol', functionalGroup = '-OH') {
    return { type, functionalGroup };
  }

  animateOrbit(time) { return time * 1.5; }
  animateCollision(time) { return Math.sin(time * 3); }
  animateBondFormation(time) { return (Math.sin(time * 2) + 1) / 2; }
  animateBondBreaking(time) { return (Math.cos(time * 2) + 1) / 2; }
  animateElectronTransfer(time) { return (Math.sin(time * 2.5) + 1) / 2; }
  animateElectronSharing(time) { return Math.sin(time * 2); }
  animateIonMovement(time) { return Math.sin(time * 1.8); }

  highlightConcept(conceptName, duration = 2500) {
    this.highlightedTargets.add(conceptName);
    if (duration > 0) {
      setTimeout(() => {
        if (this.currentVisualState?.highlightTarget !== conceptName) {
          this.highlightedTargets.delete(conceptName);
        }
      }, duration);
    }
  }

  zoomToConcept(zoomLevel = 1.0, offsetX = 0, offsetY = 0) {
    this.camera.targetZoom = zoomLevel;
    this.camera.targetX = offsetX;
    this.camera.targetY = offsetY;
  }

  showLabel(text, x, y, id = null) {
    this.labels.push({ id: id || `label-${Date.now()}`, text, x, y, alpha: 1.0 });
  }

  hideLabel(labelId) {
    this.labels = this.labels.filter(l => l.id !== labelId);
  }

  resetScene() {
    this.particles = [];
    this.electrons = [];
    this.ions = [];
    this.molecules = [];
    this.labels = [];
    this.highlightedTargets.clear();
    this.camera.targetZoom = 1.0;
    this.camera.targetX = 0;
    this.camera.targetY = 0;
  }

  // =========================================================================
  // Initialization & Resizing
  // =========================================================================
  _initSharedEntities() {
    this.nucleusParticles = this.createNucleus(6, 6);
    this.shells = [
      { radius: 110, count: 2, speed: 0.024, tilt: 0.2 },
      { radius: 190, count: 4, speed: 0.016, tilt: -0.15 }
    ];
    this.carbonElectrons = [];
    this.shells.forEach((s, sIdx) => {
      for (let i = 0; i < s.count; i++) {
        this.carbonElectrons.push({
          radius: s.radius,
          angle: (i / s.count) * Math.PI * 2,
          speed: s.speed * (sIdx % 2 === 0 ? 1 : -1),
          particleRadius: 6,
          trail: []
        });
      }
    });
  }

  _handleResize() {
    if (!this.canvas) return;
    const parent = this.canvas.parentElement;
    let w = parent ? parent.clientWidth : 0;
    let h = parent ? parent.clientHeight : 0;

    if (w < 100) w = 820;
    if (h < 100) h = 500;

    this.width = w;
    this.height = h;

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
      this._checkInteractiveHover();
    });

    this.canvas.addEventListener('click', () => {
      if (this.hoveredItem) {
        this.highlightConcept(this.hoveredItem.type, 3000);
      }
    });
  }

  _checkInteractiveHover() {
    const sx = (this.mousePos.x - this.centerX) / this.camera.zoom - this.camera.x;
    const sy = (this.mousePos.y - this.centerY) / this.camera.zoom - this.camera.y;
    this.hoveredItem = null;

    if (this.currentLessonId.includes('atomic')) {
      for (const p of this.nucleusParticles) {
        if (Math.hypot(sx - p.x, sy - p.y) <= p.radius + 4) {
          this.hoveredItem = {
            label: p.type === 'proton' ? 'Proton (p⁺)' : 'Neutron (n⁰)',
            charge: p.type === 'proton' ? '+1' : '0',
            mass: p.type === 'proton' ? '1.007 amu' : '1.008 amu',
            type: p.type === 'proton' ? 'protons' : 'neutrons'
          };
          this.canvas.style.cursor = 'pointer';
          return;
        }
      }
      for (const e of this.carbonElectrons) {
        const ex = Math.cos(e.angle) * e.radius;
        const ey = Math.sin(e.angle) * e.radius * 0.7;
        if (Math.hypot(sx - ex, sy - ey) <= e.particleRadius + 6) {
          this.hoveredItem = { label: 'Electron (e⁻)', charge: '-1', mass: '0.00055 amu', type: 'electrons' };
          this.canvas.style.cursor = 'pointer';
          return;
        }
      }
    }
    this.canvas.style.cursor = 'default';
  }

  // =========================================================================
  // Master Set Scene Config & Render Loop
  // =========================================================================
  setVisualState(state, lessonId, sceneIndex = 0) {
    this.currentVisualState = state || {};
    this.currentLessonId = lessonId || 'school-atomic-structure';
    this.currentSceneIndex = sceneIndex;

    if (state.cameraZoom !== undefined) this.camera.targetZoom = state.cameraZoom;
    if (state.cameraOffset) {
      this.camera.targetX = state.cameraOffset.x || 0;
      this.camera.targetY = state.cameraOffset.y || 0;
    }

    this.highlightedTargets.clear();
    if (state.highlightedParticles) {
      state.highlightedParticles.forEach(h => this.highlightedTargets.add(h));
    }
    if (state.highlightTarget) {
      this.highlightedTargets.add(state.highlightTarget);
    }

    this._updateConceptOverlay(state.focusOverlay);
  }

  triggerParticleHighlight(targetName, durationMs = 2500) {
    this.highlightConcept(targetName, durationMs);
  }

  _updateConceptOverlay(focusOverlay) {
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
    this.camera.zoom += (this.camera.targetZoom - this.camera.zoom) * this.camera.lerpSpeed;
    this.camera.x += (this.camera.targetX - this.camera.x) * this.camera.lerpSpeed;
    this.camera.y += (this.camera.targetY - this.camera.y) * this.camera.lerpSpeed;
    this.pulsePhase = (this.pulsePhase + 0.05) % (Math.PI * 2);

    // Update Atomic electrons
    this.carbonElectrons.forEach(e => {
      e.angle += e.speed * (this.currentVisualState?.electronSpeed || 1.0);
      const ex = Math.cos(e.angle) * e.radius;
      const ey = Math.sin(e.angle) * e.radius * 0.7;
      e.trail.push({ x: ex, y: ey });
      if (e.trail.length > 12) e.trail.shift();
    });

    // Nucleus quantum jitter
    this.nucleusParticles.forEach((p, idx) => {
      p.jitterX = Math.sin(this.globalTime * 3 + idx) * 0.5;
      p.jitterY = Math.cos(this.globalTime * 2.5 + idx * 2) * 0.5;
    });
  }

  _draw() {
    if (!this.ctx) return;
    const ctx = this.ctx;
    ctx.save();
    ctx.scale(this.dpr, this.dpr);
    ctx.clearRect(0, 0, this.width, this.height);

    this._drawBackgroundGrid(ctx);

    ctx.save();
    ctx.translate(this.centerX, this.centerY);
    ctx.scale(this.camera.zoom, this.camera.zoom);
    ctx.translate(this.camera.x, this.camera.y);

    // Render the active lesson's distinct visual animation
    const id = this.currentLessonId;
    if (id === 'school-atomic-structure') {
      this._renderLesson1_AtomicStructure(ctx);
    } else if (id === 'school-chemical-reactions') {
      this._renderLesson2_ChemicalReactions(ctx);
    } else if (id === 'school-acids-bases') {
      this._renderLesson3_AcidsBases(ctx);
    } else if (id === 'school-physical-chemical-changes') {
      this._renderLesson4_PhysicalChemicalChanges(ctx);
    } else if (id === 'school-periodic-table') {
      this._renderLesson5_PeriodicTable(ctx);
    } else if (id === 'college-atomic-quantum') {
      this._renderLesson6_AtomicQuantum(ctx);
    } else if (id === 'college-chemical-bonding') {
      this._renderLesson7_ChemicalBonding(ctx);
    } else if (id === 'college-thermodynamics') {
      this._renderLesson8_Thermodynamics(ctx);
    } else if (id === 'college-electrochemistry') {
      this._renderLesson9_Electrochemistry(ctx);
    } else if (id === 'college-organic-chemistry') {
      this._renderLesson10_OrganicChemistry(ctx);
    } else {
      this._renderLesson1_AtomicStructure(ctx);
    }

    // Draw hover tooltip
    if (this.hoveredItem) {
      this._drawTooltip(ctx, this.hoveredItem);
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

  // =========================================================================
  // 1. SCHOOL: Structure of an Atom
  // =========================================================================
  _renderLesson1_AtomicStructure(ctx) {
    const showNucleus = this.currentVisualState?.showNucleus !== false;
    const showShells = this.currentVisualState?.showShells !== false;
    const showElectrons = this.currentVisualState?.showElectrons !== false;
    const showProtons = this.currentVisualState?.showProtons !== false;
    const showNeutrons = this.currentVisualState?.showNeutrons !== false;

    const hlProtons = this.highlightedTargets.has('protons');
    const hlNeutrons = this.highlightedTargets.has('neutrons');
    const hlElectrons = this.highlightedTargets.has('electrons');
    const hlNucleus = this.highlightedTargets.has('nucleus');

    // 1. Quantum Electron Shells
    if (showShells) {
      this.shells.forEach((shell, idx) => {
        ctx.save();
        const isHl = hlElectrons || this.highlightedTargets.has('shells');
        ctx.beginPath();
        ctx.ellipse(0, 0, shell.radius, shell.radius * 0.7, shell.tilt, 0, Math.PI * 2);
        ctx.strokeStyle = isHl ? `rgba(56, 189, 248, ${0.45 + Math.sin(this.pulsePhase) * 0.25})` : 'rgba(255, 255, 255, 0.12)';
        ctx.lineWidth = isHl ? 2.5 : 1.2;
        ctx.setLineDash([6, 4]);
        ctx.stroke();

        ctx.font = '9px Outfit, sans-serif';
        ctx.fillStyle = isHl ? '#38bdf8' : 'rgba(255, 255, 255, 0.35)';
        ctx.fillText(idx === 0 ? 'K-Shell (n=1, max 2e⁻)' : 'L-Shell (n=2, max 8e⁻)', shell.radius + 6, 4);
        ctx.restore();
      });
    }

    // 2. Orbiting Electrons
    if (showElectrons) {
      this.carbonElectrons.forEach(e => {
        for (let i = 0; i < e.trail.length; i++) {
          const pt = e.trail[i];
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, e.particleRadius * (i / e.trail.length), 0, Math.PI * 2);
          ctx.fillStyle = `rgba(251, 191, 36, ${(i / e.trail.length) * 0.35})`;
          ctx.fill();
        }
        const ex = Math.cos(e.angle) * e.radius;
        const ey = Math.sin(e.angle) * e.radius * 0.7;

        ctx.save();
        ctx.shadowColor = '#fbbf24';
        ctx.shadowBlur = hlElectrons ? 18 + Math.sin(this.pulsePhase * 2) * 6 : 8;
        const grad = ctx.createRadialGradient(ex - 2, ey - 2, 1, ex, ey, e.particleRadius);
        grad.addColorStop(0, '#ffffff');
        grad.addColorStop(0.4, '#fbbf24');
        grad.addColorStop(1, '#d97706');
        ctx.beginPath();
        ctx.arc(ex, ey, e.particleRadius, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        ctx.shadowBlur = 0;
        ctx.font = 'bold 8px Outfit, sans-serif';
        ctx.fillStyle = '#090d16';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('-', ex, ey - 0.5);
        ctx.restore();
      });
    }

    // 3. Central Nucleus Core
    if (showNucleus) {
      ctx.save();
      const nGrad = ctx.createRadialGradient(0, 0, 5, 0, 0, 55);
      nGrad.addColorStop(0, 'rgba(129, 140, 248, 0.4)');
      nGrad.addColorStop(0.7, 'rgba(56, 189, 248, 0.15)');
      nGrad.addColorStop(1, 'rgba(56, 189, 248, 0)');
      ctx.beginPath();
      ctx.arc(0, 0, 55, 0, Math.PI * 2);
      ctx.fillStyle = nGrad;
      ctx.fill();

      if (hlNucleus || this.camera.zoom > 2) {
        ctx.beginPath();
        ctx.arc(0, 0, 44, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(129, 140, 248, ${0.5 + Math.sin(this.pulsePhase) * 0.3})`;
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 4]);
        ctx.stroke();
      }
      ctx.restore();

      const particlesToDraw = this.nucleusParticles.filter(p => (p.type === 'proton' && showProtons) || (p.type === 'neutron' && showNeutrons));
      particlesToDraw.sort((a, b) => a.z - b.z);

      particlesToDraw.forEach(p => {
        const px = p.x + p.jitterX;
        const py = p.y + p.jitterY;
        const isProt = p.type === 'proton';
        const isHl = isProt ? hlProtons : hlNeutrons;
        let pr = p.radius + (isHl ? Math.sin(this.pulsePhase * 2) * 2 : 0);

        ctx.save();
        ctx.shadowColor = isProt ? '#f43f5e' : '#38bdf8';
        ctx.shadowBlur = isHl ? 18 : 6;

        const pGrad = ctx.createRadialGradient(px - pr * 0.35, py - pr * 0.35, pr * 0.1, px, py, pr);
        if (isProt) {
          pGrad.addColorStop(0, '#ffffff');
          pGrad.addColorStop(0.3, '#f43f5e');
          pGrad.addColorStop(0.8, '#e11d48');
          pGrad.addColorStop(1, '#881337');
        } else {
          pGrad.addColorStop(0, '#ffffff');
          pGrad.addColorStop(0.3, '#38bdf8');
          pGrad.addColorStop(0.8, '#0284c7');
          pGrad.addColorStop(1, '#0f172a');
        }
        ctx.beginPath();
        ctx.arc(px, py, pr, 0, Math.PI * 2);
        ctx.fillStyle = pGrad;
        ctx.fill();

        ctx.shadowBlur = 0;
        ctx.font = `bold ${Math.round(pr * 0.85)}px Outfit, sans-serif`;
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(isProt ? '+' : '0', px, py - 0.5);
        ctx.restore();
      });
    }
  }

  // =========================================================================
  // 2. SCHOOL: Chemical Reactions (Collision, Rearrangement, Products)
  // =========================================================================
  _renderLesson2_ChemicalReactions(ctx) {
    ctx.save();
    ctx.font = 'bold 16px Outfit';
    ctx.fillStyle = '#38bdf8';
    ctx.textAlign = 'center';
    ctx.fillText('Chemical Reaction: 2H₂ (Reactants) + O₂ ──⚡ Collision ──> 2H₂O (Products)', 0, -110);

    const t = (Math.sin(this.globalTime * 1.8) + 1) / 2; // 0 to 1 cycle
    const isCollision = t > 0.4 && t < 0.65;
    const isProducts = t >= 0.65;

    // Glowing Reaction Zone Box
    ctx.save();
    ctx.strokeStyle = isCollision ? '#f59e0b' : 'rgba(56, 189, 248, 0.3)';
    ctx.lineWidth = isCollision ? 3 : 1.5;
    ctx.strokeRect(-90, -70, 180, 140);
    ctx.fillStyle = isCollision ? 'rgba(245, 158, 11, 0.15)' : 'rgba(15, 23, 42, 0.5)';
    ctx.fillRect(-89, -69, 178, 138);

    ctx.font = '11px JetBrains Mono';
    ctx.fillStyle = isCollision ? '#fbbf24' : '#64748b';
    ctx.fillText(isCollision ? '💥 ACTIVE COLLISION ZONE' : '⚡ REACTION CHAMBER', 0, -50);
    ctx.restore();

    if (!isProducts) {
      // Reactants moving in: 2 Hydrogen (Blue) and 1 Oxygen (Red)
      const h1x = -160 + t * 140;
      const h2x = -160 + t * 140;
      const ox = 160 - t * 140;

      // H2 Molecule 1
      this._drawDiatomicMolecule(ctx, h1x, -25, '#38bdf8', 'H', 'H');
      // H2 Molecule 2
      this._drawDiatomicMolecule(ctx, h2x, 35, '#38bdf8', 'H', 'H');
      // O2 Molecule
      this._drawDiatomicMolecule(ctx, ox, 5, '#f43f5e', 'O', 'O', 16);

      ctx.font = 'bold 13px Outfit';
      ctx.fillStyle = '#38bdf8';
      ctx.fillText('REACTANTS (Left)', -160, 80);
      ctx.fillStyle = '#f43f5e';
      ctx.fillText('REACTANTS (Right)', 160, 80);
    } else {
      // Products moving out: 2 Water Molecules (H2O)
      const p1x = 70 + (t - 0.65) * 200;
      const p2x = 120 + (t - 0.65) * 150;

      this._drawWaterMolecule(ctx, p1x, -25, this.globalTime);
      this._drawWaterMolecule(ctx, p2x, 35, this.globalTime + 1);

      // Gas bubbles rising
      for (let i = 0; i < 6; i++) {
        const by = 40 - ((this.globalTime * 60 + i * 25) % 90);
        const bx = -40 + (i * 18);
        ctx.beginPath();
        ctx.arc(bx, by, 3 + (i % 3), 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(56, 189, 248, 0.6)';
        ctx.fill();
      }

      ctx.font = 'bold 14px Outfit';
      ctx.fillStyle = '#34d399';
      ctx.fillText('✨ PRODUCTS FORMED (2H₂O)', 140, 95);
      ctx.font = '11px Outfit';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText('Bonds rearranged • Atoms conserved', 140, 115);
    }

    ctx.restore();
  }

  _drawDiatomicMolecule(ctx, x, y, color, sym1, sym2, r = 12) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(x - r * 0.7, y, r, 0, Math.PI * 2);
    ctx.arc(x + r * 0.7, y, r, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();

    ctx.fillStyle = '#fff';
    ctx.font = `bold ${Math.round(r * 0.8)}px Outfit`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(sym1, x - r * 0.7, y);
    ctx.fillText(sym2, x + r * 0.7, y);
    ctx.restore();
  }

  _drawWaterMolecule(ctx, x, y, time) {
    ctx.save();
    // Oxygen
    ctx.beginPath();
    ctx.arc(x, y, 16, 0, Math.PI * 2);
    ctx.fillStyle = '#f43f5e';
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 11px Outfit';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('O', x, y);

    // Hydrogen 1
    const h1x = x - 18;
    const h1y = y - 14;
    ctx.beginPath();
    ctx.arc(h1x, h1y, 9, 0, Math.PI * 2);
    ctx.fillStyle = '#38bdf8';
    ctx.fill();
    ctx.fillStyle = '#090d16';
    ctx.font = 'bold 8px Outfit';
    ctx.fillText('H', h1x, h1y);

    // Hydrogen 2
    const h2x = x + 18;
    const h2y = y - 14;
    ctx.beginPath();
    ctx.arc(h2x, h2y, 9, 0, Math.PI * 2);
    ctx.fillStyle = '#38bdf8';
    ctx.fill();
    ctx.fillStyle = '#090d16';
    ctx.fillText('H', h2x, h2y);
    ctx.restore();
  }

  // =========================================================================
  // 3. SCHOOL: Acids, Bases and Salts (pH Scale 0-14, Beakers, Neutralization)
  // =========================================================================
  _renderLesson3_AcidsBases(ctx) {
    ctx.save();
    ctx.font = 'bold 16px Outfit';
    ctx.fillStyle = '#38bdf8';
    ctx.textAlign = 'center';
    ctx.fillText('Acids (H⁺), Bases (OH⁻), pH Scale & Neutralization', 0, -115);

    // 1. Animated pH Scale (0 to 14)
    const scaleW = 380;
    const scaleH = 22;
    const scaleX = -scaleW / 2;
    const scaleY = -90;

    const grad = ctx.createLinearGradient(scaleX, 0, scaleX + scaleW, 0);
    grad.addColorStop(0, '#ef4444');    // 0 Strong Acid
    grad.addColorStop(0.35, '#f59e0b'); // 5 Weak Acid
    grad.addColorStop(0.5, '#10b981');  // 7 Neutral Water
    grad.addColorStop(0.65, '#06b6d4'); // 9 Weak Base
    grad.addColorStop(1, '#6366f1');    // 14 Strong Base

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.roundRect(scaleX, scaleY, scaleW, scaleH, 6);
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 1;
    ctx.stroke();

    // pH Indicator moving pointer
    const currentPH = 7 + Math.sin(this.globalTime * 1.5) * 6; // Oscillates 1 to 13
    const pointerX = scaleX + (currentPH / 14) * scaleW;

    ctx.beginPath();
    ctx.moveTo(pointerX, scaleY - 6);
    ctx.lineTo(pointerX - 6, scaleY - 14);
    ctx.lineTo(pointerX + 6, scaleY - 14);
    ctx.closePath();
    ctx.fillStyle = '#ffffff';
    ctx.fill();

    ctx.font = 'bold 10px JetBrains Mono';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(`pH: ${currentPH.toFixed(1)}`, pointerX, scaleY - 18);

    ctx.font = '9px Outfit';
    ctx.fillStyle = '#f87171'; ctx.fillText('0 (Acid)', scaleX + 15, scaleY + 34);
    ctx.fillStyle = '#34d399'; ctx.fillText('7 (Neutral)', 0, scaleY + 34);
    ctx.fillStyle = '#818cf8'; ctx.fillText('14 (Base)', scaleX + scaleW - 20, scaleY + 34);

    // 2. Beaker Simulation (Acid on left, Base on right, Neutralization in center)
    // Left Beaker: Acid (HCl with H+ and Cl-)
    this._drawBeaker(ctx, -140, 20, 'Acid (HCl)', 'rgba(239, 68, 68, 0.25)', [
      { text: 'H⁺', col: '#f43f5e' },
      { text: 'Cl⁻', col: '#94a3b8' },
      { text: 'H⁺', col: '#f43f5e' }
    ]);

    // Center Beaker: Neutralization (Salt Water NaCl + H2O)
    this._drawBeaker(ctx, 0, 20, 'Neutralization (NaCl + H₂O)', 'rgba(52, 211, 153, 0.25)', [
      { text: 'H₂O', col: '#38bdf8' },
      { text: 'Na⁺', col: '#818cf8' },
      { text: 'Cl⁻', col: '#34d399' }
    ]);

    // Right Beaker: Base (NaOH with Na+ and OH-)
    this._drawBeaker(ctx, 140, 20, 'Base (NaOH)', 'rgba(99, 102, 241, 0.25)', [
      { text: 'OH⁻', col: '#38bdf8' },
      { text: 'Na⁺', col: '#818cf8' },
      { text: 'OH⁻', col: '#38bdf8' }
    ]);

    ctx.restore();
  }

  _drawBeaker(ctx, x, y, title, liquidCol, ions) {
    ctx.save();
    ctx.strokeStyle = 'rgba(255,255,255,0.4)';
    ctx.lineWidth = 2.5;
    ctx.strokeRect(x - 45, y - 20, 90, 80);

    ctx.fillStyle = liquidCol;
    ctx.fillRect(x - 43, y + 5, 86, 53);

    ctx.font = 'bold 10px Outfit';
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'center';
    ctx.fillText(title, x, y - 26);

    ions.forEach((ion, i) => {
      const ix = x - 25 + (i * 25);
      const iy = y + 20 + Math.sin(this.globalTime * 2 + i) * 6;
      ctx.beginPath();
      ctx.arc(ix, iy, 10, 0, Math.PI * 2);
      ctx.fillStyle = ion.col;
      ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 8px Outfit';
      ctx.textBaseline = 'middle';
      ctx.fillText(ion.text, ix, iy);
    });
    ctx.restore();
  }

  // =========================================================================
  // 4. SCHOOL: Physical and Chemical Changes (State Transition vs Rusting)
  // =========================================================================
  _renderLesson4_PhysicalChemicalChanges(ctx) {
    ctx.save();
    ctx.font = 'bold 16px Outfit';
    ctx.fillStyle = '#38bdf8';
    ctx.textAlign = 'center';
    ctx.fillText('Physical Changes (Reversible) vs Chemical Changes (New Bonds)', 0, -110);

    // Split Screen
    ctx.strokeStyle = 'rgba(255,255,255,0.15)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, -90);
    ctx.lineTo(0, 110);
    ctx.stroke();

    // LEFT: Physical Change (Ice -> Water -> Ice)
    ctx.font = 'bold 13px Outfit';
    ctx.fillStyle = '#38bdf8';
    ctx.fillText('❄️ PHYSICAL CHANGE (Reversible)', -130, -75);

    const tState = (Math.sin(this.globalTime * 1.5) + 1) / 2; // 0 = Solid Ice, 1 = Liquid Water
    ctx.fillStyle = 'rgba(15, 23, 42, 0.7)';
    ctx.fillRect(-220, -55, 180, 120);
    ctx.strokeRect(-220, -55, 180, 120);

    // Particles vibrating in lattice (solid) or flowing (liquid)
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        const bx = -190 + c * 28;
        const by = -30 + r * 24;
        const jitter = (1 - tState) * 1.5 + tState * Math.sin(this.globalTime * 3 + r * c) * 6;
        ctx.beginPath();
        ctx.arc(bx + jitter, by + (tState * 15), 6, 0, Math.PI * 2);
        ctx.fillStyle = tState > 0.5 ? '#38bdf8' : '#e0f2fe';
        ctx.fill();
      }
    }
    ctx.font = '11px Outfit';
    ctx.fillStyle = '#e2e8f0';
    ctx.fillText(tState > 0.5 ? 'Liquid Water (H₂O fluid)' : 'Solid Ice Lattice (H₂O solid)', -130, 85);
    ctx.fillText('Chemical formula remains H₂O', -130, 100);

    // RIGHT: Chemical Change (Iron + Oxygen -> Rust Fe2O3)
    ctx.font = 'bold 13px Outfit';
    ctx.fillStyle = '#f43f5e';
    ctx.fillText('🔥 CHEMICAL CHANGE (New Substance)', 130, -75);

    ctx.fillStyle = 'rgba(15, 23, 42, 0.7)';
    ctx.fillRect(40, -55, 180, 120);
    ctx.strokeRect(40, -55, 180, 120);

    // Iron Bar rusting
    const rustProgress = (Math.sin(this.globalTime * 1.2) + 1) / 2;
    ctx.fillStyle = '#64748b'; // Pure iron
    ctx.fillRect(60, -25, 140, 50);

    // Rust coating
    ctx.fillStyle = `rgba(180, 83, 9, ${rustProgress * 0.9})`;
    ctx.fillRect(60, -25, 140 * rustProgress, 50);

    // Oxygen attacking particles
    for (let i = 0; i < 4; i++) {
      const ox = 70 + (i * 35) + Math.cos(this.globalTime * 2 + i) * 6;
      const oy = -40 + Math.sin(this.globalTime * 2 + i) * 6;
      ctx.beginPath();
      ctx.arc(ox, oy, 5, 0, Math.PI * 2);
      ctx.fillStyle = '#ef4444';
      ctx.fill();
    }

    ctx.font = '11px Outfit';
    ctx.fillStyle = '#fca5a5';
    ctx.fillText('4Fe + 3O₂ ──> 2Fe₂O₃ (Rust)', 130, 85);
    ctx.fillText('Irreversible molecular transformation', 130, 100);

    ctx.restore();
  }

  // =========================================================================
  // 5. SCHOOL: Periodic Table and Classification
  // =========================================================================
  _renderLesson5_PeriodicTable(ctx) {
    ctx.save();
    ctx.font = 'bold 16px Outfit';
    ctx.fillStyle = '#38bdf8';
    ctx.textAlign = 'center';
    ctx.fillText('Modern Periodic Table of Elements (Groups, Periods, Metals)', 0, -115);

    const elements = [
      { sym: 'H', z: 1, name: 'Hydrogen', cat: 'nonmetal', col: 0, row: 0 },
      { sym: 'He', z: 2, name: 'Helium', cat: 'noble', col: 7, row: 0 },
      { sym: 'Li', z: 3, name: 'Lithium', cat: 'alkali', col: 0, row: 1 },
      { sym: 'Be', z: 4, name: 'Beryllium', cat: 'alkaline', col: 1, row: 1 },
      { sym: 'B', z: 5, name: 'Boron', cat: 'metalloid', col: 2, row: 1 },
      { sym: 'C', z: 6, name: 'Carbon', cat: 'nonmetal', col: 3, row: 1 },
      { sym: 'N', z: 7, name: 'Nitrogen', cat: 'nonmetal', col: 4, row: 1 },
      { sym: 'O', z: 8, name: 'Oxygen', cat: 'nonmetal', col: 5, row: 1 },
      { sym: 'F', z: 9, name: 'Fluorine', cat: 'halogen', col: 6, row: 1 },
      { sym: 'Ne', z: 10, name: 'Neon', cat: 'noble', col: 7, row: 1 },
      { sym: 'Na', z: 11, name: 'Sodium', cat: 'alkali', col: 0, row: 2 },
      { sym: 'Mg', z: 12, name: 'Magnesium', cat: 'alkaline', col: 1, row: 2 },
      { sym: 'Al', z: 13, name: 'Aluminum', cat: 'metal', col: 2, row: 2 },
      { sym: 'Si', z: 14, name: 'Silicon', cat: 'metalloid', col: 3, row: 2 },
      { sym: 'P', z: 15, name: 'Phosphorus', cat: 'nonmetal', col: 4, row: 2 },
      { sym: 'S', z: 16, name: 'Sulfur', cat: 'nonmetal', col: 5, row: 2 },
      { sym: 'Cl', z: 17, name: 'Chlorine', cat: 'halogen', col: 6, row: 2 },
      { sym: 'Ar', z: 18, name: 'Argon', cat: 'noble', col: 7, row: 2 }
    ];

    const cellW = 38;
    const cellH = 40;
    const startX = -155;
    const startY = -85;

    // Category Color Map
    const colMap = {
      alkali: '#f43f5e',
      alkaline: '#fbbf24',
      metal: '#38bdf8',
      metalloid: '#34d399',
      nonmetal: '#818cf8',
      halogen: '#c084fc',
      noble: '#ec4899'
    };

    elements.forEach(el => {
      const ex = startX + el.col * (cellW + 6);
      const ey = startY + el.row * (cellH + 6);

      const color = colMap[el.cat] || '#38bdf8';
      const isHl = this.highlightedTargets.has('metals') && (el.cat === 'metal' || el.cat === 'alkali' || el.cat === 'alkaline')
                || this.highlightedTargets.has('nonmetals') && (el.cat === 'nonmetal' || el.cat === 'halogen' || el.cat === 'noble')
                || this.highlightedTargets.has('metalloids') && el.cat === 'metalloid';

      ctx.save();
      ctx.beginPath();
      ctx.roundRect(ex, ey, cellW, cellH, 6);
      ctx.fillStyle = isHl ? 'rgba(255, 255, 255, 0.2)' : 'rgba(15, 23, 42, 0.85)';
      ctx.fill();
      ctx.strokeStyle = isHl ? '#ffffff' : color;
      ctx.lineWidth = isHl ? 2.5 : 1.2;
      ctx.stroke();

      // Number Z
      ctx.font = '8px JetBrains Mono';
      ctx.fillStyle = '#94a3b8';
      ctx.textAlign = 'left';
      ctx.fillText(`${el.z}`, ex + 4, ey + 10);

      // Symbol
      ctx.font = 'bold 12px Outfit';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.fillText(el.sym, ex + cellW / 2, ey + 24);
      ctx.restore();
    });

    // Zoomed In Tile on Carbon (Z=6)
    ctx.save();
    const zx = 0;
    const zy = 65;
    ctx.beginPath();
    ctx.roundRect(zx - 50, zy - 25, 100, 50, 8);
    ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.fill();
    ctx.stroke();

    ctx.font = 'bold 18px Outfit';
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'center';
    ctx.fillText('C', zx, zy - 4);
    ctx.font = '9px JetBrains Mono';
    ctx.fillStyle = '#38bdf8';
    ctx.fillText('Atomic Number: 6', zx, zy + 10);
    ctx.fillText('Carbon (12.011)', zx, zy + 20);
    ctx.restore();

    ctx.restore();
  }

  // =========================================================================
  // 6. COLLEGE: Atomic Structure & Quantum Concepts (Orbitals, Transitions)
  // =========================================================================
  _renderLesson6_AtomicQuantum(ctx) {
    ctx.save();
    ctx.font = 'bold 16px Outfit';
    ctx.fillStyle = '#38bdf8';
    ctx.textAlign = 'center';
    ctx.fillText('Quantum Mechanical Model: Orbitals & Energy Level Transitions', 0, -115);

    // 1. Quantum Energy Ladder Levels (n=1, n=2, n=3, n=4)
    const ladderX = -180;
    const levels = [
      { n: 1, y: 70, e: '-13.6 eV' },
      { n: 2, y: 20, e: '-3.4 eV' },
      { n: 3, y: -20, e: '-1.5 eV' },
      { n: 4, y: -50, e: '-0.85 eV' }
    ];

    levels.forEach(lvl => {
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.5)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(ladderX, lvl.y);
      ctx.lineTo(ladderX + 110, lvl.y);
      ctx.stroke();

      ctx.font = 'bold 10px Outfit';
      ctx.fillStyle = '#38bdf8';
      ctx.textAlign = 'left';
      ctx.fillText(`n = ${lvl.n}`, ladderX + 116, lvl.y + 3);
      ctx.fillStyle = '#94a3b8';
      ctx.font = '9px JetBrains Mono';
      ctx.fillText(lvl.e, ladderX - 55, lvl.y + 3);
    });

    // Photon Emission Wave Transition
    const transT = (Math.sin(this.globalTime * 2) + 1) / 2;
    const electronY = levels[2].y + (levels[0].y - levels[2].y) * transT;

    ctx.beginPath();
    ctx.arc(ladderX + 55, electronY, 7, 0, Math.PI * 2);
    ctx.fillStyle = '#fbbf24';
    ctx.fill();

    // Emitting Photon Wave Packet
    if (transT > 0.5) {
      ctx.strokeStyle = '#c084fc';
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let i = 0; i < 40; i++) {
        const wx = ladderX + 65 + i * 2;
        const wy = levels[1].y + Math.sin(this.globalTime * 15 + i * 0.5) * 5;
        if (i === 0) ctx.moveTo(wx, wy); else ctx.lineTo(wx, wy);
      }
      ctx.stroke();
      ctx.font = '9px JetBrains Mono';
      ctx.fillStyle = '#c084fc';
      ctx.fillText('Photon hν', ladderX + 115, levels[1].y - 8);
    }

    // 2. 3D Atomic Orbital Probability Clouds (s spherical & p dumbbell)
    const orbX = 80;
    const orbY = 10;

    // s-orbital: Spherical Glow
    ctx.save();
    const sGrad = ctx.createRadialGradient(orbX - 50, orbY, 2, orbX - 50, orbY, 32);
    sGrad.addColorStop(0, 'rgba(56, 189, 248, 0.8)');
    sGrad.addColorStop(1, 'rgba(56, 189, 248, 0)');
    ctx.beginPath();
    ctx.arc(orbX - 50, orbY, 32, 0, Math.PI * 2);
    ctx.fillStyle = sGrad;
    ctx.fill();
    ctx.font = 'bold 11px Outfit';
    ctx.fillStyle = '#38bdf8';
    ctx.textAlign = 'center';
    ctx.fillText('s-Orbital (Spherical, l=0)', orbX - 50, orbY + 45);
    ctx.restore();

    // p-orbital: 3D Dumbbell Lobes
    ctx.save();
    ctx.translate(orbX + 50, orbY);
    ctx.rotate(this.globalTime * 0.5);

    // Lobe 1 (Top)
    ctx.beginPath();
    ctx.ellipse(0, -20, 14, 22, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(244, 63, 94, 0.7)';
    ctx.fill();

    // Lobe 2 (Bottom)
    ctx.beginPath();
    ctx.ellipse(0, 20, 14, 22, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(129, 140, 248, 0.7)';
    ctx.fill();

    ctx.restore();
    ctx.font = 'bold 11px Outfit';
    ctx.fillStyle = '#f43f5e';
    ctx.textAlign = 'center';
    ctx.fillText('p-Orbital (Dumbbell, l=1)', orbX + 50, orbY + 45);

    ctx.restore();
  }

  // =========================================================================
  // 7. COLLEGE: Chemical Bonding & Molecular Structure (VSEPR 3D Geometries)
  // =========================================================================
  _renderLesson7_ChemicalBonding(ctx) {
    ctx.save();
    ctx.font = 'bold 16px Outfit';
    ctx.fillStyle = '#38bdf8';
    ctx.textAlign = 'center';
    ctx.fillText('Chemical Bonding: Ionic Transfer vs Covalent Overlap & VSEPR', 0, -115);

    const subMode = this.currentVisualState?.subMode || 'covalent';

    if (subMode === 'ionic') {
      // Ionic Electron Transfer: Na (donor) -> Cl (acceptor)
      const nax = -90, clx = 90;
      ctx.beginPath();
      ctx.arc(nax, 0, 28, 0, Math.PI * 2);
      ctx.fillStyle = '#818cf8';
      ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 12px Outfit';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('Na⁺', nax, 0);

      ctx.beginPath();
      ctx.arc(clx, 0, 36, 0, Math.PI * 2);
      ctx.fillStyle = '#10b981';
      ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.fillText('Cl⁻', clx, 0);

      const t = (Math.sin(this.globalTime * 2) + 1) / 2;
      const ex = nax + (clx - nax) * t;
      const ey = -35 * Math.sin(t * Math.PI);
      ctx.beginPath();
      ctx.arc(ex, ey, 6.5, 0, Math.PI * 2);
      ctx.fillStyle = '#fbbf24';
      ctx.fill();

      ctx.font = 'bold 12px Outfit';
      ctx.fillStyle = '#fbbf24';
      ctx.fillText('e⁻ Electron Transfer (Ionic Attraction)', 0, 70);
    } else {
      // 3D VSEPR Tetrahedral Molecule (CH4 Methane)
      const rot = this.globalTime * 0.8;
      const cx = 0, cy = 0;

      // Carbon Core
      ctx.beginPath();
      ctx.arc(cx, cy, 22, 0, Math.PI * 2);
      ctx.fillStyle = '#38bdf8';
      ctx.fill();
      ctx.fillStyle = '#090d16';
      ctx.font = 'bold 11px Outfit';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('C', cx, cy);

      // 4 Hydrogens in Tetrahedral coordinates
      const angles = [0, 2.09, 4.18];
      angles.forEach((ang, i) => {
        const hx = cx + Math.cos(ang + rot) * 75;
        const hy = cy + Math.sin(ang + rot) * 55;

        // Bond stick
        ctx.strokeStyle = 'rgba(255,255,255,0.4)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(hx, hy);
        ctx.stroke();

        // Hydrogen
        ctx.beginPath();
        ctx.arc(hx, hy, 12, 0, Math.PI * 2);
        ctx.fillStyle = '#f43f5e';
        ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 9px Outfit';
        ctx.fillText('H', hx, hy);
      });

      // Top Hydrogen
      ctx.strokeStyle = 'rgba(255,255,255,0.4)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx, cy - 75);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(cx, cy - 75, 12, 0, Math.PI * 2);
      ctx.fillStyle = '#f43f5e';
      ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 9px Outfit';
      ctx.fillText('H', cx, cy - 75);

      ctx.font = 'bold 12px Outfit';
      ctx.fillStyle = '#34d399';
      ctx.fillText('Tetrahedral Geometry (109.5° Bond Angles)', 0, 80);
    }
    ctx.restore();
  }

  // =========================================================================
  // 8. COLLEGE: Thermodynamics & Chemical Equilibrium
  // =========================================================================
  _renderLesson8_Thermodynamics(ctx) {
    ctx.save();
    ctx.font = 'bold 16px Outfit';
    ctx.fillStyle = '#38bdf8';
    ctx.textAlign = 'center';
    ctx.fillText('Thermodynamics: Enthalpy (ΔH), Entropy (ΔS) & Dynamic Equilibrium', 0, -115);

    // 1. Exothermic Potential Energy Curve on Left
    const diagX = -180;
    const diagY = 50;

    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(diagX, diagY);
    ctx.lineTo(diagX + 130, diagY);
    ctx.moveTo(diagX, diagY);
    ctx.lineTo(diagX, diagY - 110);
    ctx.stroke();

    // Reaction Profile (Hill)
    ctx.strokeStyle = '#f43f5e';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(diagX + 10, diagY - 50); // Reactants
    ctx.quadraticCurveTo(diagX + 55, diagY - 120, diagX + 115, diagY - 15); // Products (lower)
    ctx.stroke();

    ctx.font = 'bold 9px Outfit';
    ctx.fillStyle = '#38bdf8'; ctx.fillText('Reactants', diagX + 25, diagY - 55);
    ctx.fillStyle = '#34d399'; ctx.fillText('Products', diagX + 100, diagY - 20);
    ctx.fillStyle = '#f87171'; ctx.fillText('ΔH < 0 (Exothermic)', diagX + 65, diagY + 18);

    // 2. Dynamic Equilibrium Forward & Reverse Flow on Right
    const eqX = 80;
    const eqY = -15;

    ctx.font = 'bold 14px Outfit';
    ctx.fillStyle = '#38bdf8';
    ctx.fillText('A + B  ⇌  C + D', eqX, eqY - 30);

    // Double Dynamic Flow Arrows
    const arrowProgress = (Math.sin(this.globalTime * 3) + 1) / 2;
    ctx.strokeStyle = '#34d399';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(eqX - 45, eqY);
    ctx.lineTo(eqX + 45, eqY);
    ctx.stroke();

    ctx.strokeStyle = '#f59e0b';
    ctx.beginPath();
    ctx.moveTo(eqX + 45, eqY + 16);
    ctx.lineTo(eqX - 45, eqY + 16);
    ctx.stroke();

    ctx.font = '11px Outfit';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('Forward Rate = Reverse Rate', eqX, eqY + 45);
    ctx.fillStyle = '#a7f3d0';
    ctx.fillText('Dynamic Equilibrium (K_eq)', eqX, eqY + 62);

    ctx.restore();
  }

  // =========================================================================
  // 9. COLLEGE: Electrochemistry & Redox Reactions (Daniell Cell)
  // =========================================================================
  _renderLesson9_Electrochemistry(ctx) {
    ctx.save();
    ctx.font = 'bold 16px Outfit';
    ctx.fillStyle = '#38bdf8';
    ctx.textAlign = 'center';
    ctx.fillText('Electrochemistry: Galvanic Daniell Cell & Electron Flow', 0, -115);

    // 1. Zinc Anode Beaker (Left)
    const zx = -90, zy = 20;
    ctx.strokeStyle = 'rgba(255,255,255,0.4)';
    ctx.lineWidth = 2;
    ctx.strokeRect(zx - 40, zy - 30, 80, 80);
    ctx.fillStyle = 'rgba(56, 189, 248, 0.2)';
    ctx.fillRect(zx - 38, zy - 5, 76, 53);

    // Zinc Electrode
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(zx - 10, zy - 45, 20, 80);
    ctx.font = 'bold 9px Outfit';
    ctx.fillStyle = '#fff';
    ctx.fillText('Zn Anode (-)', zx, zy - 52);

    // 2. Copper Cathode Beaker (Right)
    const cx = 90, cy = 20;
    ctx.strokeRect(cx - 40, cy - 30, 80, 80);
    ctx.fillStyle = 'rgba(59, 130, 246, 0.3)';
    ctx.fillRect(cx - 38, cy - 5, 76, 53);

    // Copper Electrode
    ctx.fillStyle = '#d97706';
    ctx.fillRect(cx - 10, cy - 45, 20, 80);
    ctx.fillStyle = '#fff';
    ctx.fillText('Cu Cathode (+)', cx, cy - 52);

    // 3. Salt Bridge (U-Shape)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.lineWidth = 14;
    ctx.beginPath();
    ctx.moveTo(zx + 20, zy + 15);
    ctx.lineTo(zx + 20, zy - 20);
    ctx.lineTo(cx - 20, cy - 20);
    ctx.lineTo(cx - 20, cy + 15);
    ctx.stroke();

    ctx.font = '8px JetBrains Mono';
    ctx.fillStyle = '#090d16';
    ctx.fillText('Salt Bridge', 0, zy - 17);

    // 4. External Wire & Moving Electrons
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(zx, zy - 45);
    ctx.lineTo(zx, zy - 80);
    ctx.lineTo(cx, cy - 80);
    ctx.lineTo(cx, cy - 45);
    ctx.stroke();

    const tE = (this.globalTime * 2) % 1;
    const wireEx = zx + (cx - zx) * tE;
    ctx.beginPath();
    ctx.arc(wireEx, zy - 80, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.font = 'bold 8px JetBrains Mono';
    ctx.fillStyle = '#090d16';
    ctx.fillText('e⁻', wireEx, zy - 80);

    ctx.font = 'bold 11px Outfit';
    ctx.fillStyle = '#34d399';
    ctx.fillText('Spontaneous e⁻ Flow (Anode → Cathode)', 0, 85);
    ctx.restore();
  }

  // =========================================================================
  // 10. COLLEGE: Organic Chemistry — Functional Groups & Reactions
  // =========================================================================
  _renderLesson10_OrganicChemistry(ctx) {
    ctx.save();
    ctx.font = 'bold 16px Outfit';
    ctx.fillStyle = '#38bdf8';
    ctx.textAlign = 'center';
    ctx.fillText('Organic Chemistry: Carbon Frameworks & Key Functional Groups', 0, -115);

    // Display 4 Major Functional Groups side by side
    const groups = [
      { name: 'Alcohol', formula: 'R ── OH', color: '#f43f5e', x: -140, y: -20 },
      { name: 'Aldehyde', formula: 'R ── CHO', color: '#38bdf8', x: -45, y: -20 },
      { name: 'Ketone', formula: 'R ── CO ── R', color: '#818cf8', x: 50, y: -20 },
      { name: 'Carboxylic Acid', formula: 'R ── COOH', color: '#34d399', x: 145, y: -20 }
    ];

    groups.forEach(g => {
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(g.x - 42, g.y - 35, 84, 70, 8);
      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      ctx.strokeStyle = g.color;
      ctx.lineWidth = 1.8;
      ctx.fill();
      ctx.stroke();

      ctx.font = 'bold 11px Outfit';
      ctx.fillStyle = g.color;
      ctx.textAlign = 'center';
      ctx.fillText(g.name, g.x, g.y - 15);

      ctx.font = 'bold 12px JetBrains Mono';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(g.formula, g.x, g.y + 12);
      ctx.restore();
    });

    // Nucleophilic Attack Mechanism with Curved Arrow
    const mechY = 65;
    ctx.font = 'bold 12px JetBrains Mono';
    ctx.fillStyle = '#38bdf8';
    ctx.textAlign = 'center';
    ctx.fillText('Nu:⁻  ──────>  R ── C⁺=O   (Nucleophilic Addition)', 0, mechY);

    // Curved Arrow
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(-20, mechY - 15, 25, Math.PI * 0.8, Math.PI * 1.8);
    ctx.stroke();

    ctx.font = '10px Outfit';
    ctx.fillStyle = '#a7f3d0';
    ctx.fillText('Curved arrow denotes electron pair movement from nucleophile to carbonyl carbon', 0, mechY + 22);

    ctx.restore();
  }

  _drawTooltip(ctx, item) {
    const px = this.mousePos.x - this.centerX;
    const py = this.mousePos.y - this.centerY;
    ctx.save();
    ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1.2;

    ctx.beginPath();
    ctx.roundRect(px + 12, py - 30, 130, 50, 6);
    ctx.fill();
    ctx.stroke();

    ctx.font = 'bold 11px Outfit, sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'left';
    ctx.fillText(item.label, px + 20, py - 12);

    ctx.font = '10px JetBrains Mono, monospace';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText(`Charge: ${item.charge}`, px + 20, py + 2);
    if (item.mass) ctx.fillText(`Mass: ${item.mass}`, px + 20, py + 14);
    ctx.restore();
  }
}

window.ChemistryAnimationEngine = ChemistryAnimationEngine;
window.AtomAnimationEngine = ChemistryAnimationEngine; // Backward compatibility alias
