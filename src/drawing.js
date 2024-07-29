/**
 * Draw the video and images on the canvas.
 * @param {HTMLCanvasElement} canvasElement - The canvas element to draw on.
 * @param {HTMLVideoElement} realTimeVideoElement - The video element to draw from.
 * @param {Array} images - Array of images to draw.
 * @param {Array} imagePositions - Array of positions and sizes for each image.
 */
export function drawCanvas(canvasElement, realTimeVideoElement, images, imagePositions) {
  const context = canvasElement.getContext('2d');
  context.clearRect(0, 0, canvasElement.width, canvasElement.height);
  context.drawImage(realTimeVideoElement, 0, 0, canvasElement.width, canvasElement.height);

  images.forEach((image, index) => {
    const { x, y, width, height } = imagePositions[index];
    context.drawImage(image, x, y, width, height);
  });
}