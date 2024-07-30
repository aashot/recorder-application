import { createDownloadLink } from '../utils';
import startRecordIcon from '../../assets/icons/start-record.svg';
import stopRecordIcon from '../../assets/icons/stop-record.svg';

/**
 * Sets up event listeners for the recording control buttons and manages recording state.
 * @param {Object} params - The parameters for setting up event listeners.
 * @param {HTMLButtonElement} params.recordingButton - The button to start/stop recording.
 * @param {HTMLImageElement} params.recordingIcon - The icon inside the recording button.
 * @param {HTMLImageElement} params.recordingIndicator - The video recording indicator.
 * @param {HTMLButtonElement} params.playRecordingButton - The button to play the recorded video.
 * @param {HTMLButtonElement} params.downloadRecordingButton - The button to download the recording.
 * @param {MediaRecorder} params.mediaRecorder - The media recorder instance.
 * @param {HTMLVideoElement} params.recordedVideoElement - The recorded video element.
 * @param {HTMLCanvasElement} params.canvasElement - The canvas element.
 * @param {Array} params.chunks - Array to store recorded video chunks.
 * @param {Blob} params.recordedBlob - The recorded video blob.
 */
export function setupRecordingControls({
  recordingButton,
  recordingIcon,
  recordingIndicator,
  playRecordingButton,
  downloadRecordingButton,
  mediaRecorder,
  recordedVideoElement,
  canvasElement,
  chunks,
  recordedBlob
}) {
  recordingButton.addEventListener('click', () => {
    if (recordingButton.classList.contains('recording')) {
      console.log('Stopping recording...');
      if (mediaRecorder.state !== 'inactive') {
        mediaRecorder.stop();
      }
      recordingIndicator.classList.add('hide');
      recordingButton.classList.remove('recording');
      recordingIcon.src = startRecordIcon;
      recordingButton.setAttribute('aria-label', 'Start Recording');
    } else {
      console.log('Starting recording...');
      mediaRecorder.start();
      recordingIndicator.classList.remove('hide');
      console.log('recordingIndicator', recordingIndicator)
      recordedVideoElement.classList.add('hide');
      recordingButton.classList.add('recording');
      recordingIcon.src = stopRecordIcon;
      recordingButton.setAttribute('aria-label', 'Stop Recording');
      playRecordingButton.disabled = true;
      downloadRecordingButton.disabled = true;
    }
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