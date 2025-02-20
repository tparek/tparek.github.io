// We wrap almost everything inside DOMContentLoaded to ensure the elements are available
document.addEventListener('DOMContentLoaded', () => {
  // ----- MOBILE MENU TOGGLING -----
  const menu = document.querySelector('#mobile-menu');
  const menuLinks = document.querySelector('.navbar__menu');

  if (menu && menuLinks) {
    menu.addEventListener('click', function () {
      menu.classList.toggle('is-active');
      menuLinks.classList.toggle('active');
    });
  }

  // ----- SECTION ELEMENTS -----
  const portfolioSection = document.getElementById('portfolio-section');
  const videosSection = document.getElementById('videos-section');

  // ----- GALLERY CARDS -----
  const videosCard = document.getElementById('videos-card'); // 'Videos' card on the main gallery
  const backButton = document.getElementById('back-to-portfolio'); // The back button on the Videos section
  const openVideos = document.getElementById('videonav'); // The "Video" link in the navbar

  // ----- HELPER FUNCTIONS -----
  function showVideos() {
    // Hide the portfolio section, show the videos section
    if (portfolioSection) portfolioSection.style.display = 'none';
    if (videosSection) videosSection.style.display = 'flex';
  }

  function showPortfolio() {
    // Hide the videos section, show the portfolio section
    if (videosSection) videosSection.style.display = 'none';
    if (portfolioSection) portfolioSection.style.display = 'flex';
  }

  // ----- EVENT LISTENERS -----

  // 1. Clicking the "Videos" card in the main gallery
  if (videosCard) {
    videosCard.addEventListener('click', () => {
      showVideos();
      // Smoothly scroll to the videos section
      videosSection?.scrollIntoView({ behavior: 'smooth' });
    });
  }

  // 2. Clicking the "Back to portfolio" button in the videos section
  if (backButton) {
    backButton.addEventListener('click', showPortfolio);
  }

  // 3. Clicking the "Video" link in the navbar
  if (openVideos) {
    openVideos.addEventListener('click', (event) => {
      event.preventDefault();
      // Check if we're already on index.html (or root "/")
      if (
        window.location.pathname.includes('index.html') ||
        window.location.pathname === '/'
      ) {
        // Just show and scroll
        showVideos();
        videosSection?.scrollIntoView({ behavior: 'smooth' });
      } else {
        // Redirect to index.html with a query parameter
        window.location.href = 'index.html?show=videos';
      }
    });
  }

  // ----- AUTO-SCROLL IF "?show=videos" -----
  // If user just arrived at index.html?show=videos from another page,
  // show the videos section and scroll into view.
  const urlParams = new URLSearchParams(window.location.search);
  const showType = urlParams.get('show');
  if (showType === 'videos') {
    showVideos();
    videosSection?.scrollIntoView({ behavior: 'smooth' });
  } else if (showType === 'portfolio') {
    showPortfolio();
    portfolioSection?.scrollIntoView({ behavior: 'smooth' });
  }

  // ----- GALLERY / VIDEO CARDS NAVIGATION -----
  // (Opens new pages based on data-link attributes)
  document.querySelectorAll('.gallery__card').forEach((card) => {
    card.addEventListener('click', () => {
      const link = card.getAttribute('data-link');
      if (link) {
        window.location.href = link;
      }
    });
  });

  document.querySelectorAll('.video__card').forEach((card) => {
    card.addEventListener('click', () => {
      const link = card.getAttribute('data-link');
      if (link) {
        window.location.href = link;
      }
    });
  });

  // ----- UNIVERSAL BACK BUTTON (ABOUT, PHOTOS, FICTION, ETC.) -----
  // We use a data attribute to decide if we go to index.html?show=videos
  // or just do history.back().
  const backButtonEl = document.getElementById('backButton');
  if (backButtonEl) {
    backButtonEl.addEventListener('click', () => {
      const backType = backButtonEl.getAttribute('data-back');
      if (backType === 'videos') {
        // e.g. fiction.html has data-back="videos"
        window.location.href = 'index.html?show=videos';
      } 
      else if (backType === 'portfolio') {
        // e.g., Photos page: go directly to the main gallery on index.html
        window.location.href = 'index.html?show=portfolio';
      }else {
        // otherwise do normal history back
         window.location.href = 'index.html';
      }
    });
  }
});