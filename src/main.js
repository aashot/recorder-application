import { initializeMedia } from './media.js';
import { setupEventListeners } from './eventListeners.js';
import { drawCanvas } from './drawing.js';

document.addEventListener('DOMContentLoaded', async () => {
  const startRecordingButton = document.getElementById('startRecording');
  const stopRecordingButton = document.getElementById('stopRecording');
  const playRecordingButton = document.getElementById('playRecording');
  const downloadRecordingButton = document.getElementById('downloadRecording');
  const micVolumeSlider = document.getElementById('micVolume');
  const uploadImageInput = document.getElementById('imageUpload');
  const canvasElement = document.getElementById('canvasElement');
  const realTimeVideoElement = document.getElementById('realTimeVideoElement');
  const recordedVideoElement = document.getElementById('recordedVideo');

  const images = [];
  const imagePositions = [];

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    realTimeVideoElement.srcObject = stream;
    await new Promise(resolve => realTimeVideoElement.onloadedmetadata = resolve);
    realTimeVideoElement.play();

    const { mediaRecorder, gainNode } = await initializeMedia(stream, canvasElement);

    function draw() {
      drawCanvas(canvasElement, realTimeVideoElement, images, imagePositions);
      requestAnimationFrame(draw);
    }
    draw();

    micVolumeSlider.addEventListener('input', (event) => {
      if (gainNode) {
        gainNode.gain.value = parseFloat(micVolumeSlider.value);
      }

      const slider = event.target;
      const value = (slider.value - slider.min) / (slider.max - slider.min);
      slider.style.background = `linear-gradient(to right, var(--button-bg-color) ${value * 100}%, var(--slider-track-bg-color) ${value * 100}%)`;
    });

    setupEventListeners({
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
    });
  } catch (error) {
    console.error('Error accessing media devices:', error);
  }
});