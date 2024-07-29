/**
 * Create a video element with controls and a URL source.
 * @param {Blob} blob - The video Blob object.
 * @returns {HTMLVideoElement} - The created video element.
 */
export function createVideoElement(blob) {
  const video = document.createElement('video');
  video.controls = true;
  video.src = URL.createObjectURL(blob);
  return video;
}

/**
 * Creates a download link and triggers a download for the given blob.
 * @param {Blob} blob - The blob to download.
 * @param {string} filename - The name of the file to be downloaded.
 */
export function createDownloadLink(blob, filename) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}