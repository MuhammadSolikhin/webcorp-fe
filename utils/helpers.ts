export function makeSlug(path: string) {
  return path.toLowerCase().split(" ").join("-");
}

export function pickFields<T extends object, K extends keyof T>(
  inputObject: T,
  keysToPick: K[]
): Pick<T, K> {
  const pickedFields: Pick<T, K> = {} as Pick<T, K>;

  keysToPick.forEach(key => {
    if (inputObject.hasOwnProperty(key)) {
      pickedFields[key] = inputObject[key];
    }
  });

  return pickedFields;
}

export function removeFontFamily(content: string) {
  return content.replaceAll(/(color|font-family|font-size|font-weight):([^;]+);/gm, "");
}
