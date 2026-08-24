/**
 * TeacherSpeechPodium Component
 * Page 3: Fast, reliable teacher speech recognition & manual transcript fallback
 */

class TeacherSpeechPodiumComponent {
  constructor({ speechService, conceptExtractor, onCompleteAnalysis, onBackToChemistry }) {
    this.speech = speechService;
    this.extractor = conceptExtractor;
    this.onCompleteAnalysis = onCompleteAnalysis;
    this.onBackToChemistry = onBackToChemistry;

    this.currentLesson = null;
    this.isListening = false;
    this.finalTranscript = '';
    this.interimTranscript = '';

    // DOM Elements
    this.podiumTopicTitle = document.getElementById('podium-topic-title');
    this.podiumLevelBadge = document.getElementById('podium-level-badge');
    
    // Status & Transcript
    this.micStatusIndicator = document.getElementById('mic-status-indicator');
    this.liveSpeechBox = document.getElementById('live-speech-box');
    this.micWaveVisualizer = document.getElementById('mic-wave-visualizer');
    this.micErrorBanner = document.getElementById('mic-error-banner');
    this.micErrorMessage = document.getElementById('mic-error-message');

    // Controls
    this.btnStartTeacherAnalysis = document.getElementById('btn-start-teacher-analysis');
    this.btnStopAnalysis = document.getElementById('btn-stop-analysis');
    this.btnRestartSpeech = document.getElementById('btn-restart-speech');
    this.btnToggleManual = document.getElementById('btn-toggle-manual');
    this.btnTestVoice = document.getElementById('btn-test-voice-system');
    this.btnPodiumBack = document.getElementById('btn-podium-back');
    this.selectSpeechLang = document.getElementById('select-speech-lang');

    // Manual Input Section
    this.manualSection = document.getElementById('manual-transcript-section');
    this.manualTextarea = document.getElementById('manual-speech-input');
    this.btnAnalyzeManual = document.getElementById('btn-analyze-manual');
    this.btnCancelManual = document.getElementById('btn-cancel-manual');

    // Test Voice Dropdown / Modal
    this.testVoiceDropdown = document.getElementById('test-voice-dropdown');

    this._bindEvents();
  }

