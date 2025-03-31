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

    // Back to Top Button Logic
    const backToTopButton = document.getElementById('back-to-top-btn');
    const scrollThreshold = 200; // Pixels scrolled before button appears

    if (backToTopButton) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > scrollThreshold || document.documentElement.scrollTop > scrollThreshold) {
                backToTopButton.classList.add('show');
            } else {
                backToTopButton.classList.remove('show');
            }
        });

        backToTopButton.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Contact form handling with integrated feedback
    const form = document.getElementById('contactForm'); 
    const formFeedback = document.getElementById('form-feedback');

    if (form && formFeedback) { 
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            formFeedback.innerHTML = ''; 
            const submitButton = form.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.innerHTML;
            submitButton.disabled = true;
            submitButton.innerHTML = 'Sending...'; 

            fetch(form.action, {
                method: 'POST',
                body: new FormData(form),
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                if (response.ok) {
                    formFeedback.innerHTML = `<div class="alert alert-success alert-dismissible fade show" role="alert">Thanks for your message! I will get back to you soon.<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>`;
                    form.reset();
                } else {
                    response.json().then(data => {
                        let errorMessage = 'Oops! There was a problem submitting your form.';
                        if (data && data.errors) {
                            errorMessage += ` Error: ${data.errors.map(e => e.message).join(', ')}`;
                        }
                        formFeedback.innerHTML = `<div class="alert alert-danger alert-dismissible fade show" role="alert">${errorMessage}<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>`;
                    }).catch(() => {
                        formFeedback.innerHTML = `<div class="alert alert-danger alert-dismissible fade show" role="alert">Oops! An unknown error occurred. Please try again.<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>`;
                    });
                }
            })
            .catch(error => {
                console.error('Form submission network error:', error);
                formFeedback.innerHTML = `<div class="alert alert-danger alert-dismissible fade show" role="alert">Oops! A network error occurred. Please check your connection and try again.<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>`;
            })
            .finally(() => {
                 submitButton.disabled = false; 
                 submitButton.innerHTML = originalButtonText; 
            });
        });
    }
});
