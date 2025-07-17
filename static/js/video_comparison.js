document.addEventListener("DOMContentLoaded", () => {
  const wrappers = document.querySelectorAll(".video-wrapper");

  wrappers.forEach(wrapper => {
    const videoA = wrapper.querySelector("video:nth-child(1)");
    const videoB = wrapper.querySelector("video:nth-child(2)");
    const divider = wrapper.querySelector(".divider");

    let duration = 0;
    let frameRate = 30; // Assumed fps; change to 24/25/60 as needed
    let playing = false;
    let frame = 0;

    const tryStart = () => {
      if (videoA.readyState >= 2 && videoB.readyState >= 2) {
        duration = Math.min(videoA.duration, videoB.duration);
        videoA.pause();
        videoB.pause();
        playing = true;
        render();
      }
    };

    videoA.addEventListener("loadeddata", tryStart);
    videoB.addEventListener("loadeddata", tryStart);

    function render() {
      if (!playing) return;

      const time = frame / frameRate;
      if (time >= duration) {
        frame = 0; // loop
      }

      videoA.currentTime = time;
      videoB.currentTime = time;
      frame++;
      setTimeout(() => {
        requestAnimationFrame(render);
      }, 1000 / frameRate);
    }

    // Divider movement
    wrapper.addEventListener("mousemove", (e) => {
      const rect = wrapper.getBoundingClientRect();
      const percent = ((e.clientX - rect.left) / rect.width) * 100;
      videoB.style.clipPath = `inset(0 ${100 - percent}% 0 0)`;
      divider.style.left = `${percent}%`;
    });
  });
});
