const CATEGORIES = new Set(["partner", "trial", "brand", "resource", "other"]);
const MAX_POSTS = 5;

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
  return {
    kind: data.kind,
    body,
    category: data.kind === "exchange" ? (data.category ?? "resource") : null,
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
        teamName: "現場交流",
        category: post.category,
        body: post.body,
        url: null,
      },
      ...state.posts,
    ].slice(0, MAX_POSTS),
  };
}
