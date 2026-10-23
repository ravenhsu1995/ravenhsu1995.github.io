import assert from "node:assert/strict";
import test from "node:test";
import { parseDemoPost, applyDemoPost } from "../js/demo-state.js";

const exchange = {
  type: "portfolio-demo-post",
  kind: "exchange",
  body: " Find a partner ",
  category: "partner",
};

test("rejects unsupported messages and malformed form fields", () => {
  for (const payload of [
    null,
    {},
    "post",
    { ...exchange, type: "other" },
    { ...exchange, kind: "official" },
    { ...exchange, body: {} },
    { ...exchange, body: "  " },
    { ...exchange, category: "official" },
    { ...exchange, category: { key: "partner" } },
  ]) {
    assert.equal(parseDemoPost(payload), null);
  }
});
test("normalizes only allowed fields and enforces each form's length limit", () => {
  assert.deepEqual(
    parseDemoPost({ ...exchange, token: "discard", name: "discard" }),
    { kind: "exchange", body: "Find a partner", category: "partner" },
  );
  assert.equal(
    parseDemoPost({ ...exchange, body: "x".repeat(400) }).body.length,
    200,
  );
  const mailbox = parseDemoPost({
    ...exchange,
    kind: "mailbox",
    body: "x".repeat(400),
  });
  assert.equal(mailbox.body.length, 300);
  assert.equal(mailbox.category, null);
  assert.equal(
    parseDemoPost({ ...exchange, category: undefined }).category,
    "resource",
  );
});
test("keeps only the five newest posts without mutating existing state", () => {
  const initial = { posts: [], question: "A private demo question" };
  let state = initial;
  for (let index = 0; index < 8; index++) {
    state = applyDemoPost(state, parseDemoPost(exchange), {
      id: String(index),
      createdAt: "2026-10-24T00:00:00Z",
    });
  }
  assert.deepEqual(
    state.posts.map((post) => post.id),
    ["7", "6", "5", "4", "3"],
  );
  assert.equal(state.question, initial.question);
  assert.deepEqual(initial.posts, []);
  const next = applyDemoPost(
    state,
    { kind: "mailbox", body: "New question" },
    {},
  );
  assert.equal(next.question, "New question");
  assert.equal(next.posts, state.posts);
});
