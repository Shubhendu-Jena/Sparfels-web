document.addEventListener("DOMContentLoaded", () => {
  const frameRate = 30; // Adjust if needed (e.g., 24 or 25)

  document.querySelectorAll(".video-wrapper").forEach(wrapper => {
    const videoA = wrapper.querySelector("video:nth-child(1)");
    const videoB = wrapper.querySelector("video:nth-child(2)");
    const divider = wrapper.querySelector(".divider");

    let duration = 0;
    let frame = 0;
    let ready = 0;

    function checkReady() {
      ready++;
      if (ready === 2) {
        duration = Math.min(videoA.duration, videoB.duration);
        videoA.pause();
        videoB.pause();
        videoA.currentTime = 0;
        videoB.currentTime = 0;
        requestAnimationFrame(step);
      }
    }

    videoA.addEventListener("loadeddata", checkReady);
    videoB.addEventListener("loadeddata", checkReady);

    function step() {
      const time = frame / frameRate;
      if (time >= duration) {
        frame = 0;
      }

      videoA.currentTime = time;
      videoB.currentTime = time;
      frame++;

      setTimeout(() => {
        requestAnimationFrame(step);
      }, 1000 / frameRate);
    }

    wrapper.addEventListener("mousemove", (e) => {
      const rect = wrapper.getBoundingClientRect();
      const percent = ((e.clientX - rect.left) / rect.width) * 100;
      videoB.style.clipPath = `inset(0 ${100 - percent}% 0 0)`;
      divider.style.left = `${percent}%`;
    });
  });
});
