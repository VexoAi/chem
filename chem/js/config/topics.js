/**
 * Topics Registry & Extensibility Manager
 * Stores available learning topics and provides a clean API for adding new chemistry topics.
 */

window.TopicRegistry = {
  topics: {},

  init() {
    if (window.AtomicStructureTopic) {
      this.register(window.AtomicStructureTopic);
    }
    if (window.ChemicalBondingTopic) {
      this.register(window.ChemicalBondingTopic);
    }
    if (window.AcidsBasesTopic) {
      this.register(window.AcidsBasesTopic);
    }
  },

  register(topicObj) {
    if (!topicObj || !topicObj.id) {
      console.error('Invalid topic configuration:', topicObj);
      return;
    }
    this.topics[topicObj.id] = topicObj;
  },

  get(id) {
    return this.topics[id] || this.topics['atomic-structure'];
  },

  getAll() {
    return Object.values(this.topics);
  }
};