  _bindEvents() {
    // 1. Start Speech Recognition
    this.btnStartTeacherAnalysis?.addEventListener('click', () => {
      this.startListening();
    });

    // 2. Stop Analysis & Fast Local Process
    this.btnStopAnalysis?.addEventListener('click', () => {
      this.stopAndAnalyze();
    });

    // 3. Restart / Reset
    this.btnRestartSpeech?.addEventListener('click', () => {
      this.resetPodium();
    });

    // 4. Language Selection (Default en-IN)
    this.selectSpeechLang?.addEventListener('change', (e) => {
      this.speech.setLanguage(e.target.value);
    });

    // 5. Manual Transcript Fallback
    this.btnToggleManual?.addEventListener('click', () => {
      this.toggleManualInput();
    });

    this.btnCancelManual?.addEventListener('click', () => {
      this.closeManualInput();
    });

    this.btnAnalyzeManual?.addEventListener('click', () => {
      const text = (this.manualTextarea?.value || '').trim();
      if (text) {
        this._runFastAnalysis(text);
      }
    });

    // 6. Test Voice System Phrases
    this.btnTestVoice?.addEventListener('click', () => {
      this.toggleTestVoiceMenu();
    });

    document.querySelectorAll('.test-phrase-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const phrase = btn.dataset.phrase || btn.textContent.trim();
        this.runTestPhrase(phrase);
      });
    });

    // 7. Back Navigation
    this.btnPodiumBack?.addEventListener('click', () => {
      this.resetPodium();
      if (this.onBackToChemistry) this.onBackToChemistry();
    });
  }

  loadLesson(lesson) {
    this.currentLesson = lesson;
    this.resetPodium();

    if (this.podiumTopicTitle) {
      this.podiumTopicTitle.textContent = `${lesson.icon || '🧪'} ${lesson.title.toUpperCase()}`;
    }
    if (this.podiumLevelBadge) {
      this.podiumLevelBadge.textContent = lesson.level === 'school' ? '🏫 SCHOOL CHEMISTRY' : '🎓 COLLEGE CHEMISTRY';
      this.podiumLevelBadge.className = `podium-level-tag ${lesson.level}`;
    }
  }

  /**
   * Start microphone audio permission check and SpeechRecognition
   */
  async startListening() {
    this.hideError();
    this.closeManualInput();
    this.finalTranscript = '';
    this.interimTranscript = '';
    this._updateTranscriptDisplay('', '');

    this._setMicStatus('requesting', '🎤 Requesting microphone permission...', '🎤');
    this._setButtonStates({ isListening: true });

    const started = await this.speech.start({
      onStatusChange: (status) => {
        this._setMicStatus(status.state, status.label, status.icon);
      },
      onTranscriptUpdate: (finalText, interimText, combined) => {
        this.finalTranscript = finalText;
        this.interimTranscript = interimText;
        this._updateTranscriptDisplay(finalText, interimText);
      },
      onError: (errMsg, errType) => {
        this.showError(errMsg, errType);
        this._setMicStatus('error', '⚠️ Microphone problem', '⚠️');
        this._setButtonStates({ isListening: false });
      },
      onStop: (finalResult) => {
        // Will be called if browser closes stream
      }
    });

    if (!started) {
      this._setButtonStates({ isListening: false });
    }
  }

  /**
   * Intentional Teacher Stop -> Fast Local Analysis (< 300ms)
   */
  stopAndAnalyze() {
    this._setMicStatus('processing', '🧠 Analyzing...', '🧠');
    this.speech.stop();
    this._setButtonStates({ isListening: false });

    const spokenText = this.finalTranscript.trim() || this.interimTranscript.trim() || this.currentLesson?.sampleTeacherSpeech || '';
    
    // Fast analysis (< 50ms)
    setTimeout(() => {
      this._runFastAnalysis(spokenText);
    }, 150);
  }

  _runFastAnalysis(text) {
    this._setMicStatus('complete', '✓ Analysis complete', '✓');
    const level = this.currentLesson?.level || 'school';
    const topicId = this.currentLesson?.id || null;

    const analysisResult = this.extractor.analyzeTranscript(text, level, topicId);

    if (this.onCompleteAnalysis) {
      this.onCompleteAnalysis(analysisResult, this.currentLesson);
    }
  }

  runTestPhrase(phrase) {
    this.closeTestVoiceMenu();
    this.finalTranscript = phrase;
    this.interimTranscript = '';
    this._updateTranscriptDisplay(phrase, '');
    this.stopAndAnalyze();
  }

  _updateTranscriptDisplay(finalText, interimText) {
    if (!this.liveSpeechBox) return;

    if (!finalText && !interimText) {
      this.liveSpeechBox.innerHTML = `
        <span class="transcript-placeholder">
          Teacher explanation will appear here live as you speak... Click "START TEACHER ANALYSIS" below.
        </span>
      `;
      return;
    }

    this.liveSpeechBox.innerHTML = `
      <span class="transcript-final">${this._escapeHtml(finalText)}</span>
      <span class="transcript-interim" style="color: #94a3b8; font-style: italic;"> ${this._escapeHtml(interimText)}</span>
    `;
  }

  _setMicStatus(state, label, icon) {
    if (this.micStatusIndicator) {
      this.micStatusIndicator.className = `mic-status ${state}`;
      this.micStatusIndicator.innerHTML = `<span class="pulse-dot ${state}"></span> ${icon} ${label}`;
    }
    if (this.micWaveVisualizer) {
      this.micWaveVisualizer.classList.toggle('active', state === 'listening');
    }
  }

  _setButtonStates({ isListening }) {
    if (this.btnStartTeacherAnalysis) {
      this.btnStartTeacherAnalysis.classList.toggle('hidden', isListening);
    }
    if (this.btnStopAnalysis) {
      this.btnStopAnalysis.classList.toggle('hidden', !isListening);
    }
  }

  toggleManualInput() {
    if (this.manualSection) {
      const isHidden = this.manualSection.classList.contains('hidden');
      if (isHidden) {
        this.manualSection.classList.remove('hidden');
        if (this.manualTextarea) {
          this.manualTextarea.value = this.finalTranscript || this.currentLesson?.sampleTeacherSpeech || '';
          this.manualTextarea.focus();
        }
      } else {
        this.closeManualInput();
      }
    }
  }

  closeManualInput() {
    if (this.manualSection) {
      this.manualSection.classList.add('hidden');
    }
  }

  toggleTestVoiceMenu() {
    if (this.testVoiceDropdown) {
      this.testVoiceDropdown.classList.toggle('hidden');
    }
  }

  closeTestVoiceMenu() {
    if (this.testVoiceDropdown) {
      this.testVoiceDropdown.classList.add('hidden');
    }
  }

  showError(message, errorType) {
    if (this.micErrorBanner && this.micErrorMessage) {
      this.micErrorMessage.textContent = message;
      this.micErrorBanner.classList.remove('hidden');
    }
  }

  hideError() {
    if (this.micErrorBanner) {
      this.micErrorBanner.classList.add('hidden');
    }
  }

  resetPodium() {
    this.speech.reset();
    this.finalTranscript = '';
    this.interimTranscript = '';
    this._updateTranscriptDisplay('', '');
    this.hideError();
    this.closeManualInput();
    this.closeTestVoiceMenu();
    this._setMicStatus('idle', '🎤 Ready to listen', '🎤');
    this._setButtonStates({ isListening: false });
  }

  _escapeHtml(str) {
    return (str || '').replace(/[&<>"']/g, (m) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    }[m]));
  }
}

window.TeacherSpeechPodiumComponent = TeacherSpeechPodiumComponent;
