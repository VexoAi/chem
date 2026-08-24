/**
 * TeacherAnalysis Component - Teacher Speech Capture & Analysis Podium
 * Screen 3 of the AI Chemistry Smart Classroom
 */

class TeacherAnalysisComponent {
  constructor({ speechService, onCompleteAnalysis, onBackToTopics }) {
    this.speech = speechService;
    this.onCompleteAnalysis = onCompleteAnalysis;
    this.onBackToTopics = onBackToTopics;

    this.currentLesson = null;

    // DOM Elements
    this.topicTitleEl = document.getElementById('podium-topic-title');
    this.levelBadgeEl = document.getElementById('podium-level-badge');
    this.btnBackTopics = document.getElementById('btn-back-topics');

    this.btnMicToggle = document.getElementById('btn-mic-toggle');
    this.micLabel = document.getElementById('mic-label');
    this.micWaveform = document.getElementById('mic-waveform');
    this.transcriptArea = document.getElementById('teacher-transcript-area');
    this.btnLoadSample = document.getElementById('btn-load-sample-speech');
    this.btnAnalyzeSpeech = document.getElementById('btn-analyze-speech');
    this.subConceptsChips = document.getElementById('podium-subconcepts-chips');

    this._bindEvents();
    this._bindSpeechService();
  }

  _bindEvents() {
    this.btnBackTopics?.addEventListener('click', () => {
      this.speech.stop();
      if (this.onBackToTopics) this.onBackToTopics();
    });

    // Mic Toggle
    this.btnMicToggle?.addEventListener('click', () => {
      if (this.speech.isListening) {
        this.speech.stop();
      } else {
        this.speech.start();
      }
    });

    // Load Sample Speech Preset
    this.btnLoadSample?.addEventListener('click', () => {
      if (this.currentLesson?.sampleTeacherSpeech) {
        this.transcriptArea.value = this.currentLesson.sampleTeacherSpeech;
        this.speech.setManualTranscript(this.currentLesson.sampleTeacherSpeech);
      }
    });

    // Analyze Speech Button
    this.btnAnalyzeSpeech?.addEventListener('click', () => {
      this.speech.stop();
      const text = this.transcriptArea?.value?.trim() || '';
      if (!text) {
        alert('Please speak or provide a teacher explanation first.');
        return;
      }
      if (this.onCompleteAnalysis) {
        this.onCompleteAnalysis(text, this.currentLesson);
      }
    });
  }

  _bindSpeechService() {
    this.speech.onStatusChange = ({ isListening }) => {
      if (this.btnMicToggle) {
        this.btnMicToggle.classList.toggle('recording', isListening);
      }
      if (this.micLabel) {
        this.micLabel.textContent = isListening ? 'Listening to Teacher... (Click to Stop)' : 'Start Teacher Analysis';
      }
      if (this.micWaveform) {
        this.micWaveform.classList.toggle('active', isListening);
      }
    };

    this.speech.onTranscriptChange = ({ combined }) => {
      if (this.transcriptArea) {
        this.transcriptArea.value = combined;
      }
    };
  }

  loadLesson(lesson) {
    this.currentLesson = lesson;
    if (this.topicTitleEl) this.topicTitleEl.textContent = `${lesson.icon} ${lesson.title}`;
    if (this.levelBadgeEl) this.levelBadgeEl.textContent = lesson.levelLabel.toUpperCase();

    // Reset transcript and auto-fill helpful starter guidance
    if (this.transcriptArea) {
      this.transcriptArea.value = lesson.sampleTeacherSpeech || '';
      this.speech.setManualTranscript(this.transcriptArea.value);
    }

    // Populate sub-concepts preview chips
    if (this.subConceptsChips && lesson.subConcepts) {
      this.subConceptsChips.innerHTML = lesson.subConcepts
        .map(sc => `<span class="concept-chip">⚛️ ${sc}</span>`)
        .join('');
    }
  }
}

window.TeacherAnalysisComponent = TeacherAnalysisComponent;
