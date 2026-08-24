/**
 * AI Smart Classroom — Complete Application Controller
 * Features:
 * 1. 🎤 Teacher Speech Recognition (en-IN, continuous, interim)
 * 2. 🧠 Fast Local Chemistry Keyword & Phrase Detection (< 50ms)
 * 3. 🎬 Pre-built Animation Library Matching & Relevance Scoring
 * 4. 📝 Exact Match Recommendation Card (100% Match, Detected Concepts Checklist)
 * 5. 🎬 60 FPS Visual 2D Simulation with Synchronized AI Teacher Voice & Captions
 */

class SmartClassroomApp {
  constructor() {
    this.currentScreen = 'screen-welcome';
    this.selectedSubject = 'chemistry';
    this.selectedLevel = 'school';
    this.currentLesson = null;
    this.matchedAnimation = null;
    this.currentStepIndex = 0;
    this.isPlaying = false;
    this.isPaused = false;
    this.stepStartTime = 0;
    this.playbackInterval = null;
    this.playbackSpeed = 1.0;
    this.volume = 1.0;
    this.isMuted = false;

    // Initialize Services
    if (window.LessonRegistry) window.LessonRegistry.init();
    this.animationEngine = new window.ChemistryAnimationEngine('chem-canvas');
    this.voiceEngine = new window.VoiceEngine();
    this.speechService = new window.SpeechRecognitionService();
    this.conceptExtractor = new window.ConceptExtractionService();

    this.finalTranscript = '';
    this.interimTranscript = '';

    this._cacheDOMElements();
    this._bindNavigationEvents();
    this._bindPodiumEvents();
    this._bindRecommendationEvents();
    this._bindPlayerControls();
    this._bindVoiceCallbacks();
  }

