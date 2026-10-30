export function initRoomStack() {
  // Pieces behave like paper on a desk: the last one touched stays on top.
  const pieces = [...document.querySelectorAll(".room-piece")];
  let top = 10;
  pieces.forEach((piece) => {
    const raise = () => {
      if (piece.style.zIndex === String(top)) return;
      piece.style.zIndex = String(++top);
    };
    piece.addEventListener("pointerenter", raise);
    piece.addEventListener("focus", raise);
  });
  const board = document.querySelector(".room-board iframe");
  board?.addEventListener("load", () => {
    if (!board.getAttribute("src")) return;
    requestAnimationFrame(() =>
      requestAnimationFrame(() => board.classList.add("is-loaded")),
    );
  });
}
