import { applyDemoPost, parseDemoPost } from "./demo-state.js?v=20261024-hires";

export function initDemoBridge(frames, onPost) {
  let state = { posts: [], question: "" };
  function sync() {
    frames.forEach((frame) =>
      frame.contentWindow?.postMessage(
        {
          type: "portfolio-demo-state",
          ...state,
        },
        location.origin,
      ),
    );
  }
  window.addEventListener("message", (event) => {
    // Both checks matter: another same-origin tab is not one of our demo frames.
    if (
      event.origin !== location.origin ||
      !frames.some((frame) => frame.contentWindow === event.source)
    )
      return;
    const post = parseDemoPost(event.data);
    if (!post) return;
    state = applyDemoPost(state, post, {
      id: `visitor-${crypto.randomUUID()}`,
      createdAt: new Date().toISOString(),
    });
    onPost(post.kind);
    sync();
  });
  frames.forEach((frame) => frame.addEventListener("load", sync));
  sync();
}
