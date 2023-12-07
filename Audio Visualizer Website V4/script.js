window.addEventListener('load', init, false);

function init() {

    function handleFiles(event) {
        var files = event.target.files;
        $("#src").attr("src", URL.createObjectURL(files[0]));
        document.getElementById("audio").load();
    }
    
    document.getElementById("upload").addEventListener("change", handleFiles, false);



    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const canvas = document.getElementById('visualizer');
    const canvasContext = canvas.getContext('2d');
    const audioElement = document.getElementById('audio');
    
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 128;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const source = audioContext.createMediaElementSource(audioElement);
    source.connect(analyser);
    analyser.connect(audioContext.destination);

    document.getElementById('upload').addEventListener('click', () => {
        audioContext.resume().then(() => {
            // audioElement.play();
            animation();
        });
    });

    function animation() {
        analyser.getByteFrequencyData(dataArray);

        canvasContext.clearRect(0, 0, canvas.clientWidth, canvas.height);
        const barWidth = canvas.width / bufferLength;
        let x = 0;

        for(let i = 0; i < bufferLength; i++) {
            const barHeight = dataArray[i] / 2;
            canvasContext.fillStyle = 'hsl(0, 0%, 100%)';
            canvasContext.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
            x += 1.5*barWidth + 1;
        }

        requestAnimationFrame(animation);

    }


}