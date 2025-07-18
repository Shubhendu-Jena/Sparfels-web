<!-- JS: Lazy load, sync, and drag setup -->
<script>
document.addEventListener('DOMContentLoaded', () => {
  const sets = document.querySelectorAll('[data-videoset]');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const wrapper = entry.target;
      const videos = wrapper.querySelectorAll('video');
      videos.forEach(video => {
        if (!video.src && video.dataset.src) video.src = video.dataset.src;
      });
      syncVideos(videos);
      observer.unobserve(wrapper);
    });
  }, { threshold: 0.5 });

  sets.forEach(set => {
    observer.observe(set);
    const wrapper = set.querySelector('.video-wrapper-triple');
    const videoA = set.querySelector('.videoA');
    const videoB = set.querySelector('.videoB');
    const videoC = set.querySelector('.videoC');
    const divider1 = set.querySelector('.divider1');
    const divider2 = set.querySelector('.divider2');

    const updateClipPaths = (left, right) => {
      videoB.style.clipPath = `inset(0 ${100 - left}% 0 0)`;
      videoC.style.clipPath = `inset(0 0 0 ${right}%)`;
      divider1.style.left = `${left}%`;
      divider2.style.left = `${right}%`;
    };

    let active = null;
    const pointerHandler = (divider, isFirst) => {
      divider.addEventListener('pointerdown', e => {
        active = { isFirst };
        e.preventDefault();
      });
    };
    pointerHandler(divider1, true);
    pointerHandler(divider2, false);

    window.addEventListener('pointerup', () => active = null);
    window.addEventListener('pointermove', e => {
      if (!active) return;
      const rect = wrapper.getBoundingClientRect();
      let percent = ((e.clientX - rect.left) / rect.width) * 100;
      percent = Math.min(Math.max(percent, 0), 100);
      if (active.isFirst) {
        const r = parseFloat(divider2.style.left || 66.66);
        updateClipPaths(percent, r);
      } else {
        const l = parseFloat(divider1.style.left || 33.33);
        updateClipPaths(l, percent);
      }
    });

    updateClipPaths(33.33, 66.66);
  });

  function syncVideos(videos) {
    let loaded = 0;
    videos.forEach(v => {
      v.onloadeddata = () => {
        if (++loaded === 3) {
          videos.forEach(v => { v.currentTime = 0; v.play().catch(console.warn); });
        }
      };
    });
  }
});
</script>
