import assert from "node:assert/strict";
import { readFile, access } from "node:fs/promises";
import test from "node:test";
import { parse } from "parse5";
import { frameStyles } from "../js/frame-layout.js";

const root = new URL("../", import.meta.url);
const document = parse(await readFile(new URL("index.html", root), "utf8"));
const nodes = [];
function walk(node) {
  nodes.push(node);
  node.childNodes?.forEach(walk);
}
walk(document);
const attribute = (node, name) =>
  node.attrs?.find((attr) => attr.name === name)?.value;
const ids = nodes.map((node) => attribute(node, "id")).filter(Boolean);

test("HTML IDs are unique and fragment links resolve", () => {
  assert.equal(new Set(ids).size, ids.length);
  for (const node of nodes) {
    const href = attribute(node, "href");
    if (href?.startsWith("#") && href.length > 1)
      assert.ok(ids.includes(href.slice(1)), `Missing ${href}`);
    for (const name of ["aria-controls", "aria-labelledby"]) {
      for (const id of (attribute(node, name) ?? "")
        .split(/\s+/)
        .filter(Boolean)) {
        assert.ok(ids.includes(id), `Missing ${name} target: ${id}`);
      }
    }
  }
});
test("local media, stylesheet, module and enlargement links exist", async () => {
  for (const node of nodes) {
    for (const attr of ["src", "href", "data-src"]) {
      const value = attribute(node, attr);
      if (!value || /^(?:[a-z]+:|\/\/|#)/i.test(value)) continue;
      await access(new URL(value.split(/[?#]/)[0], root));
    }
  }
});
test("every DOM ID referenced by an interaction module exists in the page", async () => {
  const { readdir } = await import("node:fs/promises");
  for (const file of await readdir(new URL("js/", root))) {
    const source = await readFile(new URL(`js/${file}`, root), "utf8");
    for (const match of source.matchAll(/getElementById\("([^"]+)"\)/g)) {
      assert.ok(
        ids.includes(match[1]),
        `${file} references missing #${match[1]}`,
      );
    }
  }
});
test("narrow board canvases fit their container and reset when unscaled", () => {
  for (const width of [284, 339, 354, 564]) {
    const styles = frameStyles(width, 1000, 1.15, true);
    const scale = Number(styles.transform.match(/scale\((.+)\)/)[1]);
    assert.equal(Number.parseFloat(styles.width) * scale, width);
    assert.ok(
      Math.abs(Number.parseFloat(styles.height) * scale - width / 1.15) < 0.001,
    );
  }
  assert.deepEqual(frameStyles(500, 1000, 1.15, false), {
    width: "",
    height: "",
    transform: "",
    transformOrigin: "center",
  });
});
