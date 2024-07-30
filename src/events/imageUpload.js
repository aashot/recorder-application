import { drawCanvas } from '../drawing.js';

/**
 * Sets up event listeners for image upload functionality.
 * @param {Object} params - The parameters for setting up event listeners.
 * @param {HTMLInputElement} params.uploadImageInput - The file input for image upload.
 * @param {HTMLCanvasElement} params.canvasElement - The canvas element.
 * @param {Array} params.images - Array to store images.
 * @param {Array} params.imagePositions - Array to store image positions.
 */
export function setupImageUpload({
  uploadImageInput,
  canvasElement,
  images,
  imagePositions
}) {
  uploadImageInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newImage = new Image();
        newImage.src = e.target.result;
        newImage.onload = () => {
          const aspectRatio = newImage.width / newImage.height;
          const maxSize = 200;
          let width, height;

          if (aspectRatio > 1) {
            width = Math.min(maxSize, newImage.width);
            height = width / aspectRatio;
          } else {
            height = Math.min(maxSize, newImage.height);
            width = height * aspectRatio;
          }

          let x, y;
          const lastImage = imagePositions[imagePositions.length - 1];

          if (!lastImage) {
            x = 15;
            y = (canvasElement.height - height) / 2;
          } else {
            if (lastImage.x + lastImage.width + width + 10 > canvasElement.width) {
              x = 15;
              y = lastImage.y + lastImage.height + 10;
            } else {
              x = lastImage.x + lastImage.width + 10;
              y = lastImage.y;
            }
          }

          images.push(newImage);
          imagePositions.push({ x, y, width, height });

          drawCanvas(canvasElement, realTimeVideoElement, images, imagePositions);
        };
      };
      reader.readAsDataURL(file);
    }
  });
}