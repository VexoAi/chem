/**
 * ControlsUI - Master Control Deck & User Interface Binder
 * Connects buttons, timeline scrubbers, voice dropdowns, volume slider,
 * keyboard hotkeys, and curriculum sequence lists to the SyncController.
 */

class ControlsUI {
  constructor({ syncController, voiceEngine, captionRenderer, animationEngine }) {
    this.sync = syncController;
    this.voice = voiceEngine;
    this.captions = captionRenderer;
    this.anim = animationEngine;

    // DOM Elements
    this.btnStartLesson = document.getElementById('btn-start-lesson');
    this.startOverlay = document.getElementById('start-lesson-overlay');
    this.btnPlayPause = document.getElementById('btn-play-pause');
    this.iconPlay = this.btnPlayPause?.querySelector('.icon-play');
    this.iconPause = this.btnPlayPause?.querySelector('.icon-pause');
    this.btnRestart = document.getElementById('btn-restart');
    this.btnPrev = document.getElementById('btn-prev-step');
    this.btnNext = document.getElementById('btn-next-step');

    this.btnVoiceToggle = document.getElementById('btn-voice-toggle');
    this.iconVolOn = this.btnVoiceToggle?.querySelector('.icon-vol-on');
    this.iconVolOff = this.btnVoiceToggle?.querySelector('.icon-vol-off');
    this.volumeSlider = document.getElementById('volume-slider');

    this.btnSpeedToggle = document.getElementById('btn-speed-toggle');
    this.speedLabel = document.getElementById('speed-label');
    this.speedMenu = document.getElementById('speed-menu');
    this.btnCcToggle = document.getElementById('btn-cc-toggle');
    this.btnInspectToggle = document.getElementById('btn-inspect-toggle');

    this.timelineTrack = document.getElementById('timeline-track');
    this.timelineProgressBar = document.getElementById('timeline-progress-bar');
    this.timelineScrubber = document.getElementById('timeline-scrubber-handle');
    this.timelineCurrentTime = document.getElementById('timeline-current-time');
    this.timelineTotalTime = document.getElementById('timeline-total-time');
    this.stepBreadcrumbs = document.getElementById('step-breadcrumbs');
    this.stepMarkers = document.getElementById('step-markers');

    this.deckStepBadge = document.getElementById('deck-step-badge');
    this.currentTopicTag = document.getElementById('current-topic-tag');
    this.currentStepTitle = document.getElementById('current-step-title');

    this.sequenceStepsList = document.getElementById('sequence-steps-list');
    this.badgeStepProgress = document.getElementById('badge-step-progress');

    this.voiceSelect = document.getElementById('voice-select');
    this.topicSelect = document.getElementById('topic-select');

    this._bindAll();
  }

  _bindAll() {
    this._bindPlaybackButtons();
    this._bindAudioControls();
    this._bindTimelineScrubber();
    this._bindVoiceSelect();
    this._bindTopicSelect();
    this._bindQuickQuiz();
    this._bindKeyboardShortcuts();
    this._bindSyncCallbacks();
  }

  _bindPlaybackButtons() {
    // Start lesson overlay button (unlocks browser speech audio)
    this.btnStartLesson?.addEventListener('click', () => {
      this.startOverlay?.classList.add('hidden');
      this.sync.start();
    });

    // Play / Pause
    this.btnPlayPause?.addEventListener('click', () => {
      this.startOverlay?.classList.add('hidden');
      this.sync.togglePlayPause();
    });

    // Restart
    this.btnRestart?.addEventListener('click', () => {
      this.sync.restart();
    });

    // Next / Previous
    this.btnNext?.addEventListener('click', () => this.sync.nextStep());
    this.btnPrev?.addEventListener('click', () => this.sync.prevStep());
  }

