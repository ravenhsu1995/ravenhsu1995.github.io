export function initFragmentDisclosure() {
  // Links from outside the page (e.g. #besci) should land on open content.
  // The browser keeps the target in view, so this only opens disclosures.
  function reveal() {
    const id = decodeURIComponent(window.location.hash.slice(1));
    const target = id && document.getElementById(id);
    for (let node = target; node; node = node.parentElement) {
      if (node instanceof HTMLDetailsElement) node.open = true;
    }
  }
  window.addEventListener("hashchange", reveal);
  reveal();
}
