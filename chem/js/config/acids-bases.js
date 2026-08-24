/**
 * Acids, Bases & Neutralization Topic Definition
 */

window.AcidsBasesTopic = {
  id: 'acids-bases',
  title: 'Acids, Bases & Neutralization',
  shortTitle: 'Acids & Bases',
  category: 'Aqueous Chemistry',
  element: 'HCl + NaOH → NaCl + H2O',
  
  steps: [
    {
      stepNumber: 1,
      title: 'What Are Acids?',
      badge: 'Step 1 of 3',
      voiceText: 'Acids are chemical substances that release hydrogen ions, or H plus, when dissolved in water. They have a pH value less than seven.',
      captionText: 'Acids release H⁺ ions in water (pH < 7).',
      takeaway: 'Acids = H⁺ Donors (pH < 7).',
      visualState: {
        mode: 'solutions',
        subMode: 'acid',
        cameraZoom: 1.0,
        highlightedParticles: ['h-plus'],
        focusOverlay: {
          icon: '🍋',
          title: 'Acids (H⁺ Donors)',
          desc: 'Release hydrogen ions (H⁺) in aqueous solution. pH < 7.0.'
        }
      },
      cues: [
        { phrase: 'release hydrogen ions', timePercent: 0.35, highlight: 'h-plus', pulse: true },
        { phrase: 'less than seven', timePercent: 0.8, highlight: 'ph-meter' }
      ]
    },
    {
      stepNumber: 2,
      title: 'What Are Bases?',
      badge: 'Step 2 of 3',
      voiceText: 'Bases are substances that release hydroxide ions, or OH minus, in aqueous solutions. They have a pH greater than seven.',
      captionText: 'Bases release OH⁻ ions in water (pH > 7).',
      takeaway: 'Bases = OH⁻ Producers (pH > 7).',
      visualState: {
        mode: 'solutions',
        subMode: 'base',
        cameraZoom: 1.0,
        highlightedParticles: ['oh-minus'],
        focusOverlay: {
          icon: '🧼',
          title: 'Bases (OH⁻)',
          desc: 'Release hydroxide ions (OH⁻) in solution. pH > 7.0.'
        }
      },
      cues: [
        { phrase: 'release hydroxide ions', timePercent: 0.35, highlight: 'oh-minus', pulse: true },
        { phrase: 'greater than seven', timePercent: 0.8, highlight: 'ph-meter' }
      ]
    },
    {
      stepNumber: 3,
      title: 'Neutralization Reaction',
      badge: 'Step 3 of 3',
      voiceText: 'When an acid reacts with a base, the hydrogen and hydroxide ions combine to form water and a salt. This is called a neutralization reaction.',
      captionText: 'Acid + Base → Salt + Water (Neutralization).',
      takeaway: 'H⁺ + OH⁻ → H₂O (pH = 7 Neutral).',
      visualState: {
        mode: 'solutions',
        subMode: 'neutralization',
        cameraZoom: 1.0,
        highlightedParticles: ['water-molecule'],
        focusOverlay: {
          icon: '🧪',
          title: 'Neutralization Reaction',
          desc: 'H⁺ + OH⁻ → H₂O (Water) along with dissolved Salt (e.g., NaCl).'
        }
      },
      cues: [
        { phrase: 'combine to form water', timePercent: 0.5, highlight: 'water-molecule', pulse: true },
        { phrase: 'neutralization reaction', timePercent: 0.85, highlight: 'neutral' }
      ]
    }
  ]
};
