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


/* ---------------fancybox js ----------------*/

document.addEventListener("DOMContentLoaded", function() {
  // Bind Fancybox to any element with data-fancybox="gallery"
  Fancybox.bind('[data-fancybox="gallery"]', {
    // Optional custom settings:
    Toolbar: {
      display: {
        left: ["infobar"],
        middle: ["zoomIn", "zoomOut", "fullscreen"],
        right: ["close"]
      }
    },
    
    // Example: set a default aspect ratio for iframes
    Html: {
      video: {
        autoplay: true,
        allowfullscreen: "true"
      }
    }
  });
});


});

// 1) Grab the "open" link element from the page
const openPopupLink = document.getElementById('open-popup');

// 2) On click, load the snippet + show the popup
openPopupLink.addEventListener('click', function(event) {
  event.preventDefault(); // stop the link from navigating anywhere

  // If we haven't already loaded the popup snippet, load it
  // Alternatively, if you want to load fresh each time, you can just always fetch it.
  if (!document.getElementById('popup-overlay')) {
    loadPopupSnippet().then(() => {
      showPopup();
    });
  } else {
    // If the snippet is already loaded, just show it
    showPopup();
  }
});

// This function fetches the HTML snippet and injects it into #popup-container
function loadPopupSnippet() {
  return fetch('contact-form_modal.html')
    .then(response => response.text())
    .then(html => {
      // Insert the snippet into #popup-container
      document.getElementById('popup-container').innerHTML = html;

      // Now that the snippet is in the DOM, attach the event listeners 
      // to the close button and overlay
      attachPopupEventListeners();
    })
    .catch(error => {
      console.error('Error loading popup snippet:', error);
    });
}

function attachPopupEventListeners() {
  // Grab the newly added elements
  const popupOverlay = document.getElementById('popup-overlay');
  const closePopup = document.getElementById('close-popup');

  // Close button
  closePopup.addEventListener('click', function() {
    hidePopup();
  });

  // Click outside the popup-content
  popupOverlay.addEventListener('click', function(e) {
    if (e.target === popupOverlay) {
      hidePopup();
    }
  });
}

function showPopup() {
  // Add the "active" class to display the overlay
  const popupOverlay = document.getElementById('popup-overlay');
  if (popupOverlay) {
    popupOverlay.classList.add('active');
  }
}

function hidePopup() {
  // Remove the "active" class
  const popupOverlay = document.getElementById('popup-overlay');
  if (popupOverlay) {
    popupOverlay.classList.remove('active');
  }
}