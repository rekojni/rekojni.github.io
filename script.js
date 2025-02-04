document.addEventListener('DOMContentLoaded', function() {
    // Dynamic title typing effect
    const titles = [
        'Strategic Business Planning',
        'Digital Business Professional',
        'Banking Specialist',
        'Process Optimization Expert'
    ];
    const dynamicTitleElement = document.getElementById('dynamic-title');
    let currentTitleIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;
    let pauseDuration = 2000;

    function typeTitle() {
        const currentTitle = titles[currentTitleIndex];
        let displayText = isDeleting 
            ? currentTitle.slice(0, dynamicTitleElement.textContent.length - 1)
            : currentTitle.slice(0, dynamicTitleElement.textContent.length + 1);
        
        dynamicTitleElement.textContent = displayText;

        if (!isDeleting && displayText === currentTitle) {
            setTimeout(() => { isDeleting = true; }, pauseDuration);
        } else if (isDeleting && displayText === '') {
            isDeleting = false;
            currentTitleIndex = (currentTitleIndex + 1) % titles.length;
        }

        setTimeout(typeTitle, isDeleting ? typingSpeed / 2 : typingSpeed);
    }

    typeTitle();

    // Smooth scrolling for navigation links
    document.querySelectorAll('a.nav-link').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            targetSection.scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Form submission (placeholder - replace with actual form handling)
    const contactForm = document.querySelector('#contact form');
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Thank you for your message! I will get back to you soon.');
        contactForm.reset();
    });
});
