/**
 * LESSON 7 — COLLEGE: Chemical Bonding and Molecular Structure
 * Exact 8-scene sequence matching Master Prompt specification.
 */

window.CollegeChemicalBondingLesson = {
  id: 'college-chemical-bonding',
  title: 'Chemical Bonding and Molecular Structure',
  level: 'college',
  levelLabel: 'College Chemistry',
  icon: '🔗',
  duration: '4–6 min',
  estimatedSeconds: 260,
  shortDesc: 'Investigate potential energy minima, ionic/covalent bonds, Lewis structures, electronegativity, and 3D VSEPR geometries.',
  subConcepts: [
    'Why atoms form bonds',
    'Valence electrons',
    'Ionic bonding',
    'Covalent bonding',
    'Coordinate bonding',
    'Lewis structures',
    'Electronegativity',
    'Polar and non-polar bonds',
    'Molecular geometry',
    'VSEPR concept',
    'Examples of molecules'
  ],
  quiz: [
    {
      question: 'According to VSEPR theory, what is the spatial geometry of a methane (CH₄) molecule?',
      options: ['Linear (180°)', 'Trigonal Planar (120°)', 'Tetrahedral (109.5° bond angle)', 'Square Planar'],
      correctIndex: 2,
      explanation: 'With 4 bonding pairs and 0 lone pairs around carbon, methane adopts a symmetric 3D tetrahedral shape.'
    },
    {
      question: 'What fundamentally distinguishes ionic bonding from covalent bonding?',
      options: [
        'Ionic bonding involves complete electron transfer forming ions; covalent involves sharing electron pairs',
        'Ionic bonding only occurs in gases',
        'Covalent bonds are always between metals',
        'Ionic bonds do not involve electrons'
      ],
      correctIndex: 0,
      explanation: 'Ionic bonding is electrostatic attraction between transferred cations and anions; covalent bonding is electron pair sharing.'
    }
  ],
  sampleTeacherSpeech: "Today we explore advanced chemical bonding. Chemical bonds form as valence electrons interact to minimize total potential energy. In covalent bonds, overlapping orbitals share electron density, while in ionic bonds, electron transfer creates electrostatic crystal lattices. VSEPR theory predicts 3D geometries based on valence electron pair repulsion.",

  steps: [
    {
      stepNumber: 1,
      title: 'Why Atoms Bond (Potential Energy Minimum)',
      subConcept: 'Why atoms form bonds',
      duration: 35,
      voiceText: 'Atoms form bonds to achieve stable octet configurations and minimize their net electrostatic potential energy at the equilibrium bond distance.',
      captionText: 'Bond Formation: Minimizes potential energy curve at optimal internuclear distance.',
      takeaway: 'Chemical bonds represent thermodynamic energetic minima between interacting atoms.',
      animationAction: 'createBond',
      highlightTarget: 'potential-well',
      visualState: { mode: 'bonding', subMode: 'potential-well', cameraZoom: 1.0 }
    },
    {
      stepNumber: 2,
      title: 'Valence Electrons: The Outer Shell',
      subConcept: 'Valence electrons',
      duration: 35,
      voiceText: 'Valence electrons are the electrons residing in the outermost energy shell, and they directly participate in chemical bonding.',
      captionText: 'Valence Electrons: Outermost shell electrons that govern chemical reactivity.',
      takeaway: 'The number of valence electrons determines bonding capacity and valency.',
      animationAction: 'createElectronShell',
      highlightTarget: 'valence-electrons',
      visualState: { mode: 'bonding', subMode: 'valence', cameraZoom: 1.1 }
    },
    {
      stepNumber: 3,
      title: 'Ionic Bonding: Electron Transfer',
      subConcept: 'Ionic bonding',
      duration: 35,
      voiceText: 'In an ionic bond, one atom transfers electrons to another, creating a positive cation and a negative anion held together by electrostatic attraction.',
      captionText: 'Ionic Bond: Electron transfer (Na⁺ + Cl⁻ → NaCl crystal lattice).',
      takeaway: 'Ionic bonds form between metals and non-metals via electrostatic crystal forces.',
      animationAction: 'animateElectronTransfer',
      highlightTarget: 'ionic-transfer',
      visualState: { mode: 'bonding', subMode: 'ionic', cameraZoom: 1.15 }
    },
    {
      stepNumber: 4,
      title: 'Covalent Bonding: Electron Sharing',
      subConcept: 'Covalent bonding',
      duration: 35,
      voiceText: 'In a covalent bond, non-metal atoms approach and constructively overlap their atomic orbitals, sharing electron pairs to achieve full valence shells.',
      captionText: 'Covalent Bond: Shared electron pairs form stable molecular orbitals (e.g. H₂O).',
      takeaway: 'Covalent bonding shares electron pairs between electronegative non-metals.',
      animationAction: 'animateElectronSharing',
      highlightTarget: 'covalent-sharing',
      visualState: { mode: 'bonding', subMode: 'covalent', cameraZoom: 1.1 }
    },
    {
      stepNumber: 5,
      title: 'Lewis Electron Dot Structures',
      subConcept: 'Lewis structures',
      duration: 35,
      voiceText: 'Lewis structures represent valence electrons as dots around element symbols, clearly distinguishing bonding electron pairs from non-bonding lone pairs.',
      captionText: 'Lewis Structures: Dot diagrams showing bonding pairs and non-bonding lone pairs.',
      takeaway: 'Lewis dot formulas predict connectivity and valence electron distribution.',
      animationAction: 'createMolecule',
      highlightTarget: 'lewis-structure',
      visualState: { mode: 'bonding', subMode: 'lewis', cameraZoom: 1.1 }
    },
    {
      stepNumber: 6,
      title: 'Electronegativity & Polar Bonds',
      subConcept: 'Electronegativity',
      duration: 35,
      voiceText: 'When bonded atoms differ in electronegativity, electrons are shared unequally, creating partial positive and negative charges with a permanent dipole moment.',
      captionText: 'Polar Covalent: Unequal electron sharing (δ⁺ H ── Cl δ⁻) creates a permanent dipole.',
      takeaway: 'Electronegativity differences dictate bond polarity and molecular dipole moments.',
      animationAction: 'createBond',
      highlightTarget: 'electronegativity-dipole',
      visualState: { mode: 'bonding', subMode: 'dipole', cameraZoom: 1.1 }
    },
    {
      stepNumber: 7,
      title: 'VSEPR Theory & 3D Molecular Geometries',
      subConcept: 'Molecular geometry',
      duration: 35,
      voiceText: 'VSEPR theory states that valence electron pairs repel each other into 3D shapes: Linear (180°), Bent, Trigonal Planar (120°), and Tetrahedral (109.5°).',
      captionText: 'VSEPR 3D Shapes: Linear (180°), Trigonal Planar (120°), Tetrahedral (109.5°).',
      takeaway: 'Electron pair repulsion governs 3D spatial molecular geometry.',
      animationAction: 'createMolecule',
      highlightTarget: 'vsepr-geometries',
      visualState: { mode: 'bonding', subMode: 'vsepr-3d', cameraZoom: 1.15 }
    },
    {
      stepNumber: 8,
      title: 'Chemical Bonding Summary',
      subConcept: 'Examples of molecules',
      duration: 35,
      voiceText: 'To summarize, chemical bonding unites atoms via ionic electron transfer or covalent sharing, creating the vast 3D molecular architecture of the universe.',
      captionText: 'Summary: Ionic (Transfer) vs Covalent (Sharing) + 3D VSEPR Geometries.',
      takeaway: 'Bonding principles explain the structure and properties of all substances.',
      animationAction: 'createMolecule',
      highlightTarget: 'bonding-summary',
      visualState: { mode: 'bonding', subMode: 'summary', cameraZoom: 1.0 }
    }
  ]
};
