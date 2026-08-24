/**
 * RecommendationCard Component
 * Manages the Instant AI Analysis Complete & Pre-Built Animation Recommendation Screen
 */

class RecommendationCardComponent {
  constructor({ onPlayAnimation, onAnalyzeAgain, onTestVideo, onBackToClassroom }) {
    this.onPlayAnimation = onPlayAnimation;
    this.onAnalyzeAgain = onAnalyzeAgain;
    this.onTestVideo = onTestVideo;
    this.onBackToClassroom = onBackToClassroom;

    this.currentResult = null;
    this.matchedLesson = null;

    // DOM Elements
    this.recBannerBadge = document.getElementById('rec-banner-badge');
    this.analysisSummaryBox = document.getElementById('analysis-summary-box');
    this.recAnalysisSubject = document.getElementById('rec-analysis-subject');
    this.recAnalysisLevel = document.getElementById('rec-analysis-level');
    this.recAnalysisTopic = document.getElementById('rec-analysis-topic');
    this.recAnalysisDuration = document.getElementById('rec-analysis-duration');
    
    this.recTitle = document.getElementById('rec-title');
    this.recMatchScore = document.getElementById('rec-match-score');
    this.recDuration = document.getElementById('rec-duration');
    this.recLevelTag = document.getElementById('rec-level-tag');
    this.recDescription = document.getElementById('rec-description');
    this.recConceptsList = document.getElementById('rec-concepts-list');
    this.recKeywordsList = document.getElementById('rec-keywords-list');

    this.btnPlayRecommended = document.getElementById('btn-play-recommended');
    this.btnAnalyzeAgain = document.getElementById('btn-analyze-again');
    this.btnTestVideo = document.getElementById('btn-test-video');
    this.btnRecBackClassroom = document.getElementById('btn-rec-back-classroom');

    this._bindEvents();
  }

  _bindEvents() {
    this.btnPlayRecommended?.addEventListener('click', () => {
      this.playRecommendedLesson();
    });

    this.btnTestVideo?.addEventListener('click', () => {
      this.testVideoDiagnostic();
    });

    this.btnAnalyzeAgain?.addEventListener('click', () => {
      if (this.onAnalyzeAgain) this.onAnalyzeAgain();
    });

    this.btnRecBackClassroom?.addEventListener('click', () => {
      if (this.onBackToClassroom) this.onBackToClassroom();
    });
  }

  playRecommendedLesson() {
    if (!this.matchedLesson) {
      console.error('No recommended animation selected');
      return;
    }

    if (this.onPlayAnimation) {
      this.onPlayAnimation(this.matchedLesson, this.currentResult?.bestMatch);
    }
  }

  testVideoDiagnostic() {
    const anim = this.currentResult?.bestMatch || (window.AnimationLibrary ? window.AnimationLibrary.animations[0] : null);
    if (!anim) return;

    console.log('🧪 Diagnostic: Attempting to load video file at path:', anim.video);
    const video = document.getElementById('lessonVideo');
    if (video) {
      video.src = anim.video;
      video.load();
      console.log('🧪 Diagnostic video.load() initiated. readyState:', video.readyState);
    }

    if (this.onPlayAnimation && this.matchedLesson) {
      this.onPlayAnimation(this.matchedLesson, anim);
    }
  }

  renderAnalysisResult(analysisResult, selectedLesson) {
    this.currentResult = analysisResult;
    const bestMatch = analysisResult.bestMatch;
    this.matchedLesson = window.LessonRegistry ? window.LessonRegistry.getById(bestMatch?.lessonRef || selectedLesson.id) : selectedLesson;

    // 1. Analysis Summary Header
    if (this.recAnalysisSubject) this.recAnalysisSubject.textContent = 'Chemistry';
    if (this.recAnalysisLevel) this.recAnalysisLevel.textContent = analysisResult.level === 'school' ? 'School Chemistry' : 'College Chemistry';
    if (this.recAnalysisTopic) this.recAnalysisTopic.textContent = selectedLesson?.title || bestMatch?.title || 'Chemistry Topic';
    if (this.recAnalysisDuration) this.recAnalysisDuration.textContent = `< ${analysisResult.analysisDurationMs} ms`;

    // 2. Banner Badge (Exact Match vs Closest Match)
    if (this.recBannerBadge) {
      if (analysisResult.isExactMatch) {
        this.recBannerBadge.className = 'rec-banner-badge exact-match';
        this.recBannerBadge.innerHTML = '🎬 RECOMMENDED LESSON';
      } else {
        this.recBannerBadge.className = 'rec-banner-badge closest-match';
        this.recBannerBadge.innerHTML = '⚠️ CLOSEST AVAILABLE MATCH';
      }
    }

    // 3. Recommended Animation Details
    if (this.recTitle) this.recTitle.textContent = bestMatch?.title || selectedLesson.title;
    if (this.recMatchScore) {
      this.recMatchScore.textContent = `${analysisResult.matchPercentage}% MATCH`;
      this.recMatchScore.className = `rec-score-pill ${analysisResult.isExactMatch ? 'exact' : 'closest'}`;
    }
    if (this.recDuration) this.recDuration.textContent = `⏱️ Duration: ${bestMatch?.duration || '3:30'}`;
    if (this.recLevelTag) {
      this.recLevelTag.textContent = bestMatch?.level === 'school' ? '🏫 School Chemistry' : '🎓 College Chemistry';
      this.recLevelTag.className = `rec-level-badge ${bestMatch?.level || 'school'}`;
    }
    if (this.recDescription) this.recDescription.textContent = bestMatch?.description || selectedLesson.shortDesc;

    // 4. Detected Concepts Checklist
    if (this.recConceptsList) {
      const concepts = analysisResult.detectedConcepts.length > 0 
        ? analysisResult.detectedConcepts 
        : ['Atom', 'Nucleus', 'Proton', 'Neutron', 'Electron'];

      this.recConceptsList.innerHTML = concepts.map(c => `
        <div class="concept-item-pill">
          <span class="check-mark">✓</span> ${c}
        </div>
      `).join('');
    }

    // 5. Matched Keywords
    if (this.recKeywordsList) {
      const keywords = analysisResult.matchedKeywords.length > 0
        ? analysisResult.matchedKeywords
        : ['atom', 'nucleus', 'proton', 'electron'];

      this.recKeywordsList.innerHTML = keywords.map(kw => `
        <span class="keyword-tag">${kw}</span>
      `).join('');
    }
  }
}

window.RecommendationCardComponent = RecommendationCardComponent;
