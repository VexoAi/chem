/**
 * LESSON 6 — COLLEGE: Atomic Structure and Quantum Concepts
 * Exact 8-scene sequence matching Master Prompt specification.
 */

window.CollegeAtomicQuantumLesson = {
  id: 'college-atomic-quantum',
  title: 'Atomic Structure and Quantum Concepts',
  level: 'college',
  levelLabel: 'College Chemistry',
  icon: '⚛️',
  duration: '4–6 min',
  estimatedSeconds: 260,
  shortDesc: 'Analyze quantum wave functions, s, p, d, f orbitals, electron transitions, and quantum numbers.',
  subConcepts: [
    'Fundamental particles',
    'Atomic number',
    'Mass number',
    'Isotopes',
    'Bohr model',
    'Energy levels',
    'Orbitals',
    's, p, d and f orbitals',
    'Electron configuration',
    'Quantum numbers',
    'Basic quantum mechanical model',
    'Summary'
  ],
  quiz: [
    {
      question: 'What is the characteristic geometric shape of a p-orbital?',
      options: ['Spherical', 'Dumbbell-shaped (two lobes along axis)', 'Cloverleaf', 'Donut-ring'],
      correctIndex: 1,
      explanation: 'p-orbitals have an azimuthal quantum number l = 1 and possess two directional lobes forming a dumbbell.'
    },
    {
      question: 'What happens when an excited electron falls back to a lower energy level?',
      options: [
        'It destroys a proton',
        'It emits electromagnetic radiation (a photon with energy E = hν)',
        'It absorbs heat permanently',
        'It turns into a neutron'
      ],
      correctIndex: 1,
      explanation: 'An electron relaxation releases quantized energy as a photon with frequency ν = ΔE/h.'
    }
  ],
  sampleTeacherSpeech: "Welcome to advanced college atomic chemistry. Today we explore quantum mechanical atomic theory. Beyond classical Bohr orbits, electrons exist in probabilistic 3D wave functions called atomic orbitals—designated as s, p, d, and f. Four quantum numbers describe energy, shape, spatial orientation, and spin.",

  steps: [
    {
      stepNumber: 1,
      title: 'Fundamental Particles & Building the Quantum Atom',
      subConcept: 'Fundamental particles',
      duration: 35,
      voiceText: 'Subatomic matter is built from protons, neutrons, and electrons. Protons and neutrons form the dense nucleus, surrounded by a probabilistic electron cloud.',
      captionText: 'Fundamental Particles: Protons (+1), Neutrons (0), Electrons (-1).',
      takeaway: 'Subatomic particles interact via electromagnetic and strong nuclear forces.',
      animationAction: 'createParticle',
      highlightTarget: 'fundamental-particles',
      visualState: { mode: 'quantum', subMode: 'particles', cameraZoom: 1.0 }
    },
    {
      stepNumber: 2,
      title: 'Atomic Number & Mass Number',
      subConcept: 'Atomic number',
      duration: 35,
      voiceText: 'The atomic number Z equals the number of protons, identifying the element. The mass number A equals the sum of protons plus neutrons.',
      captionText: 'Atomic Number Z = Protons • Mass Number A = Protons + Neutrons.',
      takeaway: 'Mass Number A = Z + N defines nuclear mass.',
      animationAction: 'createNucleus',
      highlightTarget: 'atomic-mass-number',
      visualState: { mode: 'quantum', subMode: 'az-numbers', cameraZoom: 1.1 }
    },
    {
      stepNumber: 3,
      title: 'Isotopes: Varying Neutron Counts',
      subConcept: 'Isotopes',
      duration: 35,
      voiceText: 'Isotopes are atoms of the same chemical element with identical proton counts but different numbers of neutrons, such as Carbon-12 and radioactive Carbon-14.',
      captionText: 'Isotopes: Same Z (Protons), Different N (Neutrons) (e.g., ¹²C vs ¹⁴C).',
      takeaway: 'Isotopes exhibit identical chemical reactivity but different nuclear stability.',
      animationAction: 'createNucleus',
      highlightTarget: 'isotopes',
      visualState: { mode: 'quantum', subMode: 'isotopes', cameraZoom: 1.15 }
    },
    {
      stepNumber: 4,
      title: 'Bohr Model & Quantized Energy Levels',
      subConcept: 'Bohr model',
      duration: 35,
      voiceText: 'Niels Bohr showed that electrons occupy discrete, quantized energy levels designated by the principal quantum number n equals 1, 2, 3, and beyond.',
      captionText: 'Bohr Model: Quantized energy levels n=1 (-13.6 eV), n=2 (-3.4 eV), n=3 (-1.5 eV).',
      takeaway: 'Electron orbits are quantized into discrete principal energy shells.',
      animationAction: 'createEnergyDiagram',
      highlightTarget: 'bohr-energy-levels',
      visualState: { mode: 'quantum', subMode: 'energy-levels', cameraZoom: 1.05 }
    },
    {
      stepNumber: 5,
      title: 'Electron Transitions & Photon Emission',
      subConcept: 'Electron transitions',
      duration: 35,
      voiceText: 'When an electron absorbs energy, it jumps to a higher level. When it falls back down, it emits a photon with quantized energy equal to Planck\'s constant times frequency.',
      captionText: 'Photon Emission: ΔE = hν (Quantized spectral line emission).',
      takeaway: 'Electron relaxation emits electromagnetic radiation of exact wavelength.',
      animationAction: 'animateElectronTransfer',
      highlightTarget: 'photon-transition',
      visualState: { mode: 'quantum', subMode: 'photon-emission', cameraZoom: 1.1 }
    },
    {
      stepNumber: 6,
      title: 'Atomic Orbitals: s, p, d, f Probability Clouds',
      subConcept: 's, p, d and f orbitals',
      duration: 35,
      voiceText: 'Quantum mechanics defines orbitals as 3D probability clouds. s-orbitals are spherical, while p-orbitals form directional dumbbell shapes along the x, y, and z axes.',
      captionText: 'Orbitals: s (Spherical, l=0) • p (Dumbbell px, py, pz, l=1) • d (Cloverleaf, l=2).',
      takeaway: 'Orbitals map the 90% probability boundary surface of finding an electron.',
      animationAction: 'createParticle',
      highlightTarget: 'orbitals-spdf',
      visualState: { mode: 'quantum', subMode: 'orbitals-3d', cameraZoom: 1.15 }
    },
    {
      stepNumber: 7,
      title: 'Electron Configuration & Aufbau Principle',
      subConcept: 'Electron configuration',
      duration: 35,
      voiceText: 'Electrons fill atomic subshells in order of increasing energy according to the Aufbau principle, Hund\'s rule, and the Pauli exclusion principle.',
      captionText: 'Aufbau Filling Order: 1s → 2s → 2p → 3s → 3p → 4s → 3d.',
      takeaway: 'Subshell filling rules determine periodic chemical properties.',
      animationAction: 'createElectronShell',
      highlightTarget: 'electron-config',
      visualState: { mode: 'quantum', subMode: 'aufbau-ladder', cameraZoom: 1.05 }
    },
    {
      stepNumber: 8,
      title: 'Quantum Concepts Summary',
      subConcept: 'Summary',
      duration: 35,
      voiceText: 'To summarize, quantum atomic theory maps matter from fundamental particles and energy levels to 3D atomic orbitals and electronic configurations.',
      captionText: 'Summary: Particles → Energy Levels → Quantum Orbitals → Electron Configuration.',
      takeaway: 'Quantum mechanics provides the fundamental foundation of all modern chemistry.',
      animationAction: 'createAtom',
      highlightTarget: 'quantum-summary',
      visualState: { mode: 'quantum', subMode: 'summary', cameraZoom: 1.0 }
    }
  ]
};
