export function getWidth(idA: string, idB: string, callback: (width: number) => void) {
  const content = document.getElementById(idA)!.innerText;
  if (!content || !document.getElementById(idB)) return;
  document.getElementById(idB)!.innerHTML = content.replace(/(\S+|\s+)/g, "<span>$1</span>");
  const containerWidth = document.getElementById(idA)!.getBoundingClientRect().width + 1;

  let tmpWidth = 0;
  let totalWidth = 0;
  let lineCount = 1;
  let lastLineStartIndex = 0;
  const elements = document.querySelectorAll(`#${idB} span`);

  elements.forEach((element, index) => {
    tmpWidth = element.getBoundingClientRect().width;
    if (totalWidth + tmpWidth > containerWidth) {
      lineCount++;
      lastLineStartIndex = index;
      totalWidth = tmpWidth;
    } else {
      totalWidth += tmpWidth;
    }
  });

  const arrElements = Array.from(elements);
  const lastLineSpans = arrElements.slice(lastLineStartIndex);
  let lastLineText = "";
  for (let i = 0; i < lastLineSpans.length; i++) {
    lastLineText += lastLineSpans[i].textContent;
    if (i < lastLineSpans.length - 1) {
      lastLineText += " ";
    }
  }

  document.getElementById(idB)!.innerHTML = lastLineText;

  if (lineCount === 1) {
    totalWidth = containerWidth;
  } else {
    totalWidth = document.getElementById(idB)!.getBoundingClientRect().width;
  }
  callback(totalWidth);
}
