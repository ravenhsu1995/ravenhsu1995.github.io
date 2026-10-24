import { initTheme } from "./theme.js";
import { initMotion } from "./motion.js?v=20261024-sample";
import { initFrameLayout } from "./frame-layout.js";
import { initOfficeHours } from "./office-hours.js?v=20261024-sample";
import { initDemoBridge } from "./demo-bridge.js?v=20261024-sample";
import { initArtifactGalleries } from "./artifact-gallery.js?v=20261024-sample";
import { initBesciGallery } from "./besci-gallery.js";
import { initMediaViewer } from "./media-viewer.js";
import { initProjectPreview } from "./project-preview.js?v=20261024-sample";

// Shared browser state is passed explicitly; features own their DOM and events.
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const frames = [...document.querySelectorAll('iframe[src^="demo/"]')];

initTheme();
initMotion(reducedMotion, frames);
const scheduleFrameLayout = initFrameLayout();
const showDemoFeedback = initOfficeHours(scheduleFrameLayout);
initDemoBridge(frames, showDemoFeedback);
initBesciGallery();
initArtifactGalleries();
initMediaViewer();
initProjectPreview(reducedMotion);
