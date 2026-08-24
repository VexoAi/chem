/**
 * VoiceEngine - Web Speech API AI Teacher Voice Synthesizer
 * Provides robust speech playback, natural voice detection, rate/pitch tuning,
 * boundary synchronization, volume/mute control, GC protection, and resume unlocking.
 */

class VoiceEngine {
  constructor() {
    this.synth = window.speechSynthesis;
    this.currentUtterance = null;
    this.selectedVoice = null;
    this.voices = [];
    this.isMuted = false;
    this.volume = 1.0;
    this.rate = 0.95; // Natural, clear classroom teaching pace
    this.pitch = 1.0;
    this.isSpeaking = false;
    this.isPaused = false;
    this.onStateChange = null;
    this.onBoundary = null;
    this.onEnd = null;

    this.fallbackTimer = null;
    this.startTime = 0;
    this.estimatedDuration = 0;

    this._initVoices();
  }

  _initVoices() {
    if (!this.synth) {
      console.warn('Web Speech API is not supported in this browser.');
      return;
    }

    const loadVoices = () => {
      this.voices = this.synth.getVoices() || [];
      this._selectBestTeacherVoice();
    };

    loadVoices();
    if (this.synth.onvoiceschanged !== undefined) {
      this.synth.onvoiceschanged = loadVoices;
    }
  }

  _selectBestTeacherVoice() {
    if (!this.voices || this.voices.length === 0) return;

    const englishVoices = this.voices.filter(v => v.lang && (v.lang.startsWith('en') || v.lang.includes('IN') || v.lang.includes('US') || v.lang.includes('GB')));

    const preferredNames = [
      'Google US English',
      'Google UK English Female',
      'Microsoft Jenny Online (Natural)',
      'Microsoft Guy Online (Natural)',
      'Microsoft Aria Online (Natural)',
      'Microsoft Heera - English (India)',
      'Microsoft Neerja Online (Natural) - English (India)',
      'Microsoft Prabhat Online (Natural) - English (India)',
      'Samantha',
      'Daniel',
      'Karen',
      'Victoria',
      'Alex',
      'Google UK English Male'
    ];

    let found = null;
    for (const name of preferredNames) {
      found = englishVoices.find(v => v.name && v.name.includes(name));
      if (found) break;
    }

    if (!found) {
      found = englishVoices.find(v => v.name && (v.name.toLowerCase().includes('natural') || v.name.toLowerCase().includes('female'))) 
              || englishVoices[0] 
              || this.voices[0];
    }

    this.selectedVoice = found;
  }

  getVoiceList() {
    if (!this.voices || this.voices.length === 0) {
      this.voices = this.synth ? this.synth.getVoices() : [];
    }
    return (this.voices || []).filter(v => v.lang && (v.lang.startsWith('en') || v.default));
  }

  setVoice(voiceURI) {
    if (voiceURI === 'auto') {
      this._selectBestTeacherVoice();
      return;
    }
    const match = (this.voices || []).find(v => v.voiceURI === voiceURI || v.name === voiceURI);
    if (match) {
      this.selectedVoice = match;
    }
  }

