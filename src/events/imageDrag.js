import { drawCanvas } from '../drawing.js';

/**
 * Sets up event listeners for image dragging on the canvas.
 * @param {Object} params - The parameters for setting up event listeners.
 * @param {HTMLCanvasElement} params.canvasElement - The canvas element.
 * @param {Array} params.images - Array to store images.
 * @param {Array} params.imagePositions - Array to store image positions.
 */
export function setupImageDrag({
  canvasElement,
  images,
  imagePositions
}) {
  const dragStart = { x: 0, y: 0 };
  let isDragging = false;
  let currentIndex = -1;

  canvasElement.addEventListener('mousedown', (e) => {
    if (images.length > 0) {
      const rect = canvasElement.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      for (let i = 0; i < images.length; i++) {
        const imgPos = imagePositions[i];
        if (x >= imgPos.x && x <= imgPos.x + imgPos.width && y >= imgPos.y && y <= imgPos.y + imgPos.height) {
          isDragging = true;
          currentIndex = i;
          dragStart.x = x - imgPos.x;
          dragStart.y = y - imgPos.y;
          break;
        }
      }
    }
  });

  canvasElement.addEventListener('mousemove', (e) => {
    if (isDragging && currentIndex >= 0) {
      const rect = canvasElement.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      imagePositions[currentIndex].x = x - dragStart.x;
      imagePositions[currentIndex].y = y - dragStart.y;
      drawCanvas(canvasElement, realTimeVideoElement, images, imagePositions);
    }
  });

  canvasElement.addEventListener('mouseup', () => {
    isDragging = false;
    currentIndex = -1;
  });

  canvasElement.addEventListener('mouseleave', () => {
    isDragging = false;
    currentIndex = -1;
  });
}