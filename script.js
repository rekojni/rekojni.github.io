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

    // Contact form handling
    const form = document.querySelector('#contact form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            fetch(form.action, {
                method: 'POST',
                body: new FormData(form),
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => response.json())
            .then(data => {
                alert('Thanks for your message! I will get back to you soon.');
                form.reset();
            })
            .catch(error => {
                alert('Oops! There was a problem submitting your form. Please try again.');
                console.error(error);
            });
        });
    }
});
