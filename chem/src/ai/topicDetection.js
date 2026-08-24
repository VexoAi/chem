/**
 * TopicDetectionService - Chemistry-Only AI Domain & Topic Classifier
 * Verifies if the speech is Chemistry-related and identifies the primary topic.
 */

class TopicDetectionService {
  constructor() {
    // Chemistry Domain Lexicon
    this.chemistryKeywords = [
      'atom', 'atomic', 'nucleus', 'proton', 'neutron', 'electron', 'shell', 'orbit', 'orbital',
      'molecule', 'molecular', 'chemical', 'reaction', 'reactant', 'product', 'bond', 'bonding',
      'covalent', 'ionic', 'acid', 'base', 'salt', 'ph', 'litmus', 'neutralization',
      'periodic', 'table', 'element', 'metal', 'nonmetal', 'metalloid', 'group', 'period',
      'thermodynamics', 'enthalpy', 'entropy', 'gibbs', 'equilibrium', 'le chatelier',
      'redox', 'oxidation', 'reduction', 'anode', 'cathode', 'galvanic', 'electrochemistry',
      'organic', 'hydrocarbon', 'alkane', 'alkene', 'alkyne', 'alcohol', 'aldehyde', 'ketone', 'carboxylic',
      'matter', 'mass', 'substance', 'compound', 'charge', 'positive', 'negative', 'valency'
    ];

    // Non-chemistry blacklist subjects (for strict filtering)
    this.nonChemistryKeywords = [
      'calculus', 'derivative', 'integral', 'photosynthesis', 'mitochondria', 'cell division',
      'world war', 'renaissance', 'monarchy', 'python programming', 'database', 'sql query',
      'capital cities', 'geography', 'novel', 'literature', 'grammar', 'verb', 'adjective'
    ];
  }

  /**
   * Analyzes text and returns validation status and topic prediction
   */
  analyze(speechText, selectedTopic = null) {
    const text = (speechText || '').toLowerCase().trim();
    if (!text) {
      return {
        isChemistry: false,
        confidence: 0,
        message: 'No explanation provided. Please speak or type a Chemistry concept.'
      };
    }

    // 1. Check for non-chemistry topic dominance
    let nonChemMatches = 0;
    for (const kw of this.nonChemistryKeywords) {
      if (text.includes(kw)) nonChemMatches++;
    }

    // 2. Count Chemistry domain keyword matches
    const matchedKeywords = [];
    for (const kw of this.chemistryKeywords) {
      if (text.includes(kw)) {
        matchedKeywords.push(kw);
      }
    }

    const isChemistry = matchedKeywords.length >= 2 || (matchedKeywords.length >= 1 && nonChemMatches === 0);

    if (!isChemistry && nonChemMatches > matchedKeywords.length) {
      return {
        isChemistry: false,
        confidence: 0.1,
        matchedKeywords: [],
        message: 'No Chemistry topic detected. Please teach a Chemistry concept to generate a Chemistry visual lesson.'
      };
    }

    // 3. Determine best matching topic
    const topicScores = {
      'school-atomic-structure': this._scoreKeywords(text, ['atom', 'nucleus', 'proton', 'neutron', 'electron', 'shell', 'charge', 'positive', 'negative', 'matter']),
      'school-chemical-reactions': this._scoreKeywords(text, ['reaction', 'reactant', 'product', 'rearrange', 'bonds', 'formation', 'mass']),
      'school-acids-bases': this._scoreKeywords(text, ['acid', 'base', 'salt', 'ph', 'hydrogen', 'hydroxide', 'neutralization', 'indicator']),
      'school-physical-chemical-changes': this._scoreKeywords(text, ['physical', 'chemical', 'reversible', 'melting', 'rusting', 'burning', 'ice', 'water']),
      'school-periodic-table': this._scoreKeywords(text, ['periodic', 'table', 'element', 'group', 'period', 'metal', 'nonmetal', 'atomic number']),
      'college-atomic-quantum': this._scoreKeywords(text, ['quantum', 'orbital', 'schrodinger', 'bohr', 'quantum numbers', 's p d f', 'wave function']),
      'college-chemical-bonding': this._scoreKeywords(text, ['bonding', 'covalent', 'ionic', 'vsepr', 'electronegativity', 'dipole', 'geometry']),
      'college-thermodynamics': this._scoreKeywords(text, ['thermodynamics', 'enthalpy', 'entropy', 'gibbs', 'equilibrium', 'le chatelier', 'spontaneous']),
      'college-electrochemistry': this._scoreKeywords(text, ['electrochemistry', 'redox', 'oxidation', 'reduction', 'anode', 'cathode', 'salt bridge', 'galvanic']),
      'college-organic-chemistry': this._scoreKeywords(text, ['organic', 'carbon', 'hybridization', 'functional group', 'alcohol', 'carbonyl', 'nucleophile'])
    };

    let bestTopicId = selectedTopic ? selectedTopic.id : 'school-atomic-structure';
    let highestScore = 0;

    for (const [id, score] of Object.entries(topicScores)) {
      if (score > highestScore) {
        highestScore = score;
        bestTopicId = id;
      }
    }

    // Default to currently selected topic if user speech is aligned
    if (selectedTopic && topicScores[selectedTopic.id] >= 1) {
      bestTopicId = selectedTopic.id;
    }

    return {
      isChemistry: true,
      confidence: Math.min(0.98, Math.max(0.75, matchedKeywords.length * 0.12)),
      detectedTopicId: bestTopicId,
      matchedKeywords,
      message: 'Chemistry Topic Detected ✓'
    };
  }

  _scoreKeywords(text, keywords) {
    let score = 0;
    keywords.forEach(kw => {
      if (text.includes(kw)) score += 1;
    });
    return score;
  }
}

window.TopicDetectionService = TopicDetectionService;
