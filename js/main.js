import { initTheme } from "./theme.js";
import { initMotion } from "./motion.js";
import { initFrameLayout } from "./frame-layout.js";
import { initOfficeHours } from "./office-hours.js";
import { initDemoBridge } from "./demo-bridge.js";
import { initBesciGallery } from "./besci-gallery.js";
import { initMediaViewer } from "./media-viewer.js";
import { initProjectPreview } from "./project-preview.js";
import { initWorkroom } from "./workroom.js";

// Shared browser state is passed explicitly; features own their DOM and events.
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const frames = [...document.querySelectorAll('iframe[src^="demo/"]')];

initTheme();
initMotion(reducedMotion, frames);
const scheduleFrameLayout = initFrameLayout();
const showDemoFeedback = initOfficeHours(scheduleFrameLayout);
initDemoBridge(frames, showDemoFeedback);
initBesciGallery();
initMediaViewer();
initProjectPreview(reducedMotion);
initWorkroom(reducedMotion);
