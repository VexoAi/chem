/**
 * LESSON 9 — COLLEGE: Electrochemistry and Redox Reactions
 * Exact 9-scene sequence matching Master Prompt specification.
 */

window.CollegeElectrochemistryLesson = {
  id: 'college-electrochemistry',
  title: 'Electrochemistry and Redox Reactions',
  level: 'college',
  levelLabel: 'College Chemistry',
  icon: '🔋',
  duration: '4–6 min',
  estimatedSeconds: 270,
  shortDesc: 'Explore oxidation, reduction, galvanic Daniell cells, anode/cathode half-reactions, salt bridges, and electrolysis.',
  subConcepts: [
    'Oxidation',
    'Reduction',
    'Redox reactions',
    'Oxidizing agents',
    'Reducing agents',
    'Electrochemical cells',
    'Anode',
    'Cathode',
    'Electron flow',
    'Salt bridge',
    'Galvanic cells',
    'Electrolysis',
    'Applications'
  ],
  quiz: [
    {
      question: 'At which electrode does oxidation always occur in an electrochemical cell?',
      options: ['Cathode', 'Anode (Oxidation Is Loss)', 'Salt Bridge', 'Voltmeter'],
      correctIndex: 1,
      explanation: 'Oxidation (loss of electrons) always occurs at the anode in every electrochemical cell.'
    },
    {
      question: 'What is the primary role of the salt bridge in a galvanic cell?',
      options: [
        'To speed up electron movement in the wire',
        'To maintain electrical charge neutrality by allowing ions to migrate between half-cells',
        'To supply electrical power to the circuit',
        'To dissolve the electrodes'
      ],
      correctIndex: 1,
      explanation: 'The salt bridge allows anions and cations to migrate, balancing accumulating charges in the half-cells.'
    }
  ],
  sampleTeacherSpeech: "In college electrochemistry, we examine the interconversion of chemical and electrical energy through redox reactions. Oxidation is electron loss at the anode, while reduction is electron gain at the cathode. In a galvanic cell, spontaneous electron flow through an external circuit is balanced by ion migration through a salt bridge.",

  steps: [
    {
      stepNumber: 1,
      title: 'Oxidation and Reduction (OIL RIG)',
      subConcept: 'Oxidation',
      duration: 30,
      voiceText: 'Oxidation is the loss of electrons, while reduction is the gain of electrons, remembered by the classic scientific mnemonic OIL RIG.',
      captionText: 'OIL RIG: Oxidation Is Loss of electrons • Reduction Is Gain of electrons.',
      takeaway: 'Oxidation increases oxidation state; reduction decreases oxidation state.',
      animationAction: 'createParticle',
      highlightTarget: 'oxidation-reduction',
      visualState: { mode: 'electro', subMode: 'redox-transfer', cameraZoom: 1.05 }
    },
    {
      stepNumber: 2,
      title: 'Redox Reactions & Simultaneous Transfer',
      subConcept: 'Redox reactions',
      duration: 30,
      voiceText: 'In every redox reaction, one chemical species loses electrons and acts as the reducing agent, while another receives them as the oxidizing agent.',
      captionText: 'Redox: Zn ──> Zn²⁺ + 2e⁻ (Oxidation) | Cu²⁺ + 2e⁻ ──> Cu (Reduction).',
      takeaway: 'Oxidation and reduction occur simultaneously with electron conservation.',
      animationAction: 'animateElectronTransfer',
      highlightTarget: 'redox-arrows',
      visualState: { mode: 'electro', subMode: 'redox-arrows', cameraZoom: 1.1 }
    },
    {
      stepNumber: 3,
      title: 'Building an Electrochemical Galvanic Cell',
      subConcept: 'Electrochemical cells',
      duration: 30,
      voiceText: 'A galvanic Daniell cell consists of a zinc anode half-cell, a copper cathode half-cell, electrolyte solutions, a salt bridge, and an external circuit.',
      captionText: 'Galvanic Cell: Zn Anode half-cell + Cu Cathode half-cell + Salt Bridge.',
      takeaway: 'Separating half-reactions forces electron flow through an external wire.',
      animationAction: 'createCell',
      highlightTarget: 'cell-diagram',
      visualState: { mode: 'electro', subMode: 'galvanic-cell', cameraZoom: 1.1 }
    },
    {
      stepNumber: 4,
      title: 'Electron Flow: Anode to Cathode',
      subConcept: 'Electron flow',
      duration: 30,
      voiceText: 'Electrons spontaneously flow from the negative zinc anode through the external wire to the positive copper cathode, producing an electric current.',
      captionText: 'Electron Flow: e⁻ moves spontaneously from Anode (-) ──> Cathode (+).',
      takeaway: 'The potential difference between electrodes drives electrical current.',
      animationAction: 'animateElectronTransfer',
      highlightTarget: 'electron-flow',
      visualState: { mode: 'electro', subMode: 'electron-wire', cameraZoom: 1.15 }
    },
    {
      stepNumber: 5,
      title: 'Ion Movement Through the Salt Bridge',
      subConcept: 'Salt bridge',
      duration: 30,
      voiceText: 'The salt bridge maintains electrical neutrality. Negative anions migrate toward the anode, while positive cations migrate toward the cathode.',
      captionText: 'Salt Bridge: Anions (NO₃⁻) migrate to Anode; Cations (K⁺) migrate to Cathode.',
      takeaway: 'Salt bridge ion migration completes the internal electrical circuit.',
      animationAction: 'animateIonMovement',
      highlightTarget: 'salt-bridge-ions',
      visualState: { mode: 'electro', subMode: 'salt-bridge', cameraZoom: 1.15 }
    },
    {
      stepNumber: 6,
      title: 'Anode & Cathode Half-Reactions',
      subConcept: 'Anode',
      duration: 30,
      voiceText: 'At the zinc anode, metallic zinc dissolves into zinc ions. At the copper cathode, copper ions in solution gain electrons and plate onto the electrode.',
      captionText: 'Anode: Zn(s) → Zn²⁺(aq) + 2e⁻ | Cathode: Cu²⁺(aq) + 2e⁻ → Cu(s).',
      takeaway: 'Anode loses mass by dissolving; cathode gains mass by plating.',
      animationAction: 'createCell',
      highlightTarget: 'electrodes-zoom',
      visualState: { mode: 'electro', subMode: 'electrodes', cameraZoom: 1.2 }
    },
    {
      stepNumber: 7,
      title: 'Electrolysis (Non-Spontaneous Reactions)',
      subConcept: 'Electrolysis',
      duration: 30,
      voiceText: 'In electrolytic cells, an external direct current power source drives non-spontaneous redox reactions, such as the electrolysis of molten sodium chloride.',
      captionText: 'Electrolysis: External DC power forces non-spontaneous chemical reactions.',
      takeaway: 'Electrolysis consumes electrical energy to produce chemical change.',
      animationAction: 'createCell',
      highlightTarget: 'electrolysis-mode',
      visualState: { mode: 'electro', subMode: 'electrolysis', cameraZoom: 1.1 }
    },
    {
      stepNumber: 8,
      title: 'Applications: Batteries, Plating & Extraction',
      subConcept: 'Applications',
      duration: 30,
      voiceText: 'Electrochemistry powers our modern world through lithium-ion batteries, electroplating of decorative metals, fuel cells, and industrial metal refining.',
      captionText: 'Applications: Rechargeable Batteries, Fuel Cells, Electroplating, Metal Refining.',
      takeaway: 'Electrochemical cells provide portable energy storage for modern technology.',
      animationAction: 'createCell',
      highlightTarget: 'electro-applications',
      visualState: { mode: 'electro', subMode: 'applications', cameraZoom: 1.05 }
    },
    {
      stepNumber: 9,
      title: 'Electrochemistry Summary',
      subConcept: 'Summary',
      duration: 30,
      voiceText: 'In summary, redox reactions couple oxidation and reduction, directing electron flow through circuits to generate electrical power or drive synthesis.',
      captionText: 'Summary: Electron flow ──> Oxidation ──> Reduction ──> Electrical Energy.',
      takeaway: 'Electrochemistry links chemical potential energy directly with electricity.',
      animationAction: 'createCell',
      highlightTarget: 'electro-summary',
      visualState: { mode: 'electro', subMode: 'summary', cameraZoom: 1.0 }
    }
  ]
};
