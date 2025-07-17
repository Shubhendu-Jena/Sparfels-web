document.addEventListener("DOMContentLoaded", () => {
  const wrappers = document.querySelectorAll(".video-wrapper");

  wrappers.forEach(wrapper => {
    const baseVideo = wrapper.querySelector("video:nth-child(1)");
    const overlayVideo = wrapper.querySelector("video:nth-child(2)");
    const divider = wrapper.querySelector(".divider");

    // Sync time every loop
    [baseVideo, overlayVideo].forEach(video => {
      video.addEventListener("loadeddata", () => {
        video.play();
      });
    });

    function syncVideos() {
      if (Math.abs(baseVideo.currentTime - overlayVideo.currentTime) > 0.05) {
        overlayVideo.currentTime = baseVideo.currentTime;
      }
      requestAnimationFrame(syncVideos);
    }

    syncVideos();

    // Drag logic
    wrapper.addEventListener("mousemove", (e) => {
      const rect = wrapper.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percent = (x / rect.width) * 100;
      overlayVideo.style.clipPath = `inset(0 ${100 - percent}% 0 0)`;
      divider.style.left = `${percent}%`;
    });
  });
});
