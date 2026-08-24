/**
 * TeacherAvatar - AI Teacher Visualizer & Speaking State Component
 * Manages the pulsing avatar ring, "EXPLAINING" badge, and audio equalizer bars.
 */

class TeacherAvatar {
  constructor() {
    this.avatarRing = document.getElementById('avatar-pulse-ring');
    this.speakingBadge = document.getElementById('speaking-badge');
    this.visualizer = document.getElementById('audio-wave-visualizer');
    this.statusPill = document.getElementById('teacher-status-pill');
    this.statusText = document.getElementById('teacher-status-text');
  }

  setSpeaking(isSpeaking) {
    if (this.avatarRing) {
      this.avatarRing.classList.toggle('speaking', isSpeaking);
    }

    if (this.speakingBadge) {
      this.speakingBadge.classList.toggle('speaking', isSpeaking);
      this.speakingBadge.innerHTML = isSpeaking 
        ? '<span class="dot"></span> EXPLAINING' 
        : '<span class="dot"></span> LISTENING';
    }

    if (this.visualizer) {
      this.visualizer.classList.toggle('active', isSpeaking);
    }

    if (this.statusText) {
      this.statusText.textContent = isSpeaking ? 'AI Teacher Speaking...' : 'AI Teacher Ready';
    }
  }
}

window.TeacherAvatar = TeacherAvatar;
