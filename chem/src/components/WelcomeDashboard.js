/**
 * WelcomeDashboard Component
 * Page 1: Multi-Subject Welcome Landing Screen with 6 subject cards
 */

class WelcomeDashboardComponent {
  constructor({ onSelectSubject }) {
    this.onSelectSubject = onSelectSubject;

    this.subjectCards = document.querySelectorAll('.subject-card');
    this.modalComingSoon = document.getElementById('modal-coming-soon');
    this.modalSubjectName = document.getElementById('modal-subject-name');
    this.btnModalClose = document.getElementById('btn-modal-close');

    this._bindEvents();
  }

  _bindEvents() {
    this.subjectCards.forEach(card => {
      card.addEventListener('click', () => {
        const subject = card.dataset.subject;
        if (subject === 'chemistry') {
          if (this.onSelectSubject) this.onSelectSubject('chemistry');
        } else {
          this.showComingSoon(card.dataset.title || subject);
        }
      });
    });

    this.btnModalClose?.addEventListener('click', () => {
      this.closeModal();
    });

    this.modalComingSoon?.addEventListener('click', (e) => {
      if (e.target === this.modalComingSoon) this.closeModal();
    });
  }

  showComingSoon(subjectName) {
    if (this.modalSubjectName) {
      this.modalSubjectName.textContent = subjectName;
    }
    if (this.modalComingSoon) {
      this.modalComingSoon.classList.remove('hidden');
    }
  }

  closeModal() {
    if (this.modalComingSoon) {
      this.modalComingSoon.classList.add('hidden');
    }
  }

  reset() {
    this.closeModal();
  }
}

window.WelcomeDashboardComponent = WelcomeDashboardComponent;
