/**
 * SpeechRecognitionService - Robust, Reliable Browser Speech Recognition
 * Handles explicit getUserMedia permissions, en-IN default, live interim transcripts,
 * safe auto-restart on silent disconnects, and media stream track cleanups.
 */

class SpeechRecognitionService {
  constructor() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    this.isSupported = !!SpeechRecognition;
    this.recognition = this.isSupported ? new SpeechRecognition() : null;

    this.isListening = false;
    this.userStopped = true;
    this.mediaStream = null;
    this.selectedLang = 'en-IN'; // English (India) default

    this.finalTranscript = '';
    this.interimTranscript = '';

    // Callbacks
    this.onStatusChange = null;   // (statusObj) => {}
    this.onTranscriptUpdate = null; // (finalText, interimText, combinedText) => {}
    this.onError = null;          // (errorMessage, errorType) => {}
    this.onStop = null;           // (finalTranscript) => {}

    this._configureRecognition();
  }

  _configureRecognition() {
    if (!this.isSupported || !this.recognition) return;

    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.maxAlternatives = 1;
    this.recognition.lang = this.selectedLang;

    this.recognition.onstart = () => {
      this.isListening = true;
      if (this.onStatusChange) {
        this.onStatusChange({
          state: 'listening',
          label: '🔴 Listening...',
          icon: '🔴',
          isListening: true
        });
      }
    };

    this.recognition.onresult = (event) => {
      let currentInterim = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const text = result[0].transcript;

        if (result.isFinal) {
          this.finalTranscript += (this.finalTranscript ? ' ' : '') + text.trim();
        } else {
          currentInterim += text;
        }
      }

      this.interimTranscript = currentInterim;
      const combined = (this.finalTranscript + ' ' + this.interimTranscript).trim();

      if (this.onTranscriptUpdate) {
        this.onTranscriptUpdate(this.finalTranscript, this.interimTranscript, combined);
      }
    };

    this.recognition.onerror = (event) => {
      console.warn('SpeechRecognition error:', event.error);
      let userMessage = `Speech recognition error: ${event.error}`;
      let errorType = event.error;

      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        userMessage = '🔴 Microphone permission denied. Please click the microphone icon in your browser address bar and allow microphone access.';
        this.isListening = false;
        this.userStopped = true;
      } else if (event.error === 'no-speech') {
        userMessage = 'No speech detected. Please speak into your microphone or try again.';
      } else if (event.error === 'audio-capture') {
        userMessage = 'Microphone unavailable. Check your microphone and browser permissions.';
        this.isListening = false;
        this.userStopped = true;
      } else if (event.error === 'network') {
        userMessage = 'Network connection issue with speech recognition service. You can use "Manual Transcript" or "Test Voice".';
      }

      if (this.onError) {
        this.onError(userMessage, errorType);
      }
    };

    this.recognition.onend = () => {
      // If browser ended due to silence but the teacher has NOT pressed STOP, restart safely
      if (this.isListening && !this.userStopped) {
        try {
          this.recognition.start();
        } catch (e) {
          // Already running or temporary state
        }
      } else {
        this.isListening = false;
        this._cleanupMediaStream();
        if (this.onStatusChange) {
          this.onStatusChange({
            state: 'stopped',
            label: '⚪ Microphone: Stopped',
            icon: '⚪',
            isListening: false
          });
        }
        if (this.onStop) {
          const finalResult = this.finalTranscript.trim() || this.interimTranscript.trim();
          this.onStop(finalResult);
        }
      }
    };
  }

  /**
   * Request microphone permission explicitly via getUserMedia, then start SpeechRecognition
   */
  async start({ onTranscriptUpdate, onStatusChange, onError, onStop }) {
    if (onTranscriptUpdate) this.onTranscriptUpdate = onTranscriptUpdate;
    if (onStatusChange) this.onStatusChange = onStatusChange;
    if (onError) this.onError = onError;
    if (onStop) this.onStop = onStop;

    this.finalTranscript = '';
    this.interimTranscript = '';
    this.userStopped = false;

    // 1. Check Browser Support
    if (!this.isSupported) {
      const errMsg = '⚠️ Speech recognition is not supported in this browser. Please use Chrome/Edge or use Manual Transcript.';
      if (this.onError) this.onError(errMsg, 'unsupported');
      return false;
    }

    // 2. Request Microphone Permission via getUserMedia
    if (this.onStatusChange) {
      this.onStatusChange({
        state: 'requesting',
        label: '🎤 Requesting microphone permission...',
        icon: '🎤',
        isListening: false
      });
    }

    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        this.mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        if (this.onStatusChange) {
          this.onStatusChange({
            state: 'connected',
            label: '🟢 Microphone: Connected',
            icon: '🟢',
            isListening: false
          });
        }
      }
    } catch (err) {
      console.warn('getUserMedia error:', err);
      const permMsg = '🔴 Microphone permission denied. Please click the microphone icon in your browser address bar and allow microphone access.';
      this.userStopped = true;
      this.isListening = false;
      if (this.onError) this.onError(permMsg, 'permission-denied');
      return false;
    }

    // 3. Start Native Recognition
    try {
      this.recognition.lang = this.selectedLang;
      this.recognition.start();
      this.isListening = true;
      this.userStopped = false;
      return true;
    } catch (err) {
      console.warn('SpeechRecognition start error:', err);
      if (err.name === 'InvalidStateError') {
        this.isListening = true;
        this.userStopped = false;
        return true;
      }
      const startMsg = `Speech recognition error: ${err.message || 'Could not initialize speech listener.'}`;
      if (this.onError) this.onError(startMsg, 'start-error');
      return false;
    }
  }

  /**
   * Stop SpeechRecognition and clean up all microphone audio tracks
   */
  stop() {
    this.userStopped = true;
    this.isListening = false;

    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch (e) {
        // ignore
      }
    }

    this._cleanupMediaStream();

    if (this.onStatusChange) {
      this.onStatusChange({
        state: 'stopped',
        label: '⚪ Microphone: Stopped',
        icon: '⚪',
        isListening: false
      });
    }

    const finalResult = this.finalTranscript.trim() || this.interimTranscript.trim();
    return finalResult;
  }

  _cleanupMediaStream() {
    if (this.mediaStream) {
      try {
        this.mediaStream.getTracks().forEach(track => track.stop());
      } catch (e) {
        // ignore
      }
      this.mediaStream = null;
    }
  }

  setLanguage(langCode) {
    this.selectedLang = langCode || 'en-IN';
    if (this.recognition) {
      this.recognition.lang = this.selectedLang;
    }
  }

  reset() {
    this.stop();
    this.finalTranscript = '';
    this.interimTranscript = '';
    this.userStopped = true;
    this.isListening = false;
  }
}

window.SpeechRecognitionService = SpeechRecognitionService;
