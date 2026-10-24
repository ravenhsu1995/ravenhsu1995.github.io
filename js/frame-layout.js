/** Source canvases preserve the product's desktop composition on small screens. */
export function frameStyles(stageWidth, sourceWidth, aspectRatio, scaled) {
  return {
    width: scaled ? `${sourceWidth}px` : "",
    height: scaled ? `${sourceWidth / aspectRatio}px` : "",
    transform: scaled ? `scale(${stageWidth / sourceWidth})` : "",
    transformOrigin: scaled ? "top left" : "center",
  };
}

export function initFrameLayout() {
  const narrowLayout = window.matchMedia("(max-width: 600px)");
  const hero = document.querySelector(".hero-board");
  const gallery = document.getElementById("experience-image");
  const canvases = [
    { stage: hero, sourceWidth: 900, ratio: 1.4, alwaysBoard: true },
    { stage: gallery, sourceWidth: 1000, ratio: 1.15, alwaysBoard: false },
  ].filter(({ stage }) => stage?.querySelector("iframe"));
  let pendingFrame;

  function layout() {
    cancelAnimationFrame(pendingFrame);
    // Measure every stage before writing styles to avoid forced layout per frame.
    const updates = canvases.map(
      ({ stage, sourceWidth, ratio, alwaysBoard }) => ({
        frame: stage.querySelector("iframe"),
        styles: frameStyles(
          stage.clientWidth,
          sourceWidth,
          ratio,
          narrowLayout.matches &&
            (alwaysBoard || stage.dataset.mode === "board"),
        ),
      }),
    );
    updates.forEach(({ frame, styles }) => Object.assign(frame.style, styles));
  }

  function schedule() {
    cancelAnimationFrame(pendingFrame);
    pendingFrame = requestAnimationFrame(layout);
  }
  if ("ResizeObserver" in window) {
    const observer = new ResizeObserver(() => schedule());
    canvases.forEach(({ stage }) => observer.observe(stage));
  } else {
    window.addEventListener("resize", schedule);
  }
  narrowLayout.addEventListener("change", schedule);
  layout();
  // WebKit keeps a frame's first viewport-unit layout, so demos load only at their final canvas size.
  canvases.forEach(({ stage }) => {
    const frame = stage.querySelector("iframe");
    if (frame.dataset.src) frame.src = frame.dataset.src;
  });
  return layout;
}