  _bindAudioControls() {
    // Voice Mute Toggle
    this.btnVoiceToggle?.addEventListener('click', () => {
      const isMuted = this.voice.toggleMute();
      if (this.iconVolOn) this.iconVolOn.classList.toggle('hidden', isMuted);
      if (this.iconVolOff) this.iconVolOff.classList.toggle('hidden', !isMuted);
      this.btnVoiceToggle.classList.toggle('active-toggle', !isMuted);
    });

    // Volume Slider
    this.volumeSlider?.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      this.voice.setVolume(val);
      if (val === 0) {
        if (this.iconVolOn) this.iconVolOn.classList.add('hidden');
        if (this.iconVolOff) this.iconVolOff.classList.remove('hidden');
      } else {
        if (this.iconVolOn) this.iconVolOn.classList.remove('hidden');
        if (this.iconVolOff) this.iconVolOff.classList.add('hidden');
      }
    });

    // Speed Selector
    this.btnSpeedToggle?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.speedMenu?.classList.toggle('hidden');
    });

    document.addEventListener('click', () => {
      this.speedMenu?.classList.add('hidden');
    });

    document.querySelectorAll('.speed-opt').forEach(opt => {
      opt.addEventListener('click', (e) => {
        const speed = parseFloat(opt.dataset.speed);
        this.voice.setRate(speed * 0.92);
        if (this.speedLabel) this.speedLabel.textContent = `${speed}x`;

        document.querySelectorAll('.speed-opt').forEach(o => o.classList.remove('active'));
        opt.classList.add('active');
        this.speedMenu?.classList.add('hidden');
      });
    });

    // Subtitles CC Toggle
    this.btnCcToggle?.addEventListener('click', () => {
      const isVisible = this.captions.toggleVisibility();
      this.btnCcToggle.classList.toggle('active-toggle', isVisible);
    });

    // Inspect Toggle
    this.btnInspectToggle?.addEventListener('click', () => {
      const active = this.btnInspectToggle.classList.toggle('active-toggle');
      this.anim.inspectMode = active;
    });
  }

  _bindTimelineScrubber() {
    if (!this.timelineTrack) return;

    const handleSeek = (e) => {
      const rect = this.timelineTrack.getBoundingClientRect();
      const clickX = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
      const fraction = clickX / rect.width;
      
      const totalSteps = this.sync.currentTopic?.steps?.length || 6;
      const targetStep = Math.min(totalSteps - 1, Math.floor(fraction * totalSteps));
      
      this.sync.goToStep(targetStep);
    };

    this.timelineTrack.addEventListener('click', handleSeek);
  }

  _bindVoiceSelect() {
    const populateVoices = () => {
      if (!this.voiceSelect) return;
      const voices = this.voice.getVoiceList();
      if (voices.length === 0) return;

      this.voiceSelect.innerHTML = '<option value="auto">✨ Auto-Detect Best Teacher Voice</option>';
      voices.forEach(v => {
        const opt = document.createElement('option');
        opt.value = v.voiceURI;
        opt.textContent = `${v.name} (${v.lang})`;
        this.voiceSelect.appendChild(opt);
      });
    };

    populateVoices();
    if (window.speechSynthesis && window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = () => {
        this.voice._initVoices();
        populateVoices();
      };
    }

    this.voiceSelect?.addEventListener('change', (e) => {
      this.voice.setVoice(e.target.value);
    });
  }

  _bindTopicSelect() {
    this.topicSelect?.addEventListener('change', (e) => {
      const topicId = e.target.value;
      const topicObj = window.TopicRegistry.get(topicId);
      if (topicObj) {
        this.sync.loadTopic(topicObj);
        this.renderCurriculum(topicObj);
      }
    });
  }

  renderCurriculum(topicObj) {
    if (!topicObj || !this.sequenceStepsList) return;

    if (this.currentTopicTag) {
      this.currentTopicTag.textContent = (topicObj.shortTitle || topicObj.title).toUpperCase();
    }

    // Populate Right Panel Steps List
    this.sequenceStepsList.innerHTML = '';
    topicObj.steps.forEach((step, idx) => {
      const item = document.createElement('div');
      item.className = `sequence-item ${idx === 0 ? 'active' : ''}`;
      item.dataset.index = idx;
      item.innerHTML = `
        <span class="seq-index">${idx + 1}</span>
        <span class="seq-text">${step.title}</span>
      `;
      item.addEventListener('click', () => {
        this.startOverlay?.classList.add('hidden');
        this.sync.goToStep(idx);
      });
      this.sequenceStepsList.appendChild(item);
    });

    // Populate Breadcrumbs & Timeline Markers
    if (this.stepBreadcrumbs) {
      this.stepBreadcrumbs.innerHTML = '';
      topicObj.steps.forEach((step, idx) => {
        const crumb = document.createElement('button');
        crumb.className = `step-crumb ${idx === 0 ? 'active' : ''}`;
        crumb.textContent = `Step ${idx + 1}`;
        crumb.dataset.index = idx;
        crumb.addEventListener('click', () => {
          this.startOverlay?.classList.add('hidden');
          this.sync.goToStep(idx);
        });
        this.stepBreadcrumbs.appendChild(crumb);
      });
    }

    if (this.stepMarkers) {
      this.stepMarkers.innerHTML = '';
      const total = topicObj.steps.length;
      for (let i = 1; i < total; i++) {
        const marker = document.createElement('div');
        marker.className = 'marker-point';
        marker.style.left = `${(i / total) * 100}%`;
        this.stepMarkers.appendChild(marker);
      }
    }
  }

  _bindQuickQuiz() {
    document.querySelectorAll('.quiz-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const isCorrect = btn.dataset.ans === 'correct';
        const feedbackEl = document.getElementById('quiz-feedback');
        
        document.querySelectorAll('.quiz-btn').forEach(b => {
          b.classList.remove('correct', 'wrong');
        });

        if (isCorrect) {
          btn.classList.add('correct');
          if (feedbackEl) {
            feedbackEl.className = 'quiz-feedback';
            feedbackEl.style.borderColor = '#34d399';
            feedbackEl.style.color = '#34d399';
            feedbackEl.innerHTML = '🎉 <strong>Correct!</strong> Neutrons are located in the nucleus with 0 electrical charge.';
            feedbackEl.classList.remove('hidden');
          }
        } else {
          btn.classList.add('wrong');
          if (feedbackEl) {
            feedbackEl.className = 'quiz-feedback';
            feedbackEl.style.borderColor = '#f87171';
            feedbackEl.style.color = '#f87171';
            feedbackEl.innerHTML = '❌ <strong>Try again!</strong> Recall that protons are (+), electrons are (-), and neutrons are neutral (0).';
            feedbackEl.classList.remove('hidden');
          }
        }
      });
    });
  }

  _bindKeyboardShortcuts() {
    window.addEventListener('keydown', (e) => {
      // Ignore if typing in inputs/selects
      if (['INPUT', 'SELECT', 'TEXTAREA'].includes(e.target.tagName)) return;

      if (e.code === 'Space') {
        e.preventDefault();
        this.startOverlay?.classList.add('hidden');
        this.sync.togglePlayPause();
      } else if (e.code === 'ArrowRight') {
        this.sync.nextStep();
      } else if (e.code === 'ArrowLeft') {
        this.sync.prevStep();
      } else if (e.key === 'r' || e.key === 'R') {
        this.sync.restart();
      } else if (e.key === 'c' || e.key === 'C') {
        const visible = this.captions.toggleVisibility();
        this.btnCcToggle?.classList.toggle('active-toggle', visible);
      } else if (e.key === 'm' || e.key === 'M') {
        this.btnVoiceToggle?.click();
      }
    });
  }

  _bindSyncCallbacks() {
    // 1. Playback State Change
    this.sync.onPlaybackStateChange = ({ isPlaying, isPaused }) => {
      if (this.iconPlay && this.iconPause) {
        if (isPlaying && !isPaused) {
          this.iconPlay.classList.add('hidden');
          this.iconPause.classList.remove('hidden');
        } else {
          this.iconPlay.classList.remove('hidden');
          this.iconPause.classList.add('hidden');
        }
      }
    };

    // 2. Step Change
    this.sync.onStepChange = (stepIndex, stepData, topic) => {
      if (!stepData) return;

      // Update titles
      if (this.currentStepTitle) {
        this.currentStepTitle.textContent = `${stepIndex + 1}. ${stepData.title}`;
      }

      if (this.deckStepBadge) {
        this.deckStepBadge.innerHTML = `
          <span class="step-num">Step ${stepIndex + 1}/${topic.steps.length}</span>
          <span class="step-name">${stepData.title}</span>
        `;
      }

      if (this.badgeStepProgress) {
        this.badgeStepProgress.textContent = `Step ${stepIndex + 1} / ${topic.steps.length}`;
      }

      // Update Breadcrumbs
      document.querySelectorAll('.step-crumb').forEach((crumb, idx) => {
        crumb.classList.toggle('active', idx === stepIndex);
        crumb.classList.toggle('completed', idx < stepIndex);
      });

      // Update Curriculum items
      document.querySelectorAll('.sequence-item').forEach((item, idx) => {
        item.classList.toggle('active', idx === stepIndex);
        item.classList.toggle('completed', idx < stepIndex);
      });
    };

    // 3. Progress Update
    this.sync.onProgressUpdate = (fraction, currentStep, totalSteps) => {
      const pct = Math.min(100, Math.max(0, fraction * 100));
      if (this.timelineProgressBar) {
        this.timelineProgressBar.style.width = `${pct}%`;
      }
      if (this.timelineScrubber) {
        this.timelineScrubber.style.left = `${pct}%`;
      }
      if (this.timelineCurrentTime) {
        const secs = Math.round(fraction * 45);
        this.timelineCurrentTime.textContent = `0:${secs < 10 ? '0' : ''}${secs}`;
      }
    };
  }
}

window.ControlsUI = ControlsUI;
