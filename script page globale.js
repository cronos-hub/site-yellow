
const navLinks = document.querySelectorAll('.nav-links a');
const navDescription = document.getElementById('nav-description');

navLinks.forEach(link => {
    link.addEventListener('mouseover', () => {
      
        navDescription.textContent = link.getAttribute('data-description');
        navDescription.style.opacity = '1';
        navDescription.style.visibility = 'visible';
    });

    link.addEventListener('mouseout', () => {
       
        navDescription.textContent = '';
        navDescription.style.opacity = '0';
        navDescription.style.visibility = 'hidden';
    });
});