/**
 * LESSON 1 — SCHOOL: Structure of an Atom
 * Complete narrated educational animation with teacher voice, live captions, and visual concept highlights.
 */

window.SchoolAtomicStructureLesson = {
  id: 'school-atomic-structure',
  title: 'Structure of an Atom',
  level: 'school',
  levelLabel: 'School Chemistry',
  icon: '⚛️',
  duration: '3–5 min',
  estimatedSeconds: 210,
  shortDesc: 'Explore protons, neutrons, electrons, the nucleus, and electron shells with synchronized teacher narration.',
  concepts: [
    'Basic Unit of Matter',
    'Central Nucleus',
    'Proton (+1 Charge)',
    'Neutron (0 Charge)',
    'Electron (-1 Charge)',
    'Concentric Electron Shells',
    'Complete Atomic Architecture'
  ],
  quiz: [
    {
      question: 'Which subatomic particle carries a positive electrical charge?',
      options: ['Electron (-)', 'Proton (+)', 'Neutron (0)', 'Photon'],
      correctIndex: 1,
      explanation: 'Protons carry a +1 positive electrical charge and are located inside the central nucleus.'
    },
    {
      question: 'Where are neutrons and protons located inside an atom?',
      options: ['In the electron shells', 'Floating outside', 'Inside the central nucleus', 'In chemical bonds'],
      correctIndex: 2,
      explanation: 'The dense central core called the nucleus contains both protons and neutrons.'
    },
    {
      question: 'What is the electrical charge of an electron?',
      options: ['Positive (+1)', 'Neutral (0)', 'Negative (-1)', 'Variable'],
      correctIndex: 2,
      explanation: 'Electrons carry a negative electrical charge (-1) and orbit around the nucleus in electron shells.'
    }
  ],

  steps: [
    {
      stepNumber: 1,
      title: 'Introduction',
      duration: 30,
      voiceText: 'An atom is the basic unit of matter. Everything around us is made up of atoms.',
      captionText: 'An atom is the basic unit of matter. Everything around us is made up of atoms.',
      takeaway: 'Atom = Fundamental building block of all matter.',
      highlightTarget: 'atom',
      visualState: {
        cameraZoom: 1.0,
        showNucleus: true,
        showProtons: true,
        showNeutrons: true,
        showElectrons: true,
        showShells: true,
        highlightedParticles: ['atom'],
        focusOverlay: {
          icon: '⚛️',
          title: 'Structure of an Atom',
          desc: 'Basic building block of all matter, consisting of a central nucleus surrounded by orbiting electrons.'
        }
      }
    },
    {
      stepNumber: 2,
      title: 'The Nucleus',
      duration: 30,
      voiceText: 'At the center of an atom is a tiny region called the nucleus. The nucleus contains protons and neutrons.',
      captionText: 'The nucleus contains protons and neutrons.',
      takeaway: 'The nucleus is the heavy, dense core located at the center of the atom.',
      highlightTarget: 'nucleus',
      visualState: {
        cameraZoom: 2.8,
        showNucleus: true,
        showProtons: true,
        showNeutrons: true,
        showElectrons: false,
        showShells: false,
        highlightedParticles: ['nucleus'],
        focusOverlay: {
          icon: '🎯',
          title: 'The Atomic Nucleus',
          desc: 'Dense central core holding over 99.9% of the atom\'s mass, containing protons and neutrons.'
        }
      }
    },
    {
      stepNumber: 3,
      title: 'Proton (+)',
      duration: 30,
      voiceText: 'Protons are positively charged particles found inside the nucleus.',
      captionText: 'Proton (+): Positively charged particles found inside the nucleus.',
      takeaway: 'Proton (p⁺) carries a +1 positive electrical charge.',
      highlightTarget: 'protons',
      visualState: {
        cameraZoom: 3.2,
        showNucleus: true,
        showProtons: true,
        showNeutrons: true,
        showElectrons: false,
        showShells: false,
        highlightedParticles: ['protons'],
        focusOverlay: {
          icon: '🔴',
          title: 'Proton (p⁺)',
          desc: 'Positively charged particle (+1). The number of protons determines the element\'s Atomic Number.'
        }
      }
    },
    {
      stepNumber: 4,
      title: 'Neutron (0)',
      duration: 30,
      voiceText: 'Neutrons have no electrical charge and are also found inside the nucleus.',
      captionText: 'Neutron (0): Neutrons have no electrical charge.',
      takeaway: 'Neutron (n⁰) has zero electrical charge and provides nuclear stability.',
      highlightTarget: 'neutrons',
      visualState: {
        cameraZoom: 3.2,
        showNucleus: true,
        showProtons: true,
        showNeutrons: true,
        showElectrons: false,
        showShells: false,
        highlightedParticles: ['neutrons'],
        focusOverlay: {
          icon: '⚪',
          title: 'Neutron (n⁰)',
          desc: 'Electrically neutral particle (0 charge) that binds with protons to stabilize the nucleus.'
        }
      }
    },
    {
      stepNumber: 5,
      title: 'Electron (-)',
      duration: 30,
      voiceText: 'Electrons are negatively charged particles that move around the nucleus in regions called electron shells.',
      captionText: 'Electron (-): Negatively charged particles that move around the nucleus.',
      takeaway: 'Electrons carry a -1 negative charge and orbit rapidly in electron shells.',
      highlightTarget: 'electrons',
      visualState: {
        cameraZoom: 1.2,
        showNucleus: true,
        showProtons: true,
        showNeutrons: true,
        showElectrons: true,
        showShells: true,
        highlightedParticles: ['electrons'],
        focusOverlay: {
          icon: '🔵',
          title: 'Electron (e⁻)',
          desc: 'Negative charge (-1). Fast-moving particles orbiting in concentric energy shells.'
        }
      }
    },
    {
      stepNumber: 6,
      title: 'Electron Shells',
      duration: 30,
      voiceText: 'Electrons occupy different energy levels or shells around the nucleus.',
      captionText: 'Electrons occupy different energy levels or shells around the nucleus.',
      takeaway: 'Shells fill sequentially: K-shell holds up to 2, L-shell holds up to 8 electrons.',
      highlightTarget: 'shells',
      visualState: {
        cameraZoom: 1.1,
        showNucleus: true,
        showProtons: true,
        showNeutrons: true,
        showElectrons: true,
        showShells: true,
        highlightedParticles: ['shells'],
        focusOverlay: {
          icon: '⭕',
          title: 'Electron Shells / Energy Levels',
          desc: 'Concentric paths where electrons circulate: K-Shell (n=1, max 2e⁻) and L-Shell (n=2, max 8e⁻).'
        }
      }
    },
    {
      stepNumber: 7,
      title: 'Structure of an Atom — Complete',
      duration: 30,
      voiceText: 'So, an atom consists of a nucleus containing protons and neutrons, with electrons occupying energy levels around the nucleus.',
      captionText: 'Structure of an Atom — Complete',
      takeaway: 'Atom = Nucleus (Protons + Neutrons) + Electron Cloud (Electrons in Shells).',
      highlightTarget: 'atom',
      visualState: {
        cameraZoom: 1.0,
        showNucleus: true,
        showProtons: true,
        showNeutrons: true,
        showElectrons: true,
        showShells: true,
        highlightedParticles: ['atom', 'nucleus', 'protons', 'neutrons', 'electrons', 'shells'],
        focusOverlay: {
          icon: '✨',
          title: 'Structure of an Atom — Complete',
          desc: 'Full atomic architecture: Nucleus (p⁺ + n⁰) surrounded by orbiting electrons (e⁻).'
        }
      }
    }
  ]
};
