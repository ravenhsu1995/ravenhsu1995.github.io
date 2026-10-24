const CATEGORIES = new Set(["partner", "trial", "brand", "resource", "other"]);
const MAX_POSTS = 5;
const MAX_URL_LENGTH = 500;

/**
 * Mirror the product's link rules: the URL becomes a QR code on the big screen, so only
 * http(s) addresses with a real-looking host pass. Empty means no link; invalid is undefined.
 */
function normalizeUrl(raw) {
  if (raw == null) return null;
  if (typeof raw !== "string") return undefined;
  const value = raw.trim();
  if (!value) return null;
  if (value.length > MAX_URL_LENGTH) return undefined;
  const candidate = /^[a-z][a-z0-9+.-]*:/i.test(value)
    ? value
    : `https://${value}`;
  let url;
  try {
    url = new URL(candidate);
  } catch {
    return undefined;
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") return undefined;
  if (!url.hostname.includes(".")) return undefined;
  return url.toString();
}

/** Accept only the fields the isolated demo may send. Never trust message payloads. */
export function parseDemoPost(data) {
  if (
    !data ||
    data.type !== "portfolio-demo-post" ||
    typeof data.body !== "string"
  )
    return null;
  if (data.kind !== "exchange" && data.kind !== "mailbox") return null;
  const limit = data.kind === "mailbox" ? 300 : 200;
  const body = data.body.trim().slice(0, limit);
  if (!body) return null;
  if (
    data.kind === "exchange" &&
    data.category != null &&
    !CATEGORIES.has(data.category)
  )
    return null;
  const url = data.kind === "exchange" ? normalizeUrl(data.url) : null;
  if (url === undefined) return null;
  return {
    kind: data.kind,
    body,
    category: data.kind === "exchange" ? (data.category ?? "resource") : null,
    url,
  };
}

export function applyDemoPost(state, post, { id, createdAt }) {
  if (post.kind === "mailbox") return { ...state, question: post.body };
  return {
    ...state,
    posts: [
      {
        id,
        createdAt,
        name: "訪客",
        teamName: "個人參加",
        category: post.category,
        body: post.body,
        url: post.url ?? null,
      },
      ...state.posts,
    ].slice(0, MAX_POSTS),
  };
}
