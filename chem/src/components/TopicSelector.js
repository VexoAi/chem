/**
 * TopicSelector Component - Renders School and College Topic Cards
 * Screen 2 of the AI Chemistry Smart Classroom
 */

class TopicSelectorComponent {
  constructor({ onSelectTopic, onBackToDashboard }) {
    this.onSelectTopic = onSelectTopic;
    this.onBackToDashboard = onBackToDashboard;

    this.container = document.getElementById('screen-topics');
    this.gridEl = document.getElementById('topics-grid');
    this.levelBadgeEl = document.getElementById('topics-level-badge');
    this.levelTitleEl = document.getElementById('topics-screen-title');
    this.btnBack = document.getElementById('btn-back-dashboard');

    this._bindEvents();
  }

  _bindEvents() {
    this.btnBack?.addEventListener('click', () => {
      if (this.onBackToDashboard) this.onBackToDashboard();
    });
  }

  render(level) {
    const lessons = window.LessonRegistry.getByLevel(level);
    const isSchool = level === 'school';

    if (this.levelBadgeEl) {
      this.levelBadgeEl.textContent = isSchool ? '🏫 SCHOOL LEVEL' : '🎓 COLLEGE LEVEL';
    }
    if (this.levelTitleEl) {
      this.levelTitleEl.textContent = isSchool 
        ? '🏫 School Chemistry — Choose Your Topic' 
        : '🎓 College Chemistry — Choose Your Topic';
    }

    if (!this.gridEl) return;
    this.gridEl.innerHTML = '';

    lessons.forEach(lesson => {
      const card = document.createElement('div');
      card.className = 'topic-card';
      card.dataset.topicId = lesson.id;

      // Sub-concepts list preview (up to 4 bullets)
      const conceptsPreview = (lesson.subConcepts || [])
        .slice(0, 4)
        .map(sc => `<li><span class="bullet">✓</span> ${sc}</li>`)
        .join('');

      card.innerHTML = `
        <div class="topic-card-header">
          <span class="topic-card-icon">${lesson.icon}</span>
          <span class="topic-card-badge">${lesson.levelLabel}</span>
        </div>
        <h3 class="topic-card-title">${lesson.title}</h3>
        <p class="topic-card-desc">${lesson.shortDesc}</p>
        <ul class="topic-subconcepts-list">
          ${conceptsPreview}
          ${lesson.subConcepts?.length > 4 ? `<li class="more">+ ${lesson.subConcepts.length - 4} more sub-concepts</li>` : ''}
        </ul>
        <div class="topic-card-footer">
          <div class="topic-meta">
            <span class="meta-item"><span class="icon">⏱️</span> ${lesson.duration}</span>
            <span class="meta-item"><span class="icon">📊</span> ${isSchool ? 'Foundation' : 'Advanced'}</span>
          </div>
          <button class="btn-start-classroom" data-topic-id="${lesson.id}">
            <span>Start Classroom</span>
            <span class="arrow">▶</span>
          </button>
        </div>
      `;

      card.querySelector('.btn-start-classroom').addEventListener('click', (e) => {
        e.stopPropagation();
        if (this.onSelectTopic) this.onSelectTopic(lesson);
      });

      card.addEventListener('click', () => {
        if (this.onSelectTopic) this.onSelectTopic(lesson);
      });

      this.gridEl.appendChild(card);
    });
  }
}

window.TopicSelectorComponent = TopicSelectorComponent;
