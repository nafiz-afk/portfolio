
(function () {
  'use strict';

  /* ── JSONBin Config ── */
  const MASTER_KEY = '$2a$10$b72x0QYAZTPMlHw/3Ke97etfjQ9tKdozhwFRXcmmQJHBI4nhsW5Pa';
  const ACCESS_KEY = '$2a$10$H9.W/ygR1TQboBvsWnQ7.eCzBFGKxZ2LqotehC2tg2Ky1djhIPive';
  const BIN_ID = '69ee3e60aaba8821973d33da'; 
  const API = `https://api.jsonbin.io/v3/b/${BIN_ID}`;

  /* ── State ── */
  let allRatings = [];
  let selectedStar = 0;
  let isSubmitting = false;

  /* ── DOM refs ── */
  const $ = id => document.getElementById(id);

  /* ════════════════════════════════════════
     JSONBIN HELPERS
  ════════════════════════════════════════ */
  async function fetchRatings() {
    try {
      const res = await fetch(API + '/latest', {
        headers: {
          'X-Master-Key': MASTER_KEY,
          'X-Access-Key': ACCESS_KEY
        }
      });
      if (!res.ok) throw new Error('fetch failed');
      const json = await res.json();
      return json.record.ratings || [];
    } catch (e) {
      console.warn('Rating fetch error:', e);
      return [];
    }
  }

  async function saveRatings(ratings) {
    const res = await fetch(API, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Master-Key': MASTER_KEY,
        'X-Access-Key': ACCESS_KEY
      },
      body: JSON.stringify({ ratings })
    });
    if (!res.ok) throw new Error('save failed');
    return res.json();
  }

  /* ════════════════════════════════════════
     STAR HELPERS
  ════════════════════════════════════════ */
  function renderStarHTML(avg, cls = 'rb-star') {
    let html = '';
    for (let i = 1; i <= 5; i++) {
      if (avg >= i)       html += `<i class="fas fa-star ${cls}"></i>`;
      else if (avg >= i - 0.5) html += `<i class="fas fa-star-half-stroke ${cls}"></i>`;
      else                html += `<i class="far fa-star ${cls}" style="opacity:.3"></i>`;
    }
    return html;
  }

  function calcStats(ratings) {
    if (!ratings.length) return { avg: 0, count: 0, breakdown: [0,0,0,0,0] };
    const breakdown = [0,0,0,0,0];
    let sum = 0;
    ratings.forEach(r => { sum += r.stars; breakdown[r.stars - 1]++; });
    return { avg: sum / ratings.length, count: ratings.length, breakdown };
  }

  /* ════════════════════════════════════════
     UPDATE ALL UI ELEMENTS
  ════════════════════════════════════════ */
  function updateAllUI(ratings) {
    allRatings = ratings;
    const stats = calcStats(ratings);
    const avgStr = stats.count ? stats.avg.toFixed(1) : '–';

    /* Banner */
    const bannerStars = $('bannerStars');
    const bannerAvg   = $('bannerAvg');
    const bannerCount = $('bannerCount');
    if (bannerStars) bannerStars.innerHTML = stats.count ? renderStarHTML(stats.avg) : '<i class="far fa-star rb-star" style="opacity:.3"></i>'.repeat(5);
    if (bannerAvg)   bannerAvg.textContent = avgStr;
    if (bannerCount) bannerCount.textContent = stats.count ? `${stats.count} review${stats.count !== 1 ? 's' : ''}` : 'No reviews yet';

    /* About section mini preview */
    const arpStars = $('arpStars');
    const arpAvg   = $('arpAvg');
    const arpCount = $('arpCount');
    if (arpStars) arpStars.innerHTML = stats.count ? renderStarHTML(stats.avg, 'a-star') : '';
    if (arpAvg)   arpAvg.textContent = stats.count ? avgStr : '';
    if (arpCount) arpCount.textContent = stats.count ? `${stats.count} client${stats.count !== 1 ? 's' : ''} rated` : 'Be the first to rate!';

    /* Show rating summary */
    updateShowRatingUI(ratings, stats, avgStr);
  }

  function updateShowRatingUI(ratings, stats, avgStr) {
    const summaryAvg  = $('summaryAvg');
    const summaryStars = $('summaryStars');
    const summaryTotal = $('summaryTotal');
    const breakdown   = $('summaryBreakdown');
    const reviewsList = $('reviewsList');

    if (summaryAvg)   summaryAvg.textContent = avgStr;
    if (summaryStars) summaryStars.innerHTML = renderStarHTML(stats.avg || 0, 's-star');
    if (summaryTotal) summaryTotal.textContent = `${stats.count} review${stats.count !== 1 ? 's' : ''}`;

    /* Breakdown bars */
    if (breakdown) {
      breakdown.innerHTML = '';
      for (let i = 5; i >= 1; i--) {
        const cnt  = stats.breakdown[i - 1];
        const pct  = stats.count ? (cnt / stats.count * 100) : 0;
        breakdown.innerHTML += `
          <div class="breakdown-row">
            <span class="breakdown-label">${i} <i class="fas fa-star" style="font-size:.6rem;color:#f59e0b"></i></span>
            <div class="breakdown-bar-track">
              <div class="breakdown-bar-fill" style="width:${pct}%"></div>
            </div>
            <span class="breakdown-count">${cnt}</span>
          </div>`;
      }
    }

    /* Reviews list */
    if (reviewsList) {
      if (!ratings.length) {
        reviewsList.innerHTML = '<div class="no-reviews-msg">✨ No reviews yet. Be the first!</div>';
        return;
      }
      const sorted = [...ratings].sort((a, b) => b.ts - a.ts);
      reviewsList.innerHTML = sorted.map((r, idx) => {
        const name   = r.name && r.name.trim() ? r.name.trim() : 'Unlisted User';
        const initials = name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
        const stars  = '<i class="fas fa-star r-star"></i>'.repeat(r.stars) +
                       '<i class="far fa-star r-star" style="opacity:.3"></i>'.repeat(5 - r.stars);
        const date   = new Date(r.ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        const desc   = r.desc ? `<p class="review-text">"${r.desc}"</p>` : '';
        return `
          <div class="review-item" style="animation-delay:${idx * 0.05}s">
            <div class="review-item-header">
              <div class="review-avatar">${initials}</div>
              <span class="review-name">${name}</span>
              <div class="review-stars-row">${stars}</div>
            </div>
            <span class="review-date">${date}</span>
            ${desc}
          </div>`;
      }).join('');
    }
  }

  /* ════════════════════════════════════════
     POPUP OPEN / CLOSE
  ════════════════════════════════════════ */
  function openGiveRating() {
    $('giveRatingOverlay').classList.add('active');
    $('giveRatingPopup').classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  function closeGiveRating() {
    $('giveRatingOverlay').classList.remove('active');
    $('giveRatingPopup').classList.remove('active');
    document.body.style.overflow = '';
  }
  function openShowRating() {
    $('giveRatingOverlay').classList.add('active'); /* reuse same overlay */
    $('showRatingPopup').classList.add('active');
    document.body.style.overflow = 'hidden';
    /* Refresh data every time it opens */
    fetchRatings().then(updateAllUI);
  }
  function closeShowRating() {
    $('giveRatingOverlay').classList.remove('active');
    $('showRatingPopup').classList.remove('active');
    document.body.style.overflow = '';
  }

  /* ════════════════════════════════════════
     STAR SELECTOR INTERACTION
  ════════════════════════════════════════ */
  function initStarSelector() {
    const btns = document.querySelectorAll('.star-btn');
    btns.forEach(btn => {
      btn.addEventListener('mouseover', () => {
        const val = +btn.dataset.val;
        btns.forEach(b => b.classList.toggle('hovered', +b.dataset.val <= val));
      });
      btn.addEventListener('mouseleave', () => {
        btns.forEach(b => b.classList.remove('hovered'));
      });
      btn.addEventListener('click', () => {
        selectedStar = +btn.dataset.val;
        btns.forEach(b => {
          b.classList.toggle('selected', +b.dataset.val <= selectedStar);
          b.classList.remove('hovered');
        });
        $('submitRatingBtn').disabled = false;
      });
    });
  }

  /* ════════════════════════════════════════
     SUBMIT RATING
  ════════════════════════════════════════ */
  async function handleSubmitRating() {
    if (!selectedStar || isSubmitting) return;
    isSubmitting = true;

    const btn      = $('submitRatingBtn');
    const feedback = $('ratingFeedback');
    const name     = $('raterName').value.trim();
    const desc     = $('ratingDesc').value.trim();

    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
    btn.disabled  = true;
    feedback.textContent = '';
    feedback.className   = 'rating-feedback';

    try {
      if (BIN_ID === 'YOUR_BIN_ID_HERE') throw new Error('BIN_ID not set');

      const current = await fetchRatings();
      const newEntry = { stars: selectedStar, name: name || '', desc: desc || '', ts: Date.now() };
      const updated  = [...current, newEntry];
      await saveRatings(updated);
      updateAllUI(updated);

      feedback.textContent = '✅ Thank you! Your rating has been saved.';
      feedback.className   = 'rating-feedback success';

      /* Reset form after 1.8s */
      setTimeout(() => {
        closeGiveRating();
        selectedStar = 0;
        document.querySelectorAll('.star-btn').forEach(b => b.classList.remove('selected', 'hovered'));
        $('raterName').value  = '';
        $('ratingDesc').value = '';
        $('charCount').textContent = '0/300';
        btn.innerHTML = '<i class="fas fa-paper-plane"></i> Submit Rating';
        btn.disabled  = true;
        feedback.textContent = '';
        isSubmitting  = false;
      }, 1800);

    } catch (err) {
      console.error(err);
      const isBinErr = BIN_ID === 'YOUR_BIN_ID_HERE';
      feedback.textContent = isBinErr
        ? '⚠️ Setup needed: Replace BIN_ID in rating.js with your JSONBin bin ID.'
        : '❌ Could not save. Check your internet connection.';
      feedback.className = 'rating-feedback error';
      btn.innerHTML = '<i class="fas fa-paper-plane"></i> Submit Rating';
      btn.disabled  = false;
      isSubmitting  = false;
    }
  }

  /* ════════════════════════════════════════
     CHARACTER COUNT
  ════════════════════════════════════════ */
  function initCharCount() {
    const ta = $('ratingDesc');
    const cc = $('charCount');
    if (!ta || !cc) return;
    ta.addEventListener('input', () => {
      cc.textContent = `${ta.value.length}/300`;
    });
  }

  /* ════════════════════════════════════════
     WIRE UP ALL TRIGGERS
  ════════════════════════════════════════ */
  function wireEvents() {
    /* Give rating buttons (multiple exist) */
    document.querySelectorAll('.give-rating-trigger').forEach(btn => {
      btn.addEventListener('click', () => { closeShowRating(); openGiveRating(); });
    });
    /* Show rating buttons */
    document.querySelectorAll('.show-rating-trigger').forEach(btn => {
      btn.addEventListener('click', openShowRating);
    });

    /* Close buttons */
    const cgr = $('closeGiveRating');
    const csr = $('closeShowRating');
    if (cgr) cgr.addEventListener('click', closeGiveRating);
    if (csr) csr.addEventListener('click', closeShowRating);

    /* Overlay click closes both */
    const overlay = $('giveRatingOverlay');
    if (overlay) overlay.addEventListener('click', () => {
      closeGiveRating();
      closeShowRating();
    });

    /* Submit */
    const subBtn = $('submitRatingBtn');
    if (subBtn) subBtn.addEventListener('click', handleSubmitRating);
  }

  /* ════════════════════════════════════════
     AUTO-REFRESH (every 60 seconds)
  ════════════════════════════════════════ */
  function startAutoRefresh() {
    setInterval(async () => {
      const ratings = await fetchRatings();
      updateAllUI(ratings);
    }, 40000);
  }

  /* ════════════════════════════════════════
     INIT
  ════════════════════════════════════════ */
  async function init() {
    initStarSelector();
    initCharCount();
    wireEvents();

    /* Load initial data */
    const ratings = await fetchRatings();
    updateAllUI(ratings);
    startAutoRefresh();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
