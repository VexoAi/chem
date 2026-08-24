/**
 * LESSON 3 — SCHOOL: Acids, Bases and Salts
 * Exact 6-scene sequence matching Master Prompt specification.
 */

window.SchoolAcidsBasesLesson = {
  id: 'school-acids-bases',
  title: 'Acids, Bases and Salts',
  level: 'school',
  levelLabel: 'School Chemistry',
  icon: '🧪',
  duration: '3–5 min',
  estimatedSeconds: 220,
  shortDesc: 'Understand pH scale (0–14), hydrogen & hydroxide ions, color indicators and neutralization.',
  subConcepts: [
    'What are acids?',
    'What are bases?',
    'Properties of acids',
    'Properties of bases',
    'pH scale',
    'Strong and weak acids/bases',
    'Indicators',
    'Neutralization',
    'Formation of salts',
    'Everyday examples'
  ],
  quiz: [
    {
      question: 'What ion do acids release when dissolved in aqueous solutions?',
      options: ['Hydroxide ion (OH⁻)', 'Hydrogen ion (H⁺)', 'Sodium ion (Na⁺)', 'Chloride ion (Cl⁻)'],
      correctIndex: 1,
      explanation: 'Acids release hydrogen ions (H⁺) in water, lowering the pH below 7.'
    },
    {
      question: 'What happens when an acid and a base combine during neutralization?',
      options: ['They explode', 'They form salt and water', 'They turn into gas only', 'Nothing happens'],
      correctIndex: 1,
      explanation: 'Acid + Base → Salt + Water. Hydrogen ions (H⁺) and hydroxide ions (OH⁻) combine to form neutral water.'
    }
  ],
  sampleTeacherSpeech: "In this lesson, we will explore acids, bases, and salts. Acids release hydrogen ions in water and have a pH below 7, like lemons and vinegar. Bases produce hydroxide ions and have a pH above 7, like soap. When an acid and base combine, they neutralize to form salt and water.",

  steps: [
    {
      stepNumber: 1,
      title: 'Acids (H⁺ Ion Donors)',
      subConcept: 'What are acids?',
      duration: 35,
      voiceText: 'Acids are chemical substances that release hydrogen ions, or H plus, in water. Common everyday examples include citrus lemons, vinegar, and hydrochloric acid.',
      captionText: 'Acids = Release H⁺ ions in water (pH < 7). Sour taste.',
      takeaway: 'Acids produce H⁺ ions and turn blue litmus paper red.',
      animationAction: 'createIon',
      highlightTarget: 'acid',
      visualState: { mode: 'solutions', subMode: 'acid', cameraZoom: 1.05 }
    },
    {
      stepNumber: 2,
      title: 'Bases (OH⁻ Ion Producers)',
      subConcept: 'What are bases?',
      duration: 35,
      voiceText: 'Bases are substances that produce hydroxide ions, or OH minus, in aqueous solutions. Common examples include hand soaps, baking soda, and sodium hydroxide.',
      captionText: 'Bases = Release OH⁻ ions in water (pH > 7). Slippery feel.',
      takeaway: 'Bases produce OH⁻ ions and turn red litmus paper blue.',
      animationAction: 'createIon',
      highlightTarget: 'base',
      visualState: { mode: 'solutions', subMode: 'base', cameraZoom: 1.05 }
    },
    {
      stepNumber: 3,
      title: 'The Animated pH Scale (0 to 14)',
      subConcept: 'pH scale',
      duration: 35,
      voiceText: 'The pH scale measures how acidic or basic a solution is from zero to fourteen. Seven is neutral, values below seven are acidic, and values above seven are basic.',
      captionText: 'pH Scale: 0 (Acidic Red) ← 7 (Neutral Green) → 14 (Basic Purple).',
      takeaway: 'pH < 7 = Acidic • pH 7 = Pure Water Neutral • pH > 7 = Basic.',
      animationAction: 'createPHScale',
      highlightTarget: 'ph-scale',
      visualState: { mode: 'solutions', subMode: 'ph-scale', cameraZoom: 1.0 }
    },
    {
      stepNumber: 4,
      title: 'Indicators & Color Changes',
      subConcept: 'Indicators',
      duration: 35,
      voiceText: 'Chemical indicators change color depending on whether they are placed in acidic or basic solutions, allowing us to identify their pH visually.',
      captionText: 'Indicators change color to reveal whether a solution is acidic or basic.',
      takeaway: 'Indicators visually signal pH shifts through distinct color transitions.',
      animationAction: 'createPHScale',
      highlightTarget: 'indicators',
      visualState: { mode: 'solutions', subMode: 'indicators', cameraZoom: 1.0 }
    },
    {
      stepNumber: 5,
      title: 'Neutralization: Acid + Base → Salt + Water',
      subConcept: 'Neutralization',
      duration: 35,
      voiceText: 'When an acid and a base combine, hydrogen ions and hydroxide ions react to form neutral water and an ionic salt. This is called a neutralization reaction.',
      captionText: 'Acid + Base ──> Salt + Water (Neutralization).',
      takeaway: 'HCl + NaOH → NaCl + H₂O (Neutralization forming table salt).',
      animationAction: 'createReaction',
      highlightTarget: 'neutralization',
      visualState: { mode: 'solutions', subMode: 'neutralization', cameraZoom: 1.1 }
    },
    {
      stepNumber: 6,
      title: 'Summary: Acids, Bases & Salts',
      subConcept: 'Summary',
      duration: 35,
      voiceText: 'To summarize, acids release H plus, bases release OH minus, and their neutralization creates neutral water and essential salts across the pH spectrum.',
      captionText: 'Summary: Acid (H⁺) + Base (OH⁻) → Neutral Salt + Water.',
      takeaway: 'Acids, bases, and salts play fundamental roles in chemistry and daily life.',
      animationAction: 'createPHScale',
      highlightTarget: 'solutions-summary',
      visualState: { mode: 'solutions', subMode: 'summary', cameraZoom: 1.0 }
    }
  ]
};
