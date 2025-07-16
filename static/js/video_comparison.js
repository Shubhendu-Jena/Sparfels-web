function resizeAndPlay(video) {
  const canvas = document.getElementById(video.id + "Merge");

  const width = video.videoWidth;
  const height = video.videoHeight;
  canvas.width = width;
  canvas.height = height;
  canvas.style.width = video.clientWidth + "px";
  canvas.style.height = video.clientHeight + "px";

  const ctx = canvas.getContext("2d");

  const overlayVideo = document.createElement("video");
  overlayVideo.src = video.dataset.altSrc;  // 👈 dynamic alt video
  overlayVideo.loop = true;
  overlayVideo.muted = true;
  overlayVideo.playsInline = true;
  overlayVideo.autoplay = true;
  overlayVideo.play();

  let sliderX = canvas.width / 2;

  canvas.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    sliderX = e.clientX - rect.left;
  });

  function render() {
    if (video.readyState >= 2 && overlayVideo.readyState >= 2) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, 0, sliderX, canvas.height);
      ctx.clip();
      ctx.drawImage(overlayVideo, 0, 0, canvas.width, canvas.height);
      ctx.restore();
    }
    requestAnimationFrame(render);
  }

  render();
}
