/**
 * ChemistryClassroom Component
 * Page 2: Two-column Chemistry Classroom (School 5 topics on left, College 5 topics on right)
 */

class ChemistryClassroomComponent {
  constructor({ onSelectTopic, onBackToDashboard }) {
    this.onSelectTopic = onSelectTopic;
    this.onBackToDashboard = onBackToDashboard;

    this.schoolTopicsGrid = document.getElementById('grid-school-topics');
    this.collegeTopicsGrid = document.getElementById('grid-college-topics');
    this.btnBackDashboard = document.getElementById('btn-back-to-dashboard');

    this._bindEvents();
    this.render();
  }

  _bindEvents() {
    this.btnBackDashboard?.addEventListener('click', () => {
      if (this.onBackToDashboard) this.onBackToDashboard();
    });
  }

  render() {
    if (!this.schoolTopicsGrid || !this.collegeTopicsGrid) return;

    const schoolLessons = window.LessonRegistry ? window.LessonRegistry.getByLevel('school') : [];
    const collegeLessons = window.LessonRegistry ? window.LessonRegistry.getByLevel('college') : [];

    this.schoolTopicsGrid.innerHTML = '';
    schoolLessons.forEach((lesson, index) => {
      const card = this._createTopicCard(lesson, index + 1, 'school');
      this.schoolTopicsGrid.appendChild(card);
    });

    this.collegeTopicsGrid.innerHTML = '';
    collegeLessons.forEach((lesson, index) => {
      const card = this._createTopicCard(lesson, index + 1, 'college');
      this.collegeTopicsGrid.appendChild(card);
    });
  }

  _createTopicCard(lesson, index, level) {
    const card = document.createElement('div');
    card.className = 'topic-classroom-card';
    card.dataset.lessonId = lesson.id;
    card.dataset.level = level;

    card.innerHTML = `
      <div class="topic-card-header">
        <div class="topic-icon-wrap">${lesson.icon || '🧪'}</div>
        <div class="topic-index-badge">#${index}</div>
      </div>
      <div class="topic-card-body">
        <h4 class="topic-card-title">${lesson.title}</h4>
        <p class="topic-card-desc">${lesson.shortDesc || 'Interactive animated visual lesson with AI teacher voice and captions.'}</p>
        <div class="topic-card-meta">
          <span class="meta-pill"><span class="clock-icon">⏱️</span> ${lesson.duration || '3–5 min'}</span>
          <span class="meta-pill level-pill ${level}">${level === 'school' ? '🏫 School' : '🎓 College'}</span>
        </div>
      </div>
      <div class="topic-card-footer">
        <span class="btn-start-label">Open Classroom →</span>
      </div>
    `;

    card.addEventListener('click', () => {
      if (this.onSelectTopic) {
        this.onSelectTopic(lesson);
      }
    });

    return card;
  }
}

window.ChemistryClassroomComponent = ChemistryClassroomComponent;
