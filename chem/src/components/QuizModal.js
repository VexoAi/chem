/**
 * QuizModal Component - End of Lesson Takeaways & Interactive Quiz
 * Screen 6 of the AI Chemistry Smart Classroom
 */

class QuizModalComponent {
  constructor({ onWatchAgain, onChooseTopic, onBackToTeacher }) {
    this.onWatchAgain = onWatchAgain;
    this.onChooseTopic = onChooseTopic;
    this.onBackToTeacher = onBackToTeacher;

    this.container = document.getElementById('screen-lesson-complete');
    this.takeawaysList = document.getElementById('complete-takeaways-list');
    this.quizContainer = document.getElementById('complete-quiz-container');

    this.btnWatchAgain = document.getElementById('btn-watch-again');
    this.btnChooseTopic = document.getElementById('btn-choose-another-topic');
    this.btnBackTeacher = document.getElementById('btn-complete-back-teacher');

    this._bindEvents();
  }

  _bindEvents() {
    this.btnWatchAgain?.addEventListener('click', () => {
      if (this.onWatchAgain) this.onWatchAgain();
    });

    this.btnChooseTopic?.addEventListener('click', () => {
      if (this.onChooseTopic) this.onChooseTopic();
    });

    this.btnBackTeacher?.addEventListener('click', () => {
      if (this.onBackToTeacher) this.onBackToTeacher();
    });
  }

  render(lesson) {
    if (!lesson) return;

    // Render Takeaways
    if (this.takeawaysList) {
      this.takeawaysList.innerHTML = '';
      const summaryItems = lesson.steps.map(s => s.takeaway || s.captionText);
      summaryItems.forEach(item => {
        const li = document.createElement('li');
        li.innerHTML = `<span class="check-icon">✓</span> <span>${item}</span>`;
        this.takeawaysList.appendChild(li);
      });
    }

    // Render Quiz
    if (this.quizContainer && lesson.quiz) {
      this.quizContainer.innerHTML = '';
      lesson.quiz.forEach((q, qIdx) => {
        const qBox = document.createElement('div');
        qBox.className = 'quiz-question-box';

        const optionsHtml = q.options.map((opt, optIdx) => `
          <button class="quiz-opt-btn" data-qidx="${qIdx}" data-optidx="${optIdx}">
            <span class="opt-letter">${String.fromCharCode(65 + optIdx)}</span>
            <span class="opt-text">${opt}</span>
          </button>
        `).join('');

        qBox.innerHTML = `
          <h4 class="quiz-q-title">${qIdx + 1}. ${q.question}</h4>
          <div class="quiz-options-grid">${optionsHtml}</div>
          <div class="quiz-feedback-box hidden" id="feedback-q-${qIdx}"></div>
        `;

        // Bind option clicks
        qBox.querySelectorAll('.quiz-opt-btn').forEach(btn => {
          btn.addEventListener('click', () => {
            const chosen = parseInt(btn.dataset.optidx);
            const isCorrect = chosen === q.correctIndex;
            const feedbackEl = qBox.querySelector(`#feedback-q-${qIdx}`);

            qBox.querySelectorAll('.quiz-opt-btn').forEach(b => {
              b.classList.remove('selected-correct', 'selected-wrong');
            });

            if (isCorrect) {
              btn.classList.add('selected-correct');
              feedbackEl.className = 'quiz-feedback-box correct';
              feedbackEl.innerHTML = `🎉 <strong>Correct!</strong> ${q.explanation}`;
            } else {
              btn.classList.add('selected-wrong');
              feedbackEl.className = 'quiz-feedback-box wrong';
              feedbackEl.innerHTML = `❌ <strong>Not quite!</strong> ${q.explanation}`;
            }
            feedbackEl.classList.remove('hidden');
          });
        });

        this.quizContainer.appendChild(qBox);
      });
    }
  }
}

window.QuizModalComponent = QuizModalComponent;
