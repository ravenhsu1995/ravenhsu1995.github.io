import assert from "node:assert/strict";
import test from "node:test";
import { initDemoBridge } from "../js/demo-bridge.js";
import { initMotion } from "../js/motion.js";

function stubGlobal(context, name, value) {
  const descriptor = Object.getOwnPropertyDescriptor(globalThis, name);
  Object.defineProperty(globalThis, name, {
    value,
    configurable: true,
    writable: true,
  });
  context.after(() => {
    if (descriptor) Object.defineProperty(globalThis, name, descriptor);
    else Reflect.deleteProperty(globalThis, name);
  });
}

// Exercise the browser boundaries without a DOM emulator or production dependency.
test("demo bridge rejects foreign origins and unowned windows before updating state", (t) => {
  const listeners = new Map();
  const messages = [];
  const child = {
    postMessage: (data, origin) => messages.push({ data, origin }),
  };
  const frame = { contentWindow: child, addEventListener: () => {} };
  const feedback = [];
  stubGlobal(t, "window", {
    addEventListener: (name, listener) => listeners.set(name, listener),
  });
  stubGlobal(t, "location", { origin: "https://portfolio.test" });
  initDemoBridge([frame], (kind) => feedback.push(kind));
  messages.length = 0;
  const data = {
    type: "portfolio-demo-post",
    kind: "mailbox",
    body: "Question",
  };
  const receive = listeners.get("message");
  receive({ origin: "https://foreign.test", source: child, data });
  receive({ origin: globalThis.location.origin, source: {}, data });
  receive({
    origin: globalThis.location.origin,
    source: child,
    data: { ...data, kind: "invalid" },
  });
  assert.equal(messages.length, 0);
  receive({ origin: globalThis.location.origin, source: child, data });
  assert.deepEqual(feedback, ["mailbox"]);
  assert.equal(messages[0].origin, globalThis.location.origin);
  assert.equal(messages[0].data.question, "Question");
  assert.equal(messages[0].data.type, "portfolio-demo-state");
});

test("system reduced motion takes precedence without discarding a user's pause choice", (t) => {
  const handlers = new Map();
  const mediaHandlers = new Map();
  const button = {
    setAttribute: () => {},
    addEventListener: (name, listener) => handlers.set(name, listener),
  };
  const media = {
    matches: false,
    addEventListener: (name, listener) => mediaHandlers.set(name, listener),
  };
  const messages = [];
  stubGlobal(t, "window", {});
  stubGlobal(t, "document", {
    documentElement: { classList: { remove: () => {} } },
    querySelectorAll: () => [button],
    addEventListener: () => {},
    hidden: false,
  });
  stubGlobal(t, "location", { origin: "https://portfolio.test" });
  initMotion(media, [
    {
      contentWindow: { postMessage: (message) => messages.push(message) },
      addEventListener: () => {},
    },
  ]);
  handlers.get("click")();
  assert.equal(messages.at(-1).paused, true);
  media.matches = true;
  mediaHandlers.get("change")();
  assert.equal(button.disabled, true);
  media.matches = false;
  mediaHandlers.get("change")();
  assert.equal(button.disabled, false);
  assert.equal(messages.at(-1).paused, true);
  assert.equal(button.textContent, "Resume motion");
  handlers.get("click")();
  assert.equal(messages.at(-1).paused, false);
});

test("a delayed preview cannot replace the project the visitor returned to", async (t) => {
  const { initProjectPreview } = await import("../js/project-preview.js");
  const handlers = new Map();
  const link = (key) => ({
    dataset: { project: key },
    addEventListener: (event, listener) =>
      handlers.set(`${key}:${event}`, listener),
  });
  const links = [link("garage"), link("travel"), link("besci")];
  const stage = { dataset: { preview: "garage" } };
  const image = { src: "original" };
  const detail = { hidden: true };
  const caption = { textContent: "original" };
  const nodes = new Map([
    ["project-preview-stage", stage],
    ["project-preview-image", image],
    ["project-preview-detail", detail],
    ["project-preview-caption", caption],
  ]);
  const pending = [];
  stubGlobal(t, "document", {
    getElementById: (id) => nodes.get(id),
    querySelectorAll: () => links,
  });
  stubGlobal(
    t,
    "Image",
    class {
      decode() {
        return new Promise((resolve) => pending.push(resolve));
      }
    },
  );
  initProjectPreview({ matches: true });
  const travel = handlers.get("travel:focus")();
  await handlers.get("garage:focus")();
  pending.splice(0).forEach((resolve) => resolve());
  await travel;
  assert.equal(stage.dataset.preview, "garage");
  assert.equal(image.src, "original");

  const latest = handlers.get("travel:focus")();
  await latest;
  assert.equal(stage.dataset.preview, "travel");
  assert.equal(detail.hidden, false);
  assert.equal(links[1].dataset.previewActive, "true");
});
