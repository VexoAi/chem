/**
 * SyncController - Master Timeline & Multimedia Synchronization Coordinator
 * Orchestrates voice narration, canvas animation states, live subtitles,
 * scrubbable progress bar, step navigation, and particle highlight cues.
 */

class SyncController {
  constructor({ voiceEngine, animationEngine, captionRenderer, teacherAvatar }) {
    this.voiceEngine = voiceEngine;
    this.animationEngine = animationEngine;
    this.captionRenderer = captionRenderer;
    this.teacherAvatar = teacherAvatar;

    this.currentTopic = null;
    this.currentStepIndex = 0;
    this.isPlaying = false;
    this.isPaused = false;
    this.autoAdvance = true;

    // Timeline metrics
    this.stepStartTime = 0;
    this.stepEstimatedDuration = 6000; // ms
    this.timelineInterval = null;

    // Listener callbacks
    this.onStepChange = null;
    this.onProgressUpdate = null;
    this.onPlaybackStateChange = null;

    this._bindVoiceEngine();
  }

  _bindVoiceEngine() {
    this.voiceEngine.onBoundary = (event) => {
      // 1. Update live subtitles word highlight
      this.captionRenderer.updateBoundary(event.charIndex, event.charLength);

      // 2. Evaluate cues in the current step to trigger micro-highlights
      this._evaluateSpeechCues(event.charIndex);
    };

    this.voiceEngine.onStateChange = (state) => {
      if (this.teacherAvatar) {
        this.teacherAvatar.setSpeaking(state.isSpeaking && !state.isPaused);
      }
    };
  }

  loadTopic(topicObj) {
    this.stop();
    this.currentTopic = topicObj;
    this.currentStepIndex = 0;

    // Set topic visual mode
    const mode = topicObj.id === 'chemical-bonding' ? 'bonding' 
               : topicObj.id === 'acids-bases' ? 'solutions' 
               : 'atom';

    // Apply step 1 initial visual state without auto-playing voice yet
    if (this.currentTopic.steps && this.currentTopic.steps.length > 0) {
      const step = this.currentTopic.steps[0];
      this.animationEngine.setVisualState(step.visualState, mode);
      this.captionRenderer.setStep(step, this.currentTopic.steps.length);
    }

    if (this.onStepChange) {
      this.onStepChange(this.currentStepIndex, this.currentTopic.steps[0], this.currentTopic);
    }
  }

  start() {
    this.isPlaying = true;
    this.isPaused = false;
    this._playCurrentStep();
    this._startProgressTracker();

    if (this.onPlaybackStateChange) {
      this.onPlaybackStateChange({ isPlaying: true, isPaused: false });
    }
  }

  pause() {
    if (!this.isPlaying) return;
    this.isPaused = true;
    this.voiceEngine.pause();
    this._stopProgressTracker();

    if (this.teacherAvatar) {
      this.teacherAvatar.setSpeaking(false);
    }

    if (this.onPlaybackStateChange) {
      this.onPlaybackStateChange({ isPlaying: true, isPaused: true });
    }
  }

  resume() {
    if (!this.isPlaying || !this.isPaused) return;
    this.isPaused = false;
    this.voiceEngine.resume();
    this._startProgressTracker();

    if (this.teacherAvatar) {
      this.teacherAvatar.setSpeaking(true);
    }

    if (this.onPlaybackStateChange) {
      this.onPlaybackStateChange({ isPlaying: true, isPaused: false });
    }
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
    this.start();
  }

  stop() {
    this.isPlaying = false;
    this.isPaused = false;
    this.voiceEngine.cancel();
    this._stopProgressTracker();

    if (this.teacherAvatar) {
      this.teacherAvatar.setSpeaking(false);
    }

    if (this.onPlaybackStateChange) {
      this.onPlaybackStateChange({ isPlaying: false, isPaused: false });
    }
  }

