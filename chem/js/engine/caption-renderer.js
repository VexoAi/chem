/**
 * CaptionRenderer - Live Subtitle & Synchronized Text Highlighting
 * Renders spoken teacher sentences, highlights active words/phrases dynamically,
 * applies chemistry particle color cues, and manages takeaway callouts.
 */

class CaptionRenderer {
  constructor() {
    this.container = document.getElementById('captions-container');
    this.textEl = document.getElementById('live-caption-text');
    this.takeawayEl = document.getElementById('takeaway-text');
    this.stepIndicatorEl = document.getElementById('caption-step-indicator');
    this.isVisible = true;
    this.currentRawText = '';
    this.words = [];
    this.activeCharIndex = 0;
  }

  setStep(stepData, totalSteps = 6) {
    if (!stepData) return;
    this.currentRawText = stepData.voiceText;
    this.stepIndicatorEl.textContent = `Step ${stepData.stepNumber} of ${totalSteps}`;
    this.takeawayEl.textContent = stepData.takeaway || stepData.captionText;
    
    // Initial display with syntax highlighting for key chemistry terms
    this.renderText(this.currentRawText, -1);
  }

  /**
   * Highlights chemistry keywords (proton, neutron, electron, nucleus, shells)
   */
  _formatKeywords(text) {
    return text
      .replace(/\b(protons?|positive charge|positive)\b/gi, '<span class="hl-proton">$1</span>')
      .replace(/\b(neutrons?|neutral|no electrical charge|no charge)\b/gi, '<span class="hl-neutron">$1</span>')
      .replace(/\b(electrons?|negative charge|negative|electron shells?)\b/gi, '<span class="hl-electron">$1</span>')
      .replace(/\b(nucleus|central nucleus)\b/gi, '<span class="active-phrase">$1</span>');
  }

  /**
   * Updates word-level active highlighting based on SpeechSynthesis boundary character index
   */
  updateBoundary(charIndex, charLength = 0) {
    if (!this.currentRawText) return;
    this.activeCharIndex = charIndex;
    this.renderText(this.currentRawText, charIndex, charLength);
  }

  renderText(text, activeCharIndex = -1, activeCharLength = 0) {
    if (!this.textEl) return;

    if (activeCharIndex < 0) {
      // Just keyword-highlighted sentence
      this.textEl.innerHTML = `"${this._formatKeywords(text)}"`;
      return;
    }

    // Split into prefix, active word, and suffix
    const start = Math.max(0, activeCharIndex);
    // Find word boundary if length is 0
    let end = start + (activeCharLength > 0 ? activeCharLength : 5);
    const spacePos = text.indexOf(' ', start);
    if (spacePos !== -1 && spacePos < end + 10) {
      end = spacePos;
    } else if (end > text.length) {
      end = text.length;
    }

    const before = text.substring(0, start);
    const current = text.substring(start, end);
    const after = text.substring(end);

    const formattedBefore = this._formatKeywords(before);
    const formattedAfter = this._formatKeywords(after);

    this.textEl.innerHTML = `"${formattedBefore}<span class="active-phrase">${current}</span>${formattedAfter}"`;
  }

  toggleVisibility(forcedState = null) {
    this.isVisible = forcedState !== null ? forcedState : !this.isVisible;
    if (this.container) {
      this.container.classList.toggle('hidden', !this.isVisible);
    }
    return this.isVisible;
  }

  setVisibility(visible) {
    this.isVisible = visible;
    if (this.container) {
      this.container.classList.toggle('hidden', !visible);
    }
  }
}

window.CaptionRenderer = CaptionRenderer;
