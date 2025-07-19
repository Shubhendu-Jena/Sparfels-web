
import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r152/three.module.min.js';

function setupTripleViewer(containerId, videoPaths) {
  const container = document.getElementById(containerId);
  const width = container.clientWidth;
  const height = container.clientHeight;

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(width, height);
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(0, width, height, 0, -1, 1);

  const videos = videoPaths.map(path => {
    const v = document.createElement('video');
    v.src = path;
    v.muted = true;
    v.loop = true;
    v.playsInline = true;
    v.preload = 'auto';
    v.crossOrigin = 'anonymous';
    return v;
  });

  const textures = videos.map(v => new THREE.VideoTexture(v));
  const planes = textures.map((tex, i) => {
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    const mat = new THREE.MeshBasicMaterial({ map: tex });
    const geo = new THREE.PlaneGeometry(width, height);
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.z = -i;
    scene.add(mesh);
    return mesh;
  });

  const divider1 = document.createElement('div');
  const divider2 = document.createElement('div');
  divider1.className = 'divider';
  divider2.className = 'divider';
  container.appendChild(divider1);
  container.appendChild(divider2);

  let dividerX1 = width / 3;
  let dividerX2 = 2 * width / 3;
  divider1.style.left = dividerX1 + 'px';
  divider2.style.left = dividerX2 + 'px';

  [divider1, divider2].forEach(div => {
    div.style.width = '4px';
    div.style.position = 'absolute';
    div.style.top = '0';
    div.style.height = '100%';
    div.style.background = 'black';
    div.style.cursor = 'ew-resize';
    div.style.zIndex = 10;
    div.innerHTML = '<div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);color:black;">↔</div>';
  });

  let dragging = null;
  const dragStart = (id) => () => { dragging = id; };
  const dragEnd = () => { dragging = null; };
  const dragMove = (e) => {
    if (!dragging) return;
    const x = Math.min(Math.max(e.clientX, 0), width);
    if (dragging === 1) {
      dividerX1 = Math.min(x, dividerX2 - 10);
      divider1.style.left = dividerX1 + 'px';
    } else if (dragging === 2) {
      dividerX2 = Math.max(x, dividerX1 + 10);
      divider2.style.left = dividerX2 + 'px';
    }
  };
  divider1.addEventListener('pointerdown', dragStart(1));
  divider2.addEventListener('pointerdown', dragStart(2));
  window.addEventListener('pointerup', dragEnd);
  window.addEventListener('pointermove', dragMove);

  function animate() {
    requestAnimationFrame(animate);
    renderer.setScissorTest(true);
    renderer.clear();

    const x1 = dividerX1;
    const x2 = dividerX2;

    renderer.setScissor(0, 0, x1, height);
    renderer.setViewport(0, 0, x1, height);
    renderer.render(scene, camera);

    renderer.setScissor(x1, 0, x2 - x1, height);
    renderer.setViewport(x1, 0, x2 - x1, height);
    renderer.render(scene, camera);

    renderer.setScissor(x2, 0, width - x2, height);
    renderer.setViewport(x2, 0, width - x2, height);
    renderer.render(scene, camera);
  }

  videos.forEach(v => v.addEventListener('canplaythrough', () => {
    if (videos.every(video => video.readyState >= 3)) {
      videos.forEach(v => v.play());
    }
  }));

  animate();
}

// Example calls (you can add more here)
window.addEventListener('DOMContentLoaded', () => {
  setupTripleViewer('dtu_scan24', [
    'static/videos/scan_dtu_24_sparfels.webm',
    'static/videos/scan_dtu_24_instantsplat.webm',
    'static/videos/scan_dtu_24_sparsecraft.webm'
  ]);

  setupTripleViewer('dtu_scan65', [
    'static/videos/scan_dtu_65_sparfels.webm',
    'static/videos/scan_dtu_65_instantsplat.webm',
    'static/videos/scan_dtu_65_sparsecraft.webm'
  ]);

  setupTripleViewer('bmvs_scan120', [
    'static/videos/scan_bmvs_120_sparfels.webm',
    'static/videos/scan_bmvs_120_uforecon.webm',
    'static/videos/scan_bmvs_120_colmap.webm'
  ]);

  setupTripleViewer('bmvs_scan350', [
    'static/videos/scan_bmvs_350_sparfels.webm',
    'static/videos/scan_bmvs_350_uforecon.webm',
    'static/videos/scan_bmvs_350_colmap.webm'
  ]);
});
  // Add additional calls for other containers with their respective video paths
});
