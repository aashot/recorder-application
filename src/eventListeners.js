import { createDownloadLink } from './utils.js';
import { drawCanvas } from './drawing.js';

/**
 * Sets up event listeners for various UI elements and controls.
 * @param {Object} params - The parameters for setting up event listeners.
 * @param {HTMLButtonElement} params.startRecordingButton - The button to start recording.
 * @param {HTMLButtonElement} params.stopRecordingButton - The button to stop recording.
 * @param {HTMLButtonElement} params.playRecordingButton - The button to play the recorded video.
 * @param {HTMLButtonElement} params.downloadRecordingButton - The button to download the recording.
 * @param {HTMLInputElement} params.uploadImageInput - The file input for image upload.
 * @param {MediaRecorder} params.mediaRecorder - The media recorder instance.
 * @param {HTMLCanvasElement} params.canvasElement - The canvas element.
 * @param {HTMLVideoElement} params.realTimeVideoElement - The real-time video element.
 * @param {HTMLVideoElement} params.recordedVideoElement - The recorded video element.
 */
export function setupEventListeners({
  startRecordingButton,
  stopRecordingButton,
  playRecordingButton,
  downloadRecordingButton,
  uploadImageInput,
  mediaRecorder,
  canvasElement,
  realTimeVideoElement,
  recordedVideoElement,
  images,
  imagePositions
}) {
  const dragStart = { x: 0, y: 0 };
  const paddingLeft = 15;
  const imageSpacing = 10;
  const imageSize = 200;
  let isDragging = false;
  let currentIndex = -1; // Index of the currently dragged image
  let chunks = [];
  let recordedBlob = null;

  startRecordingButton.addEventListener('click', () => {
    console.log('Starting recording...');
    mediaRecorder.start();

    realTimeVideoElement.classList.remove('hide');
    canvasElement.classList.remove('hide');
    recordedVideoElement.classList.add('hide');
    recordedVideoElement.pause();
    recordedVideoElement.currentTime = 0;

    images.length = 0;
    imagePositions.length = 0;
    drawCanvas(canvasElement, realTimeVideoElement, images, imagePositions);

    startRecordingButton.disabled = true;
    stopRecordingButton.disabled = false;
    playRecordingButton.disabled = true;
    downloadRecordingButton.disabled = true;
  });

  stopRecordingButton.addEventListener('click', () => {
    console.log('Stopping recording...');
    if (mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
    }
    startRecordingButton.disabled = false;
    stopRecordingButton.disabled = true;
  });

  mediaRecorder.ondataavailable = (event) => {
    console.log('Data available:', event.data);
    if (event.data.size > 0) {
      chunks.push(event.data);
    }
  };

  mediaRecorder.onstop = () => {
    console.log('Recording stopped.');
    recordedBlob = new Blob(chunks, { type: 'video/webm' });
    recordedVideoElement.src = URL.createObjectURL(recordedBlob);
    chunks = [];
    playRecordingButton.disabled = false;
    downloadRecordingButton.disabled = false;
  };

  playRecordingButton.addEventListener('click', () => {
    if (recordedBlob) {
      realTimeVideoElement.classList.add('hide');
      canvasElement.classList.add('hide');
      recordedVideoElement.classList.remove('hide');
      recordedVideoElement.play();
    }
  });

  downloadRecordingButton.addEventListener('click', () => {
    if (recordedBlob) {
      createDownloadLink(recordedBlob, 'video.webm');
    }
  });

  uploadImageInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newImage = new Image();
        newImage.src = e.target.result;
        newImage.onload = () => {
          const aspectRatio = newImage.width / newImage.height;
          const maxSize = imageSize;
          let width, height;

          if (aspectRatio > 1) { // Landscape or square image
            width = Math.min(maxSize, newImage.width);
            height = width / aspectRatio;
          } else { // Portrait image
            height = Math.min(maxSize, newImage.height);
            width = height * aspectRatio;
          }

          // Calculate position for the new image
          let x, y;
          const lastImage = imagePositions[imagePositions.length - 1];

          if (!lastImage) {
            // First image
            x = paddingLeft;
            y = (canvasElement.height - height) / 2;
          } else {
            // Check if the image fits in the current row
            if (lastImage.x + lastImage.width + width + imageSpacing > canvasElement.width) {
              // Move to new row
              x = paddingLeft;
              y = lastImage.y + lastImage.height + imageSpacing;
            } else {
              // Same row
              x = lastImage.x + lastImage.width + imageSpacing;
              y = lastImage.y;
            }
          }

          images.push(newImage);
          imagePositions.push({
            x,
            y,
            width,
            height
          });

          drawCanvas(canvasElement, realTimeVideoElement, images, imagePositions);
        };
      };
      reader.readAsDataURL(file);
    }
  });

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