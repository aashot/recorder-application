import { initializeMedia } from './media.js';
import { setupRecordingControls } from './events/recordingControls.js';
import { setupImageUpload } from './events/imageUpload.js';
import { setupImageDrag } from './events/imageDrag.js';
import { drawCanvas } from './drawing.js';

document.addEventListener('DOMContentLoaded', async () => {
  const recordingButton = document.getElementById('recordingButton');
  const recordingIcon = document.getElementById('recordingIcon');
  const recordingIndicator = document.getElementById('recordingIndicator');
  const playRecordingButton = document.getElementById('playRecording');
  const downloadRecordingButton = document.getElementById('downloadRecording');
  const micVolumeSlider = document.getElementById('micVolume');
  const uploadImageButton = document.getElementById('uploadImageButton');
  const uploadImageInput = document.getElementById('imageUpload');
  const canvasElement = document.getElementById('canvasElement');
  const realTimeVideoElement = document.getElementById('realTimeVideoElement');
  const recordedVideoElement = document.getElementById('recordedVideo');

  const images = [];
  const imagePositions = [];
  const chunks = [];
  const recordedBlob = { value: null };

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
      slider.style.background = `linear-gradient(to right, var(--slider-thumb-bg-color) ${value * 100}%, var(--slider-track-bg-color) ${value * 100}%)`;
    });

    setupRecordingControls({
      recordingButton,
      recordingIcon,
      recordingIndicator,
      playRecordingButton,
      downloadRecordingButton,
      uploadImageButton,
      mediaRecorder,
      recordedVideoElement,
      canvasElement,
      chunks,
      recordedBlob
    });

    setupImageUpload({
      uploadImageInput,
      canvasElement,
      images,
      imagePositions
    });

    setupImageDrag({
      canvasElement,
      images,
      imagePositions
    });

  } catch (error) {
    console.error('Error initializing media:', error);
  }
});