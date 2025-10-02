// ------------------------------
// Reset pages on load (all turned, so it shows last page first)
// ------------------------------
const rightPages = Array.from(document.querySelectorAll('.book-page.page-right'));
rightPages.forEach(p => {
  p.classList.add('turn'); // start with all flipped -> last page visible
  p.style.zIndex = 1000;   // keep them on top initially
});

// ------------------------------
// Manual navigation
// ------------------------------
const navButtons = document.querySelectorAll('.nextprev-btn');
const coverRight = document.querySelector('.cover.cover-right');
const contactBtn = document.querySelector('.btn.contact-me');
const cvBtn = document.querySelector('.btn.download-cv');
const backProfileBtn = document.querySelector('.back-profile');

rightPages.forEach((p, idx) => (p.dataset.autoIndex = idx));

navButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    cancelAutoFlip();
    const pageId = btn.getAttribute('data-page');
    const page = document.getElementById(pageId);
    if (!page) return;

    const idx = Number(page.dataset.autoIndex || 0);
    if (btn.classList.contains('back')) {
      page.classList.remove('turn');
      setTimeout(() => {
        page.style.zIndex = 100 - idx;
      }, 1100);
    } else {
      page.classList.add('turn');
      page.style.zIndex = 1000 + idx;
    }
  });
});

// ------------------------------
// Contact Me button -> WhatsApp
// ------------------------------
if (contactBtn) {
  contactBtn.addEventListener('click', (e) => {
    e.preventDefault(); // stop reload
    cancelAutoFlip();

    // Open WhatsApp chat
    window.open("https://wa.me/918307162706", "_blank"); // <-- put your number here
  });
}

// ------------------------------
// Download CV button
// ------------------------------
if (cvBtn) {
  cvBtn.addEventListener('click', (e) => {
    e.preventDefault(); // stop reload
    cancelAutoFlip();

    // Open CV file in new tab
    window.open("assets/Vikas_CV.pdf", "_blank"); // <-- update path if needed
  });
}

if (backProfileBtn) {
  backProfileBtn.addEventListener('click', () => {
    cancelAutoFlip();
    [...rightPages].reverse().forEach((p, i) => {
      setTimeout(() => {
        p.classList.remove('turn');
        setTimeout(() => {
          const idx = Number(p.dataset.autoIndex || 0);
          p.style.zIndex = 100 - idx;
        }, 1100);
      }, (i + 1) * 300);
    });
  });
};

// ------------------------------
// Auto-flip (backward only, from last → first once)
// ------------------------------
let __autoFlipTimers = [];
let __autoFlipRunning = false;
let __autoFlipStarted = false;

function schedule(fn, delay) {
  const id = setTimeout(fn, delay);
  __autoFlipTimers.push(id);
}
function clearAllAutoTimers() {
  __autoFlipTimers.forEach(id => clearTimeout(id));
  __autoFlipTimers = [];
}
function cancelAutoFlip() {
  if (!__autoFlipRunning) return;
  clearAllAutoTimers();
  __autoFlipRunning = false;
  __autoFlipStarted = true;
}

// timings
const COVER_DELAY = 1500;
const PER_PAGE_MS = 1500;
const TRANSITION_MS = 1000;
const Z_BACK_BASE = 100;

if (coverRight && rightPages.length > 0) {
  if (!__autoFlipStarted) {
    __autoFlipStarted = true;
    __autoFlipRunning = true;

    // open cover first
    schedule(() => {
      coverRight.classList.add('turn');
      schedule(() => {
        coverRight.style.zIndex = -1;
      }, TRANSITION_MS);

      // flip back through pages in reverse order
      [...rightPages].reverse().forEach((page, rIdx) => {
        schedule(() => {
          page.classList.remove('turn');
          setTimeout(() => {
            const idx = Number(page.dataset.autoIndex || 0);
            page.style.zIndex = Z_BACK_BASE - idx;
          }, TRANSITION_MS + 50);
        }, (rIdx + 1) * PER_PAGE_MS);
      });

      // finish
      schedule(() => {
        __autoFlipRunning = false;
        clearAllAutoTimers();
      }, (rightPages.length + 1) * PER_PAGE_MS);

    }, COVER_DELAY);
  }
}
