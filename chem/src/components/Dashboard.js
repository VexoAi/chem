/**
 * Dashboard Component - Subject and Education Level Selector
 * Screen 1 of the AI Chemistry Smart Classroom
 */

class DashboardComponent {
  constructor({ onSelectLevel }) {
    this.onSelectLevel = onSelectLevel;

    this.subjectCard = document.getElementById('card-subject-chem');
    this.levelSection = document.getElementById('section-education-level');
    this.schoolCard = document.getElementById('card-level-school');
    this.collegeCard = document.getElementById('card-level-college');

    this._bindEvents();
  }

  _bindEvents() {
    // Subject Selection
    this.subjectCard?.addEventListener('click', () => {
      this.subjectCard.classList.add('selected');
      this.levelSection?.classList.remove('hidden');
      this.levelSection?.scrollIntoView({ behavior: 'smooth' });
    });

    // Level Selection - School
    this.schoolCard?.addEventListener('click', () => {
      this.schoolCard.classList.add('selected');
      this.collegeCard?.classList.remove('selected');
      if (this.onSelectLevel) this.onSelectLevel('school');
    });

    // Level Selection - College
    this.collegeCard?.addEventListener('click', () => {
      this.collegeCard.classList.add('selected');
      this.schoolCard?.classList.remove('selected');
      if (this.onSelectLevel) this.onSelectLevel('college');
    });
  }

  reset() {
    this.subjectCard?.classList.remove('selected');
    this.schoolCard?.classList.remove('selected');
    this.collegeCard?.classList.remove('selected');
  }
}

window.DashboardComponent = DashboardComponent;
