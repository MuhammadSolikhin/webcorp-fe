export function createDebounce() {
  let timeout: NodeJS.Timeout | null = null;
  return function (fnc: () => any) {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      fnc();
    }, 500);
  };
}
