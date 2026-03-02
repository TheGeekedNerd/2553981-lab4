// ===========================
// Helper function to fetch country data by name
// ===========================
async function fetchCountryByName(countryName) {
    const response = await fetch(`https://restcountries.com/v3.1/name/${countryName}`);
    if (!response.ok) {
        throw new Error('Country not found');
    }
    const data = await response.json();
    return data[0]; // Return the first matching country
}

// ===========================
// Helper function to fetch country data by code (for borders)
// ===========================
async function fetchCountryByCode(code) {
    const response = await fetch(`https://restcountries.com/v3.1/alpha/${code}`);
    if (!response.ok) {
        throw new Error(`Border country with code ${code} not found`);
    }
    const data = await response.json();
    return data[0]; // Return the country
}

// ===========================
// Main function to search for a country
// ===========================
async function searchCountry(countryName) {
    const countryInfoEl = document.getElementById('country-info');
    const borderingCountriesEl = document.getElementById('bordering-countries');
    const errorEl = document.getElementById('error-message');
    const spinnerEl = document.getElementById('loading-spinner');

    // Reset previous data
    countryInfoEl.innerHTML = '';
    borderingCountriesEl.innerHTML = '';
    errorEl.textContent = '';

    // Show spinner
    spinnerEl.classList.remove('hidden');

    try {
        // Fetch main country data
        const country = await fetchCountryByName(countryName);

        // Update DOM with country info
        countryInfoEl.innerHTML = `
            <h2>${country.name.common}</h2>
            <p><strong>Capital:</strong> ${country.capital ? country.capital[0] : 'N/A'}</p>
            <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
            <p><strong>Region:</strong> ${country.region}</p>
            <img src="${country.flags.svg}" alt="${country.name.common} flag">
        `;

        // Fetch and display bordering countries
        if (country.borders && country.borders.length > 0) {
            for (const code of country.borders) {
                const borderCountry = await fetchCountryByCode(code);
                const borderDiv = document.createElement('div');
                borderDiv.classList.add('border-country');
                borderDiv.innerHTML = `
                    <p>${borderCountry.name.common}</p>
                    <img src="${borderCountry.flags.svg}" alt="${borderCountry.name.common} flag">
                `;
                borderingCountriesEl.appendChild(borderDiv);
            }
        } else {
            borderingCountriesEl.innerHTML = `<p>No bordering countries</p>`;
        }

    } catch (error) {
        // Show error message
        errorEl.textContent = error.message;
    } finally {
        // Hide spinner
        spinnerEl.classList.add('hidden');
    }
}

// ===========================
// Event Listeners
// ===========================
document.getElementById('search-btn').addEventListener('click', () => {
    const country = document.getElementById('country-input').value.trim();
    if (country) searchCountry(country);
});

// Trigger search on Enter key
document.getElementById('country-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const country = document.getElementById('country-input').value.trim();
        if (country) searchCountry(country);
    }
});