  speak(text, callbacks = {}) {
    if (!this.synth) {
      this._simulateSpeechTimer(text, callbacks);
      return;
    }

    // Cancel any stuck utterances and unlock audio stream
    try {
      this.synth.cancel();
      this.synth.resume();
    } catch (e) {}

    if (!text || text.trim() === '') return;

    if (!this.voices || this.voices.length === 0) {
      this.voices = this.synth.getVoices() || [];
      if (!this.selectedVoice) this._selectBestTeacherVoice();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    this.currentUtterance = utterance;
    window._activeSpeechUtterance = utterance; // Prevent browser GC bug

    if (this.selectedVoice) {
      utterance.voice = this.selectedVoice;
    }

    utterance.volume = this.isMuted ? 0 : this.volume;
    utterance.rate = this.rate;
    utterance.pitch = this.pitch;
    utterance.lang = this.selectedVoice?.lang || 'en-US';

    this.isSpeaking = true;
    this.isPaused = false;
    this.startTime = performance.now();

    const wordCount = text.split(/\s+/).length;
    const durationSec = Math.max(3.5, (wordCount / (120 * this.rate)) * 60);
    this.estimatedDuration = durationSec * 1000;

    if (callbacks.onStart) callbacks.onStart();
    if (this.onStateChange) this.onStateChange({ isSpeaking: true, isPaused: false });

    utterance.onboundary = (event) => {
      if (callbacks.onBoundary) callbacks.onBoundary(event);
      if (this.onBoundary) this.onBoundary(event);
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      this.isPaused = false;
      this.currentUtterance = null;
      window._activeSpeechUtterance = null;
      this._stopFallbackTimer();

      if (this.onStateChange) this.onStateChange({ isSpeaking: false, isPaused: false });
      if (callbacks.onEnd) callbacks.onEnd();
      if (this.onEnd) this.onEnd();
    };

    utterance.onerror = (err) => {
      console.warn('SpeechSynthesis error:', err.error);
      if (err.error === 'interrupted' || err.error === 'canceled') {
        return;
      }
      this.isSpeaking = false;
      this.isPaused = false;
      this._stopFallbackTimer();
      if (callbacks.onEnd) callbacks.onEnd();
    };

    if (this.isMuted) {
      this._startFallbackTimer(this.estimatedDuration, callbacks);
    } else {
      try {
        this.synth.speak(utterance);
      } catch (err) {
        console.warn('Speech speak exception:', err);
      }
      // Safety timer ensures progress if browser drops onend
      this._startFallbackTimer(this.estimatedDuration + 2000, callbacks);
    }
  }

  _simulateSpeechTimer(text, callbacks) {
    const wordCount = (text || '').split(/\s+/).length;
    const durationSec = Math.max(3.5, (wordCount / 120) * 60);
    this.estimatedDuration = durationSec * 1000;
    this.isSpeaking = true;
    if (callbacks.onStart) callbacks.onStart();
    this._startFallbackTimer(this.estimatedDuration, callbacks);
  }

  _startFallbackTimer(durationMs, callbacks) {
    this._stopFallbackTimer();
    this.fallbackTimer = setTimeout(() => {
      if (this.isSpeaking && !this.isPaused) {
        this.isSpeaking = false;
        if (this.synth) {
          try { this.synth.cancel(); } catch (e) {}
        }
        if (this.onStateChange) this.onStateChange({ isSpeaking: false, isPaused: false });
        if (callbacks.onEnd) callbacks.onEnd();
        if (this.onEnd) this.onEnd();
      }
    }, durationMs);
  }

  _stopFallbackTimer() {
    if (this.fallbackTimer) {
      clearTimeout(this.fallbackTimer);
      this.fallbackTimer = null;
    }
  }

  pause() {
    if (!this.synth) return;
    if (this.isSpeaking && !this.isPaused) {
      try { this.synth.pause(); } catch (e) {}
      this.isPaused = true;
      this._stopFallbackTimer();
      if (this.onStateChange) this.onStateChange({ isSpeaking: true, isPaused: true });
    }
  }

  resume() {
    if (!this.synth) return;
    if (this.isSpeaking && this.isPaused) {
      try { this.synth.resume(); } catch (e) {}
      this.isPaused = false;
      if (this.onStateChange) this.onStateChange({ isSpeaking: true, isPaused: false });
    }
  }

  cancel() {
    this._stopFallbackTimer();
    if (this.synth) {
      try { this.synth.cancel(); } catch (e) {}
    }
    this.isSpeaking = false;
    this.isPaused = false;
    this.currentUtterance = null;
    window._activeSpeechUtterance = null;
    if (this.onStateChange) this.onStateChange({ isSpeaking: false, isPaused: false });
  }

  setVolume(val) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.currentUtterance) {
      this.currentUtterance.volume = this.isMuted ? 0 : this.volume;
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.currentUtterance) {
      this.currentUtterance.volume = this.isMuted ? 0 : this.volume;
    }
    return this.isMuted;
  }

  setRate(speed) {
    this.rate = Math.max(0.5, Math.min(2.0, speed));
  }
}

window.VoiceEngine = VoiceEngine;
