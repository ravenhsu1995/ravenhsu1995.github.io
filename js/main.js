import { initTheme } from "./theme.js";
import { initMotion } from "./motion.js?v=20261024-qr";
import { initFrameLayout } from "./frame-layout.js?v=20261024-qr";
import { initOfficeHours } from "./office-hours.js?v=20261025-evidence";
import { initDemoBridge } from "./demo-bridge.js?v=20261024-qr";
import { initArtifactGalleries } from "./artifact-gallery.js?v=20261024-qr";
import { initBesciGallery } from "./besci-gallery.js?v=20261024-qr";
import { initMediaViewer } from "./media-viewer.js?v=20261024-qr";
import { initProjectPreview } from "./project-preview.js?v=20261030-align";
import { initFragmentDisclosure } from "./fragment-disclosure.js?v=20261030-align";

// Shared browser state is passed explicitly; features own their DOM and events.
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const frames = [...document.querySelectorAll('iframe[data-src^="demo/"]')];

initTheme();
initMotion(reducedMotion, frames);
const applyFrameLayout = initFrameLayout();
const showDemoFeedback = initOfficeHours(applyFrameLayout);
initDemoBridge(frames, showDemoFeedback);
initBesciGallery();
initArtifactGalleries();
initMediaViewer();
initProjectPreview(reducedMotion);
initFragmentDisclosure();
