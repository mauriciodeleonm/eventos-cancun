export function parseImageUrls(raw: string | undefined): string[] | undefined {
  if (!raw) return undefined;

  const urls = raw
    .split(',')
    .map((url) => url.trim())
    .filter((url) => url !== '');

  return urls.length > 0 ? urls : undefined;
}
