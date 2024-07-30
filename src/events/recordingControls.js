import { createDownloadLink } from '../utils'

/**
 * Sets up event listeners for recording control buttons.
 * @param {Object} params - The parameters for setting up event listeners.
 * @param {HTMLButtonElement} params.startRecordingButton - The button to start recording.
 * @param {HTMLButtonElement} params.stopRecordingButton - The button to stop recording.
 * @param {HTMLButtonElement} params.playRecordingButton - The button to play the recorded video.
 * @param {HTMLButtonElement} params.downloadRecordingButton - The button to download the recording.
 * @param {MediaRecorder} params.mediaRecorder - The media recorder instance.
 * @param {HTMLVideoElement} params.recordedVideoElement - The recorded video element.
 * @param {HTMLVideoElement} params.canvasElement - The canvas element.
 * @param {Array} params.chunks - Array to store recorded video chunks.
 * @param {Blob} params.recordedBlob - The recorded video blob.
 */
export function setupRecordingControls({
  startRecordingButton,
  stopRecordingButton,
  playRecordingButton,
  downloadRecordingButton,
  mediaRecorder,
  recordedVideoElement,
  canvasElement,
  chunks,
  recordedBlob
}) {
  startRecordingButton.addEventListener('click', () => {
    console.log('Starting recording...');
    mediaRecorder.start();
    recordedVideoElement.classList.add('hide');
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
    recordedBlob.value = new Blob(chunks, { type: 'video/webm' });
    recordedVideoElement.src = URL.createObjectURL(recordedBlob.value);
    chunks.length = 0;
    playRecordingButton.disabled = false;
    downloadRecordingButton.disabled = false;
  };

  playRecordingButton.addEventListener('click', () => {
    if (recordedBlob.value) {
      canvasElement.classList.add('hide');
      recordedVideoElement.classList.remove('hide');
      recordedVideoElement.play();
    }
  });

  downloadRecordingButton.addEventListener('click', () => {
    if (recordedBlob.value) {
      createDownloadLink(recordedBlob.value, 'video.webm');
    }
  });
}