  _cacheDOMElements() {
    // Navigation Headers & Breadcrumbs
    this.navBrand = document.getElementById('nav-brand');
    this.headerBreadcrumbs = document.getElementById('header-breadcrumbs');

    // Page 1 Elements
    this.btnWelcomeStart = document.getElementById('btn-welcome-start');

    // Page 2 Elements
    this.btnBackToWelcome = document.getElementById('btn-back-to-welcome');
    this.cardSubjectChemistry = document.getElementById('card-subject-chemistry');
    this.subjectCards = document.querySelectorAll('.subject-card');

    // Page 3 Elements (Chemistry Classroom)
    this.btnBackToSubjects = document.getElementById('btn-back-to-subjects');
    this.btnOpenSpeechPodium = document.getElementById('btn-open-speech-podium');
    this.topicCards = document.querySelectorAll('.topic-classroom-card');

    // Page 3.5 Elements (Speech Podium)
    this.btnPodiumBack = document.getElementById('btn-podium-back');
    this.podiumTopicTitle = document.getElementById('podium-topic-title');
    this.podiumLevelBadge = document.getElementById('podium-level-badge');
    this.micStatusIndicator = document.getElementById('mic-status-indicator');
    this.liveSpeechBox = document.getElementById('live-speech-box');
    this.selectSpeechLang = document.getElementById('select-speech-lang');
    this.btnStartTeacherAnalysis = document.getElementById('btn-start-teacher-analysis');
    this.btnStopAnalysis = document.getElementById('btn-stop-analysis');
    this.btnRestartSpeech = document.getElementById('btn-restart-speech');
    this.btnToggleManual = document.getElementById('btn-toggle-manual');
    this.btnTestVoice = document.getElementById('btn-test-voice-system');
    this.testVoiceDropdown = document.getElementById('test-voice-dropdown');
    this.manualSection = document.getElementById('manual-transcript-section');
    this.manualTextarea = document.getElementById('manual-speech-input');
    this.btnAnalyzeManual = document.getElementById('btn-analyze-manual');
    this.btnCancelManual = document.getElementById('btn-cancel-manual');
    this.micErrorBanner = document.getElementById('mic-error-banner');
    this.micErrorMessage = document.getElementById('mic-error-message');
    this.btnMicTryAgain = document.getElementById('btn-mic-try-again');
    this.btnMicUseManual = document.getElementById('btn-mic-use-manual');

    // Page 3.6 Elements (Recommendation Results)
    this.recAnalysisDuration = document.getElementById('rec-analysis-duration');
    this.recDetectedTopic = document.getElementById('rec-detected-topic');
    this.recDetectedLevel = document.getElementById('rec-detected-level');
    this.recBannerBadge = document.getElementById('rec-banner-badge');
    this.recTitle = document.getElementById('rec-title');
    this.recMatchScore = document.getElementById('rec-match-score');
    this.recDescription = document.getElementById('rec-description');
    this.recConceptsList = document.getElementById('rec-concepts-list');
    this.recKeywordsList = document.getElementById('rec-keywords-list');
    this.btnPlayRecommended = document.getElementById('btn-play-recommended');
    this.btnAnalyzeAgain = document.getElementById('btn-analyze-again');
    this.btnRecBackClassroom = document.getElementById('btn-rec-back-classroom');

    // Page 4 Elements (Player)
    this.btnBackToChemistry = document.getElementById('btn-back-to-chemistry');
    this.lessonLevelTag = document.getElementById('lesson-level-tag');
    this.lessonTopicHeading = document.getElementById('lesson-topic-heading');
    this.canvasEl = document.getElementById('chem-canvas');
    this.playerContainer = document.getElementById('player-screen-container');

    this.badgeStepProgress = document.getElementById('badge-step-progress');
    this.sequenceListEl = document.getElementById('sequence-steps-list');
    this.lessonConceptsTags = document.getElementById('lesson-concepts-tags');

    // Subtitles / Captions
    this.captionStepCounter = document.getElementById('caption-step-counter');
    this.spokenSentenceDisplay = document.getElementById('spoken-sentence-display');
    this.takeawayText = document.getElementById('takeaway-text');

    // Video Controls Deck
    this.timeElapsedDisplay = document.getElementById('time-elapsed-display');
    this.timeTotalDisplay = document.getElementById('time-total-display');
    this.scrubberTrack = document.getElementById('scrubber-track');
    this.scrubberFill = document.getElementById('scrubber-fill');
    this.scrubberHandle = document.getElementById('scrubber-handle');

    this.btnPrevStep = document.getElementById('btn-prev-step');
    this.btnPlayPause = document.getElementById('btn-play-pause');
    this.playPauseIcon = document.getElementById('play-pause-icon');
    this.playPauseLabel = document.getElementById('play-pause-label');
    this.btnNextStep = document.getElementById('btn-next-step');
    this.btnRestartLesson = document.getElementById('btn-restart-lesson');

    this.btnVoiceMute = document.getElementById('btn-voice-mute');
    this.muteIcon = document.getElementById('mute-icon');
    this.sliderVolume = document.getElementById('slider-volume');
    this.speedSelect = document.getElementById('speed-select');
    this.btnFullscreen = document.getElementById('btn-fullscreen-toggle');

    // Coming Soon Modal
    this.modalComingSoon = document.getElementById('modal-coming-soon');
    this.modalSubjectName = document.getElementById('modal-subject-name');
    this.btnModalClose = document.getElementById('btn-modal-close');
  }

  _bindVoiceCallbacks() {
    this.voiceEngine.onBoundary = (event) => {
      this._evaluateSpeechBoundary(event.charIndex);
    };

    this.voiceEngine.onStateChange = (state) => {
      const isSpeaking = state.isSpeaking && !state.isPaused;
      if (this.captionStepCounter) {
        this.captionStepCounter.classList.toggle('speaking', isSpeaking);
      }
    };
  }

  _evaluateSpeechBoundary(charIndex) {
    const step = this.currentLesson?.steps?.[this.currentStepIndex];
    if (!step || !step.highlightTarget) return;

    if (this.animationEngine) {
      this.animationEngine.highlightConcept(step.highlightTarget, 2000);
    }
  }

