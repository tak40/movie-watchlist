// Constants and DOM References
const BASE_API_URL = 'https://omdbapi.com'
const API_KEY = '8489e969'
const moviesContainer = document.getElementById('movies')

// Retrieve movie IDs saved in local storage or default to an empty array if none exist.
let movieIdArray = JSON.parse(localStorage.getItem("movieData")) || []

// ----- EVENT LISTENERS ----- //

// Add click event listeners to the 'Remove' buttons allowing for movie removal.
function attachRemoveBtnListeners() {
    const removeBtns = document.querySelectorAll('.movies__remove-btn');
    removeBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            const movieId = e.target.closest('button').dataset.imdbid;
            removeMovie(movieId);
        });
    });
}

// ----- PRIMARY FUNCTIONS ----- //

// Fetch and display the list of movies saved in the watchlist.
async function renderMovies() {
    moviesContainer.innerHTML = "";

    // Populate movies or show default message based on movies in the watchlist.
    if (movieIdArray.length === 0) {
        defaultScreen();
    } else {
        for(let imdbID of movieIdArray) {
            const movieData = await fetchMovieDetails(imdbID);
            const movieHtml = constructMovieHTML(movieData);
            renderMovieHtml(movieHtml);
        } 
    }
}
renderMovies();

// Removes a movie from the watchlist based on its IMDb ID.
function removeMovie(imdbID) {
    movieIdArray = movieIdArray.filter(id => id !== imdbID);
    localStorage.setItem("movieData", JSON.stringify(movieIdArray));
    renderMovies();
}

// ----- HELPER FUNCTIONS ----- //

// Retrieve detailed movie information using the provided IMDb ID from OMDB API.
async function fetchMovieDetails(imdbID) {
    const apiUrl = `${BASE_API_URL}?i=${imdbID}&apikey=${API_KEY}`;
    const response = await fetch(apiUrl);
    return await response.json();
}

// Generate HTML markup for a movie using its details.
function constructMovieHTML(data) {
    return `
        <article class='movies__movie'>
            <img class='movies__poster' src='${data.Poster}' alt='Movie poster for ${data.Title}'>
            <div class='movies__info'>
                <div class='movies__info-top'>
                    <h3 class='movies__title'>${data.Title}</h3>
                    <img src='images/star.svg' class='movies__star-icon'>
                    <p class='movies__rating'>${data.imdbRating}</p>
                </div>
                <div class='movies__info-middle'>
                    <p class='movies__runtime'>${data.Runtime}</p>
                    <p class='movies__genre'>${data.Genre}</p>
                    <button class='movies__remove-btn' data-imdbid=${data.imdbID}>
                        <img src="images/remove.svg" class='movies__remove-icon' alt="Remove Button"> 
                        Remove
                    </button>
                </div>
                <div class='movies__info-bottom'>
                    <p class='movies__plot'>${data.Plot}</p>
                </div>
            </div>
        </article>
    `
}

// Inserts the provided movie HTML into the movies container 
// and attaches event listeners to the 'Remove' buttons.
function renderMovieHtml(movieHtml) {
    moviesContainer.innerHTML += movieHtml;
    attachRemoveBtnListeners();
}

// Displays a default message when the watchlist is empty.
function defaultScreen() {
    const defaultScreenHtmlString = `
        <section class='movies__default-screen'>
            <p class='movies__default-text'>Your watchlist is looking a little empty...</p>
            <div class='movies__default-nav-container'>
                <a class='movies__default-nav-text' href='index.html'><img src='images/plus.svg' class='movies__plus-icon'>Let’s add some movies!</a>
            </div>
        </section> 
    `
    moviesContainer.innerHTML = defaultScreenHtmlString
}