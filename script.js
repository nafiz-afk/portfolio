/* =============================================
   NAFIZ ABDULLAH — DATA ENTRY SPECIALIST SCRIPT
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

  // ===== CURSOR =====
  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursorFollower');

  if (cursor && follower && window.innerWidth > 768) {
    let mx = 0, my = 0, fx = 0, fy = 0;
    document.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      cursor.style.left = mx + 'px';
      cursor.style.top = my + 'px';
    });
    function animateFollower() {
      fx += (mx - fx) * 0.12;
      fy += (my - fy) * 0.12;
      follower.style.left = fx + 'px';
      follower.style.top = fy + 'px';
      requestAnimationFrame(animateFollower);
    }
    animateFollower();
    document.querySelectorAll('a, button, .pcard, .acard, .jcard, .scard, .plist-item').forEach(el => {
      el.addEventListener('mouseenter', () => { cursor.classList.add('grow'); follower.classList.add('grow'); });
      el.addEventListener('mouseleave', () => { cursor.classList.remove('grow'); follower.classList.remove('grow'); });
    });
  }

  // ===== LOADER =====
  const loader = document.getElementById('loader');
  setTimeout(() => {
    if (loader) {
      loader.style.opacity = '0';
      setTimeout(() => loader.style.display = 'none', 500);
    }
  }, 1000);

  // ===== NAVBAR SCROLL =====
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
    setActiveNav();
    setActiveMobileNav();
  }, { passive: true });

  // ===== HAMBURGER / DRAWER =====
  const hamburger = document.getElementById('hamburger');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerOverlay = document.getElementById('drawerOverlay');

  function toggleDrawer(open) {
    hamburger.classList.toggle('open', open);
    mobileDrawer.classList.toggle('open', open);
    drawerOverlay.classList.toggle('show', open);
    document.body.style.overflow = open ? 'hidden' : '';
  }

  hamburger.addEventListener('click', () => toggleDrawer(!mobileDrawer.classList.contains('open')));
  drawerOverlay.addEventListener('click', () => toggleDrawer(false));
  document.querySelectorAll('.drawer-link').forEach(l => l.addEventListener('click', () => toggleDrawer(false)));

  // ===== THEME TOGGLE =====
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = document.getElementById('themeIcon');
  const html = document.documentElement;

  const savedTheme = localStorage.getItem('theme') || 'dark';
  html.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  themeToggle.addEventListener('click', () => {
    const isDark = html.getAttribute('data-theme') === 'dark';
    const newTheme = isDark ? 'light' : 'dark';
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
  });

  function updateThemeIcon(theme) {
    if (!themeIcon) return;
    themeIcon.className = theme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
  }

  // ===== TYPED TEXT =====
  const roles = [
    'Advanced Data Entry Specialist',
    'Business Progress Tracker',
    'Lead Generation Expert',
    'Dashboard Designer',
    'Habit Tracker Builder',
    'Accurate. Fast. Reliable.'
  ];
  const typedEl = document.getElementById('typedRole');
  let roleIdx = 0, charIdx = 0, deleting = false, typingTimer;

  function type() {
    if (!typedEl) return;
    const current = roles[roleIdx];
    if (!deleting) {
      typedEl.textContent = current.slice(0, ++charIdx);
      if (charIdx === current.length) { deleting = true; typingTimer = setTimeout(type, 2000); return; }
    } else {
      typedEl.textContent = current.slice(0, --charIdx);
      if (charIdx === 0) { deleting = false; roleIdx = (roleIdx + 1) % roles.length; }
    }
    typingTimer = setTimeout(type, deleting ? 45 : 80);
  }
  setTimeout(type, 500);

  // ===== SMOOTH SCROLL =====
  function smoothScroll(targetId) {
    const el = document.querySelector(targetId);
    if (el) window.scrollTo({ top: el.offsetTop - 80, behavior: 'smooth' });
  }

  document.querySelectorAll('.nav-link, .mbn-link').forEach(link => {
    link.addEventListener('click', e => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) { e.preventDefault(); smoothScroll(href); }
    });
  });

  // ===== ACTIVE NAV =====
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  const mbnLinks = document.querySelectorAll('.mbn-link');

  function setActiveNav() {
    let current = '';
    sections.forEach(s => { if (window.scrollY >= s.offsetTop - 120) current = s.id; });
    navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + current));
  }
  function setActiveMobileNav() {
    let current = '';
    sections.forEach(s => { if (window.scrollY >= s.offsetTop - 120) current = s.id; });
    mbnLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + current));
  }

  // ===== BUTTONS =====
  const aboutMeBtn = document.getElementById('aboutMeBtn');
  const cvBtn = document.getElementById('cvBtn');
  aboutMeBtn?.addEventListener('click', e => { e.preventDefault(); smoothScroll('#about'); });
  cvBtn?.addEventListener('click', e => { e.preventDefault(); window.open('cv.html', '_blank', 'noopener,noreferrer'); });

  // ===== SOCIAL MODAL =====
  const socialLinksBtn = document.getElementById('socialLinksBtn');
  const socialOverlay = document.getElementById('socialOverlay');
  const socialModal = document.getElementById('socialModal');
  const socialClose = document.getElementById('socialClose');

  function toggleSocial(show) {
    socialOverlay.classList.toggle('show', show);
    socialModal.classList.toggle('show', show);
    document.body.style.overflow = show ? 'hidden' : '';
  }

  socialLinksBtn?.addEventListener('click', e => { e.preventDefault(); toggleSocial(true); });
  socialClose?.addEventListener('click', () => toggleSocial(false));
  socialOverlay?.addEventListener('click', () => toggleSocial(false));

  // ===== SCROLL ANIMATIONS =====
  const observerOptions = { threshold: 0.12, rootMargin: '0px 0px -40px 0px' };

  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        if (entry.target.id === 'about') animateSkills();
        sectionObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.section').forEach(el => sectionObserver.observe(el));

  // Cards staggered animation
  const cardObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = parseInt(entry.target.dataset.delay || 0);
        setTimeout(() => entry.target.classList.add('visible'), delay);
        cardObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.acard, .pcard, .jcard, .scard').forEach(el => cardObserver.observe(el));

  // ===== SKILL BARS =====
  function animateSkills() {
    document.querySelectorAll('.skill-fill').forEach((bar, i) => {
      setTimeout(() => { bar.style.width = bar.dataset.width + '%'; }, i * 150);
    });
  }

  // ===== LIGHTBOX =====
  const projectImages = [
    {
      title: 'Sales Dashboard — Excel',
      images: [
        'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=900&q=80',
        'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=900&q=80',
        'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=900&q=80',
      ],
      desc: 'Interactive sales tracking dashboard with KPIs, charts, and regional breakdown'
    },
    {
      title: 'Lead Generation — 500 Verified Leads',
      images: [
        'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=900&q=80',
        'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=900&q=80',
        'https://images.unsplash.com/photo-1532619675605-1ede6c2ed2b0?w=900&q=80',
      ],
      desc: 'B2B lead generation with verified emails, LinkedIn URLs and phone numbers'
    },
    {
      title: 'Habit Tracker — Notion System',
      images: [
        'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=900&q=80',
        'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=900&q=80',
        'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=900&q=80',
      ],
      desc: 'Full Notion habit system with daily check-ins, streaks, and monthly charts'
    },
    {
      title: 'Business Progress Tracker',
      images: [
        'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=900&q=80',
        'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=900&q=80',
        'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=900&q=80',
      ],
      desc: 'Quarterly tracker with revenue, expenses, team targets and milestone tracking'
    },
    {
      title: 'Data Cleaning — 10K Records',
      images: [
        'https://images.unsplash.com/photo-1532619675605-1ede6c2ed2b0?w=900&q=80',
        'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=900&q=80',
        'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=900&q=80',
      ],
      desc: '10,000+ customer records cleaned, standardized, and verified for an e-commerce brand'
    }
  ];

  const lightboxOverlay = document.getElementById('lightboxOverlay');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxDesc = document.getElementById('lightboxDesc');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');
  const lightboxDots = document.getElementById('lightboxDots');

  let currentProject = 0;
  let currentImgIdx = 0;

  function openLightbox(projectIdx) {
    currentProject = projectIdx;
    currentImgIdx = 0;
    showLightboxImg();
    buildDots();
    lightboxOverlay.classList.add('show');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightboxOverlay.classList.remove('show');
    document.body.style.overflow = '';
  }

  function showLightboxImg() {
    const proj = projectImages[currentProject];
    lightboxImg.src = proj.images[currentImgIdx];
    lightboxTitle.textContent = proj.title;
    lightboxDesc.textContent = proj.desc;
    document.querySelectorAll('.lightbox-dot').forEach((d, i) => d.classList.toggle('active', i === currentImgIdx));
  }

  function buildDots() {
    const proj = projectImages[currentProject];
    lightboxDots.innerHTML = proj.images.map((_, i) =>
      `<div class="lightbox-dot${i === 0 ? ' active' : ''}"></div>`
    ).join('');
    lightboxDots.querySelectorAll('.lightbox-dot').forEach((dot, i) => {
      dot.addEventListener('click', () => { currentImgIdx = i; showLightboxImg(); });
    });
  }

  document.querySelectorAll('.view-gallery').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const idx = parseInt(btn.dataset.project);
      openLightbox(idx);
    });
  });

  lightboxClose?.addEventListener('click', closeLightbox);
  lightboxOverlay?.addEventListener('click', e => { if (e.target === lightboxOverlay) closeLightbox(); });

  lightboxNext?.addEventListener('click', () => {
    currentImgIdx = (currentImgIdx + 1) % projectImages[currentProject].images.length;
    showLightboxImg();
  });
  lightboxPrev?.addEventListener('click', () => {
    currentImgIdx = (currentImgIdx - 1 + projectImages[currentProject].images.length) % projectImages[currentProject].images.length;
    showLightboxImg();
  });

  // ===== MUSIC PLAYER =====
  const musicData = [
    { title: 'Golden Brown Instrumental', artist: 'The Stranglers', src: 'music.mp3', image: 'goldenbrown.png', duration: '1:21' },
    { title: 'Fade to Black', artist: 'Metallica', src: 'fadetoblack.mp3', image: 'fadetoblack.png', duration: '4:20' },
    { title: 'Far From Any Road', artist: 'The Handsome Family', src: 'farfromanyroad.mp3', image: 'farfromanyroad.png', duration: '3:55' },
  ];

  const audio = new Audio();
  let currentIdx = 0, isPlaying = false;

  const musicFab = document.getElementById('musicFab');
  const musicPill = document.getElementById('musicPill');
  const musicPanel = document.getElementById('musicPanel');
  const panelClose = document.getElementById('panelClose');
  const pillExpand = document.getElementById('pillExpand');

  const pillPlay = document.getElementById('pillPlay');
  const pillPrev = document.getElementById('pillPrev');
  const pillNext = document.getElementById('pillNext');
  const panelPlay = document.getElementById('panelPlay');
  const panelPrev = document.getElementById('panelPrev');
  const panelNext = document.getElementById('panelNext');

  const pillSong = document.getElementById('pillSong');
  const pillArtist = document.getElementById('pillArtist');
  const pillArt = document.getElementById('pillArt');
  const panelTitle = document.getElementById('panelTitle');
  const panelArtist = document.getElementById('panelArtist');
  const panelArt = document.getElementById('panelArt');

  const panelFill = document.getElementById('panelFill');
  const panelProgressBar = document.getElementById('panelProgressBar');
  const panelCurrent = document.getElementById('panelCurrent');
  const panelTotal = document.getElementById('panelTotal');
  const volSlider = document.getElementById('volSlider');

  audio.volume = 0.4;

  function loadSong(idx) {
    currentIdx = idx;
    const song = musicData[idx];
    audio.src = song.src;
    pillSong.textContent = song.title;
    pillArtist.textContent = song.artist;
    if (song.image && !song.image.includes('undefined')) {
      pillArt.src = song.image;
      panelArt.src = song.image;
    }
    panelTitle.textContent = song.title;
    panelArtist.textContent = song.artist;
    document.querySelectorAll('.plist-item').forEach((item, i) => item.classList.toggle('active', i === idx));
    if (isPlaying) audio.play().catch(() => {});
  }

  function playMusic() {
    audio.play().then(() => {
      isPlaying = true;
      pillPlay.innerHTML = '<i class="fas fa-pause"></i>';
      panelPlay.innerHTML = '<i class="fas fa-pause"></i>';
      musicPill.classList.add('playing');
    }).catch(() => {});
  }

  function pauseMusic() {
    audio.pause(); isPlaying = false;
    pillPlay.innerHTML = '<i class="fas fa-play"></i>';
    panelPlay.innerHTML = '<i class="fas fa-play"></i>';
    musicPill.classList.remove('playing');
  }

  function togglePlay() { isPlaying ? pauseMusic() : playMusic(); }

  function fmtTime(s) {
    if (isNaN(s)) return '0:00';
    return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
  }

  audio.addEventListener('timeupdate', () => {
    if (!audio.duration) return;
    const pct = (audio.currentTime / audio.duration) * 100;
    panelFill.style.width = pct + '%';
    panelCurrent.textContent = fmtTime(audio.currentTime);
  });
  audio.addEventListener('loadedmetadata', () => { panelTotal.textContent = fmtTime(audio.duration); });
  audio.addEventListener('ended', () => { currentIdx = (currentIdx + 1) % musicData.length; loadSong(currentIdx); playMusic(); });

  panelProgressBar?.addEventListener('click', e => { const pct = e.offsetX / panelProgressBar.clientWidth; audio.currentTime = pct * audio.duration; });
  volSlider?.addEventListener('input', () => { audio.volume = volSlider.value / 100; });

  pillPlay?.addEventListener('click', togglePlay);
  panelPlay?.addEventListener('click', togglePlay);
  pillPrev?.addEventListener('click', () => { currentIdx = (currentIdx - 1 + musicData.length) % musicData.length; loadSong(currentIdx); if (isPlaying) playMusic(); });
  pillNext?.addEventListener('click', () => { currentIdx = (currentIdx + 1) % musicData.length; loadSong(currentIdx); if (isPlaying) playMusic(); });
  panelPrev?.addEventListener('click', () => { currentIdx = (currentIdx - 1 + musicData.length) % musicData.length; loadSong(currentIdx); if (isPlaying) playMusic(); });
  panelNext?.addEventListener('click', () => { currentIdx = (currentIdx + 1) % musicData.length; loadSong(currentIdx); if (isPlaying) playMusic(); });

  document.querySelectorAll('.plist-item').forEach((item, i) => {
    item.addEventListener('click', () => { loadSong(i); playMusic(); });
  });

  musicFab?.addEventListener('click', () => {
    musicPill.classList.toggle('visible');
    if (!musicPill.classList.contains('visible')) musicPanel.classList.remove('open');
  });
  pillExpand?.addEventListener('click', () => musicPanel.classList.toggle('open'));
  panelClose?.addEventListener('click', () => musicPanel.classList.remove('open'));

  loadSong(0);

  document.body.addEventListener('click', function firstPlay() {
    if (!isPlaying) playMusic();
    document.body.removeEventListener('click', firstPlay);
  }, { once: true });

  setTimeout(() => musicPill.classList.add('visible'), 2000);

  // ===== KEYBOARD ESC =====
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      toggleSocial(false);
      toggleDrawer(false);
      musicPanel.classList.remove('open');
      closeLightbox();
    }
    if (e.key === 'ArrowRight' && lightboxOverlay.classList.contains('show')) {
      currentImgIdx = (currentImgIdx + 1) % projectImages[currentProject].images.length;
      showLightboxImg();
    }
    if (e.key === 'ArrowLeft' && lightboxOverlay.classList.contains('show')) {
      currentImgIdx = (currentImgIdx - 1 + projectImages[currentProject].images.length) % projectImages[currentProject].images.length;
      showLightboxImg();
    }
  });

  // ===== CONTACT FORM — EMAILJS =====
  const contactForm = document.getElementById('contactForm');
  const submitBtn   = document.getElementById('submitBtn');
  const submitText  = document.getElementById('submitText');
  const formSuccess = document.getElementById('formSuccess');
  const formError   = document.getElementById('formError');

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const name    = document.getElementById('cf_name').value.trim();
      const email   = document.getElementById('cf_email').value.trim();
      const service = document.getElementById('cf_service').value;
      const message = document.getElementById('cf_message').value.trim();

      // Validate service selection
      if (!service) {
        const sel = document.getElementById('cf_service');
        sel.focus();
        sel.style.borderColor = '#ec4899';
        setTimeout(() => sel.style.borderColor = '', 2000);
        return;
      }

      // Loading state
      submitBtn.classList.add('loading');
      submitText.textContent = 'Sending...';
      submitBtn.querySelector('i').className = 'fas fa-spinner fa-spin';
      formSuccess.style.display = 'none';
      formError.style.display   = 'none';

      // EmailJS — replace SERVICE_ID and TEMPLATE_ID with yours
      emailjs.send('service_qh4ecsd', 'template_4qjqvjl', {
        from_name:    name,
        from_email:   email,
        service_type: service,
        message:      message,
        to_email:     'imtasirabd@gmail.com'
      }).then(() => {
        formSuccess.style.display = 'flex';
        contactForm.reset();
        formSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }).catch(() => {
        formError.style.display = 'flex';
      }).finally(() => {
        submitBtn.classList.remove('loading');
        submitText.textContent = 'Send Message';
        submitBtn.querySelector('i').className = 'fas fa-paper-plane';
      });
    });
  }

  // ===== INIT =====
  setActiveNav();
  setActiveMobileNav();
  navbar.classList.toggle('scrolled', window.scrollY > 20);
});
