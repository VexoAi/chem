/**
 * Atomic Structure Topic Definition
 * Exact 6-step sequence with voice narration scripts, live subtitles,
 * visual state parameters, camera zoom targets, and particle highlight cues.
 */

window.AtomicStructureTopic = {
  id: 'atomic-structure',
  title: 'Atomic Structure & Subatomic Particles',
  shortTitle: 'Atomic Structure',
  category: 'Fundamental Chemistry',
  element: 'Carbon-12 (C)',
  atomicNumber: 6,
  massNumber: 12,
  protonsCount: 6,
  neutronsCount: 6,
  electronsCount: 6,
  electronConfig: [2, 4], // K-shell: 2, L-shell: 4
  
  steps: [
    {
      stepNumber: 1,
      title: 'The Fundamental Atom',
      badge: 'Step 1 of 6',
      // Exact script requested
      voiceText: 'An atom is the basic unit of matter. It consists of a central nucleus surrounded by electrons.',
      captionText: 'An atom consists of a nucleus and electrons.',
      takeaway: 'An atom consists of a nucleus and electrons.',
      
      // Visual simulation parameters
      visualState: {
        cameraZoom: 1.0,
        cameraOffset: { x: 0, y: 0 },
        showNucleus: true,
        showProtons: true,
        showNeutrons: true,
        showElectrons: true,
        showShells: true,
        nucleusGlow: 0.5,
        electronSpeed: 1.0,
        highlightedParticles: ['atom'],
        focusOverlay: {
          icon: '⚛️',
          title: 'The Fundamental Atom',
          desc: 'Basic building block of all elements, made of a central nucleus and orbiting electrons.'
        }
      },

      // Substring cues for synchronizing speech with visual micro-animations
      cues: [
        { phrase: 'basic unit of matter', timePercent: 0.1, highlight: 'atom' },
        { phrase: 'central nucleus', timePercent: 0.45, highlight: 'nucleus', pulse: true },
        { phrase: 'surrounded by electrons', timePercent: 0.75, highlight: 'electrons', pulse: true }
      ]
    },

    {
      stepNumber: 2,
      title: 'Zooming into the Nucleus',
      badge: 'Step 2 of 6',
      // Exact script requested
      voiceText: 'At the center of the atom is the nucleus. The nucleus contains protons and neutrons.',
      captionText: 'The nucleus contains protons and neutrons.',
      takeaway: 'The nucleus contains protons and neutrons.',
      
      visualState: {
        cameraZoom: 2.8,
        cameraOffset: { x: 0, y: 0 },
        showNucleus: true,
        showProtons: true,
        showNeutrons: true,
        showElectrons: false, // zoomed-in focus on core
        showShells: false,
        nucleusGlow: 1.0,
        electronSpeed: 0.5,
        highlightedParticles: ['nucleus'],
        focusOverlay: {
          icon: '🎯',
          title: 'The Atomic Nucleus',
          desc: 'Ultra-dense core containing over 99.9% of atomic mass, packed with protons and neutrons.'
        }
      },

      cues: [
        { phrase: 'center of the atom', timePercent: 0.08, highlight: 'nucleus' },
        { phrase: 'the nucleus', timePercent: 0.28, highlight: 'nucleus', pulse: true },
        { phrase: 'protons', timePercent: 0.62, highlight: 'protons', pulse: true },
        { phrase: 'neutrons', timePercent: 0.82, highlight: 'neutrons', pulse: true }
      ]
    },

    {
      stepNumber: 3,
      title: 'Protons: Positive Charge (+)',
      badge: 'Step 3 of 6',
      // Exact script requested
      voiceText: 'Protons have a positive electrical charge.',
      captionText: 'Proton = Positive charge',
      takeaway: 'Proton = Positive charge (+1)',
      
      visualState: {
        cameraZoom: 3.3,
        cameraOffset: { x: 0, y: 0 },
        showNucleus: true,
        showProtons: true,
        showNeutrons: true,
        showElectrons: false,
        showShells: false,
        nucleusGlow: 0.7,
        highlightedParticles: ['protons'],
        protonPulse: true,
        focusOverlay: {
          icon: '🔴',
          title: 'Proton (p⁺)',
          desc: 'Positively charged particle (+1e). The number of protons determines the atomic number.'
        }
      },

      cues: [
        { phrase: 'Protons', timePercent: 0.1, highlight: 'protons', pulse: true },
        { phrase: 'positive electrical charge', timePercent: 0.45, highlight: 'protons', pulse: true }
      ]
    },

    {
      stepNumber: 4,
      title: 'Neutrons: Neutral Particles (0)',
      badge: 'Step 4 of 6',
      // Exact script requested
      voiceText: 'Neutrons have no electrical charge. They are electrically neutral.',
      captionText: 'Neutron = No charge',
      takeaway: 'Neutron = No charge (0)',
      
      visualState: {
        cameraZoom: 3.3,
        cameraOffset: { x: 0, y: 0 },
        showNucleus: true,
        showProtons: true,
        showNeutrons: true,
        showElectrons: false,
        showShells: false,
        nucleusGlow: 0.7,
        highlightedParticles: ['neutrons'],
        neutronPulse: true,
        focusOverlay: {
          icon: '⚪',
          title: 'Neutron (n⁰)',
          desc: 'Electrically neutral particle (0 charge). Adds nuclear binding force to hold protons together.'
        }
      },

      cues: [
        { phrase: 'Neutrons', timePercent: 0.08, highlight: 'neutrons', pulse: true },
        { phrase: 'no electrical charge', timePercent: 0.35, highlight: 'neutrons' },
        { phrase: 'electrically neutral', timePercent: 0.72, highlight: 'neutrons', pulse: true }
      ]
    },

    {
      stepNumber: 5,
      title: 'Electrons & Energy Shells (-)',
      badge: 'Step 5 of 6',
      // Exact script requested
      voiceText: 'Electrons have a negative electrical charge and move around the nucleus in regions called electron shells.',
      captionText: 'Electron = Negative charge',
      takeaway: 'Electron = Negative charge (-1)',
      
      visualState: {
        cameraZoom: 1.15,
        cameraOffset: { x: 0, y: 0 },
        showNucleus: true,
        showProtons: true,
        showNeutrons: true,
        showElectrons: true,
        showShells: true,
        electronSpeed: 2.0,
        highlightedParticles: ['electrons', 'shells'],
        electronPulse: true,
        focusOverlay: {
          icon: '🔵',
          title: 'Electrons & Shells (e⁻)',
          desc: 'Negatively charged particles (-1e) orbiting in quantized electron energy levels (K, L shells).'
        }
      },

      cues: [
        { phrase: 'Electrons', timePercent: 0.05, highlight: 'electrons', pulse: true },
        { phrase: 'negative electrical charge', timePercent: 0.28, highlight: 'electrons' },
        { phrase: 'move around the nucleus', timePercent: 0.52, highlight: 'shells' },
        { phrase: 'electron shells', timePercent: 0.78, highlight: 'shells', pulse: true }
      ]
    },

    {
      stepNumber: 6,
      title: 'Complete Atomic Architecture',
      badge: 'Step 6 of 6',
      // Exact script requested
      voiceText: 'So, an atom is made up of protons, neutrons and electrons. The protons and neutrons are located in the nucleus, while electrons occupy the space around it.',
      captionText: 'Atom = Protons + Neutrons + Electrons',
      takeaway: 'Atom = Protons + Neutrons + Electrons',
      
      visualState: {
        cameraZoom: 1.0,
        cameraOffset: { x: 0, y: 0 },
        showNucleus: true,
        showProtons: true,
        showNeutrons: true,
        showElectrons: true,
        showShells: true,
        electronSpeed: 1.2,
        nucleusGlow: 0.9,
        fullGlow: true,
        highlightedParticles: ['atom', 'protons', 'neutrons', 'electrons'],
        focusOverlay: {
          icon: '🌟',
          title: 'Complete Atom Architecture',
          desc: 'Balanced harmony: Protons (+) and Neutrons (0) in the dense core with Electrons (-) in orbit.'
        }
      },

      cues: [
        { phrase: 'protons, neutrons and electrons', timePercent: 0.18, highlight: 'atom' },
        { phrase: 'located in the nucleus', timePercent: 0.52, highlight: 'nucleus', pulse: true },
        { phrase: 'electrons occupy the space', timePercent: 0.78, highlight: 'electrons', pulse: true }
      ]
    }
  ]
};
