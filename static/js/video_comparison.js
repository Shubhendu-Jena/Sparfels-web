document.addEventListener("DOMContentLoaded", () => {
  const pairs = document.querySelectorAll(".video-wrapper");

  pairs.forEach(wrapper => {
    const videoA = wrapper.querySelector("video:nth-child(1)");
    const videoB = wrapper.querySelector("video:nth-child(2)");
    const divider = wrapper.querySelector(".divider");

    let bothReady = 0;

    const checkReady = () => {
      bothReady++;
      if (bothReady === 2) {
        // Sync play
        videoA.currentTime = 0;
        videoB.currentTime = 0;
        videoA.play();
        videoB.play();
        syncLoop();
      }
    };

    videoA.addEventListener("loadeddata", checkReady);
    videoB.addEventListener("loadeddata", checkReady);

    // Keep videos aligned
    function syncLoop() {
      if (Math.abs(videoA.currentTime - videoB.currentTime) > 0.03) {
        videoB.currentTime = videoA.currentTime;
      }
      requestAnimationFrame(syncLoop);
    }

    // Divider movement
    wrapper.addEventListener("mousemove", e => {
      const rect = wrapper.getBoundingClientRect();
      const percent = ((e.clientX - rect.left) / rect.width) * 100;
      videoB.style.clipPath = `inset(0 ${100 - percent}% 0 0)`;
      divider.style.left = `${percent}%`;
    });
  });
});
