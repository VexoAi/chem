/**
 * LESSON 8 — COLLEGE: Thermodynamics and Chemical Equilibrium
 * Exact 9-scene sequence matching Master Prompt specification.
 */

window.CollegeThermodynamicsLesson = {
  id: 'college-thermodynamics',
  title: 'Thermodynamics and Chemical Equilibrium',
  level: 'college',
  levelLabel: 'College Chemistry',
  icon: '🌡️',
  duration: '4–6 min',
  estimatedSeconds: 270,
  shortDesc: 'Analyze enthalpy curves, entropy dispersion, Gibbs spontaneity criteria, dynamic equilibrium and Le Chatelier shifts.',
  subConcepts: [
    'System and surroundings',
    'Open, closed and isolated systems',
    'Heat and work',
    'Internal energy',
    'Enthalpy',
    'Exothermic reactions',
    'Endothermic reactions',
    'Entropy',
    'Gibbs free energy',
    'Chemical equilibrium',
    'Le Chatelier\'s principle'
  ],
  quiz: [
    {
      question: 'What is the universal thermodynamic criterion for a spontaneous reaction at constant T and P?',
      options: ['ΔH > 0', 'ΔG < 0 (Negative Gibbs Free Energy)', 'ΔS = 0', 'ΔU = 0'],
      correctIndex: 1,
      explanation: 'A negative change in Gibbs free energy (ΔG = ΔH - TΔS < 0) defines thermodynamic spontaneity.'
    },
    {
      question: 'According to Le Chatelier\'s principle, what happens if reactant concentration is increased in an equilibrium system?',
      options: [
        'The equilibrium shifts forward toward products to relieve the added stress',
        'The equilibrium shifts backward',
        'The equilibrium constant Keq changes permanently',
        'The reaction terminates'
      ],
      correctIndex: 0,
      explanation: 'The system counteracts added reactants by shifting forward to produce more products.'
    }
  ],
  sampleTeacherSpeech: "Today we study chemical thermodynamics and dynamic equilibrium. Thermodynamics analyzes energy transfer, enthalpy changes, and entropy in systems. A reaction is spontaneous when Gibbs free energy change delta G is negative. Dynamic equilibrium occurs when forward and reverse reaction rates are equal, governed by Le Chatelier's principle.",

  steps: [
    {
      stepNumber: 1,
      title: 'System and Surroundings',
      subConcept: 'System and surroundings',
      duration: 30,
      voiceText: 'In thermodynamics, the system is the specific chemical reaction container under study, while the surroundings encompass everything else in the universe.',
      captionText: 'Thermodynamics: SYSTEM (Reaction vessel) vs SURROUNDINGS (Rest of universe).',
      takeaway: 'Boundary conditions define energy and matter exchange in systems.',
      animationAction: 'createEnergyDiagram',
      highlightTarget: 'system-surroundings',
      visualState: { mode: 'thermo', subMode: 'system-boundary', cameraZoom: 1.0 }
    },
    {
      stepNumber: 2,
      title: 'Heat (q) and Work (w)',
      subConcept: 'Heat and work',
      duration: 30,
      voiceText: 'Energy transfers across system boundaries as heat q or mechanical pressure-volume work w, changing the internal energy delta U equals q plus w.',
      captionText: 'First Law: ΔU = q (Heat flux) + w (Work done by or on system).',
      takeaway: 'Energy is conserved; energy entering equals energy leaving.',
      animationAction: 'createEnergyDiagram',
      highlightTarget: 'heat-work',
      visualState: { mode: 'thermo', subMode: 'heat-work', cameraZoom: 1.05 }
    },
    {
      stepNumber: 3,
      title: 'Exothermic Reactions (Energy Released)',
      subConcept: 'Exothermic reactions',
      duration: 30,
      voiceText: 'In an exothermic reaction, products have lower potential energy than reactants, releasing excess heat to the surroundings with negative delta H.',
      captionText: 'Exothermic: ΔH < 0 (Heat released to surroundings, product energy is lower).',
      takeaway: 'Exothermic processes release heat into the surroundings.',
      animationAction: 'createEnergyDiagram',
      highlightTarget: 'exothermic-curve',
      visualState: { mode: 'thermo', subMode: 'exothermic', cameraZoom: 1.1 }
    },
    {
      stepNumber: 4,
      title: 'Endothermic Reactions (Energy Absorbed)',
      subConcept: 'Endothermic reactions',
      duration: 30,
      voiceText: 'In an endothermic reaction, products have higher potential energy than reactants, absorbing heat from the surroundings with positive delta H.',
      captionText: 'Endothermic: ΔH > 0 (Heat absorbed from surroundings, product energy is higher).',
      takeaway: 'Endothermic processes absorb thermal energy from the surroundings.',
      animationAction: 'createEnergyDiagram',
      highlightTarget: 'endothermic-curve',
      visualState: { mode: 'thermo', subMode: 'endothermic', cameraZoom: 1.1 }
    },
    {
      stepNumber: 5,
      title: 'Enthalpy (ΔH)',
      subConcept: 'Enthalpy',
      duration: 30,
      voiceText: 'Enthalpy change delta H quantifies the net heat absorbed or evolved during a chemical transformation under constant atmospheric pressure.',
      captionText: 'Enthalpy (ΔH) = H_products - H_reactants (Heat exchange at constant pressure).',
      takeaway: 'Enthalpy is the thermodynamic potential measuring heat flow.',
      animationAction: 'createEnergyDiagram',
      highlightTarget: 'enthalpy-diagram',
      visualState: { mode: 'thermo', subMode: 'enthalpy', cameraZoom: 1.05 }
    },
    {
      stepNumber: 6,
      title: 'Entropy (ΔS): Increasing Disorder',
      subConcept: 'Entropy',
      duration: 30,
      voiceText: 'The Second Law states that universe entropy constantly increases. Entropy measures molecular randomness, dispersal of energy, and microstate disorder.',
      captionText: 'Entropy (ΔS): Measures molecular dispersion and randomness (ΔS_universe > 0).',
      takeaway: 'Spontaneous physical processes drive towards higher entropy and dispersal.',
      animationAction: 'createParticle',
      highlightTarget: 'entropy-disorder',
      visualState: { mode: 'thermo', subMode: 'entropy', cameraZoom: 1.05 }
    },
    {
      stepNumber: 7,
      title: 'Gibbs Free Energy (ΔG = ΔH - TΔS)',
      subConcept: 'Gibbs free energy',
      duration: 30,
      voiceText: 'Gibbs free energy combines enthalpy and entropy. When delta G is negative, the reaction is exergonic and proceeds spontaneously.',
      captionText: 'Gibbs Criterion: ΔG = ΔH - TΔS < 0 denotes spontaneous thermodynamic processes.',
      takeaway: 'ΔG < 0 is the universal criterion for reaction spontaneity.',
      animationAction: 'createEnergyDiagram',
      highlightTarget: 'gibbs-spontaneity',
      visualState: { mode: 'thermo', subMode: 'gibbs', cameraZoom: 1.0 }
    },
    {
      stepNumber: 8,
      title: 'Dynamic Chemical Equilibrium',
      subConcept: 'Chemical equilibrium',
      duration: 30,
      voiceText: 'In a reversible reaction at dynamic equilibrium, the forward reaction rate equals the reverse reaction rate, maintaining constant concentrations.',
      captionText: 'Dynamic Equilibrium: Rate_forward = Rate_reverse (A + B ⇌ C + D).',
      takeaway: 'Equilibrium is dynamic with active forward and reverse molecular exchanges.',
      animationAction: 'createReaction',
      highlightTarget: 'dynamic-equilibrium',
      visualState: { mode: 'thermo', subMode: 'equilibrium', cameraZoom: 1.1 }
    },
    {
      stepNumber: 9,
      title: 'Le Chatelier\'s Principle',
      subConcept: 'Le Chatelier\'s principle',
      duration: 30,
      voiceText: 'Le Chatelier\'s principle states that if an external stress is applied to an equilibrium system, the system shifts in the direction that relieves the stress.',
      captionText: 'Le Chatelier\'s Principle: System shifts forward or reverse to counteract applied stress.',
      takeaway: 'Changes in temperature, pressure, or concentration shift equilibrium states.',
      animationAction: 'createReaction',
      highlightTarget: 'le-chatelier-shift',
      visualState: { mode: 'thermo', subMode: 'lechatelier', cameraZoom: 1.1 }
    }
  ]
};
