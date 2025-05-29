document.addEventListener("DOMContentLoaded", function () {
    // Theme switcher
    const themeToggle = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;

    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme') || 'light';
    htmlElement.setAttribute('data-theme', savedTheme);
    themeToggle.checked = savedTheme === 'dark';

    // Theme toggle handler
    themeToggle.addEventListener('change', () => {
        const newTheme = themeToggle.checked ? 'dark' : 'light';
        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });

    // Section switching function
    function switchSection(targetId) {
        // Hide all sections
        document.querySelectorAll(".content-section").forEach(section => {
            section.classList.remove("active");
        });

        // Show target section
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
            targetSection.classList.add("active");
        }

        // Update nav links
        document.querySelectorAll(".nav-links li").forEach(link => {
            link.classList.remove("active");
            if (link.getAttribute("data-target") === targetId) {
                link.classList.add("active");
            }
        });

        // Scroll to section
        targetSection.scrollIntoView({ behavior: "smooth" });
    }

    // Navigation
    const navLinks = document.querySelectorAll('.nav-links li');
    const sections = document.querySelectorAll('.content-section');

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            const target = link.getAttribute('data-target');
            switchSection(target);
        });
    });

    // Hero CTA Buttons
    const ctaButtons = document.querySelectorAll('.hero-cta a');
    ctaButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const target = button.getAttribute('href').replace('#', '');
            switchSection(target);
        });
    });

    // Initialize AOS
    AOS.init({
        duration: 800,
        once: true,
        offset: 100
    });

    // Enhanced GitHub Projects with loading state
    async function fetchGitHubProjects() {
        const username = 'Kushanware';
        const container = document.getElementById('projects-container');
        
        try {
            container.innerHTML = `
                <div class="loading-message">
                    <i class="fas fa-spinner fa-spin"></i>
                    <p>Loading projects...</p>
                </div>
            `;

            const response = await fetch(`https://api.github.com/users/${username}/repos`);
            const projects = await response.json();
            
            if (Array.isArray(projects)) {
                container.innerHTML = projects
                    .filter(project => !project.fork)
                    .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
                    .map(project => `
                        <div class="project-card" data-aos="fade-up">
                            <div class="project-content">
                                <div class="project-header">
                                    <h3 class="project-title">
                                        <a href="${project.html_url}" target="_blank" rel="noopener noreferrer">
                                            ${project.name}
                                            <i class="fas fa-external-link-alt"></i>
                                        </a>
                                    </h3>
                                    <div class="project-links">
                                        ${project.homepage ? `
                                            <a href="${project.homepage}" target="_blank" rel="noopener noreferrer" title="Live Demo">
                                                <i class="fas fa-globe"></i>
                                            </a>
                                        ` : ''}
                                        <a href="${project.html_url}" target="_blank" rel="noopener noreferrer" title="View Source">
                                            <i class="fab fa-github"></i>
                                        </a>
                                    </div>
                                </div>
                                <p class="project-description">${project.description || 'No description available'}</p>
                                <div class="project-meta">
                                    <div class="project-tags">
                                        ${project.language ? `<span class="language"><i class="fas fa-code"></i> ${project.language}</span>` : ''}
                                        ${project.topics ? project.topics.map(topic => `<span class="topic">${topic}</span>`).join('') : ''}
                                    </div>
                                    <div class="project-stats">
                                        <span title="Stars"><i class="fas fa-star"></i> ${project.stargazers_count}</span>
                                        <span title="Forks"><i class="fas fa-code-branch"></i> ${project.forks_count}</span>
                                        <span title="Last Updated"><i class="fas fa-clock"></i> ${new Date(project.updated_at).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `).join('');
            }
        } catch (error) {
            console.error('Error fetching GitHub projects:', error);
            container.innerHTML = `
                <div class="error-message">
                    <i class="fas fa-exclamation-circle"></i>
                    <p>Failed to load projects. Please try again later.</p>
                    <button onclick="fetchGitHubProjects()" class="retry-button">
                        <i class="fas fa-redo"></i> Retry
                    </button>
                </div>
            `;
        }
    }

    // Blog Section
    const blogPosts = [
        {
            title: 'Getting Started with Web Development',
            date: 'March 15, 2024',
            excerpt: 'Learn the fundamentals of web development and start your journey as a developer.',
            image: 'https://source.unsplash.com/random/800x600/?coding'
        },
        {
            title: 'The Power of Arduino',
            date: 'March 10, 2024',
            excerpt: 'Explore the possibilities of Arduino and how it can be used in various projects.',
            image: 'https://source.unsplash.com/random/800x600/?arduino'
        },
        {
            title: 'Understanding Data Structures',
            date: 'March 5, 2024',
            excerpt: 'A comprehensive guide to common data structures and their applications.',
            image: 'https://source.unsplash.com/random/800x600/?programming'
        }
    ];

    function renderBlogPosts() {
        const container = document.getElementById('blog-posts');
        container.innerHTML = blogPosts.map(post => `
            <div class="blog-card" data-aos="fade-up">
                <img src="${post.image}" alt="${post.title}" class="blog-image">
                <div class="blog-content">
                    <p class="blog-date">${post.date}</p>
                    <h3 class="blog-title">${post.title}</h3>
                    <p class="blog-excerpt">${post.excerpt}</p>
                    <a href="#" class="read-more">Read More</a>
                </div>
            </div>
        `).join('');
    }

    // Contact Form Handling
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitButton = contactForm.querySelector('.submit-btn');
            const originalButtonText = submitButton.textContent;
            submitButton.disabled = true;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            
            try {
                const formData = new FormData(contactForm);
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    showNotification('Thank you! Your message has been sent successfully.', 'success');
                    contactForm.reset();
                } else {
                    const data = await response.json();
                    throw new Error(data.error || 'Failed to send message');
                }
            } catch (error) {
                console.error('Error sending message:', error);
                showNotification(
                    'Failed to send message. Please try again or contact directly via email.',
                    'error'
                );
            } finally {
                submitButton.disabled = false;
                submitButton.textContent = originalButtonText;
            }
        });
    }

    // Notification System
    function showNotification(message, type) {
        // Remove existing notification if any
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
                <p>${message}</p>
            </div>
            <button class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        `;

        // Add notification to DOM
        document.body.appendChild(notification);

        // Add close button functionality
        const closeButton = notification.querySelector('.notification-close');
        closeButton.addEventListener('click', () => {
            notification.classList.add('notification-hide');
            setTimeout(() => notification.remove(), 300);
        });

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (document.body.contains(notification)) {
                notification.classList.add('notification-hide');
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
    }

    // Initialize
    switchSection("about");
    fetchGitHubProjects();
    renderBlogPosts();
});
