function resizeAndPlay(video) {
  const canvas = document.getElementById(video.id + "Merge");
  const container = video.parentElement;

  const width = video.videoWidth;
  const height = video.videoHeight;

  canvas.width = width;
  canvas.height = height;
  canvas.style.width = video.clientWidth + "px";
  canvas.style.height = video.clientHeight + "px";

  const ctx = canvas.getContext("2d");

  // Clone video element to create overlay comparison
  const mask = document.createElement("video");
  mask.src = video.src.replace("_ours", "_gt");  // assumes naming convention: scan_01_ours.mp4 and scan_01_gt.mp4
  mask.loop = true;
  mask.muted = true;
  mask.playsInline = true;
  mask.autoplay = true;
  mask.play();

  let sliderX = canvas.width / 2;

  // Mouse-controlled slider
  canvas.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    sliderX = e.clientX - rect.left;
  });

  function render() {
    if (video.readyState >= 2 && mask.readyState >= 2) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, 0, sliderX, canvas.height);
      ctx.clip();
      ctx.drawImage(mask, 0, 0, canvas.width, canvas.height);
      ctx.restore();
    }
    requestAnimationFrame(render);
  }

  render();
}
