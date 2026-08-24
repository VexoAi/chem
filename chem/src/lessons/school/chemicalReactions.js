/**
 * LESSON 2 — SCHOOL: Chemical Reactions
 * Exact 7-scene sequence matching Master Prompt specification.
 */

window.SchoolChemicalReactionsLesson = {
  id: 'school-chemical-reactions',
  title: 'Chemical Reactions',
  level: 'school',
  levelLabel: 'School Chemistry',
  icon: '⚗️',
  duration: '3–5 min',
  estimatedSeconds: 230,
  shortDesc: 'Observe reactants collide, break bonds, and rearrange atoms to form new products.',
  subConcepts: [
    'What is a chemical reaction?',
    'Reactants',
    'Products',
    'Rearrangement of atoms',
    'Signs of a chemical reaction',
    'Formation of new substances',
    'Simple examples',
    'Energy changes',
    'Balancing the idea of atoms',
    'Summary'
  ],
  quiz: [
    {
      question: 'What are the starting substances in a chemical reaction called?',
      options: ['Products', 'Reactants', 'Catalysts', 'Precipitates'],
      correctIndex: 1,
      explanation: 'Reactants are the starting substances that interact during a chemical reaction.'
    },
    {
      question: 'What happens to atoms during a chemical reaction?',
      options: ['They are destroyed', 'They are created', 'They rearrange into new substances with mass conserved', 'They turn into energy'],
      correctIndex: 2,
      explanation: 'Atoms are neither created nor destroyed; chemical bonds break and atoms rearrange to form new products.'
    }
  ],
  sampleTeacherSpeech: "In today's lesson, we will study chemical reactions. A chemical reaction occurs when starting substances called reactants collide and rearrange their atoms to form entirely new substances called products. We can observe signs of reactions like gas formation, color changes, and temperature shifts.",

  steps: [
    {
      stepNumber: 1,
      title: 'Introduction to Chemical Reactions',
      subConcept: 'What is a chemical reaction?',
      duration: 35,
      voiceText: 'A chemical reaction occurs when substances change to form new substances with different properties.',
      captionText: 'Chemical Reaction: Substances transform to form new materials.',
      takeaway: 'Chemical reactions transform substances into new chemical products.',
      animationAction: 'createReaction',
      highlightTarget: 'reaction-intro',
      visualState: { mode: 'reactions', subMode: 'overview', cameraZoom: 1.0 }
    },
    {
      stepNumber: 2,
      title: 'Reactants: Starting Substances',
      subConcept: 'Reactants',
      duration: 35,
      voiceText: 'The initial substances entering the reaction from the left are called reactants, such as hydrogen gas and oxygen gas.',
      captionText: 'Reactants = Starting substances (e.g., 2H₂ + O₂).',
      takeaway: 'Reactants are the initial materials that participate in the reaction.',
      animationAction: 'createParticle',
      highlightTarget: 'reactants',
      visualState: { mode: 'reactions', subMode: 'reactants', cameraZoom: 1.05 }
    },
    {
      stepNumber: 3,
      title: 'Collision in the Reaction Zone',
      subConcept: 'Collision',
      duration: 35,
      voiceText: 'For a reaction to occur, reactant particles must collide with sufficient kinetic energy inside the active reaction zone.',
      captionText: 'Collision: Reactant molecules collide with energy in reaction chamber.',
      takeaway: 'Collisions between reactant molecules initiate bond breaking.',
      animationAction: 'animateCollision',
      highlightTarget: 'collision-zone',
      visualState: { mode: 'reactions', subMode: 'collision', cameraZoom: 1.15 }
    },
    {
      stepNumber: 4,
      title: 'Rearrangement of Atoms',
      subConcept: 'Rearrangement of atoms',
      duration: 35,
      voiceText: 'During the reaction, old chemical bonds break and atoms rearrange. Notice that atoms do not disappear; they simply reorganize into new configurations.',
      captionText: 'Rearrangement: Old bonds break and atoms rearrange into new bonds.',
      takeaway: 'Atoms are conserved; they reorganize into new molecular bonds.',
      animationAction: 'animateBondBreaking',
      highlightTarget: 'rearrangement',
      visualState: { mode: 'reactions', subMode: 'rearrangement', cameraZoom: 1.1 }
    },
    {
      stepNumber: 5,
      title: 'Products: Newly Formed Substances',
      subConcept: 'Products',
      duration: 35,
      voiceText: 'New molecules form and move toward the right. These newly formed substances are called products, such as water molecules.',
      captionText: 'Products = Newly formed substances (e.g., 2H₂O).',
      takeaway: 'Products have entirely new physical and chemical properties.',
      animationAction: 'animateBondFormation',
      highlightTarget: 'products',
      visualState: { mode: 'reactions', subMode: 'products', cameraZoom: 1.05 }
    },
    {
      stepNumber: 6,
      title: 'Signs of a Chemical Reaction',
      subConcept: 'Signs of a chemical reaction',
      duration: 35,
      voiceText: 'Common visible signs of a reaction include gas bubbles, distinct color changes, temperature shifts, and precipitate formation.',
      captionText: 'Signs of Reaction: Gas formation, color shift, temperature change, precipitate.',
      takeaway: 'Observations like bubbling and heat indicate a chemical reaction.',
      animationAction: 'createParticle',
      highlightTarget: 'signs-reaction',
      visualState: { mode: 'reactions', subMode: 'signs', cameraZoom: 1.0 }
    },
    {
      stepNumber: 7,
      title: 'Summary: Reactants → Products',
      subConcept: 'Summary',
      duration: 35,
      voiceText: 'To summarize, reactants collide, break bonds, and rearrange atoms to form products with complete conservation of mass.',
      captionText: 'Summary: Reactants → Chemical Reaction → Products.',
      takeaway: 'Reactants → Reaction → Products (Mass and atoms are conserved).',
      animationAction: 'createReaction',
      highlightTarget: 'reaction-summary',
      visualState: { mode: 'reactions', subMode: 'summary', cameraZoom: 1.0 }
    }
  ]
};
