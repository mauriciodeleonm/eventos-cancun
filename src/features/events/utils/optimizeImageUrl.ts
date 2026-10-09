const CLOUDINARY_UPLOAD_PATH = /^(https:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\/)(.*)$/;

export function optimizeImageUrl(url: string): string {
  const match = url.match(CLOUDINARY_UPLOAD_PATH);
  if (!match) return url;

  const [, uploadPrefix, rest] = match;
  return `${uploadPrefix}f_auto,q_auto,w_600/${rest}`;
}
