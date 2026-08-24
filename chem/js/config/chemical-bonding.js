/**
 * Chemical Bonding Topic Definition (Extensibility Showcase)
 * Demonstrates Covalent and Ionic bond formation with synchronized AI teacher voice.
 */

window.ChemicalBondingTopic = {
  id: 'chemical-bonding',
  title: 'Chemical Bonding: Covalent & Ionic',
  shortTitle: 'Chemical Bonding',
  category: 'Molecular Chemistry',
  element: 'Water (H2O) & Salt (NaCl)',
  
  steps: [
    {
      stepNumber: 1,
      title: 'Why Do Atoms Bond?',
      badge: 'Step 1 of 4',
      voiceText: 'Atoms combine to form chemical bonds in order to achieve a stable, full outer electron shell, known as the octet rule.',
      captionText: 'Atoms bond to gain outer shell stability (Octet Rule).',
      takeaway: 'Stability = 8 valence electrons (Octet Rule).',
      visualState: {
        mode: 'bonding',
        subMode: 'octet-overview',
        cameraZoom: 1.0,
        highlightedParticles: ['valence-electrons'],
        focusOverlay: {
          icon: '🤝',
          title: 'The Octet Rule',
          desc: 'Atoms seek stability by filling their outermost electron shell with 8 valence electrons.'
        }
      },
      cues: [
        { phrase: 'chemical bonds', timePercent: 0.15, highlight: 'valence-electrons' },
        { phrase: 'full outer electron shell', timePercent: 0.55, highlight: 'valence-electrons', pulse: true },
        { phrase: 'octet rule', timePercent: 0.85, highlight: 'valence-electrons' }
      ]
    },
    {
      stepNumber: 2,
      title: 'Covalent Bonding: Electron Sharing',
      badge: 'Step 2 of 4',
      voiceText: 'In a covalent bond, non-metal atoms share pairs of electrons to complete their valence shells, like two hydrogen atoms bonding with oxygen to form water.',
      captionText: 'Covalent Bond = Sharing electrons between non-metals.',
      takeaway: 'Covalent Bond = Shared Electron Pairs (e.g. H₂O).',
      visualState: {
        mode: 'bonding',
        subMode: 'covalent',
        cameraZoom: 1.1,
        highlightedParticles: ['shared-pair'],
        focusOverlay: {
          icon: '💧',
          title: 'Covalent Bond (H₂O)',
          desc: 'Electrons are shared between atoms to form a stable molecular orbital.'
        }
      },
      cues: [
        { phrase: 'covalent bond', timePercent: 0.1, highlight: 'shared-pair' },
        { phrase: 'share pairs of electrons', timePercent: 0.35, highlight: 'shared-pair', pulse: true },
        { phrase: 'form water', timePercent: 0.8, highlight: 'shared-pair' }
      ]
    },
    {
      stepNumber: 3,
      title: 'Ionic Bonding: Electron Transfer',
      badge: 'Step 3 of 4',
      voiceText: 'In an ionic bond, one atom transfers electrons to another, creating positive and negative ions that attract each other, such as sodium and chlorine forming table salt.',
      captionText: 'Ionic Bond = Transfer of electrons forming charged ions.',
      takeaway: 'Ionic Bond = Transfer of Electrons (Na⁺ + Cl⁻ = NaCl).',
      visualState: {
        mode: 'bonding',
        subMode: 'ionic',
        cameraZoom: 1.1,
        highlightedParticles: ['ions'],
        focusOverlay: {
          icon: '🧂',
          title: 'Ionic Bond (NaCl)',
          desc: 'Electrostatic attraction between positive cation (Na⁺) and negative anion (Cl⁻).'
        }
      },
      cues: [
        { phrase: 'ionic bond', timePercent: 0.1, highlight: 'ions' },
        { phrase: 'transfers electrons', timePercent: 0.35, highlight: 'transfer', pulse: true },
        { phrase: 'positive and negative ions', timePercent: 0.6, highlight: 'ions', pulse: true }
      ]
    },
    {
      stepNumber: 4,
      title: 'Bonding Summary',
      badge: 'Step 4 of 4',
      voiceText: 'To summarize, covalent bonds involve sharing electrons, while ionic bonds involve the transfer of electrons between atoms.',
      captionText: 'Covalent = Sharing • Ionic = Transfer of electrons.',
      takeaway: 'Covalent = Sharing • Ionic = Transfer',
      visualState: {
        mode: 'bonding',
        subMode: 'summary',
        cameraZoom: 1.0,
        highlightedParticles: ['both'],
        focusOverlay: {
          icon: '📚',
          title: 'Bonding Summary',
          desc: 'Covalent (sharing) and Ionic (transfer) hold the chemical universe together.'
        }
      },
      cues: [
        { phrase: 'covalent bonds involve sharing', timePercent: 0.3, highlight: 'shared-pair' },
        { phrase: 'ionic bonds involve the transfer', timePercent: 0.7, highlight: 'ions' }
      ]
    }
  ]
};
