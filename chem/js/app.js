/**
 * ChemPulse AI - Application Entrypoint
 * Bootstraps all engines, loads initial topic data, and starts the learning environment.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Topic Registry
  window.TopicRegistry.init();

  // 2. Instantiate Core Engines
  const voiceEngine = new window.VoiceEngine();
  const animationEngine = new window.AnimationEngine('chem-canvas');
  const captionRenderer = new window.CaptionRenderer();
  const teacherAvatar = new window.TeacherAvatar();

  // 3. Instantiate Multimedia Synchronization Controller
  const syncController = new window.SyncController({
    voiceEngine,
    animationEngine,
    captionRenderer,
    teacherAvatar
  });

  // 4. Instantiate Controls UI Binder
  const controlsUI = new window.ControlsUI({
    syncController,
    voiceEngine,
    captionRenderer,
    animationEngine
  });

  // 5. Load Initial Topic: Atomic Structure
  const initialTopic = window.TopicRegistry.get('atomic-structure');
  if (initialTopic) {
    syncController.loadTopic(initialTopic);
    controlsUI.renderCurriculum(initialTopic);
  }

  console.log('⚛️ ChemPulse AI Learning Module initialized successfully.');
});
