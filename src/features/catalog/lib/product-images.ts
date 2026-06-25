export function buildProductImages(imageUrl: string, galleryImageUrls: string[] = []) {
  const images = [imageUrl, ...galleryImageUrls]
    .map((url) => url.trim())
    .filter(Boolean);

  return images.filter((url, index) => images.indexOf(url) === index);
}
