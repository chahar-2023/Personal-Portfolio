// ---------- IN-PAGE SMOOTH SCROLL (robust, JS-driven, no href to avoid sandbox nav prompts) ----------
  document.querySelectorAll('[data-scroll]').forEach(el => {
    el.style.cursor = 'pointer';
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const id = el.getAttribute('data-scroll');
      const target = document.getElementById(id);
      if (!target) return;
      const navOffset = 84;
      const top = target.getBoundingClientRect().top + window.pageYOffset - navOffset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  // ---------- MOBILE NAV ----------
  const navBurger = document.getElementById('nav-burger');
  const navLinksEl = document.querySelector('.nav-links');
  navBurger.addEventListener('click', () => {
    navBurger.classList.toggle('open');
    navLinksEl.classList.toggle('open');
  });
  navLinksEl.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navBurger.classList.remove('open');
      navLinksEl.classList.remove('open');
    });
  });

  // ---------- THEME TOGGLE ----------
  const themeToggle = document.getElementById('theme-toggle');
  const themeLabel = document.getElementById('theme-label');
  const themeIcon = document.getElementById('theme-icon');
  const sunPath = '<path d="M12 4V2M12 22v-2M4.93 4.93L3.51 3.51M20.49 20.49l-1.42-1.42M4 12H2M22 12h-2M4.93 19.07l-1.42 1.42M20.49 3.51l-1.42 1.42"/><circle cx="12" cy="12" r="4"/>';
  const moonPath = '<path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>';
  themeToggle.addEventListener('click', () => {
    const html = document.documentElement;
    const isDark = html.getAttribute('data-theme') === 'dark';
    html.setAttribute('data-theme', isDark ? 'light' : 'dark');
    themeLabel.textContent = isDark ? 'Light' : 'Dark';
    themeIcon.setAttribute('fill', isDark ? 'none' : 'currentColor');
    themeIcon.setAttribute('stroke', 'currentColor');
    themeIcon.innerHTML = isDark ? sunPath : moonPath;
  });

  // ---------- NAV SCROLL STATE ----------
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  });

  // ---------- REDUCED MOTION ----------
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------- HERO 3D SCENE ----------
  const canvas = document.getElementById('hero-canvas');
  const heroSection = document.getElementById('hero');
  let W = heroSection.clientWidth, H = heroSection.clientHeight;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, W / H, 0.1, 1000);
  camera.position.set(0, 0, 14);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(W, H);

  // Lighting
  scene.add(new THREE.AmbientLight(0x334466, 1.2));
  const pLight1 = new THREE.PointLight(0xff8a4c, 2.5, 40);
  pLight1.position.set(6, 4, 8);
  scene.add(pLight1);
  const pLight2 = new THREE.PointLight(0x5eead4, 2, 40);
  pLight2.position.set(-6, -3, 6);
  scene.add(pLight2);

  // Group that holds the whole orbit system — this is what the user drags
  const rig = new THREE.Group();
  scene.add(rig);

  // Central core: layered wireframe polyhedra (front-end / back-end / data layers)
  const coreGroup = new THREE.Group();
  rig.add(coreGroup);

  const coreGeoOuter = new THREE.IcosahedronGeometry(2.6, 0);
  const coreMatOuter = new THREE.MeshBasicMaterial({ color: 0xff8a4c, wireframe: true, transparent: true, opacity: 0.55 });
  const coreOuter = new THREE.Mesh(coreGeoOuter, coreMatOuter);
  coreGroup.add(coreOuter);

  const coreGeoInner = new THREE.IcosahedronGeometry(1.7, 1);
  const coreMatInner = new THREE.MeshStandardMaterial({ color: 0x141f38, wireframe: true, emissive: 0x5eead4, emissiveIntensity: 0.3 });
  const coreInner = new THREE.Mesh(coreGeoInner, coreMatInner);
  coreGroup.add(coreInner);

  // Orbiting tech nodes
  const techList = [
    { label: 'React', color: 0x5eead4, radius: 4.6, speed: 0.42, size: 0.26, tilt: 0.15 },
    { label: 'Node', color: 0xff8a4c, radius: 5.4, speed: -0.31, size: 0.24, tilt: 0.55 },
    { label: 'Java', color: 0x8a87e8, radius: 4.1, speed: 0.5, size: 0.22, tilt: -0.4 },
    { label: 'MySQL', color: 0xffc98a, radius: 6.0, speed: -0.24, size: 0.26, tilt: 0.32 },
    { label: 'Tailwind', color: 0x5eead4, radius: 5.0, speed: 0.36, size: 0.2, tilt: -0.65 },
    { label: 'Git', color: 0x8a87e8, radius: 6.6, speed: -0.4, size: 0.22, tilt: 0.05 }
  ];

  const nodeGeo = new THREE.OctahedronGeometry(1, 0);
  const nodes = techList.map(t => {
    const mat = new THREE.MeshStandardMaterial({ color: t.color, emissive: t.color, emissiveIntensity: 0.5, roughness: 0.4 });
    const mesh = new THREE.Mesh(nodeGeo, mat);
    mesh.scale.setScalar(t.size);
    const orbit = new THREE.Group();
    orbit.rotation.x = t.tilt;
    orbit.rotation.z = Math.random() * Math.PI;
    mesh.position.set(t.radius, 0, 0);
    orbit.add(mesh);
    rig.add(orbit);
    return { orbit, mesh, ...t, angle: Math.random() * Math.PI * 2 };
  });

  // faint orbit rings
  nodes.forEach(n => {
    const ringGeo = new THREE.RingGeometry(n.radius - 0.008, n.radius + 0.008, 128);
    const ringMat = new THREE.MeshBasicMaterial({ color: n.color, transparent: true, opacity: 0.08, side: THREE.DoubleSide });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2 + n.tilt;
    ring.rotation.z = n.orbit.rotation.z;
    rig.add(ring);
  });

  // Scattered background particles
  const starGeo = new THREE.BufferGeometry();
  const starCount = 260;
  const starPos = new Float32Array(starCount * 3);
  for (let i = 0; i < starCount; i++) {
    starPos[i*3] = (Math.random() - 0.5) * 60;
    starPos[i*3+1] = (Math.random() - 0.5) * 60;
    starPos[i*3+2] = (Math.random() - 0.5) * 40 - 10;
  }
  starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
  const starMat = new THREE.PointsMaterial({ color: 0x8b96ae, size: 0.06, transparent: true, opacity: 0.6 });
  const stars = new THREE.Points(starGeo, starMat);
  scene.add(stars);

  // ---------- INTERACTION: drag to rotate rig, parallax on mousemove ----------
  let dragging = false;
  let prevX = 0, prevY = 0;
  let rigRotX = 0.15, rigRotY = 0.3;
  let velX = 0, velY = 0.0006;
  let targetCamX = 0, targetCamY = 0;

  function pointerDown(x, y) {
    dragging = true;
    prevX = x; prevY = y;
    canvas.style.cursor = 'grabbing';
  }
  function pointerMove(x, y) {
    if (!dragging) {
      // parallax
      const nx = (x / W) * 2 - 1;
      const ny = (y / H) * 2 - 1;
      targetCamX = nx * 1.2;
      targetCamY = -ny * 0.8;
      return;
    }
    const dx = x - prevX, dy = y - prevY;
    rigRotY += dx * 0.005;
    rigRotX += dy * 0.005;
    velX = dy * 0.0006;
    velY = dx * 0.0006;
    prevX = x; prevY = y;
  }
  function pointerUp() { dragging = false; canvas.style.cursor = 'grab'; }

  canvas.addEventListener('mousedown', e => pointerDown(e.clientX, e.clientY));
  window.addEventListener('mousemove', e => pointerMove(e.clientX, e.clientY));
  window.addEventListener('mouseup', pointerUp);
  canvas.addEventListener('touchstart', e => { const t = e.touches[0]; pointerDown(t.clientX, t.clientY); }, { passive: true });
  canvas.addEventListener('touchmove', e => { const t = e.touches[0]; pointerMove(t.clientX, t.clientY); }, { passive: true });
  canvas.addEventListener('touchend', pointerUp);

  function resize() {
    W = heroSection.clientWidth; H = heroSection.clientHeight;
    camera.aspect = W / H;
    camera.updateProjectionMatrix();
    renderer.setSize(W, H);
  }
  window.addEventListener('resize', resize);

  const clock = new THREE.Clock();
  function animate() {
    requestAnimationFrame(animate);
    const dt = Math.min(clock.getDelta(), 0.05);

    if (!prefersReduced) {
      if (!dragging) {
        rigRotY += velX ? velY : 0.0009;
        velX *= 0.94; velY = 0.0006 + velY * 0.94;
        rigRotX += velX * 0.02;
      } else {
        velX *= 0.9; velY *= 0.9;
      }

      rig.rotation.x += (rigRotX - rig.rotation.x) * 0.08;
      rig.rotation.y += (rigRotY - rig.rotation.y) * 0.08;

      coreOuter.rotation.y += dt * 0.15;
      coreInner.rotation.y -= dt * 0.2;
      coreInner.rotation.x += dt * 0.08;

      nodes.forEach(n => {
        n.angle += dt * n.speed * 0.3;
        n.mesh.position.set(Math.cos(n.angle) * n.radius, 0, Math.sin(n.angle) * n.radius);
        n.mesh.rotation.x += dt * 0.6;
        n.mesh.rotation.y += dt * 0.4;
      });

      stars.rotation.y += dt * 0.01;
    }

    camera.position.x += (targetCamX - camera.position.x) * 0.03;
    camera.position.y += (targetCamY - camera.position.y) * 0.03;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
  }
  animate();

  // ---------- PROJECT CARD 3D TILT ----------
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      if (prefersReduced) return;
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `rotateY(${px * 10}deg) rotateX(${-py * 10}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'rotateY(0deg) rotateX(0deg) translateY(0)';
    });
  });

  // ---------- SKILL CARD SUBTLE TILT ----------
  document.querySelectorAll('.skill-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      if (prefersReduced) return;
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `rotateY(${px * 6}deg) rotateX(${-py * 6}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'rotateY(0deg) rotateX(0deg)';
    });
  });

  // ---------- SCROLL REVEAL ----------
  const revealEls = document.querySelectorAll('section:not(#hero) .section-head, .about-grid, .skill-card, .tl-item, .project-card, .edu-item, .contact-panel');
  revealEls.forEach(el => { el.style.opacity = 0; el.style.transform = 'translateY(24px)'; el.style.transition = 'opacity .7s ease, transform .7s ease'; });
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = 1;
        entry.target.style.transform = 'translateY(0)';
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el => io.observe(el));
  if (prefersReduced) {
    revealEls.forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; });
  }