  _bindNavigationEvents() {
    // Brand Logo Click -> Go Home
    this.navBrand?.addEventListener('click', () => {
      this.stopPlayback();
      this.speechService.stop();
      this.showScreen('screen-welcome');
    });

    // PAGE 1: Start Learning -> Go to Subjects
    this.btnWelcomeStart?.addEventListener('click', () => {
      this.showScreen('screen-subjects');
    });

    // PAGE 2: Back to Welcome
    this.btnBackToWelcome?.addEventListener('click', () => {
      this.showScreen('screen-welcome');
    });

    // PAGE 2: Subject Cards Click
    this.subjectCards.forEach(card => {
      card.addEventListener('click', () => {
        const subject = card.dataset.subject;
        if (subject === 'chemistry') {
          this.showScreen('screen-chemistry');
        } else {
          const title = card.dataset.title || 'Subject';
          this.showComingSoonModal(title);
        }
      });
    });

    // Modal Close
    this.btnModalClose?.addEventListener('click', () => {
      this.modalComingSoon?.classList.add('hidden');
    });

    // PAGE 3: Back to Subjects
    this.btnBackToSubjects?.addEventListener('click', () => {
      this.showScreen('screen-subjects');
    });

    // PAGE 3: Teacher Speech Analysis Mode Banner Click
    this.btnOpenSpeechPodium?.addEventListener('click', () => {
      this.openSpeechPodium(null, 'school');
    });

    // PAGE 3: Topic Cards Click -> Open Teacher Speech Podium or Lesson
    this.topicCards.forEach(card => {
      card.addEventListener('click', () => {
        const lessonId = card.dataset.lessonId;
        if (lessonId && window.LessonRegistry) {
          const lesson = window.LessonRegistry.getById(lessonId);
          if (lesson) {
            this.openSpeechPodium(lesson, lesson.level);
          }
        }
      });
    });

    // PAGE 3.5: Back from Podium to Chemistry
    this.btnPodiumBack?.addEventListener('click', () => {
      this.speechService.stop();
      this.showScreen('screen-chemistry');
    });

    // PAGE 4: Back from Player to Chemistry
    this.btnBackToChemistry?.addEventListener('click', () => {
      this.stopPlayback();
      this.showScreen('screen-chemistry');
    });
  }

  // =========================================================================
  // PAGE 3.5: Teacher Speech Recognition Podium Logic
  // =========================================================================
  openSpeechPodium(lesson = null, level = 'school') {
    this.selectedLevel = level;
    this.currentLesson = lesson;
    this.resetPodium();

    if (this.podiumTopicTitle) {
      this.podiumTopicTitle.textContent = lesson 
        ? `${lesson.icon || '🧪'} ${lesson.title.toUpperCase()}`
        : '🎤 TEACHER SPEECH ANALYSIS PODIUM';
    }
    if (this.podiumLevelBadge) {
      this.podiumLevelBadge.textContent = level === 'school' ? '🏫 SCHOOL CHEMISTRY' : '🎓 COLLEGE CHEMISTRY';
    }

    this.showScreen('screen-topic-podium');
  }

  resetPodium() {
    this.speechService.stop();
    this.finalTranscript = '';
    this.interimTranscript = '';
    this._setMicStatus('idle', '🎤 Ready to listen', '🎤');
    this.btnStartTeacherAnalysis?.classList.remove('hidden');
    this.btnStopAnalysis?.classList.add('hidden');
    this.micErrorBanner?.classList.add('hidden');
    this.manualSection?.classList.add('hidden');
    this.testVoiceDropdown?.classList.add('hidden');

    if (this.liveSpeechBox) {
      this.liveSpeechBox.innerHTML = `
        <span class="transcript-placeholder">
          Teacher explanation will appear here live as you speak... Click "START TEACHER ANALYSIS" below.
        </span>
      `;
    }
  }

