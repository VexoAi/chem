/**
 * LESSON 5 — SCHOOL: Periodic Table and Classification of Elements
 * Exact 8-scene sequence matching Master Prompt specification.
 */

window.SchoolPeriodicTableLesson = {
  id: 'school-periodic-table',
  title: 'Periodic Table and Classification of Elements',
  level: 'school',
  levelLabel: 'School Chemistry',
  icon: '🔬',
  duration: '3–5 min',
  estimatedSeconds: 240,
  shortDesc: 'Understand elemental classification, groups, periods, metals, non-metals, and periodic trends.',
  subConcepts: [
    'What is an element?',
    'Why elements are classified',
    'Periodic table structure',
    'Groups',
    'Periods',
    'Metals',
    'Non-metals',
    'Metalloids',
    'Atomic number',
    'Element symbols',
    'Trends in the periodic table',
    'Simple real-world examples'
  ],
  quiz: [
    {
      question: 'What do vertical columns in the periodic table represent?',
      options: ['Periods', 'Groups (Families with similar chemical properties)', 'Blocks', 'Electron shells'],
      correctIndex: 1,
      explanation: 'Vertical columns are called Groups; elements in the same group have the same number of valence electrons.'
    },
    {
      question: 'Where are metals located on the periodic table?',
      options: ['On the far right', 'On the left and center', 'Only in the top row', 'Only in group 18'],
      correctIndex: 1,
      explanation: 'Metals make up the majority of elements and are located on the left and center of the periodic table.'
    }
  ],
  sampleTeacherSpeech: "Today we will explore the periodic table of elements. The periodic table organizes all 118 chemical elements in order of increasing atomic number. Vertical columns are called groups, horizontal rows are called periods, and elements are categorized into metals, metalloids, and non-metals.",

  steps: [
    {
      stepNumber: 1,
      title: 'Introduction to the Periodic Table',
      subConcept: 'Periodic table structure',
      duration: 30,
      voiceText: 'The periodic table is an organized master chart of all known chemical elements, arranged progressively by increasing atomic number.',
      captionText: 'Periodic Table: Master chart of all 118 chemical elements.',
      takeaway: 'Elements are organized by increasing proton count (Atomic Number).',
      animationAction: 'createPeriodicTable',
      highlightTarget: 'periodic-grid',
      visualState: { mode: 'periodic', subMode: 'grid', cameraZoom: 1.0 }
    },
    {
      stepNumber: 2,
      title: 'Atomic Number & Element Tile',
      subConcept: 'Atomic number',
      duration: 30,
      voiceText: 'Zooming into an element tile like Carbon, we see its element symbol C, its atomic number six, and its atomic mass of twelve point zero one.',
      captionText: 'Carbon Tile: Symbol = C, Atomic Number = 6 (6 protons), Mass = 12.011.',
      takeaway: 'The atomic number Z defines the number of protons in every atom.',
      animationAction: 'zoomToConcept',
      highlightTarget: 'element-tile',
      visualState: { mode: 'periodic', subMode: 'tile-zoom', cameraZoom: 1.2 }
    },
    {
      stepNumber: 3,
      title: 'Groups: Vertical Columns',
      subConcept: 'Groups',
      duration: 30,
      voiceText: 'Vertical columns are called groups. Elements in the same group have the same number of valence electrons and exhibit similar chemical behavior.',
      captionText: 'Groups (Vertical Columns) = Elements with identical valence electrons.',
      takeaway: 'Group elements share common chemical reactivity and family traits.',
      animationAction: 'highlightConcept',
      highlightTarget: 'groups',
      visualState: { mode: 'periodic', subMode: 'groups', cameraZoom: 1.05 }
    },
    {
      stepNumber: 4,
      title: 'Periods: Horizontal Rows',
      subConcept: 'Periods',
      duration: 30,
      voiceText: 'Horizontal rows are called periods. As you move across a period from left to right, each step adds one proton to the nucleus and one electron to the outer shell.',
      captionText: 'Periods (Horizontal Rows) = Indicate the number of occupied electron shells.',
      takeaway: 'Period number equals the number of electron shells in the atom.',
      animationAction: 'highlightConcept',
      highlightTarget: 'periods',
      visualState: { mode: 'periodic', subMode: 'periods', cameraZoom: 1.05 }
    },
    {
      stepNumber: 5,
      title: 'Metals: Lustrous & Conductive',
      subConcept: 'Metals',
      duration: 30,
      voiceText: 'Metals occupy the left and center of the table. They are shiny, malleable, ductile, and excellent conductors of electricity and heat.',
      captionText: 'Metals (Left & Center): Shiny, conductive, malleable (e.g., Na, Mg, Fe, Cu, Au).',
      takeaway: 'Metals readily lose valence electrons to form positive cations.',
      animationAction: 'highlightConcept',
      highlightTarget: 'metals',
      visualState: { mode: 'periodic', subMode: 'metals', cameraZoom: 1.0 }
    },
    {
      stepNumber: 6,
      title: 'Non-metals: Diverse & Essential',
      subConcept: 'Non-metals',
      duration: 30,
      voiceText: 'Non-metals occupy the upper right side of the periodic table. They are poor conductors, brittle when solid, and essential for organic life.',
      captionText: 'Non-metals (Right Side): Insulators, essential for life (e.g., C, N, O, P, S).',
      takeaway: 'Non-metals tend to gain or share electrons in chemical reactions.',
      animationAction: 'highlightConcept',
      highlightTarget: 'nonmetals',
      visualState: { mode: 'periodic', subMode: 'nonmetals', cameraZoom: 1.0 }
    },
    {
      stepNumber: 7,
      title: 'Metalloids: The Staircase Boundary',
      subConcept: 'Metalloids',
      duration: 30,
      voiceText: 'Metalloids lie along the diagonal staircase between metals and non-metals, possessing intermediate semiconductor properties, such as Silicon and Boron.',
      captionText: 'Metalloids (Staircase): Semiconductor properties (e.g., B, Si, Ge, As).',
      takeaway: 'Metalloids are semiconductors vital to modern computer electronics.',
      animationAction: 'highlightConcept',
      highlightTarget: 'metalloids',
      visualState: { mode: 'periodic', subMode: 'metalloids', cameraZoom: 1.0 }
    },
    {
      stepNumber: 8,
      title: 'Periodic Table Summary',
      subConcept: 'Summary',
      duration: 30,
      voiceText: 'In summary, the periodic table organizes all elements into groups and periods, elegantly categorizing metals, metalloids, and non-metals across the universe.',
      captionText: 'Summary: 118 Elements mapped by Groups, Periods, and Metallic Character.',
      takeaway: 'The periodic table is the cornerstone framework of modern chemistry.',
      animationAction: 'createPeriodicTable',
      highlightTarget: 'periodic-summary',
      visualState: { mode: 'periodic', subMode: 'summary', cameraZoom: 1.0 }
    }
  ]
};
