document.addEventListener("DOMContentLoaded", function () {
 
    function switchSection(targetId) {
        
        document.querySelectorAll(".content-section").forEach(section => {
            section.classList.remove("active");
        });

        document.querySelectorAll(".side-nav li").forEach(item => {
            item.classList.remove("active");
        });

     
        document.getElementById(targetId).classList.add("active");


        document.querySelector(`.side-nav li[data-target='${targetId}']`).classList.add("active");
    }


    document.querySelectorAll(".side-nav li").forEach(item => {
        item.addEventListener("click", function () {
            const targetId = this.getAttribute("data-target");
            switchSection(targetId);
        });
    });


    switchSection("about");

 
    async function fetchGitHubRepos() {
        const username = 'Kushanware';
        try {
            const response = await fetch(`https://api.github.com/users/${username}/repos`);
            const repos = await response.json();
            displayProjects(repos);
        } catch (error) {
            console.error("Failed to fetch GitHub repositories:", error);
        }
    }

    function displayProjects(repos) {
        const projectsContainer = document.getElementById('projects-container');
        projectsContainer.innerHTML = '';

        repos.forEach(repo => {
            const projectItem = document.createElement('div');
            projectItem.classList.add('project-item');
            projectItem.innerHTML = `
                <h3>${repo.name}</h3>
                <p>${repo.description || 'No description available.'}</p>
                <a href="${repo.html_url}" target="_blank">View Repository</a>
            `;
            projectsContainer.appendChild(projectItem);
        });
    }

    fetchGitHubRepos();
});
