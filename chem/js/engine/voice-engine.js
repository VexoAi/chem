/**
 * VoiceEngine - Web Speech API AI Teacher Voice Synthesizer
 * Provides speech playback, natural voice detection, rate/pitch tuning,
 * boundary synchronization, volume/mute control, and fallback timer tracking.
 */

class VoiceEngine {
  constructor() {
    this.synth = window.speechSynthesis;
    this.currentUtterance = null;
    this.selectedVoice = null;
    this.voices = [];
    this.isMuted = false;
    this.volume = 1.0;
    this.rate = 0.92; // Natural, clear teaching pace (comfortable for students)
    this.pitch = 1.0; // Friendly, clear teacher pitch
    this.isSpeaking = false;
    this.isPaused = false;
    this.onStateChange = null;
    this.onBoundary = null;
    this.onEnd = null;
    
    // Fallback timer when browser speech engine omits onboundary
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
      this.voices = this.synth.getVoices();
      this._selectBestTeacherVoice();
    };

    loadVoices();
    if (this.synth.onvoiceschanged !== undefined) {
      this.synth.onvoiceschanged = loadVoices;
    }
  }

  /**
   * Prioritizes the most natural, clear educational voices available
   */
  _selectBestTeacherVoice() {
    if (!this.voices || this.voices.length === 0) return;

    // Filter English voices
    const englishVoices = this.voices.filter(v => v.lang.startsWith('en'));

    // Preference ranking for high quality, natural classroom voices
    const preferredNames = [
      'Google US English',
      'Google UK English Female',
      'Microsoft Jenny Online (Natural)',
      'Microsoft Guy Online (Natural)',
      'Microsoft Aria Online (Natural)',
      'Microsoft Christopher Online (Natural)',
      'Samantha',
      'Daniel',
      'Karen',
      'Victoria',
      'Alex',
      'Google UK English Male'
    ];

    let found = null;
    for (const name of preferredNames) {
      found = englishVoices.find(v => v.name.includes(name));
      if (found) break;
    }

    // Fallback: any natural/female English voice or default English voice
    if (!found) {
      found = englishVoices.find(v => v.name.toLowerCase().includes('natural') || v.name.toLowerCase().includes('female')) 
              || englishVoices[0] 
              || this.voices[0];
    }

    this.selectedVoice = found;
  }

  getVoiceList() {
    if (!this.voices || this.voices.length === 0) {
      this.voices = this.synth ? this.synth.getVoices() : [];
    }
    return this.voices.filter(v => v.lang.startsWith('en') || v.default);
  }

  setVoice(voiceURI) {
    if (voiceURI === 'auto') {
      this._selectBestTeacherVoice();
      return;
    }
    const match = this.voices.find(v => v.voiceURI === voiceURI || v.name === voiceURI);
    if (match) {
      this.selectedVoice = match;
    }
  }

  /**
   * Speaks a sentence with synchronized boundary callbacks and onEnd trigger
   */
  speak(text, callbacks = {}) {
    if (!this.synth) return;

    // Cancel any previous speech
    this.cancel();

    if (!text || text.trim() === '') return;

    // Build utterance
    const utterance = new SpeechSynthesisUtterance(text);
    this.currentUtterance = utterance;

    if (this.selectedVoice) {
      utterance.voice = this.selectedVoice;
    }

    utterance.volume = this.isMuted ? 0 : this.volume;
    utterance.rate = this.rate;
    utterance.pitch = this.pitch;
    utterance.lang = 'en-US';

    this.isSpeaking = true;
    this.isPaused = false;
    this.startTime = performance.now();

    // Approximate duration for fallback timer calculation
    // Average speech rate is ~140-160 words per minute
    const wordCount = text.split(/\s+/).length;
    const durationSec = Math.max(2.5, (wordCount / (140 * this.rate)) * 60);
    this.estimatedDuration = durationSec * 1000;

    if (callbacks.onStart) callbacks.onStart();
    if (this.onStateChange) this.onStateChange({ isSpeaking: true, isPaused: false });

    // Word boundary event for live subtitle highlight
    utterance.onboundary = (event) => {
      if (callbacks.onBoundary) {
        callbacks.onBoundary(event);
      }
      if (this.onBoundary) {
        this.onBoundary(event);
      }
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      this.isPaused = false;
      this.currentUtterance = null;
      this._stopFallbackTimer();

      if (this.onStateChange) this.onStateChange({ isSpeaking: false, isPaused: false });
      if (callbacks.onEnd) callbacks.onEnd();
      if (this.onEnd) this.onEnd();
    };

    utterance.onerror = (err) => {
      // In case speech is cancelled or interrupted
      if (err.error === 'interrupted' || err.error === 'canceled') {
        this.isSpeaking = false;
        this.isPaused = false;
        return;
      }
      console.warn('Speech synthesis error:', err);
      this.isSpeaking = false;
      this.isPaused = false;
      this._stopFallbackTimer();
      if (callbacks.onEnd) callbacks.onEnd();
    };

    // If muted, we still run the timer so animation and step advance proceed seamlessly
    if (this.isMuted) {
      this._startFallbackTimer(this.estimatedDuration, callbacks);
    } else {
      this.synth.speak(utterance);
      // Start fallback safety watcher
      this._startFallbackTimer(this.estimatedDuration + 1200, callbacks);
    }
  }

  _startFallbackTimer(durationMs, callbacks) {
    this._stopFallbackTimer();
    this.fallbackTimer = setTimeout(() => {
      if (this.isSpeaking && !this.isPaused) {
        this.isSpeaking = false;
        if (this.synth) this.synth.cancel();
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
      this.synth.pause();
      this.isPaused = true;
      this._stopFallbackTimer();
      if (this.onStateChange) this.onStateChange({ isSpeaking: true, isPaused: true });
    }
  }

  resume() {
    if (!this.synth) return;
    if (this.isSpeaking && this.isPaused) {
      this.synth.resume();
      this.isPaused = false;
      if (this.onStateChange) this.onStateChange({ isSpeaking: true, isPaused: false });
    }
  }

  cancel() {
    this._stopFallbackTimer();
    if (this.synth) {
      this.synth.cancel();
    }
    this.isSpeaking = false;
    this.isPaused = false;
    this.currentUtterance = null;
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
