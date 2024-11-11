const cityListUrl = 'https://data.gov.il/api/3/action/datastore_search?resource_id=5c78e9fa-c2e2-4771-93ff-7f400a12f7ba&q=&limit=32000';

// Fetch the list of cities
fetch(cityListUrl)
    .then(response => response.json())
    .then(data => {
        const cities = data.result.records;
        const cityListElement = document.getElementById('city-list');

        cities.forEach(city => {
            const cityElement = document.createElement('div');
            cityElement.className = 'city';
            cityElement.innerText = city.שם_ישוב; // Assuming the key for the city name is 'שם_ישוב'
            cityElement.onclick = () => fetchVotes(city.שם_ישוב); // Pass the city name to fetchVotes
            cityListElement.appendChild(cityElement);
        });
    })
    .catch(error => console.error('Error fetching city list:', error));

function fetchVotes(cityName) {
    //const encodedCityName = encodeURIComponent(cityName); // Encode the city name

    const baseUrl = 'https://data.gov.il/api/3/action/datastore_search';
    const resourceId = '929b50c6-f455-4be2-b438-ec6af01421f2';
    const query = { "שם ישוב": cityName };
    const limit = 32000;

    const url1 = new URL(baseUrl);
    url1.searchParams.append('resource_id', resourceId);
    url1.searchParams.append('q', JSON.stringify(query));
    url1.searchParams.append('limit', limit);

    fetch(url1)
        .then(response => response.json())
        .then(votes => {
            const filteredData = Object.entries(votes.result.records[0])
                .filter(([key, value]) => parseInt(value) > 10)
                .sort((a, b) => parseInt(b[1]) - parseInt(a[1]))
                .slice(0, 7);

            const labels = filteredData.map(([key, value]) => key);
            const dataValues = filteredData.map(([key, value]) => parseInt(value));

            displayChart(labels, dataValues);
        })
        .catch(error => console.error('Error fetching votes:', error));
}

function displayChart(labels, dataValues) {
    console.log(labels, dataValues);
    const ctx = document.getElementById('vote-chart').getContext('2d');
    if (window.voteChart) {
        window.voteChart.destroy(); // Destroy previous chart if it exists
    }

    window.voteChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Number of Votes',
                data: dataValues,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    // Dynamically add CSS to the chart
    const chartCanvas = document.getElementById('vote-chart');
    chartCanvas.style.backgroundColor = '#f5f5f5';
    chartCanvas.style.border = '1px solid #ddd';
    chartCanvas.style.borderRadius = '5px';
}


