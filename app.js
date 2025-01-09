const menu = document.querySelector('#mobile-menu')
const menuLinks = document.querySelector('.navbar__menu')

menu.addEventListener('click', function(){
    menu.classList.toggle('is-active');
    menuLinks.classList.toggle('active');
});

document.addEventListener('DOMContentLoaded', () => {
    const portfolioSection = document.getElementById('portfolio-section');
    const videosSection = document.getElementById('videos-section');
    const videosCard = document.getElementById('videos-card');
    const backButton = document.getElementById('back-to-portfolio');

    function showVideos() {
        portfolioSection.style.display = 'none';
        videosSection.style.display = 'flex';
    }

    function showPortfolio() {
        videosSection.style.display = 'none';
        portfolioSection.style.display = 'flex';
    }

    videosCard.addEventListener('click', showVideos);
    backButton.addEventListener('click', showPortfolio);
    
});