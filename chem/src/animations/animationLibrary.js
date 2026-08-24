/**
 * AnimationLibrary - Pre-built Chemistry Animation Metadata & Multi-Keyword Scoring Engine
 * Stores metadata, multi-word phrases, keywords, and priority weighting for all 10 pre-built animations.
 */

window.AnimationLibrary = {
  animations: [
    // -----------------------------------------------------------------------
    // SCHOOL CHEMISTRY PRE-BUILT ANIMATIONS
    // -----------------------------------------------------------------------
    {
      id: 'school-atomic-structure',
      title: 'Structure of an Atom',
      level: 'school',
      subject: 'chemistry',
      icon: '⚛️',
      duration: '3:30',
      durationSeconds: 210,
      description: 'Animated 2D visual explanation of protons, neutrons, electrons, central nucleus, and electron shells.',
      keyPhrases: [
        'structure of an atom', 'structure of atom', 'electron shell', 'electron shells',
        'central nucleus', 'protons and neutrons', 'protons neutrons and electrons'
      ],
      keywords: [
        'atom', 'atoms', 'nucleus', 'nuclei', 'proton', 'protons', 'neutron', 'neutrons',
        'electron', 'electrons', 'electron shell', 'shells', 'charge', 'subatomic'
      ],
      conceptKeys: ['atom', 'nucleus', 'proton', 'neutron', 'electron'],
      lessonRef: 'school-atomic-structure'
    },
    {
      id: 'school-chemical-reactions',
      title: 'Chemical Reactions',
      level: 'school',
      subject: 'chemistry',
      icon: '⚗️',
      duration: '3:20',
      durationSeconds: 200,
      description: 'Animated collision chamber showing reactants breaking bonds and rearranging atoms into products.',
      keyPhrases: [
        'chemical reaction', 'chemical reactions', 'rearrangement of atoms', 'reactants and products',
        'particles collide', 'atoms rearrange', 'products form'
      ],
      keywords: [
        'chemical reaction', 'chemical reactions', 'reactant', 'reactants', 'product', 'products',
        'reaction', 'reactions', 'collision', 'collide', 'rearrange', 'bonds'
      ],
      conceptKeys: ['reactant', 'collision', 'rearrangement', 'product'],
      lessonRef: 'school-chemical-reactions'
    },
    {
      id: 'school-acids-bases',
      title: 'Acids, Bases and Salts',
      level: 'school',
      subject: 'chemistry',
      icon: '🧪',
      duration: '3:15',
      durationSeconds: 195,
      description: 'Animated visualization of H⁺ and OH⁻ ions, full 0–14 pH scale, and acid-base neutralization.',
      keyPhrases: [
        'acids and bases', 'acids bases and salts', 'ph scale', 'acid base neutralization',
        'salt and water', 'hydrogen ion', 'hydroxide ion'
      ],
      keywords: [
        'acid', 'acids', 'base', 'bases', 'ph', 'ph scale', 'neutralization', 'salt', 'salts',
        'hydrogen ion', 'hydroxide'
      ],
      conceptKeys: ['acid', 'ph scale', 'base', 'neutralization', 'salt'],
      lessonRef: 'school-acids-bases'
    },
    {
      id: 'school-physical-chemical-changes',
      title: 'Physical and Chemical Changes',
      level: 'school',
      subject: 'chemistry',
      icon: '🔥',
      duration: '3:25',
      durationSeconds: 205,
      description: 'Split-screen animation comparing reversible state transitions (Ice ↔ Water) with irreversible chemical changes.',
      keyPhrases: [
        'physical change', 'chemical change', 'physical and chemical changes',
        'solid liquid gas', 'ice water steam', 'new substance', 'reversible change'
      ],
      keywords: [
        'physical change', 'chemical change', 'solid', 'liquid', 'gas', 'melting', 'evaporation',
        'new substance', 'ice', 'water', 'steam', 'rust', 'rusting'
      ],
      conceptKeys: ['physical change', 'chemical change', 'phase transition', 'new substance'],
      lessonRef: 'school-physical-chemical-changes'
    },
    {
      id: 'school-periodic-table',
      title: 'Periodic Table and Elements',
      level: 'school',
      subject: 'chemistry',
      icon: '🔬',
      duration: '3:40',
      durationSeconds: 220,
      description: 'Interactive periodic grid animation highlighting Groups, Periods, Metals, Non-metals, and Elements.',
      keyPhrases: [
        'periodic table', 'periodic table and elements', 'classification of elements',
        'groups and periods', 'metals and nonmetals'
      ],
      keywords: [
        'periodic table', 'element', 'elements', 'group', 'groups', 'period', 'periods',
        'metal', 'metals', 'nonmetal', 'nonmetals', 'metalloid', 'atomic number'
      ],
      conceptKeys: ['periodic table', 'groups', 'periods', 'metals', 'nonmetals'],
      lessonRef: 'school-periodic-table'
    },

    // -----------------------------------------------------------------------
    // COLLEGE CHEMISTRY PRE-BUILT ANIMATIONS
    // -----------------------------------------------------------------------
    {
      id: 'college-atomic-quantum',
      title: 'Atomic Structure and Quantum Concepts',
      level: 'college',
      subject: 'chemistry',
      icon: '⚛️',
      duration: '4:15',
      durationSeconds: 255,
      description: 'Advanced quantum mechanics animation covering wave probability clouds, s/p/d/f orbitals, and energy transitions.',
      keyPhrases: [
        'quantum concepts', 'quantum mechanics', 'electron transition', 'energy levels',
        'electron configuration', 's orbital', 'p orbital', 'd orbital'
      ],
      keywords: [
        'quantum', 'quantum concepts', 'orbital', 'orbitals', 's orbital', 'p orbital', 'd orbital',
        'energy level', 'energy levels', 'electron transition', 'photon', 'electron configuration'
      ],
      conceptKeys: ['quantum', 'energy levels', 'electron transition', 'orbitals', 'configuration'],
      lessonRef: 'college-atomic-quantum'
    },
    {
      id: 'college-chemical-bonding',
      title: 'Chemical Bonding and Molecular Structure',
      level: 'college',
      subject: 'chemistry',
      icon: '🔗',
      duration: '4:10',
      durationSeconds: 250,
      description: '3D animated simulation of electron transfer, ionic attraction (Na & Cl), covalent orbital overlap, and VSEPR geometries.',
      keyPhrases: [
        'chemical bonding', 'molecular structure', 'electron transfer', 'electron transfer between sodium and chlorine',
        'electrons are shared', 'shared electrons', 'ionic bond', 'covalent bond', 'sodium and chlorine'
      ],
      keywords: [
        'chemical bonding', 'bonding', 'molecular structure', 'ionic bond', 'ionic bonding',
        'covalent bond', 'covalent bonding', 'electron transfer', 'shared electron', 'electrons are shared',
        'sodium', 'chlorine', 'vsepr'
      ],
      conceptKeys: ['ionic bond', 'electron transfer', 'covalent bond', 'electron sharing', 'molecular structure'],
      lessonRef: 'college-chemical-bonding'
    },
    {
      id: 'college-thermodynamics',
      title: 'Thermodynamics and Chemical Equilibrium',
      level: 'college',
      subject: 'chemistry',
      icon: '🌡️',
      duration: '4:30',
      durationSeconds: 270,
      description: 'Dynamic simulation of system/surroundings, enthalpy curves, entropy dispersion, and Le Chatelier equilibrium shifts.',
      keyPhrases: [
        'thermodynamics', 'chemical equilibrium', 'system and surroundings', 'heat enters or leaves',
        'exothermic reaction', 'endothermic reaction', 'dynamic equilibrium', 'le chatelier'
      ],
      keywords: [
        'thermodynamics', 'chemical equilibrium', 'equilibrium', 'system', 'heat', 'energy changes',
        'enthalpy', 'exothermic', 'endothermic', 'entropy', 'gibbs', 'le chatelier'
      ],
      conceptKeys: ['system', 'heat exchange', 'exothermic', 'endothermic', 'equilibrium'],
      lessonRef: 'college-thermodynamics'
    },
    {
      id: 'college-electrochemistry',
      title: 'Electrochemistry and Redox Reactions',
      level: 'college',
      subject: 'chemistry',
      icon: '🔋',
      duration: '4:20',
      durationSeconds: 260,
      description: 'Complete animated Galvanic cell with zinc anode, copper cathode, external wire current, and salt bridge ion migration.',
      keyPhrases: [
        'electrochemistry', 'redox reactions', 'electrons move', 'external circuit',
        'ions move through electrolyte', 'anode and cathode', 'salt bridge', 'galvanic cell'
      ],
      keywords: [
        'electrochemistry', 'redox', 'redox reactions', 'anode', 'cathode', 'external circuit',
        'electrons move', 'electrolyte', 'salt bridge', 'galvanic cell', 'ions move'
      ],
      conceptKeys: ['anode', 'cathode', 'electron flow', 'external circuit', 'salt bridge ions'],
      lessonRef: 'college-electrochemistry'
    },
    {
      id: 'college-organic-chemistry',
      title: 'Organic Chemistry and Functional Groups',
      level: 'college',
      subject: 'chemistry',
      icon: '🧬',
      duration: '4:25',
      durationSeconds: 265,
      description: 'Animated 3D carbon frameworks, carbon chains forming, functional groups, and organic reaction mechanisms.',
      keyPhrases: [
        'organic chemistry', 'functional groups', 'functional group', 'carbon atoms connect',
        'carbon chain forms', 'molecular structure forms', 'bonds change', 'organic reaction'
      ],
      keywords: [
        'organic chemistry', 'functional groups', 'functional group', 'carbon', 'carbon atoms',
        'carbon chain', 'molecular structure', 'organic reaction', 'alcohol', 'aldehyde', 'carboxylic acid'
      ],
      conceptKeys: ['carbon chain', 'functional group', 'molecular structure', 'bonds change', 'organic reaction'],
      lessonRef: 'college-organic-chemistry'
    }
  ],

  /**
   * Searches the pre-built animation library with multi-phrase and multi-keyword scoring
   */
  searchLibrary(speechText, selectedLevel = 'school', activeTopicId = null) {
    const raw = (speechText || '').toLowerCase().trim();
    if (!raw) {
      const defaultMatch = this.animations.find(a => a.id === activeTopicId) || this.animations[0];
      return {
        bestMatch: defaultMatch,
        matchPercentage: 100,
        detectedConcepts: ['Atom', 'Nucleus', 'Proton', 'Neutron', 'Electron'],
        matchedKeywords: ['atom', 'nucleus', 'proton', 'neutron', 'electron'],
        allRanked: this.animations
      };
    }

    // 1. Extract Detected Concepts from Speech
    const detectedConcepts = [];
    const matchedKeywords = [];

    const conceptMapping = [
      { key: 'atom', label: 'Atom' },
      { key: 'nucleus', label: 'Nucleus' },
      { key: 'proton', label: 'Proton' },
      { key: 'neutron', label: 'Neutron' },
      { key: 'electron', label: 'Electron' },
      { key: 'shell', label: 'Electron Shells' },
      { key: 'reactant', label: 'Reactants' },
      { key: 'collision', label: 'Collision' },
      { key: 'rearrange', label: 'Rearrangement' },
      { key: 'product', label: 'Products' },
      { key: 'acid', label: 'Acid' },
      { key: 'base', label: 'Base' },
      { key: 'ph', label: 'pH Scale' },
      { key: 'neutralization', label: 'Neutralization' },
      { key: 'salt', label: 'Salt + Water' },
      { key: 'physical change', label: 'Physical Change' },
      { key: 'chemical change', label: 'Chemical Change' },
      { key: 'new substance', label: 'New Substance' },
      { key: 'solid liquid gas', label: 'Solid → Liquid → Gas' },
      { key: 'periodic table', label: 'Periodic Table' },
      { key: 'group', label: 'Groups' },
      { key: 'period', label: 'Periods' },
      { key: 'metal', label: 'Metals' },
      { key: 'nonmetal', label: 'Non-metals' },
      { key: 'quantum', label: 'Quantum Concepts' },
      { key: 'orbital', label: 'Orbitals' },
      { key: 'energy level', label: 'Energy Levels' },
      { key: 'transition', label: 'Electron Transition' },
      { key: 'bonding', label: 'Chemical Bonding' },
      { key: 'ionic', label: 'Ionic Bond' },
      { key: 'covalent', label: 'Covalent Bond' },
      { key: 'electron transfer', label: 'Electron Transfer' },
      { key: 'sodium and chlorine', label: 'Sodium & Chlorine' },
      { key: 'thermodynamics', label: 'Thermodynamics' },
      { key: 'equilibrium', label: 'Chemical Equilibrium' },
      { key: 'exothermic', label: 'Exothermic / Endothermic' },
      { key: 'electrochemistry', label: 'Electrochemistry' },
      { key: 'redox', label: 'Redox Reactions' },
      { key: 'anode', label: 'Anode' },
      { key: 'cathode', label: 'Cathode' },
      { key: 'salt bridge', label: 'Salt Bridge' },
      { key: 'organic', label: 'Organic Chemistry' },
      { key: 'carbon chain', label: 'Carbon Chain' },
      { key: 'functional group', label: 'Functional Groups' }
    ];

    conceptMapping.forEach(item => {
      if (raw.includes(item.key) && !detectedConcepts.includes(item.label)) {
        detectedConcepts.push(item.label);
      }
    });

    // 2. Score Each Pre-Built Animation
    const scored = this.animations.map(anim => {
      let score = 0;
      let matchedCount = 0;
      const matched = [];

      // High-weight Multi-word Key Phrases (+30 points each)
      anim.keyPhrases.forEach(phrase => {
        if (raw.includes(phrase)) {
          score += 30;
          matched.push(phrase);
          matchedCount += 2;
        }
      });

      // Individual Keywords (+10 points each)
      anim.keywords.forEach(kw => {
        if (raw.includes(kw) && !matched.includes(kw)) {
          score += 10;
          matched.push(kw);
          matchedCount++;
        }
      });

      // Selected Level Preference (+15 points)
      if (anim.level === selectedLevel) {
        score += 15;
      }

      // Context Match: Selected Topic (+20 points)
      if (activeTopicId && anim.id === activeTopicId) {
        score += 20;
      }

      // Calculate Match Percentage (Clamped 30% to 100%)
      let matchPercentage = 0;
      if (matched.length >= 4 || score >= 60) {
        matchPercentage = 100;
      } else if (matched.length >= 2 || score >= 35) {
        matchPercentage = Math.min(95, Math.max(75, Math.round((score / 60) * 100)));
      } else if (score > 0) {
        matchPercentage = Math.min(65, Math.max(35, Math.round((score / 50) * 100)));
      } else {
        matchPercentage = 25;
      }

      return {
        animation: anim,
        score,
        matchedCount,
        matchedKeywords: matched,
        matchPercentage
      };
    });

    // Sort descending by score / match percentage
    scored.sort((a, b) => b.score - a.score || b.matchPercentage - a.matchPercentage);

    const top = scored[0];

    return {
      bestMatch: top.animation,
      matchPercentage: top.matchPercentage,
      matchedKeywords: top.matchedKeywords.length > 0 ? top.matchedKeywords : ['atom', 'nucleus', 'proton', 'neutron', 'electron'],
      detectedConcepts: detectedConcepts.length > 0 ? detectedConcepts : ['Atom', 'Nucleus', 'Proton', 'Neutron', 'Electron'],
      allRanked: scored
    };
  }
};
