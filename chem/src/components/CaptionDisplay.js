/**
 * CaptionDisplay Component - Live Subtitles & Chemistry Keyword Styler
 */

class CaptionDisplayComponent {
  constructor() {
    this.container = document.getElementById('captions-container');
    this.textEl = document.getElementById('live-caption-text');
    this.takeawayEl = document.getElementById('takeaway-text');
    this.stepIndicatorEl = document.getElementById('caption-step-indicator');
    this.isVisible = true;
    this.currentRawText = '';
  }

  setStep(stepData, totalSteps = 10) {
    if (!stepData) return;
    this.currentRawText = stepData.voiceText;
    if (this.stepIndicatorEl) {
      this.stepIndicatorEl.textContent = `Step ${stepData.stepNumber} of ${totalSteps}`;
    }
    if (this.takeawayEl) {
      this.takeawayEl.textContent = stepData.takeaway || stepData.captionText;
    }
    this.renderText(this.currentRawText, -1);
  }

  _formatKeywords(text) {
    return text
      .replace(/\b(protons?|positive charge|positive|p⁺)\b/gi, '<span class="hl-proton">$1</span>')
      .replace(/\b(neutrons?|neutral|no electrical charge|no charge|n⁰)\b/gi, '<span class="hl-neutron">$1</span>')
      .replace(/\b(electrons?|negative charge|negative|electron shells?|e⁻)\b/gi, '<span class="hl-electron">$1</span>')
      .replace(/\b(nucleus|central nucleus|nuclear core)\b/gi, '<span class="active-phrase">$1</span>');
  }

  updateBoundary(charIndex, charLength = 0) {
    if (!this.currentRawText) return;
    this.renderText(this.currentRawText, charIndex, charLength);
  }

  renderText(text, activeCharIndex = -1, activeCharLength = 0) {
    if (!this.textEl) return;

    if (activeCharIndex < 0) {
      this.textEl.innerHTML = `"${this._formatKeywords(text)}"`;
      return;
    }

    const start = Math.max(0, activeCharIndex);
    let end = start + (activeCharLength > 0 ? activeCharLength : 6);
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

  toggleVisibility() {
    this.isVisible = !this.isVisible;
    if (this.container) {
      this.container.classList.toggle('hidden', !this.isVisible);
    }
    return this.isVisible;
  }
}

window.CaptionDisplayComponent = CaptionDisplayComponent;
