/**
 * LessonPlayer Component - Video & 60 FPS Visual Simulation Coordinator
 * Screen 4: Large Animation Player with Real Video & Canvas Fallback Support
 */

class LessonPlayerComponent {
  constructor({ voiceEngine, animationEngine, captionDisplay, videoControls, onLessonComplete, onBackToTeacher }) {
    this.voice = voiceEngine;
    this.anim = animationEngine;
    this.captions = captionDisplay;
    this.controls = videoControls;
    this.onLessonComplete = onLessonComplete;
    this.onBackToTeacher = onBackToTeacher;

    this.currentLesson = null;
    this.currentAnimation = null;
    this.currentStepIndex = 0;
    this.isPlaying = false;
    this.isPaused = false;
    this.stepStartTime = 0;
    this.timelineInterval = null;
    this.isVideoMode = false;

    // DOM Elements
    this.videoEl = document.getElementById('lessonVideo');
    this.canvasEl = document.getElementById('chem-canvas');
    this.videoNoticeOverlay = document.getElementById('video-notice-overlay');
    this.videoNoticeMsg = document.getElementById('video-notice-msg');
    this.btnRetryVideo = document.getElementById('btn-retry-video');

    this.stageTopicTag = document.getElementById('stage-topic-tag');
    this.stageStepTitle = document.getElementById('stage-step-title');
    this.avatarRing = document.getElementById('avatar-pulse-ring');
    this.speakingBadge = document.getElementById('speaking-badge');
    this.audioWaveform = document.getElementById('audio-wave-visualizer');
    this.sequenceListEl = document.getElementById('sequence-steps-list');
    this.badgeStepProgress = document.getElementById('badge-step-progress');
    this.btnPlayerBackTeacher = document.getElementById('btn-player-back-teacher');

    this._bindVoiceEvents();
    this._bindVideoEvents();
    this._bindBackEvents();
  }

  _bindBackEvents() {
    this.btnPlayerBackTeacher?.addEventListener('click', () => {
      this.stop();
      if (this.onBackToTeacher) this.onBackToTeacher();
    });

    this.btnRetryVideo?.addEventListener('click', () => {
      this._attemptVideoLoad();
    });
  }

  _bindVoiceEvents() {
    this.voice.onBoundary = (event) => {
      this.captions.updateBoundary(event.charIndex, event.charLength);
      this._evaluateSpeechCues(event.charIndex);
    };

    this.voice.onStateChange = (state) => {
      this._setTeacherSpeakingState(state.isSpeaking && !state.isPaused);
    };
  }

  _bindVideoEvents() {
    if (!this.videoEl) return;

    this.videoEl.addEventListener('loadedmetadata', () => {
      console.log('🎬 Video metadata loaded successfully:', this.videoEl.src);
    });

    this.videoEl.addEventListener('canplay', () => {
      console.log('🎬 Video can play:', this.videoEl.src);
    });

    this.videoEl.addEventListener('error', (e) => {
      console.warn('⚠️ Video file could not be loaded directly:', this.videoEl.src, e);
      this._fallbackToVisualSimulation('Animation video asset path not found on server. Seamlessly switched to 60 FPS Visual Simulation Engine.');
    });

    this.videoEl.addEventListener('timeupdate', () => {
      if (this.isVideoMode && this.videoEl.duration) {
        const cur = this.videoEl.currentTime;
        const dur = this.videoEl.duration;
        this.controls.updateProgress(cur / dur, 0, 1, cur, dur);
      }
    });

    this.videoEl.addEventListener('ended', () => {
      if (this.isVideoMode) {
        this._finishLesson();
      }
    });
  }

  _setTeacherSpeakingState(isSpeaking) {
    if (this.avatarRing) this.avatarRing.classList.toggle('speaking', isSpeaking);
    if (this.speakingBadge) {
      this.speakingBadge.classList.toggle('speaking', isSpeaking);
      this.speakingBadge.innerHTML = isSpeaking 
        ? '<span class="dot"></span> EXPLAINING' 
        : '<span class="dot"></span> LISTENING';
    }
    if (this.audioWaveform) this.audioWaveform.classList.toggle('active', isSpeaking);
  }

  loadLesson(lesson, animationMeta = null) {
    this.stop();
    this.currentLesson = lesson;
    this.currentAnimation = animationMeta || (window.AnimationLibrary ? window.AnimationLibrary.animations.find(a => a.lessonRef === lesson.id) : null);
    this.currentStepIndex = 0;

    if (this.stageTopicTag) {
      this.stageTopicTag.textContent = (lesson.title || '').toUpperCase();
    }

    // Render side curriculum & bottom step breadcrumbs
    this._renderCurriculumList();
    this.controls.renderStepStructure(lesson, (stepIdx) => this.goToStep(stepIdx));

    // Show initial visual state of step 1
    if (lesson.steps && lesson.steps.length > 0) {
      const step1 = lesson.steps[0];
      this._applyStepVisuals(step1, 0);
      this.captions.setStep(step1, lesson.steps.length);
      this.controls.setStepIndex(0, lesson.steps.length, step1.title);
    }

    // Prepare Video Element if metadata specifies video path
    this._attemptVideoLoad();
  }

