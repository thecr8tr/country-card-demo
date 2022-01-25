const searchBar = window.document.getElementById("searchBar")
const results = window.document.getElementById("results")
let countries = [];

// Preload all the countries
fetch('https://restcountries.com/v2/all').then(response => {
    response.json().then(json => {
        countries = json
        loadAllCountries()
    })
});

// Loads all countries by search value
function loadCountriesForSearchValue(search) {
    const countriesToShow = countries.filter(country => country.name.toLowerCase().match(search.toLowerCase()))
    results.innerHTML = '';
    countriesToShow.map(country => {
        addCountry(country)
    })
}
// Loads all the countries
function loadAllCountries() {
    results.innerHTML = '';
    countries.map(country => {
        addCountry(country)
    })
}

// Adds an event listener on input change
searchBar.addEventListener('input', () => {
    const currentValue = searchBar.value;
    if (currentValue === '') {
        loadAllCountries();
    } else {
        loadCountriesForSearchValue(currentValue);
    }
});

// Replaces search results with an individual country's details
function loadCountryDetails(countryDetails) {
    results.innerHTML = '';
    const newCard = document.createElement('div');
    newCard.classList.add('search-result-card');
    // This is duplicated with the assumption that you will be changing it to display more country data
    newCard.innerHTML = `
    <div class="country-img">
      <img src="${countryDetails.flag}" alt="">
    </div>
    <div class="country-info">
      <h2>${countryDetails.name}</h2>
      <h3>Population: <span>81,770,900</span></h3>
      <h3>Region: <span>Europe</span></h3>
      <h3>Capital: <span>Berlin</span></h3>
    </div>
  `
    results.append(newCard);
}

// function to execute when a search country card is clicked.
function cardClickHandler (ev) {
    // make sure we are working with the search-result-card div
    let cardElement = ev.target;
    while (
        !cardElement.classList.contains('search-result-card')) {
        if(cardElement.tagName.toLowerCase() !== 'body') {
            throw "Could not find search-result-card class, which is unexpected."
        }
        cardElement = cardElement.parentElement
    }

    // get the country name
    const name = cardElement.getElementsByClassName("country-name")[0].innerText

    // load the country details
    fetch('https://restcountries.com/v2/name/' + name)
        .then(response => {
            if (response.status === 404) {
                console.error("Country not found: " + name)
            } else {
                response.json().then(json => {
                    loadCountryDetails(json[0])
                })
            }
        })
}

// Add a new card to the result div for the given country
function addCountry(CountryData) {
    const newCard = document.createElement('div');
    newCard.classList.add('search-result-card');
    newCard.onclick = cardClickHandler

    newCard.innerHTML = `
    <div class="country-img">
      <img src="${CountryData.flag}" alt="">
    </div>
    <div class="country-info">
      <h2 class="country-name">${CountryData.name}</h2>
      <h3>Population: <span>81,770,900</span></h3>
      <h3>Region: <span>Europe</span></h3>
      <h3>Capital: <span>Berlin</span></h3>
    </div>
  `
    results.append(newCard);
}
