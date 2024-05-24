document.addEventListener("DOMContentLoaded", () => {
  const countriesList = document.getElementById("countries-container");
  const toggleBtn = document.getElementById("theme-switcher"); // for dark mode
  const searchInput = document.getElementById("search");
  const regionFilter = document.getElementById("region");
  const modal = document.getElementById("modal");
  const closeBtn = document.getElementById("close-modal");

  // Event Listeners
  searchInput.addEventListener("input", filterCountries);
  regionFilter.addEventListener("change", filterCountries);
  closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });

  toggleBtn.addEventListener("click", toggleTheme);

  getCountries();

  async function getCountries() {
    const res = await fetch("./data.json");
    const countries = await res.json();
    displayCountries(countries);
  }

  function displayCountries(countries) {
    countriesList.innerHTML = "";
    countries.forEach((country) => {
      const countryEl = document.createElement("div");
      countryEl.classList.add("card");

      countryEl.innerHTML = `
          <div>
              <img src="${country.flags.png}" alt="${country.name.common}" />
          </div>
          <div class="card-body">
              <h3 class="country-name">${country.name}</h3>
              <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
              <p class="country-region"><strong>Region:</strong> ${
                country.region
              }</p>
              <p><strong>Capital:</strong> ${
                country.capital ? country.capital[0] : "N/A"
              }</p>
          </div>
        `;

      countryEl.addEventListener("click", () => {
        showCountryDetails(country);
      });

      countriesList.appendChild(countryEl);
    });
  }

  function showCountryDetails(country) {
    const modalContent = document.getElementById("modal-content");

    const languages = Object.values(country.languages || {}).join(", ");
    const currencies = Object.values(country.currencies || {})
      .map((curr) => curr.name)
      .join(", ");

    modalContent.innerHTML = `
        <div class="modal-img">
          <img src="${country.flags.png}" alt="${country.name.common}" />
        </div>
        <div class="modal-info">
          <h2>${country.name.common}</h2>
          <p><strong>Native Name:</strong> ${country.name.official}</p>
          <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
          <p><strong>Region:</strong> ${country.region}</p>
          <p><strong>Sub Region:</strong> ${country.subregion}</p>
          <p><strong>Capital:</strong> ${
            country.capital ? country.capital[0] : "N/A"
          }</p>
          <p><strong>Top Level Domain:</strong> ${country.tld}</p>
          <p><strong>Currencies:</strong> ${currencies}</p>
          <p><strong>Languages:</strong> ${languages}</p>
        </div>
      `;

    modal.style.display = "flex";
  }

  function filterCountries() {
    const searchValue = searchInput.value.toLowerCase();
    const regionValue = regionFilter.value;

    const allCountries = document.querySelectorAll(".card");

    allCountries.forEach((countryCard) => {
      const countryName = countryCard
        .querySelector(".country-name")
        .innerText.toLowerCase();
      const countryRegion = countryCard
        .querySelector(".country-region")
        .innerText.split(": ")[1]
        .toLowerCase();

      if (
        (countryName.includes(searchValue) || searchValue === "") &&
        (countryRegion === regionValue || regionValue === "all")
      ) {
        countryCard.style.display = "block";
      } else {
        countryCard.style.display = "none";
      }
    });
  }

  function toggleTheme() {
    document.body.classList.toggle("light-mode");

    if (document.body.classList.contains("light-mode")) {
      toggleBtn.innerHTML = `<i class="fa-solid fa-sun"></i> Light Mode`;
    } else {
      toggleBtn.innerHTML = `<i class="fa-solid fa-moon"></i> Dark Mode`;
    }
  }
});