  _attemptVideoLoad() {
    if (!this.videoEl || !this.currentAnimation || !this.currentAnimation.video) return;

    const videoPath = this.currentAnimation.video;
    console.log('Attempting to load video asset:', videoPath);

    this.videoEl.src = videoPath;
    try {
      this.videoEl.load();
    } catch (err) {
      console.warn('Video load exception:', err);
    }
  }

  _fallbackToVisualSimulation(noticeMessage) {
    this.isVideoMode = false;
    if (this.videoEl) this.videoEl.classList.add('hidden');
    if (this.canvasEl) this.canvasEl.classList.remove('hidden');

    if (this.videoNoticeOverlay && this.videoNoticeMsg) {
      this.videoNoticeMsg.textContent = noticeMessage;
      this.videoNoticeOverlay.classList.remove('hidden');
      setTimeout(() => {
        if (this.videoNoticeOverlay) this.videoNoticeOverlay.classList.add('hidden');
      }, 3500);
    }
  }

  start() {
    this.isPlaying = true;
    this.isPaused = false;
    this.controls.setPlaybackState({ isPlaying: true, isPaused: false });

    // Explicitly unlock Web Speech API synthesizer upon user click
    if (window.speechSynthesis) {
      try {
        window.speechSynthesis.resume();
      } catch (e) {}
    }

    // Force canvas dimension refresh for 60 FPS visual simulation
    if (this.anim) {
      this.anim._handleResize();
    }

    // If a valid playable video element is present
    if (this.videoEl && this.videoEl.src && !this.videoEl.error && this.videoEl.readyState >= 2) {
      this.isVideoMode = true;
      if (this.videoEl) this.videoEl.classList.remove('hidden');
      if (this.canvasEl) this.canvasEl.classList.add('hidden');

      this.videoEl.play().catch(error => {
        console.warn('Direct video playback error:', error);
        this._fallbackToVisualSimulation('Video file could not be played. Activating 60 FPS Visual Simulation.');
        this._playStep(this.currentStepIndex);
        this._startProgressTracker();
      });
      return;
    }

    // Default & Visual Simulation: 60 FPS Visual Canvas Animation with AI Teacher Voice Narration & Live Captions
    this.isVideoMode = false;
    if (this.videoEl) this.videoEl.classList.add('hidden');
    if (this.canvasEl) this.canvasEl.classList.remove('hidden');

    this._playStep(this.currentStepIndex);
    this._startProgressTracker();
  }

  pause() {
    if (!this.isPlaying) return;
    this.isPaused = true;

    if (this.isVideoMode && this.videoEl) {
      this.videoEl.pause();
    } else {
      this.voice.pause();
      this._stopProgressTracker();
    }

    this._setTeacherSpeakingState(false);
    this.controls.setPlaybackState({ isPlaying: true, isPaused: true });
  }

  resume() {
    if (!this.isPlaying || !this.isPaused) return;
    this.isPaused = false;

    if (this.isVideoMode && this.videoEl) {
      this.videoEl.play().catch(e => console.warn('Resume error:', e));
    } else {
      this.voice.resume();
      this._startProgressTracker();
      this._setTeacherSpeakingState(true);
    }

    this.controls.setPlaybackState({ isPlaying: true, isPaused: false });
  }

  togglePlayPause() {
    if (!this.isPlaying) {
      this.start();
    } else if (this.isPaused) {
      this.resume();
    } else {
      this.pause();
    }
  }

  restart() {
    this.stop();
    this.currentStepIndex = 0;
    if (this.videoEl) {
      this.videoEl.currentTime = 0;
    }
    this.start();
  }

  stop() {
    this.isPlaying = false;
    this.isPaused = false;

    if (this.videoEl) {
      try {
        this.videoEl.pause();
        this.videoEl.currentTime = 0;
      } catch (e) {}
    }

    this.voice.cancel();
    this._stopProgressTracker();
    this._setTeacherSpeakingState(false);
    this.controls.setPlaybackState({ isPlaying: false, isPaused: false });
  }

  goToStep(stepIndex) {
    if (!this.currentLesson || !this.currentLesson.steps) return;
    const bounded = Math.max(0, Math.min(this.currentLesson.steps.length - 1, stepIndex));
    this.currentStepIndex = bounded;
    const step = this.currentLesson.steps[bounded];

    this._applyStepVisuals(step, bounded);
    this.captions.setStep(step, this.currentLesson.steps.length);
    this.controls.setStepIndex(bounded, this.currentLesson.steps.length, step.title);
    this._updateCurriculumActiveState();

    if (this.isPlaying) {
      this._playStep(bounded);
    }
  }

