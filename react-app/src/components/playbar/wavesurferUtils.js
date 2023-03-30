import WaveSurfer from 'wavesurfer.js';

export function initWaveSurfer(elementId, url, onReady) {
    const wavesurfer = WaveSurfer.create({
        container: `#${elementId}`,
        waveColor: 'violet',
        progressColor: 'purple',
        height: 100,
        barWidth: 2,
        responsive: true,
        normalize: true,
    });

    wavesurfer.load(url);
    wavesurfer.on('ready', onReady);

    return wavesurfer;
}

export function playWaveSurfer(wavesurfer) {
    wavesurfer.play();
}

export function pauseWaveSurfer(wavesurfer) {
    wavesurfer.pause();
}

export function stopWaveSurfer(wavesurfer) {
    wavesurfer.stop();
}
