let moviesContainer = document.getElementById('movies')
// Get the movie IDs from local storage
let movieIdArray = JSON.parse(localStorage.getItem("movieData")) || []

// Initial screen setup
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

// Remove movie from watchlist
function removeMovie(imdbID) {
    movieIdArray = movieIdArray.filter(function(id) {
        return id !== imdbID
    })
    localStorage.setItem("movieData", JSON.stringify(movieIdArray))
    renderMovies()
}


// Fetch and display movie details
async function fetchAndDisplayMovieDetails(imdbID, callback) {
    const apiUrl = `https://omdbapi.com/?i=${imdbID}&apikey=8489e969`
    const response = await fetch(apiUrl)
    const data = await response.json()
    const getMovieDetailsHtmlString = `
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
                    <button class='movies__remove-btn' data-imdbID=${imdbID}>
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
    callback(getMovieDetailsHtmlString)
}

// Append movie HTML and attach listeners
function renderMovieHtml(movieHtml) {
    moviesContainer.innerHTML += movieHtml
    attachRemoveBtnListeners()
}

// Attach click listeners to remove buttons
function attachRemoveBtnListeners() {
    const removeBtns = document.querySelectorAll('.movies__remove-btn');
    removeBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            const movieId = e.target.dataset.imdbid
            removeMovie(movieId)
        })
    })
}

// Renders movies in the watchlist
function renderMovies() {
    moviesContainer.innerHTML = ""
    if (movieIdArray.length === 0) {
        defaultScreen()
    } else {
        movieIdArray.forEach(function(imdbID) {
            fetchAndDisplayMovieDetails(imdbID, renderMovieHtml)
        })
    }
}
renderMovies()


