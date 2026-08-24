/**
 * LESSON 4 — SCHOOL: Physical and Chemical Changes
 * Exact 6-scene sequence matching Master Prompt specification.
 */

window.SchoolPhysicalChemicalChangesLesson = {
  id: 'school-physical-chemical-changes',
  title: 'Physical and Chemical Changes',
  level: 'school',
  levelLabel: 'School Chemistry',
  icon: '🔥',
  duration: '3–5 min',
  estimatedSeconds: 220,
  shortDesc: 'Compare reversible state transitions with irreversible chemical bond transformations.',
  subConcepts: [
    'What is a physical change?',
    'What is a chemical change?',
    'Reversible changes',
    'Irreversible changes',
    'Change of state',
    'Melting',
    'Freezing',
    'Dissolving',
    'Burning',
    'Rusting',
    'Comparison between physical and chemical changes'
  ],
  quiz: [
    {
      question: 'Which of the following is a physical change?',
      options: ['Burning wood', 'Rusting iron nail', 'Melting an ice cube into water', 'Baking a cake'],
      correctIndex: 2,
      explanation: 'Melting ice changes only the physical state from solid to liquid; the chemical identity (H₂O) remains identical.'
    },
    {
      question: 'What fundamentally distinguishes a chemical change from a physical change?',
      options: [
        'A chemical change always produces new substances with new chemical bonds',
        'Physical changes are always hotter',
        'Chemical changes never release energy',
        'Physical changes destroy atoms'
      ],
      correctIndex: 0,
      explanation: 'Chemical changes break and form bonds to create entirely new substances, whereas physical changes do not.'
    }
  ],
  sampleTeacherSpeech: "In today's lesson, we will compare physical and chemical changes. In a physical change, like ice melting into water, the chemical formula remains H2O and the change is reversible. In a chemical change, like iron rusting or wood burning, new substances with different properties are formed.",

  steps: [
    {
      stepNumber: 1,
      title: 'Physical Change: Reversible Transitions',
      subConcept: 'What is a physical change?',
      duration: 35,
      voiceText: 'A physical change alters the state or shape of a substance without changing its chemical identity. Ice melting into water and freezing back into ice is a classic reversible physical change.',
      captionText: 'Physical Change: Ice ──> Water ──> Ice (Chemical formula H₂O is unchanged).',
      takeaway: 'Physical changes alter form or state without creating new molecules.',
      animationAction: 'createParticle',
      highlightTarget: 'physical-change',
      visualState: { mode: 'changes', subMode: 'physical', cameraZoom: 1.05 }
    },
    {
      stepNumber: 2,
      title: 'Change of State: Solid, Liquid, Gas',
      subConcept: 'Change of state',
      duration: 35,
      voiceText: 'In a solid, particles vibrate in a fixed crystal lattice. In a liquid, they slide past each other. In a gas, particles move rapidly and freely.',
      captionText: 'States of Matter: Solid (Fixed lattice) ↔ Liquid (Flowing) ↔ Gas (Rapid free motion).',
      takeaway: 'Temperature shifts alter kinetic energy and state of matter.',
      animationAction: 'createParticle',
      highlightTarget: 'states-of-matter',
      visualState: { mode: 'changes', subMode: 'states', cameraZoom: 1.0 }
    },
    {
      stepNumber: 3,
      title: 'Chemical Change: Iron Reacting into Rust',
      subConcept: 'What is a chemical change?',
      duration: 35,
      voiceText: 'A chemical change occurs when bonds break and reform, creating new substances. When iron reacts with oxygen and moisture, it forms rust, which is iron oxide.',
      captionText: 'Chemical Change: 4Fe (Iron) + 3O₂ ──> 2Fe₂O₃ (Rust). New bonds created.',
      takeaway: 'Chemical changes yield new substances with entirely new chemical properties.',
      animationAction: 'animateBondFormation',
      highlightTarget: 'chemical-change',
      visualState: { mode: 'changes', subMode: 'chemical', cameraZoom: 1.05 }
    },
    {
      stepNumber: 4,
      title: 'Combustion & Burning',
      subConcept: 'Burning',
      duration: 35,
      voiceText: 'Burning is a rapid chemical reaction with oxygen that releases heat and light, transforming organic fuel into carbon dioxide and water vapor.',
      captionText: 'Combustion: Fuel + Oxygen ──> Carbon Dioxide + Water + Heat Energy.',
      takeaway: 'Combustion is an irreversible chemical reaction that releases energy.',
      animationAction: 'createReaction',
      highlightTarget: 'burning',
      visualState: { mode: 'changes', subMode: 'burning', cameraZoom: 1.0 }
    },
    {
      stepNumber: 5,
      title: 'Split-Screen Comparison',
      subConcept: 'Comparison between physical and chemical changes',
      duration: 35,
      voiceText: 'On the left, physical changes are reversible and retain the original substance. On the right, chemical changes form new substances and are usually irreversible.',
      captionText: 'Comparison: Left = Physical (Reversible, H₂O) | Right = Chemical (New substance, Fe₂O₃).',
      takeaway: 'Physical = Same substance • Chemical = New substance formed.',
      animationAction: 'createReaction',
      highlightTarget: 'comparison-split',
      visualState: { mode: 'changes', subMode: 'comparison', cameraZoom: 1.0 }
    },
    {
      stepNumber: 6,
      title: 'Summary: Physical vs Chemical',
      subConcept: 'Summary',
      duration: 35,
      voiceText: 'To summarize, physical changes preserve chemical composition, while chemical changes rearrange atomic bonds into new chemical products.',
      captionText: 'Summary: Physical (No new substance) vs Chemical (New substance formed).',
      takeaway: 'Understanding physical vs chemical changes is fundamental to all science.',
      animationAction: 'createReaction',
      highlightTarget: 'changes-summary',
      visualState: { mode: 'changes', subMode: 'summary', cameraZoom: 1.0 }
    }
  ]
};
