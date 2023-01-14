export default class MiniPaint {
    constructor() {
        const canvas = document.querySelectorAll('#MiniPaint')[0];
        const canvasCtx = canvas.getContext('2d');
        const img = new Image();
        const radius = 40;

        img.src = '/assets/images/miniafter.png';
        img.onload = setUp(canvasCtx, canvas, radius);
    }
}

function setUp(canvasCtx, canvas) {
    // canvasCtx.fillStyle = '#ffffff';
    // canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
    canvasCtx.globalCompositeOperation = 'destination-out';
    canvasCtx.lineWidth = 5;
    canvasCtx.strokeStyle = 'rgba(0, 0, 0, 0.5)';

    // canvas.addEventListener('mousemove', (e) => {
    //     var r = canvas.getBoundingClientRect(),
    //     x = e.clientX - r.left,
    //     y = e.clientY - r.top;
    
    //     canvasCtx.beginPath();
    //     canvasCtx.moveTo(x + radius, y);
    //     canvasCtx.arc(x, y, radius, 0, 2*Math.PI);
    //     canvasCtx.fill();
    // });
}
