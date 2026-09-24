export function scrollToView({ elementId = "", offsetTop = 30 }) {
  if (!elementId) return;
  const element = document.getElementById(elementId);
  if (element) {
    window.scrollTo(0, element.offsetTop - offsetTop);
  }
}
