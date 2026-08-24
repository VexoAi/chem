/**
 * LESSON 10 — COLLEGE: Organic Chemistry — Functional Groups and Reactions
 * Exact 9-scene sequence matching Master Prompt specification.
 */

window.CollegeOrganicChemistryLesson = {
  id: 'college-organic-chemistry',
  title: 'Organic Chemistry — Functional Groups and Reactions',
  level: 'college',
  levelLabel: 'College Chemistry',
  icon: '🧬',
  duration: '4–6 min',
  estimatedSeconds: 270,
  shortDesc: 'Analyze carbon catenation, alkanes/alkenes/alkynes, functional groups (alcohols, carbonyls, carboxylic acids), and reaction mechanisms.',
  subConcepts: [
    'Introduction to organic chemistry',
    'Carbon bonding',
    'Hydrocarbons',
    'Alkanes',
    'Alkenes',
    'Alkynes',
    'Functional groups',
    'Alcohols',
    'Aldehydes',
    'Ketones',
    'Carboxylic acids',
    'Amines',
    'Basic organic reactions'
  ],
  quiz: [
    {
      question: 'Which functional group is characteristic of carboxylic acids?',
      options: ['-OH (Hydroxyl)', '-COOH (Carboxyl)', '-CHO (Aldehyde)', '-NH₂ (Amine)'],
      correctIndex: 1,
      explanation: 'The carboxyl group (-COOH) consists of a carbonyl group (C=O) bonded directly to a hydroxyl group (-OH).'
    },
    {
      question: 'What type of carbon-carbon bond distinguishes an alkyne from an alkane or alkene?',
      options: ['Single sigma bond', 'Double bond (one sigma, one pi)', 'Triple bond (one sigma, two pi bonds)', 'Ionic bond'],
      correctIndex: 2,
      explanation: 'Alkynes contain at least one carbon-carbon triple bond (C≡C), characterized by linear sp hybridization.'
    }
  ],
  sampleTeacherSpeech: "Welcome to college organic chemistry. Carbon's unique ability to form four covalent bonds and catenate into chains creates organic chemistry. Functional groups such as hydroxyls, carbonyls, and carboxyls dictate chemical reactivity. Nucleophiles attack electron-deficient electrophiles to drive synthetic transformations.",

  steps: [
    {
      stepNumber: 1,
      title: 'Carbon Tetravalency & Catenation',
      subConcept: 'Carbon bonding',
      duration: 30,
      voiceText: 'Carbon is the central atom of life due to its tetravalency, forming four strong covalent bonds and catenating into stable chains, rings, and complex networks.',
      captionText: 'Carbon: Tetravalent (forms 4 covalent bonds) with unparalleled catenation ability.',
      takeaway: 'Carbon forms the versatile backbone of all organic and biological molecules.',
      animationAction: 'createOrganicMolecule',
      highlightTarget: 'carbon-backbone',
      visualState: { mode: 'organic', subMode: 'carbon-core', cameraZoom: 1.05 }
    },
    {
      stepNumber: 2,
      title: 'Hydrocarbons: Alkanes, Alkenes, and Alkynes',
      subConcept: 'Hydrocarbons',
      duration: 30,
      voiceText: 'Hydrocarbons contain only hydrogen and carbon. Alkanes contain single bonds, alkenes possess double bonds, and alkynes contain triple bonds.',
      captionText: 'Hydrocarbons: Alkane (C ── C Single) • Alkene (C ══ C Double) • Alkyne (C ≡≡ C Triple).',
      takeaway: 'Bond saturation dictates bond length, strength, and molecular geometry.',
      animationAction: 'createBond',
      highlightTarget: 'hydrocarbon-chains',
      visualState: { mode: 'organic', subMode: 'hydrocarbons', cameraZoom: 1.1 }
    },
    {
      stepNumber: 3,
      title: 'Introduction to Functional Groups',
      subConcept: 'Functional groups',
      duration: 30,
      voiceText: 'Functional groups are specific clusters of atoms attached to hydrocarbon chains that impart distinct chemical properties and reactivity patterns.',
      captionText: 'Functional Groups: Alcohols (-OH), Aldehydes (-CHO), Ketones (C=O), Carboxylic Acids (-COOH).',
      takeaway: 'Functional groups dictate the characteristic chemical reactions of organic molecules.',
      animationAction: 'createOrganicMolecule',
      highlightTarget: 'functional-groups-overview',
      visualState: { mode: 'organic', subMode: 'groups-overview', cameraZoom: 1.05 }
    },
    {
      stepNumber: 4,
      title: 'Alcohols: The Hydroxyl Group (-OH)',
      subConcept: 'Alcohols',
      duration: 30,
      voiceText: 'Alcohols contain the polar hydroxyl group, or minus OH, bonded to carbon. The electronegative oxygen allows hydrogen bonding, elevating boiling points.',
      captionText: 'Alcohol: R ── OH (Polar hydroxyl group, enables intermolecular hydrogen bonding).',
      takeaway: 'Hydroxyl groups create polar compounds capable of strong hydrogen bonding.',
      animationAction: 'createOrganicMolecule',
      highlightTarget: 'alcohol-group',
      visualState: { mode: 'organic', subMode: 'alcohol', cameraZoom: 1.15 }
    },
    {
      stepNumber: 5,
      title: 'Carbonyl Compounds: Aldehydes & Ketones',
      subConcept: 'Aldehydes',
      duration: 30,
      voiceText: 'Carbonyl compounds feature a carbon double-bonded to oxygen. Aldehydes have the carbonyl at the terminal carbon, while ketones have it within the chain.',
      captionText: 'Carbonyls: Aldehydes (R ── CHO Terminal) • Ketones (R ── CO ── R Internal).',
      takeaway: 'The polarized carbonyl carbon (δ⁺) is prime for nucleophilic attack.',
      animationAction: 'createOrganicMolecule',
      highlightTarget: 'carbonyl-compounds',
      visualState: { mode: 'organic', subMode: 'carbonyls', cameraZoom: 1.15 }
    },
    {
      stepNumber: 6,
      title: 'Carboxylic Acids (-COOH)',
      subConcept: 'Carboxylic acids',
      duration: 30,
      voiceText: 'Carboxylic acids combine a carbonyl group with a hydroxyl group into minus COOH, giving them acidic properties by releasing a proton in aqueous solution.',
      captionText: 'Carboxylic Acid: R ── COOH (Carbonyl + Hydroxyl group, releases H⁺ proton).',
      takeaway: 'Carboxylic acids are weak organic acids found in vinegar and fats.',
      animationAction: 'createOrganicMolecule',
      highlightTarget: 'carboxylic-acid',
      visualState: { mode: 'organic', subMode: 'carboxylic', cameraZoom: 1.15 }
    },
    {
      stepNumber: 7,
      title: 'Organic Reaction Mechanism: Curved Arrow Notation',
      subConcept: 'Basic organic reactions',
      duration: 30,
      voiceText: 'In organic mechanisms, curved arrows trace the movement of electron pairs from electron-rich nucleophiles to electron-deficient electrophilic centers.',
      captionText: 'Reaction Mechanism: Nucleophile (Nu:⁻) attacks Electrophile (C⁺=O) with curved electron arrows.',
      takeaway: 'Curved arrows represent electron pair flow in bond making and breaking.',
      animationAction: 'animateBondFormation',
      highlightTarget: 'reaction-mechanism',
      visualState: { mode: 'organic', subMode: 'mechanism', cameraZoom: 1.1 }
    },
    {
      stepNumber: 8,
      title: 'Functional Group Identification',
      subConcept: 'Amines',
      duration: 30,
      voiceText: 'Chemists analyze unknown compounds by identifying characteristic infrared, nuclear magnetic resonance, and chemical reactions of their functional groups.',
      captionText: 'Identification: Identifying -OH, -CHO, -COOH, -NH₂ in drug design and synthesis.',
      takeaway: 'Functional group identification is key in pharmaceuticals and polymers.',
      animationAction: 'highlightConcept',
      highlightTarget: 'functional-identification',
      visualState: { mode: 'organic', subMode: 'identification', cameraZoom: 1.05 }
    },
    {
      stepNumber: 9,
      title: 'Organic Chemistry Summary',
      subConcept: 'Summary',
      duration: 30,
      voiceText: 'To summarize, organic chemistry unites carbon frameworks with functional groups, predicting structure, synthesis, and reaction mechanisms across living systems.',
      captionText: 'Summary: Alkane → Alkene → Alkyne → Alcohol → Aldehyde → Ketone → Carboxylic Acid.',
      takeaway: 'Functional group chemistry forms the molecular foundation of life.',
      animationAction: 'createOrganicMolecule',
      highlightTarget: 'organic-summary',
      visualState: { mode: 'organic', subMode: 'summary', cameraZoom: 1.0 }
    }
  ]
};
