class BlogPost {
    constructor(title, date, content, tags = []) {
        this.title = title;
        this.date = new Date(date);
        this.content = content;
        this.tags = tags;
    }

    static fromJSON(json) {
        return new BlogPost(json.title, json.date, json.content, json.tags);
    }
}

const blogPosts = [
    {
        title: "Getting Started with Web Development",
        date: "2024-03-15",
        content: "Web development is an exciting journey that combines creativity with technical skills...",
        tags: ["Web Development", "Beginners", "HTML", "CSS", "JavaScript"]
    },
    // Add more blog posts here
];

function displayBlogPosts(posts = blogPosts, container = document.getElementById('blog-posts')) {
    if (!container) return;
    
    container.innerHTML = '';
    
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Search posts...';
    searchInput.className = 'blog-search';
    container.appendChild(searchInput);

    const postsContainer = document.createElement('div');
    postsContainer.className = 'posts-container';
    container.appendChild(postsContainer);

    function renderPosts(postsToRender) {
        postsContainer.innerHTML = '';
        
        postsToRender.forEach((post, index) => {
            const article = document.createElement('article');
            article.className = 'blog-post';
            article.setAttribute('data-aos', 'fade-up');
            article.setAttribute('data-aos-delay', `${index * 100}`);

            const date = new Date(post.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });

            article.innerHTML = `
                <h3>${post.title}</h3>
                <div class="post-meta">
                    <span class="post-date">${date}</span>
                    <div class="post-tags">
                        ${post.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                </div>
                <div class="post-content">
                    <p>${post.content}</p>
                </div>
                <button class="read-more">Read More</button>
            `;

            postsContainer.appendChild(article);
        });
    }

    // Initial render
    renderPosts(posts);

    // Search functionality
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredPosts = posts.filter(post => 
            post.title.toLowerCase().includes(searchTerm) ||
            post.content.toLowerCase().includes(searchTerm) ||
            post.tags.some(tag => tag.toLowerCase().includes(searchTerm))
        );
        renderPosts(filteredPosts);
    });
}

// Export for use in main script
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { BlogPost, displayBlogPosts };
} 