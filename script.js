document.addEventListener('DOMContentLoaded', function() {
    // Target the element where the dynamic title will be displayed
    const dynamicTitleElement = document.getElementById('dynamic-title');
    
    // Check if the element exists before proceeding
    if (dynamicTitleElement) {
        // Array of titles to cycle through
        const titles = [
            'Strategic Business Planning',
            'Digital Business Professional',
            'Banking Specialist',
            'Process Optimization Expert'
        ];
        
        // State variables for the typing animation
        let currentTitleIndex = 0; // Index of the current title in the array
        let isDeleting = false;    // Flag to indicate if currently deleting text
        let typingSpeed = 100;     // Speed of typing characters (ms)
        let deletingSpeed = 50;    // Speed of deleting characters (ms) - often faster
        let pauseDuration = 1800;  // Pause duration after a title is fully typed (ms)
        let nextWordDelay = 500;   // Small delay before starting to type the next word (ms)

        // The main function to handle the typing animation logic
        function typeTitle() {
            // Get the full text of the current title
            const currentTitle = titles[currentTitleIndex];
            // Get the currently displayed text length
            const currentLength = dynamicTitleElement.textContent.length;
            // Determine the timeout duration for the next step
            let timeoutSpeed;

            if (isDeleting) {
                // --- Deleting Logic ---
                // Remove the last character
                dynamicTitleElement.textContent = currentTitle.slice(0, currentLength - 1);
                // Set the speed for the next deletion step
                timeoutSpeed = deletingSpeed;

                // Check if deletion is complete
                if (dynamicTitleElement.textContent === '') {
                    // Finished deleting this title
                    isDeleting = false; // Switch state to typing
                    currentTitleIndex = (currentTitleIndex + 1) % titles.length; // Move to the next title index
                    timeoutSpeed = nextWordDelay; // Add a small delay before typing the new title
                }
            } else {
                // --- Typing Logic ---
                // Add the next character
                dynamicTitleElement.textContent = currentTitle.slice(0, currentLength + 1);
                // Set the speed for the next typing step
                timeoutSpeed = typingSpeed;

                // Check if typing is complete for the current title
                if (dynamicTitleElement.textContent === currentTitle) {
                    // Finished typing this title
                    isDeleting = true; // Switch state to deleting
                    timeoutSpeed = pauseDuration; // Pause before starting to delete
                }
            }

            // Schedule the next call to this function after the calculated timeout
            setTimeout(typeTitle, timeoutSpeed);
        }

        // Start the typing animation
        typeTitle();
    } // End if(dynamicTitleElement)

    // Smooth scrolling for navigation links
    const navbar = document.querySelector('.navbar.fixed-top'); // Get the navbar element
    const navbarHeight = navbar ? navbar.offsetHeight : 0; // Get its height, default to 0 if not found
    const navbarNav = document.getElementById('navbarNav'); // Get the collapsible element

    // Function to handle the scroll calculation and execution
    function scrollToSection(targetId) {
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
            const targetPosition = targetSection.offsetTop - navbarHeight;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    }

    document.querySelectorAll('a.nav-link').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);

            // Check if the click is inside the open mobile menu
            const isMobileMenuOpen = navbarNav && navbarNav.classList.contains('show');
            const isInsideMobileMenu = navbarNav && navbarNav.contains(this);

            if (isMobileMenuOpen && isInsideMobileMenu) {
                // If mobile menu is open, hide it first, then scroll after a delay
                const collapseInstance = bootstrap.Collapse.getInstance(navbarNav);
                if (collapseInstance) {
                    collapseInstance.hide();
                    // Wait for collapse animation (approx 350ms) + small buffer
                    setTimeout(() => {
                        scrollToSection(targetId);
                    }, 360); 
                } else {
                     // Fallback if instance not found, scroll immediately (less ideal)
                     scrollToSection(targetId); 
                }
            } else {
                // If not mobile menu or menu closed, scroll immediately
                 scrollToSection(targetId);
            }
        });
    });

    // Contact form handling
    const form = document.getElementById('contactForm'); // Use getElementById for better performance
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
            .then(response => {
                // Check if the response indicates success (Formspree might return ok: true)
                if (response.ok) {
                    // Display a success message (consider using a less intrusive method than alert)
                    alert('Thanks for your message! I will get back to you soon.'); 
                    form.reset(); // Reset the form fields
                } else {
                    // Handle potential errors from the server side
                    response.json().then(data => {
                        // Log the error data if available
                        console.error('Form submission error:', data);
                        alert('Oops! There was a problem submitting your form. Please try again.');
                    }).catch(error => {
                        // Handle cases where the response is not JSON
                        console.error('Form submission error, non-JSON response:', error);
                        alert('Oops! There was a problem submitting your form. Please try again.');
                    });
                }
            })
            .catch(error => {
                // Handle network errors
                console.error('Network error during form submission:', error);
                alert('Oops! There was a network problem submitting your form. Please check your connection and try again.');
            });
        });
    } // End if(form)

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

    // Handle initial scroll adjustment if page loads with a hash
    if (window.location.hash) {
        // Use a minimal timeout to ensure layout is stable before calculating offsetTop
        setTimeout(() => {
            const hash = window.location.hash.substring(1);
            const targetElement = document.getElementById(hash);
            if (targetElement) {
                const navbar = document.querySelector('.navbar.fixed-top'); // Need navbar height here too
                const navbarHeight = navbar ? navbar.offsetHeight : 0;
                const targetPosition = targetElement.offsetTop - navbarHeight;
                
                // Temporarily disable smooth scrolling for instant jump
                document.documentElement.style.scrollBehavior = 'auto';
                
                window.scrollTo({ top: targetPosition, behavior: 'auto' }); // Use 'auto' for instant scroll
                
                // Restore default scroll behavior (allows CSS to take over again)
                document.documentElement.style.scrollBehavior = ''; 
            }
        }, 10); // 10ms delay usually sufficient
    }
});
