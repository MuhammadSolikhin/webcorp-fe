export const isValidUrl = (url: string) => {
  const urlRegex =
    /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})(\/[\w.-]*)*\/?(\?([\w.-]+=[\w.-]+&?)*)?$/i;
  return urlRegex.test(url);
};

export function extractValidURL(input: string) {
  const regex = /src="([^"]*)"/g;
  const match = regex.exec(input);
  if (match && match.length > 1) {
    return match[1];
  }
  return "";
}
