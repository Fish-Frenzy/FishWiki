document.addEventListener('DOMContentLoaded', function () {
    const apiUrl = 'http://127.0.0.1:8000/api/wikis';
    const createWikiForm = document.getElementById('createWikiForm');
    const wikisContainer = document.getElementById('wikisContainer');

    function logout() {
        localStorage.removeItem('accessToken'); // Remove the token from localStorage
        window.location.href = 'login.html'; // Redirect to the login page
    }

    function fetchWikis(token) {
        axios.get(apiUrl, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(response => {
            const wikis = response.data;
            displayWikis(wikis);
        })
        .catch(error => {
            console.error('Error fetching wikis:', error);
        });
    }

    function displayWikis(wikis) {
        wikisContainer.innerHTML = '';
        wikis.forEach(wiki => {
            const wikiElement = document.createElement('div');
            wikiElement.innerHTML = `
                <h3>${wiki.title}</h3>
                <p>${wiki.description}</p>
                <button class="edit-btn" data-id="${wiki.id}" data-title="${wiki.title}" data-description="${wiki.description}" data-region="${wiki.region}" data-rarity="${wiki.rarity}" data-image="${wiki.image}">Edit</button>
                <button class="delete-btn" data-id="${wiki.id}">Delete</button>
            `;
            wikisContainer.appendChild(wikiElement);
        });
    }

    createWikiForm.addEventListener('submit', function (event) {
        event.preventDefault();
    
        const title = document.getElementById('title').value;
        const description = document.getElementById('description').value;
        const region = document.getElementById('region').value;
        const rarity = document.getElementById('rarity').value;
        const image = document.getElementById('image').value;
    
        const token = localStorage.getItem('accessToken');

        const newWiki = {
            title: title,
            description: description,
            region: region,
            rarity: rarity,
            image: image
        };

        const wikiId = document.getElementById('wikiId').value;
        let requestUrl = apiUrl;
        let requestMethod = 'POST';
        if (wikiId) {
            requestUrl += `/${wikiId}`;
            requestMethod = 'PUT';
        }

        axios({
            method: requestMethod,
            url: requestUrl,
            data: newWiki,
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(response => {
            console.log('New wiki created:', response.data);
            fetchWikis(token);
            createWikiForm.reset();
        })
        .catch(error => {
            console.error('Error creating/editing wiki:', error);
            const errorMessageElement = document.getElementById('errorCreating');
            errorMessageElement.textContent = 'Error creating/editing wiki: ' + error.message;
        });
    });

    wikisContainer.addEventListener('click', function(event) {
        if (event.target.classList.contains('edit-btn')) {
            const { id, title, description, region, rarity, image } = event.target.dataset;
            document.getElementById('title').value = title;
            document.getElementById('description').value = description;
            document.getElementById('region').value = region;
            document.getElementById('rarity').value = rarity;
            document.getElementById('image').value = image;
            document.getElementById('wikiId').value = id;
        }

        if (event.target.classList.contains('delete-btn')) {
            const wikiId = event.target.dataset.id;
            const token = localStorage.getItem('accessToken');
            axios.delete(`${apiUrl}/${wikiId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            .then(response => {
                console.log('Wiki deleted:', response.data);
                fetchWikis(token);
            })
            .catch(error => {
                console.error('Error deleting wiki:', error);
            });
        }
    });

    const token = localStorage.getItem('accessToken');
    fetchWikis(token);
});