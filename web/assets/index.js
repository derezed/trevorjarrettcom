(() => {
  // src/scripts/minipaint.js
  var MiniPaint = class {
    constructor() {
      const canvas = document.querySelectorAll("#MiniPaint")[0];
      const canvasCtx = canvas.getContext("2d");
      const img = new Image();
      const radius = 40;
      img.src = "/assets/images/miniafter.png";
      img.onload = setUp(canvasCtx, canvas, radius);
    }
  };
  function setUp(canvasCtx, canvas) {
    canvasCtx.globalCompositeOperation = "destination-out";
    canvasCtx.lineWidth = 5;
    canvasCtx.strokeStyle = "rgba(0, 0, 0, 0.5)";
  }

  // src/scripts/index.js
  if (document.querySelectorAll("#MiniPaint")) {
    new MiniPaint();
  }
})();