  goToStep(stepIndex) {
    if (!this.currentTopic || !this.currentTopic.steps) return;
    const boundedIndex = Math.max(0, Math.min(this.currentTopic.steps.length - 1, stepIndex));
    
    this.currentStepIndex = boundedIndex;
    const step = this.currentTopic.steps[boundedIndex];

    const mode = this.currentTopic.id === 'chemical-bonding' ? 'bonding' 
               : this.currentTopic.id === 'acids-bases' ? 'solutions' 
               : 'atom';

    this.animationEngine.setVisualState(step.visualState, mode);
    this.captionRenderer.setStep(step, this.currentTopic.steps.length);

    if (this.onStepChange) {
      this.onStepChange(this.currentStepIndex, step, this.currentTopic);
    }

    if (this.isPlaying) {
      this._playCurrentStep();
    }
  }

  nextStep() {
    if (!this.currentTopic) return;
    if (this.currentStepIndex < this.currentTopic.steps.length - 1) {
      this.goToStep(this.currentStepIndex + 1);
    } else {
      // Completed all steps
      this.stop();
    }
  }

  prevStep() {
    if (this.currentStepIndex > 0) {
      this.goToStep(this.currentStepIndex - 1);
    }
  }

  _playCurrentStep() {
    if (!this.currentTopic || !this.currentTopic.steps) return;
    const step = this.currentTopic.steps[this.currentStepIndex];
    if (!step) return;

    this.stepStartTime = performance.now();
    const mode = this.currentTopic.id === 'chemical-bonding' ? 'bonding' 
               : this.currentTopic.id === 'acids-bases' ? 'solutions' 
               : 'atom';

    // 1. Transition animation camera & particle state
    this.animationEngine.setVisualState(step.visualState, mode);

    // 2. Update subtitle box
    this.captionRenderer.setStep(step, this.currentTopic.steps.length);

    if (this.onStepChange) {
      this.onStepChange(this.currentStepIndex, step, this.currentTopic);
    }

    // 3. Play Teacher Voice Narration
    this.voiceEngine.speak(step.voiceText, {
      onStart: () => {
        if (this.teacherAvatar) this.teacherAvatar.setSpeaking(true);
      },
      onEnd: () => {
        if (this.teacherAvatar) this.teacherAvatar.setSpeaking(false);
        
        // Auto-advance to next step after a natural pedagogical pause (800ms)
        if (this.isPlaying && !this.isPaused && this.autoAdvance) {
          setTimeout(() => {
            if (this.isPlaying && !this.isPaused) {
              if (this.currentStepIndex < this.currentTopic.steps.length - 1) {
                this.nextStep();
              } else {
                // Completed lesson
                this.stop();
                if (this.captionRenderer) {
                  this.captionRenderer.renderText('Lesson completed! Review the key concepts or restart anytime.', -1);
                }
              }
            }
          }, 850);
        }
      }
    });
  }

  _evaluateSpeechCues(charIndex) {
    const step = this.currentTopic?.steps?.[this.currentStepIndex];
    if (!step || !step.cues) return;

    const fullText = step.voiceText;
    const progressFraction = charIndex / fullText.length;

    // Check matching cues
    step.cues.forEach(cue => {
      // Either text matched or progress reached
      if (cue.phrase && fullText.toLowerCase().includes(cue.phrase.toLowerCase())) {
        const phraseIdx = fullText.toLowerCase().indexOf(cue.phrase.toLowerCase());
        if (Math.abs(charIndex - phraseIdx) < 8) {
          this.animationEngine.triggerParticleHighlight(cue.highlight, 2000);
        }
      }
    });
  }

  _startProgressTracker() {
    this._stopProgressTracker();
    this.timelineInterval = setInterval(() => {
      if (!this.isPlaying || this.isPaused || !this.currentTopic) return;

      const totalSteps = this.currentTopic.steps.length;
      const baseStepProgress = this.currentStepIndex / totalSteps;
      
      // Calculate smooth fractional progress of current step
      const elapsed = performance.now() - this.stepStartTime;
      const stepDuration = this.voiceEngine.estimatedDuration || 5000;
      const stepFraction = Math.min(1.0, elapsed / stepDuration);
      
      const overallProgress = baseStepProgress + (stepFraction * (1 / totalSteps));

      if (this.onProgressUpdate) {
        this.onProgressUpdate(Math.min(1.0, overallProgress), this.currentStepIndex, totalSteps);
      }
    }, 60);
  }

  _stopProgressTracker() {
    if (this.timelineInterval) {
      clearInterval(this.timelineInterval);
      this.timelineInterval = null;
    }
  }
}

window.SyncController = SyncController;
