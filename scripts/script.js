console.log("Test");

document.addEventListener("DOMContentLoaded", function() {
    const apiUrl = 'http://127.0.0.1:8000/api/wikis';
    const wikiContainer = document.getElementById('wikiContainer');
    const regionFilter = document.getElementById('regionFilter');

    function fetchWikis() {
        axios.get(apiUrl, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            wikiContainer.innerHTML = '';

            if (response.data && response.data.length > 0) {
                response.data.forEach(wiki => {
                    if (regionFilter.value === 'all' || wiki.region === regionFilter.value) {
                        const wikiWrapper = document.createElement('div');
                        wikiWrapper.classList.add('wiki-container');

                        const wikiDetails = document.createElement('div');
                        wikiDetails.classList.add('wiki-details');
                        wikiDetails.innerHTML = `
                            <h1>${wiki.title}</h1>
                            <p>${wiki.description}</p>
                        `;

                        const wikiImageContainer = document.createElement('div');
                        wikiImageContainer.classList.add('wiki-image-container');

                        const wikiImage = document.createElement('img');
                        wikiImage.classList.add('wiki-image');
                        wikiImage.src = wiki.image;
                        wikiImage.alt = 'Wiki Image';

                        const wikiTable = document.createElement('table');
                        wikiTable.innerHTML = `
                            <tr>
                                <th>Attribute</th>
                                <th>Value</th>
                            </tr>
                            <tr>
                                <td>Region:</td>
                                <td>${wiki.region} <img class="flag-img" src="${getFlagSrc(wiki.region)}" alt="${wiki.region} Flag"></td>
                            </tr>
                            <tr>
                                <td>Rarity:</td>
                                <td>${wiki.rarity}</td>
                            </tr>
                        `;

                        wikiImageContainer.appendChild(wikiImage);
                        wikiImageContainer.appendChild(wikiTable);

                        wikiWrapper.appendChild(wikiDetails);
                        wikiWrapper.appendChild(wikiImageContainer);

                        wikiContainer.appendChild(wikiWrapper);
                    }
                });
            } else {
                console.error('No data received or empty data array.');
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
    }

    fetchWikis();

    regionFilter.addEventListener('change', fetchWikis);

    function getFlagSrc(region) {
        if (region === 'North America') {
            return 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Flag_of_the_United_States.svg/1280px-Flag_of_the_United_States.svg.png';
        } else if (region === 'Europe') {
            return 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Flag_of_Europe.svg/2560px-Flag_of_Europe.svg.png';
        }
        else if (region === 'Asia') {
            return 'https://upload.wikimedia.org/wikipedia/commons/d/d6/Flag_of_Asia.png';
        }
        else if (region === 'Latin America') {
            return 'https://upload.wikimedia.org/wikipedia/commons/a/ad/Flag_of_the_Hispanic_peoples.svg';
        }
        return '';
    }
});