  nextStep() {
    if (!this.currentLesson) return;
    if (this.currentStepIndex < this.currentLesson.steps.length - 1) {
      this.goToStep(this.currentStepIndex + 1);
    } else {
      this._finishLesson();
    }
  }

  prevStep() {
    if (this.currentStepIndex > 0) {
      this.goToStep(this.currentStepIndex - 1);
    }
  }

  seekFraction(fraction) {
    if (!this.currentLesson) return;
    if (this.isVideoMode && this.videoEl && this.videoEl.duration) {
      this.videoEl.currentTime = fraction * this.videoEl.duration;
      return;
    }
    const total = this.currentLesson.steps.length;
    const targetIdx = Math.min(total - 1, Math.floor(fraction * total));
    this.goToStep(targetIdx);
  }

  _playStep(stepIndex) {
    const step = this.currentLesson.steps[stepIndex];
    if (!step) return;

    this.stepStartTime = performance.now();
    this._applyStepVisuals(step, stepIndex);
    this.captions.setStep(step, this.currentLesson.steps.length);
    this.controls.setStepIndex(stepIndex, this.currentLesson.steps.length, step.title);
    this._updateCurriculumActiveState();

    if (this.stageStepTitle) {
      this.stageStepTitle.textContent = `${stepIndex + 1}. ${step.title}`;
    }

    this.voice.speak(step.voiceText, {
      onStart: () => this._setTeacherSpeakingState(true),
      onEnd: () => {
        this._setTeacherSpeakingState(false);
        if (this.isPlaying && !this.isPaused) {
          setTimeout(() => {
            if (this.isPlaying && !this.isPaused) {
              if (this.currentStepIndex < this.currentLesson.steps.length - 1) {
                this.nextStep();
              } else {
                this._finishLesson();
              }
            }
          }, 850);
        }
      }
    });
  }

  _applyStepVisuals(step, sceneIndex) {
    if (this.anim && this.currentLesson) {
      this.anim.setVisualState(step.visualState, this.currentLesson.id, sceneIndex);
    }
  }

  _evaluateSpeechCues(charIndex) {
    const step = this.currentLesson?.steps?.[this.currentStepIndex];
    if (!step || !step.cues) return;

    const fullText = step.voiceText;
    step.cues.forEach(cue => {
      if (cue.phrase && fullText.toLowerCase().includes(cue.phrase.toLowerCase())) {
        const phraseIdx = fullText.toLowerCase().indexOf(cue.phrase.toLowerCase());
        if (Math.abs(charIndex - phraseIdx) < 12) {
          this.anim.triggerParticleHighlight(cue.highlight, 2200);
        }
      }
    });
  }

  _startProgressTracker() {
    this._stopProgressTracker();
    this.timelineInterval = setInterval(() => {
      if (!this.isPlaying || this.isPaused || !this.currentLesson) return;

      const totalSteps = this.currentLesson.steps.length;
      const baseFraction = this.currentStepIndex / totalSteps;
      const elapsed = performance.now() - this.stepStartTime;
      const stepDuration = this.voice.estimatedDuration || 6000;
      const stepFraction = Math.min(1.0, elapsed / stepDuration);
      
      const overallFraction = baseFraction + (stepFraction * (1 / totalSteps));
      const totalSec = this.currentLesson.estimatedSeconds || 210;
      const currentSec = overallFraction * totalSec;

      this.controls.updateProgress(overallFraction, this.currentStepIndex, totalSteps, currentSec, totalSec);
    }, 80);
  }

  _stopProgressTracker() {
    if (this.timelineInterval) {
      clearInterval(this.timelineInterval);
      this.timelineInterval = null;
    }
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
      item.addEventListener('click', () => this.goToStep(idx));
      this.sequenceListEl.appendChild(item);
    });

    if (this.badgeStepProgress) {
      this.badgeStepProgress.textContent = `1 / ${this.currentLesson.steps.length}`;
    }
  }

  _updateCurriculumActiveState() {
    if (!this.currentLesson) return;
    document.querySelectorAll('.sequence-item').forEach((item, idx) => {
      item.classList.toggle('active', idx === this.currentStepIndex);
      item.classList.toggle('completed', idx < this.currentStepIndex);
    });

    if (this.badgeStepProgress) {
      this.badgeStepProgress.textContent = `${this.currentStepIndex + 1} / ${this.currentLesson.steps.length}`;
    }
  }

  _finishLesson() {
    this.stop();
    if (this.onLessonComplete) {
      this.onLessonComplete(this.currentLesson);
    }
  }
}

window.LessonPlayerComponent = LessonPlayerComponent;
