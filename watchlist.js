let moviesContainer = document.getElementById('movies-container')
// Get the movie IDs from local storage
let movieIdArray = JSON.parse(localStorage.getItem("movieData")) || []

// Initial screen setup
function defaultScreen() {
    const defaultScreenHtmlString = `
        <section class='default-watchlist-screen'>
            <p class='default-text'>Your watchlist is looking a little empty...</p>
            <div class='default-navigation-container'>
                <a class='default-navigation-text' href='index.html'><img src='images/plus.svg' class='plus-icon'>Let’s add some movies!</a>
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
        <section class='movie-container'>
            <img class='movie-poster' src='${data.Poster}' alt='Movie poster for ${data.Title}'>
            <div class='movie-info-container'>
                <div class='movie-info-top-row'>
                    <h3 class='movie-title'>${data.Title}</h3>
                    <img src='images/star.svg' class='star-icon'>
                    <p class='movie-rating'>${data.imdbRating}</p>
                </div>
                <div class='movie-info-mid-row'>
                    <p class='movie-runtime'>${data.Runtime}</p>
                    <p class='movie-genre'>${data.Genre}</p>
                    <button class='remove-btn' data-imdbID=${imdbID}>
                        <img src="images/remove.svg" class='remove-icon' alt=""> 
                        Remove
                    </button>
                </div>
                <div class='movie-info-bottom-row'>
                    <p class='plot-text'>${data.Plot}</p>
                </div>
            </div>
        </section>
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
    const removeBtns = document.querySelectorAll('.remove-btn');
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


