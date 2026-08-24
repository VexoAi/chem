/**
 * LessonRegistry - Master Repository for all School and College Chemistry Lessons
 */

window.LessonRegistry = {
  lessons: {},

  init() {
    // Register School Topics
    if (window.SchoolAtomicStructureLesson) this.register(window.SchoolAtomicStructureLesson);
    if (window.SchoolChemicalReactionsLesson) this.register(window.SchoolChemicalReactionsLesson);
    if (window.SchoolAcidsBasesLesson) this.register(window.SchoolAcidsBasesLesson);
    if (window.SchoolPhysicalChemicalChangesLesson) this.register(window.SchoolPhysicalChemicalChangesLesson);
    if (window.SchoolPeriodicTableLesson) this.register(window.SchoolPeriodicTableLesson);

    // Register College Topics
    if (window.CollegeAtomicQuantumLesson) this.register(window.CollegeAtomicQuantumLesson);
    if (window.CollegeChemicalBondingLesson) this.register(window.CollegeChemicalBondingLesson);
    if (window.CollegeThermodynamicsLesson) this.register(window.CollegeThermodynamicsLesson);
    if (window.CollegeElectrochemistryLesson) this.register(window.CollegeElectrochemistryLesson);
    if (window.CollegeOrganicChemistryLesson) this.register(window.CollegeOrganicChemistryLesson);
  },

  register(lesson) {
    if (!lesson || !lesson.id) return;
    this.lessons[lesson.id] = lesson;
  },

  get(id) {
    return this.lessons[id] || this.lessons['school-atomic-structure'];
  },

  getById(id) {
    return this.get(id);
  },

  getByLevel(level) {
    return Object.values(this.lessons).filter(l => l.level === level);
  },

  getAll() {
    return Object.values(this.lessons);
  }
};
