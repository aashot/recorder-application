/**
 * Initializes media recording and audio processing.
 * @param {MediaStream} stream - The media stream from getUserMedia.
 * @param {HTMLCanvasElement} canvasElement - The canvas element used for capturing video frames.
 * @returns {Promise<{ mediaRecorder: MediaRecorder, audioContext: AudioContext, gainNode: GainNode }>}
 */
export async function initializeMedia(stream, canvasElement) {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const audioInput = audioContext.createMediaStreamSource(stream);
  const gainNode = audioContext.createGain();
  gainNode.gain.value = parseFloat(document.getElementById('micVolume').value) || 1;

  audioInput.connect(gainNode);
  const destination = audioContext.createMediaStreamDestination();
  gainNode.connect(destination);

  const canvasStream = canvasElement.captureStream();
  const combinedStream = new MediaStream([
    ...canvasStream.getTracks(),
    ...destination.stream.getAudioTracks()
  ]);

  return {
    mediaRecorder: new MediaRecorder(combinedStream),
    audioContext,
    gainNode
  };
}