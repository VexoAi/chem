/**
 * VideoControls Component - Master Multimedia Playback Deck
 */

class VideoControlsComponent {
  constructor({ onPlayPause, onRestart, onPrev, onNext, onSeek, onVolumeChange, onMuteToggle, onSpeedChange, onCcToggle, onInspectToggle }) {
    this.callbacks = { onPlayPause, onRestart, onPrev, onNext, onSeek, onVolumeChange, onMuteToggle, onSpeedChange, onCcToggle, onInspectToggle };

    // DOM Elements
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

    this._bindEvents();
  }

  _bindEvents() {
    this.btnPlayPause?.addEventListener('click', () => this.callbacks.onPlayPause && this.callbacks.onPlayPause());
    this.btnRestart?.addEventListener('click', () => this.callbacks.onRestart && this.callbacks.onRestart());
    this.btnPrev?.addEventListener('click', () => this.callbacks.onPrev && this.callbacks.onPrev());
    this.btnNext?.addEventListener('click', () => this.callbacks.onNext && this.callbacks.onNext());

    this.btnVoiceToggle?.addEventListener('click', () => {
      if (this.callbacks.onMuteToggle) {
        const isMuted = this.callbacks.onMuteToggle();
        if (this.iconVolOn) this.iconVolOn.classList.toggle('hidden', isMuted);
        if (this.iconVolOff) this.iconVolOff.classList.toggle('hidden', !isMuted);
        this.btnVoiceToggle.classList.toggle('active-toggle', !isMuted);
      }
    });

    this.volumeSlider?.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      if (this.callbacks.onVolumeChange) this.callbacks.onVolumeChange(val);
      if (val === 0) {
        if (this.iconVolOn) this.iconVolOn.classList.add('hidden');
        if (this.iconVolOff) this.iconVolOff.classList.remove('hidden');
      } else {
        if (this.iconVolOn) this.iconVolOn.classList.remove('hidden');
        if (this.iconVolOff) this.iconVolOff.classList.add('hidden');
      }
    });

    this.btnSpeedToggle?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.speedMenu?.classList.toggle('hidden');
    });

    document.addEventListener('click', () => this.speedMenu?.classList.add('hidden'));

    document.querySelectorAll('.speed-opt').forEach(opt => {
      opt.addEventListener('click', (e) => {
        const speed = parseFloat(opt.dataset.speed);
        if (this.callbacks.onSpeedChange) this.callbacks.onSpeedChange(speed);
        if (this.speedLabel) this.speedLabel.textContent = `${speed}x`;

        document.querySelectorAll('.speed-opt').forEach(o => o.classList.remove('active'));
        opt.classList.add('active');
        this.speedMenu?.classList.add('hidden');
      });
    });

    this.btnCcToggle?.addEventListener('click', () => {
      if (this.callbacks.onCcToggle) {
        const visible = this.callbacks.onCcToggle();
        this.btnCcToggle.classList.toggle('active-toggle', visible);
      }
    });

    this.btnInspectToggle?.addEventListener('click', () => {
      if (this.callbacks.onInspectToggle) {
        const active = this.btnInspectToggle.classList.toggle('active-toggle');
        this.callbacks.onInspectToggle(active);
      }
    });

    this.timelineTrack?.addEventListener('click', (e) => {
      const rect = this.timelineTrack.getBoundingClientRect();
      const clickX = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
      const fraction = clickX / rect.width;
      if (this.callbacks.onSeek) this.callbacks.onSeek(fraction);
    });
  }

  setPlaybackState({ isPlaying, isPaused }) {
    if (this.iconPlay && this.iconPause) {
      if (isPlaying && !isPaused) {
        this.iconPlay.classList.add('hidden');
        this.iconPause.classList.remove('hidden');
      } else {
        this.iconPlay.classList.remove('hidden');
        this.iconPause.classList.add('hidden');
      }
    }
  }

  updateProgress(fraction, currentStep, totalSteps, elapsedSec, totalSec) {
    const pct = Math.min(100, Math.max(0, fraction * 100));
    if (this.timelineProgressBar) this.timelineProgressBar.style.width = `${pct}%`;
    if (this.timelineScrubber) this.timelineScrubber.style.left = `${pct}%`;

    const formatTime = (s) => {
      const m = Math.floor(s / 60);
      const rem = Math.floor(s % 60);
      return `${m < 10 ? '0' : ''}${m}:${rem < 10 ? '0' : ''}${rem}`;
    };

    if (this.timelineCurrentTime) {
      this.timelineCurrentTime.textContent = formatTime(elapsedSec);
    }
    if (this.timelineTotalTime) {
      this.timelineTotalTime.textContent = formatTime(totalSec || 230);
    }
  }

  renderStepStructure(lesson, onStepClick) {
    if (!lesson || !this.stepBreadcrumbs) return;

    this.stepBreadcrumbs.innerHTML = '';
    lesson.steps.forEach((step, idx) => {
      const crumb = document.createElement('button');
      crumb.className = `step-crumb ${idx === 0 ? 'active' : ''}`;
      crumb.textContent = `${idx + 1}`;
      crumb.title = step.title;
      crumb.dataset.index = idx;
      crumb.addEventListener('click', () => onStepClick(idx));
      this.stepBreadcrumbs.appendChild(crumb);
    });

    if (this.stepMarkers) {
      this.stepMarkers.innerHTML = '';
      const total = lesson.steps.length;
      for (let i = 1; i < total; i++) {
        const marker = document.createElement('div');
        marker.className = 'marker-point';
        marker.style.left = `${(i / total) * 100}%`;
        this.stepMarkers.appendChild(marker);
      }
    }
  }

  setStepIndex(stepIndex, totalSteps, stepTitle) {
    if (this.deckStepBadge) {
      this.deckStepBadge.innerHTML = `
        <span class="step-num">Step ${stepIndex + 1}/${totalSteps}</span>
        <span class="step-name">${stepTitle}</span>
      `;
    }

    document.querySelectorAll('.step-crumb').forEach((crumb, idx) => {
      crumb.classList.toggle('active', idx === stepIndex);
      crumb.classList.toggle('completed', idx < stepIndex);
    });
  }
}

window.VideoControlsComponent = VideoControlsComponent;
