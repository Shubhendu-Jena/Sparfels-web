<script>
document.addEventListener("DOMContentLoaded", () => {
  const frameRate = 30;

  document.querySelectorAll(".video-wrapper-triple").forEach(wrapper => {
    const videoA = wrapper.querySelector("video:nth-child(1)");
    const videoB = wrapper.querySelector("video:nth-child(2)");
    const videoC = wrapper.querySelector("video:nth-child(3)");
    const divider1 = wrapper.querySelector(".divider-triple-1");
    const divider2 = wrapper.querySelector(".divider-triple-2");

    let duration = 0;
    let frame = 0;
    let ready = 0;

    function checkReady() {
      ready++;
      if (ready === 3) {
        duration = Math.min(videoA.duration, videoB.duration, videoC.duration);
        [videoA, videoB, videoC].forEach(v => {
          v.pause();
          v.currentTime = 0;
        });
        requestAnimationFrame(step);
      }
    }

    [videoA, videoB, videoC].forEach(v => v.addEventListener("loadeddata", checkReady));

    function step() {
      const time = frame / frameRate;
      if (time >= duration) {
        frame = 0;
      }

      [videoA, videoB, videoC].forEach(v => v.currentTime = time);
      frame++;
      setTimeout(() => requestAnimationFrame(step), 1000 / frameRate);
    }

    wrapper.addEventListener("mousemove", (e) => {
      const rect = wrapper.getBoundingClientRect();
      const percent = ((e.clientX - rect.left) / rect.width) * 100;

      // Set clips for 3 videos: A (full), B (middle), C (right)
      videoB.style.clipPath = `inset(0 ${100 - percent}% 0 0)`;
      videoC.style.clipPath = `inset(0 0 0 ${percent}%)`;

      divider1.style.left = `${percent}%`;
      divider2.style.left = `${percent}%`;
    });
  });
});
</script>