  _bindPodiumEvents() {
    // 1. Start Teacher Analysis Button
    this.btnStartTeacherAnalysis?.addEventListener('click', () => {
      this.startTeacherListening();
    });

    // 2. Stop Button (Extract keywords and find animation)
    this.btnStopAnalysis?.addEventListener('click', () => {
      this.stopAndAnalyze();
    });

    // 3. Language Selector (Default en-IN)
    this.selectSpeechLang?.addEventListener('change', (e) => {
      this.speechService.setLanguage(e.target.value);
    });

    // 4. Restart / Start Again
    this.btnRestartSpeech?.addEventListener('click', () => {
      this.resetPodium();
    });

    // 5. Manual Input Toggle
    this.btnToggleManual?.addEventListener('click', () => {
      this.manualSection?.classList.toggle('hidden');
    });

    this.btnCancelManual?.addEventListener('click', () => {
      this.manualSection?.classList.add('hidden');
    });

    this.btnAnalyzeManual?.addEventListener('click', () => {
      const text = (this.manualTextarea?.value || '').trim();
      if (text) {
        this.runFastAnalysis(text);
      }
    });

    // 6. Test Voice System Dropdown
    this.btnTestVoice?.addEventListener('click', () => {
      this.testVoiceDropdown?.classList.toggle('hidden');
    });

    document.querySelectorAll('.test-phrase-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const phrase = btn.dataset.phrase || btn.textContent.trim();
        this.testVoiceDropdown?.classList.add('hidden');
        this.finalTranscript = phrase;
        this.interimTranscript = '';
        this._updateTranscriptDisplay(phrase, '');
        this.runFastAnalysis(phrase);
      });
    });

    // Error banner actions
    this.btnMicTryAgain?.addEventListener('click', () => {
      this.startTeacherListening();
    });

    this.btnMicUseManual?.addEventListener('click', () => {
      this.micErrorBanner?.classList.add('hidden');
      this.manualSection?.classList.remove('hidden');
    });
  }

  async startTeacherListening() {
    this.micErrorBanner?.classList.add('hidden');
    this.manualSection?.classList.add('hidden');
    this.testVoiceDropdown?.classList.add('hidden');
    this.finalTranscript = '';
    this.interimTranscript = '';
    this._updateTranscriptDisplay('', '');

    this._setMicStatus('requesting', '🎤 Requesting microphone permission...', '🎤');
    this.btnStartTeacherAnalysis?.classList.add('hidden');
    this.btnStopAnalysis?.classList.remove('hidden');

    const started = await this.speechService.start({
      onStatusChange: (status) => {
        this._setMicStatus(status.state, status.label, status.icon);
      },
      onTranscriptUpdate: (finalText, interimText, combined) => {
        this.finalTranscript = finalText;
        this.interimTranscript = interimText;
        this._updateTranscriptDisplay(finalText, interimText);
      },
      onError: (errMsg) => {
        if (this.micErrorMessage) this.micErrorMessage.textContent = errMsg;
        this.micErrorBanner?.classList.remove('hidden');
        this._setMicStatus('error', '⚠️ Microphone problem', '⚠️');
        this.btnStartTeacherAnalysis?.classList.remove('hidden');
        this.btnStopAnalysis?.classList.add('hidden');
      }
    });

    if (!started) {
      this.btnStartTeacherAnalysis?.classList.remove('hidden');
      this.btnStopAnalysis?.classList.add('hidden');
    }
  }

  stopAndAnalyze() {
    this._setMicStatus('processing', '🧠 Analyzing keywords...', '🧠');
    const spokenResult = this.speechService.stop();
    this.btnStartTeacherAnalysis?.classList.remove('hidden');
    this.btnStopAnalysis?.classList.add('hidden');

    const fullTranscript = (this.finalTranscript || spokenResult || this.interimTranscript || '').trim();
    
    // Fast analysis (< 50ms)
    setTimeout(() => {
      this.runFastAnalysis(fullTranscript);
    }, 150);
  }

  runFastAnalysis(transcriptText) {
    this._setMicStatus('complete', '✓ Analysis complete', '✓');
    const textToAnalyze = transcriptText || 'Today I am going to explain the structure of an atom with protons, neutrons, and electrons.';
    
    const analysisResult = this.conceptExtractor.analyzeTranscript(textToAnalyze, this.selectedLevel, this.currentLesson?.id);
    this.renderRecommendationResult(analysisResult);
    this.showScreen('screen-recommendation');
  }

  _setMicStatus(state, label, icon) {
    if (!this.micStatusIndicator) return;
    this.micStatusIndicator.className = `mic-status ${state}`;
    this.micStatusIndicator.innerHTML = `<span class="pulse-dot ${state}"></span> ${label}`;
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

    let html = '';
    if (finalText) {
      html += `<span class="transcript-final">${finalText}</span>`;
    }
    if (interimText) {
      html += ` <span class="transcript-interim" style="color: #38bdf8; font-style: italic;">${interimText}</span>`;
    }
    this.liveSpeechBox.innerHTML = html;
  }

  // =========================================================================
  // PAGE 3.6: Recommendation Results Card
  // =========================================================================
  _bindRecommendationEvents() {
    // Play Recommended Lesson Button
    this.btnPlayRecommended?.addEventListener('click', () => {
      if (this.matchedAnimation) {
        const lesson = window.LessonRegistry?.getById(this.matchedAnimation.lessonRef || this.matchedAnimation.id) || this.currentLesson;
        this.openTopicLesson(lesson);
      }
    });

    // Analyze Again
    this.btnAnalyzeAgain?.addEventListener('click', () => {
      this.showScreen('screen-topic-podium');
      this.startTeacherListening();
    });

    // Back to All Topics
    this.btnRecBackClassroom?.addEventListener('click', () => {
      this.showScreen('screen-chemistry');
    });
  }

  renderRecommendationResult(analysisResult) {
    const best = analysisResult.bestMatch || window.AnimationLibrary.animations[0];
    this.matchedAnimation = best;
    this.currentLesson = window.LessonRegistry?.getById(best.lessonRef || best.id);

    if (this.recDetectedTopic) this.recDetectedTopic.textContent = best.title;
    if (this.recDetectedLevel) this.recDetectedLevel.textContent = best.level === 'school' ? 'School Chemistry' : 'College Chemistry';
    if (this.recAnalysisDuration) this.recAnalysisDuration.textContent = `< ${analysisResult.analysisDurationMs} ms`;

    // Banner & Match Score
    if (this.recBannerBadge) {
      if (analysisResult.isExactMatch) {
        this.recBannerBadge.className = 'rec-banner-badge exact-match';
        this.recBannerBadge.textContent = '🎬 EXACT MATCH FOUND';
      } else {
        this.recBannerBadge.className = 'rec-banner-badge closest-match';
        this.recBannerBadge.textContent = '⚠️ CLOSEST AVAILABLE MATCH';
      }
    }

    if (this.recTitle) this.recTitle.textContent = best.title;
    if (this.recMatchScore) {
      this.recMatchScore.textContent = `${analysisResult.matchPercentage}% MATCH`;
      this.recMatchScore.className = `rec-score-pill ${analysisResult.isExactMatch ? 'exact' : 'closest'}`;
    }
    if (this.recDescription) this.recDescription.textContent = best.description;

    // Detected Concepts Checklist (✓ Atom, ✓ Nucleus, etc.)
    if (this.recConceptsList) {
      const concepts = analysisResult.detectedConcepts.length > 0
        ? analysisResult.detectedConcepts
        : ['Atom', 'Nucleus', 'Proton', 'Neutron', 'Electron'];

      this.recConceptsList.innerHTML = concepts.map(c => `
        <div class="concept-item-pill">
          <span class="check-mark">✓</span> ${c}
        </div>
      `).join('');
    }

    // Matched Keywords Tags
    if (this.recKeywordsList) {
      const keywords = analysisResult.matchedKeywords.length > 0
        ? analysisResult.matchedKeywords
        : ['atom', 'nucleus', 'proton', 'neutron', 'electron'];

      this.recKeywordsList.innerHTML = keywords.map(kw => `
        <span class="keyword-tag">${kw}</span>
      `).join('');
    }
  }

  // =========================================================================
  // PAGE 4: Topic Lesson Player Methods (Visual Animation + Teacher Narration)
  // =========================================================================
  openTopicLesson(lesson) {
    this.stopPlayback();
    this.currentLesson = lesson;
    this.currentStepIndex = 0;

    // 1. Update Lesson Headers
    if (this.lessonTopicHeading) {
      this.lessonTopicHeading.textContent = `${lesson.icon || '🧪'} ${lesson.title}`;
    }
    if (this.lessonLevelTag) {
      this.lessonLevelTag.textContent = lesson.level === 'school' ? '🏫 SCHOOL CHEMISTRY' : '🎓 COLLEGE CHEMISTRY';
      this.lessonLevelTag.className = `stage-tag ${lesson.level}`;
    }

    // 2. Render Side Curriculum Steps List
    this._renderCurriculumList();

    // 3. Render Concepts Tag List
    this._renderConceptsList();

    // 4. Navigate to Page 4 and Start Playback
    this.showScreen('screen-topic-lesson');
    this.goToStep(0);
    this.startPlayback();
  }

  _renderCurriculumList() {
    if (!this.sequenceListEl || !this.currentLesson) return;
    this.sequenceListEl.innerHTML = '';

    this.currentLesson.steps.forEach((step, idx) => {
      const item = document.createElement('div');
      item.className = `sequence-item ${idx === 0 ? 'active' : ''}`;
      item.dataset.index = idx;
      item.innerHTML = `
        <span class="seq-index">${idx + 1}</span>
        <span class="seq-text">${step.title}</span>
      `;
      item.addEventListener('click', () => {
        this.goToStep(idx);
      });
      this.sequenceListEl.appendChild(item);
    });

    if (this.badgeStepProgress) {
      this.badgeStepProgress.textContent = `Step 1 of ${this.currentLesson.steps.length}`;
    }
  }

  _renderConceptsList() {
    if (!this.lessonConceptsTags || !this.currentLesson) return;
    const concepts = this.currentLesson.concepts || ['Fundamental Concept', 'Particle Physics', 'Molecular Reactions'];

    this.lessonConceptsTags.innerHTML = concepts.map(c => `
      <span class="concept-badge-tag"><span class="check">✓</span> ${c}</span>
    `).join('');
  }

  _applyStep(stepIndex) {
    if (!this.currentLesson || !this.currentLesson.steps) return;
    const step = this.currentLesson.steps[stepIndex];
    if (!step) return;

    this.currentStepIndex = stepIndex;
    this.stepStartTime = performance.now();

    // 1. Update 60 FPS Visual Simulation on Canvas
    if (this.animationEngine) {
      this.animationEngine.setVisualState(step.visualState, this.currentLesson.id, stepIndex);
    }

    // 2. Update Live Captions & Subtitles
    if (this.captionStepCounter) {
      this.captionStepCounter.textContent = `SCENE ${stepIndex + 1} OF ${this.currentLesson.steps.length}`;
    }
    if (this.spokenSentenceDisplay) {
      this.spokenSentenceDisplay.textContent = step.voiceText || step.captionText || step.title;
    }
    if (this.takeawayText) {
      this.takeawayText.textContent = step.takeaway || `${this.currentLesson.title} — Educational concept takeaway.`;
    }

    // 3. Update Curriculum active styling
    document.querySelectorAll('.sequence-item').forEach((item, idx) => {
      item.classList.toggle('active', idx === stepIndex);
      item.classList.toggle('completed', idx < stepIndex);
    });

    if (this.badgeStepProgress) {
      this.badgeStepProgress.textContent = `Step ${stepIndex + 1} of ${this.currentLesson.steps.length}`;
    }

    // 4. Speak Teacher Narration for this Scene (Synchronized)
    const narrationText = step.voiceText || step.captionText || step.title;
    this.voiceEngine.speak(narrationText, {
      onStart: () => {
        if (this.captionStepCounter) this.captionStepCounter.classList.add('speaking');
      },
      onEnd: () => {
        if (this.captionStepCounter) this.captionStepCounter.classList.remove('speaking');
        
        // Auto-advance to next scene after teacher finishes speaking
        if (this.isPlaying && !this.isPaused) {
          setTimeout(() => {
            if (this.isPlaying && !this.isPaused) {
              if (this.currentStepIndex < this.currentLesson.steps.length - 1) {
                this.nextStep();
              } else {
                this.pausePlayback();
              }
            }
          }, 700);
        }
      }
    });

    this._updateProgressDisplay();
  }

  _bindPlayerControls() {
    // Play / Pause Toggle
    this.btnPlayPause?.addEventListener('click', () => {
      this.togglePlayPause();
    });

    // Prev / Next Step
    this.btnPrevStep?.addEventListener('click', () => {
      this.prevStep();
    });

    this.btnNextStep?.addEventListener('click', () => {
      this.nextStep();
    });

    // Restart Lesson
    this.btnRestartLesson?.addEventListener('click', () => {
      this.restartLesson();
    });

    // Timeline Scrubber Click & Drag
    this.scrubberTrack?.addEventListener('click', (e) => {
      const rect = this.scrubberTrack.getBoundingClientRect();
      const fraction = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      this.seekFraction(fraction);
    });

    // Volume Slider
    this.sliderVolume?.addEventListener('input', (e) => {
      this.volume = parseFloat(e.target.value);
      this.voiceEngine.setVolume(this.volume);
      if (this.muteIcon) this.muteIcon.textContent = this.volume > 0 && !this.isMuted ? '🔊' : '🔇';
    });

    // Mute Toggle
    this.btnVoiceMute?.addEventListener('click', () => {
      this.toggleMute();
    });

    // Playback Speed
    this.speedSelect?.addEventListener('change', (e) => {
      this.playbackSpeed = parseFloat(e.target.value) || 1.0;
      this.voiceEngine.setRate(this.playbackSpeed * 0.95);
    });

    // Fullscreen Toggle
    this.btnFullscreen?.addEventListener('click', () => {
      this.toggleFullscreen();
    });
  }

  toggleMute() {
    this.isMuted = this.voiceEngine.toggleMute();
    if (this.muteIcon) this.muteIcon.textContent = this.isMuted ? '🔇' : '🔊';
  }

  startPlayback() {
    this.isPlaying = true;
    this.isPaused = false;
    this._setPlayPauseButtonUI(true);

    if (this.animationEngine) {
      this.animationEngine._handleResize();
    }

    // Unlock Web Speech synthesizer
    if (window.speechSynthesis) {
      try { window.speechSynthesis.resume(); } catch (e) {}
    }

    this._startProgressTracker();
  }

  pausePlayback() {
    if (!this.isPlaying) return;
    this.isPaused = true;
    this._setPlayPauseButtonUI(false);
    this.voiceEngine.pause();
    this._stopProgressTracker();
  }

  resumePlayback() {
    if (!this.isPlaying || !this.isPaused) return;
    this.isPaused = false;
    this._setPlayPauseButtonUI(true);
    this.voiceEngine.resume();
    this._startProgressTracker();
  }

  togglePlayPause() {
    if (!this.isPlaying) {
      this.startPlayback();
      this._applyStep(this.currentStepIndex);
    } else if (this.isPaused) {
      this.resumePlayback();
    } else {
      this.pausePlayback();
    }
  }

  stopPlayback() {
    this.isPlaying = false;
    this.isPaused = false;
    this._setPlayPauseButtonUI(false);
    this.voiceEngine.cancel();
    this._stopProgressTracker();
  }

  restartLesson() {
    this.stopPlayback();
    this.goToStep(0);
    this.startPlayback();
  }

  goToStep(stepIndex) {
    if (!this.currentLesson || !this.currentLesson.steps) return;
    const bounded = Math.max(0, Math.min(this.currentLesson.steps.length - 1, stepIndex));
    this.voiceEngine.cancel();
    this._applyStep(bounded);
  }

  nextStep() {
    if (!this.currentLesson) return;
    if (this.currentStepIndex < this.currentLesson.steps.length - 1) {
      this.goToStep(this.currentStepIndex + 1);
    } else {
      this.pausePlayback();
    }
  }

  prevStep() {
    if (this.currentStepIndex > 0) {
      this.goToStep(this.currentStepIndex - 1);
    }
  }

  seekFraction(fraction) {
    if (!this.currentLesson || !this.currentLesson.steps) return;
    const total = this.currentLesson.steps.length;
    const targetIdx = Math.min(total - 1, Math.floor(fraction * total));
    this.goToStep(targetIdx);
  }

  _startProgressTracker() {
    this._stopProgressTracker();
    this.playbackInterval = setInterval(() => {
      if (!this.isPlaying || this.isPaused || !this.currentLesson) return;
      this._updateProgressDisplay();
    }, 80);
  }

  _stopProgressTracker() {
    if (this.playbackInterval) {
      clearInterval(this.playbackInterval);
      this.playbackInterval = null;
    }
  }

  _updateProgressDisplay() {
    if (!this.currentLesson || !this.currentLesson.steps) return;

    const totalSteps = this.currentLesson.steps.length;
    const baseFraction = this.currentStepIndex / totalSteps;
    const elapsed = performance.now() - this.stepStartTime;
    const stepDuration = this.voiceEngine.estimatedDuration || 5500;
    const stepFraction = Math.min(1.0, elapsed / stepDuration);

    const overallFraction = Math.min(1.0, baseFraction + (stepFraction * (1 / totalSteps)));
    const totalSec = (this.currentLesson.steps.length * 6);
    const currentSec = Math.round(overallFraction * totalSec);

    // Update Scrubber UI
    if (this.scrubberFill) this.scrubberFill.style.width = `${overallFraction * 100}%`;
    if (this.scrubberHandle) this.scrubberHandle.style.left = `${overallFraction * 100}%`;

    // Time Text
    if (this.timeElapsedDisplay) this.timeElapsedDisplay.textContent = this._formatTime(currentSec);
    if (this.timeTotalDisplay) this.timeTotalDisplay.textContent = this._formatTime(totalSec);
  }

  _formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }

  _setPlayPauseButtonUI(isPlaying) {
    if (this.playPauseIcon) this.playPauseIcon.textContent = isPlaying ? '⏸' : '▶';
    if (this.playPauseLabel) this.playPauseLabel.textContent = isPlaying ? 'Pause' : 'Play';
  }

  toggleFullscreen() {
    if (!this.playerContainer) return;
    if (!document.fullscreenElement) {
      this.playerContainer.requestFullscreen().catch(err => {
        console.warn('Fullscreen request failed:', err);
      });
    } else {
      document.exitFullscreen();
    }
  }

  showScreen(screenId) {
    this.currentScreen = screenId;
    document.querySelectorAll('.app-screen').forEach(scr => {
      scr.classList.toggle('active', scr.id === screenId);
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });

    this._updateBreadcrumbs(screenId);

    // Refresh canvas buffer size when switching to player screen
    if (screenId === 'screen-topic-lesson' && this.animationEngine) {
      setTimeout(() => {
        this.animationEngine._handleResize();
      }, 60);
    }
  }

  _updateBreadcrumbs(screenId) {
    if (!this.headerBreadcrumbs) return;

    let crumbsHtml = '<span class="crumb" onclick="window.App.showScreen(\'screen-welcome\')">Home</span>';

    if (screenId === 'screen-subjects') {
      crumbsHtml += ' <span class="sep">/</span> <span class="crumb active">Subjects</span>';
    } else if (screenId === 'screen-chemistry') {
      crumbsHtml += ' <span class="sep">/</span> <span class="crumb" onclick="window.App.showScreen(\'screen-subjects\')">Subjects</span>';
      crumbsHtml += ' <span class="sep">/</span> <span class="crumb active">🧪 Chemistry</span>';
    } else if (screenId === 'screen-topic-podium') {
      crumbsHtml += ' <span class="sep">/</span> <span class="crumb" onclick="window.App.showScreen(\'screen-subjects\')">Subjects</span>';
      crumbsHtml += ' <span class="sep">/</span> <span class="crumb" onclick="window.App.showScreen(\'screen-chemistry\')">🧪 Chemistry</span>';
      crumbsHtml += ' <span class="sep">/</span> <span class="crumb active">🎤 Speech Analysis</span>';
    } else if (screenId === 'screen-recommendation') {
      crumbsHtml += ' <span class="sep">/</span> <span class="crumb" onclick="window.App.showScreen(\'screen-subjects\')">Subjects</span>';
      crumbsHtml += ' <span class="sep">/</span> <span class="crumb" onclick="window.App.showScreen(\'screen-chemistry\')">🧪 Chemistry</span>';
      crumbsHtml += ' <span class="sep">/</span> <span class="crumb active">🧠 Recommendation</span>';
    } else if (screenId === 'screen-topic-lesson') {
      crumbsHtml += ' <span class="sep">/</span> <span class="crumb" onclick="window.App.showScreen(\'screen-subjects\')">Subjects</span>';
      crumbsHtml += ' <span class="sep">/</span> <span class="crumb" onclick="window.App.showScreen(\'screen-chemistry\')">🧪 Chemistry</span>';
      crumbsHtml += ` <span class="sep">/</span> <span class="crumb active">${this.currentLesson?.title || 'Lesson'}</span>`;
    }

    this.headerBreadcrumbs.innerHTML = crumbsHtml;
  }

  showComingSoonModal(subjectTitle) {
    if (this.modalSubjectName) this.modalSubjectName.textContent = subjectTitle;
    this.modalComingSoon?.classList.remove('hidden');
  }
}

// Instantiate on DOM Load
document.addEventListener('DOMContentLoaded', () => {
  window.App = new SmartClassroomApp();
  console.log('🏫 AI Smart Classroom with Speech Keyword Detection initialized successfully.');
});
