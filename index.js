const searchBtn = document.getElementById('search-btn')
const searchInput = document.getElementById('search-input');
const searchForm = document.getElementById('search-form')
let moviesContainer = document.getElementById('movies-container')

// Get the movie IDs from local storage
let movieIdArray = JSON.parse(localStorage.getItem("movieData")) || []

searchForm.addEventListener('submit', function(e){
    e.preventDefault()
    const searchTerm = searchInput.value
    searchMovies(searchTerm)
    searchInput.value = ""
})

// Initial screen setup
function defaultScreen(){
    const htmlString = `
        <section class='default-index-screen content'>
            <img src='images/Icon.svg' class='default-icon'>
            <p class='default-text'>Start exploring</p>
        </section> 
    `
    moviesContainer.innerHTML = htmlString
}
defaultScreen()

// Fetch movie data from OMDB API
async function searchMovies(searchTerm) {
    const apiUrl = `https://omdbapi.com/?s=${searchTerm}&apikey=8489e969`
    const response = await fetch(apiUrl)
    const data = await response.json()
    if(data.Search){
        const movieData = data.Search
        for (let i = 0; i < movieData.length; i++) {
            const imdbID = movieData[i].imdbID
            fetchAndDisplayMovieDetails(imdbID)
        }
    } else {
        moviesContainer.innerHTML = `<p class='search-error-text'>Unable to find what you’re looking for. Please try another search.</p>`
    }
}

// Fetch and display movie details
async function fetchAndDisplayMovieDetails(imdbID) {
    moviesContainer.innerHTML = ""
    const apiUrl = `https://omdbapi.com/?i=${imdbID}&apikey=8489e969`
    const response = await fetch(apiUrl)
    const data = await response.json()
    const htmlString = `
        <article class='movie-container'>
            <img class='movie-poster' src='${data.Poster}' alt='Movie poster for ${data.Title}'>
            <div class='movie-info-container'>
                <div class='movie-info-top-row'>
                    <h3 class='movie-title'>${data.Title}</h3>
                    <img src='images/star.svg' class='star-icon' alt='Star Icon'>
                    <p class='movie-rating'>${data.imdbRating}</p>
                </div>
                <div class='movie-info-mid-row'>
                    <p class='movie-runtime'>${data.Runtime}</p>
                    <p class='movie-genre'>${data.Genre}</p>
                    <button class='watchlist-btn' data-imdbID=${imdbID}>
                        <img src="images/plus.svg" class='watchlist-icon' alt='Plus Icon'> 
                        Watchlist
                    </button>
                </div>
                <div class='movie-info-bottom-row'>
                    <p class='plot-text'>${data.Plot}</p>
                </div>
            </div>
        </article>
    `
    moviesContainer.innerHTML += htmlString
    
    // Listen for watchlist button click
    const watchListBtns = document.querySelectorAll('.watchlist-btn')
    watchListBtns.forEach(function(btn) {
        btn.addEventListener('click', function(e) {
            const movieId = e.target.dataset.imdbid
            // Check if the movie is already in the array
            if (!movieIdArray.includes(movieId)) {
                movieIdArray.push(movieId)
                localStorage.setItem("movieData", JSON.stringify(movieIdArray))
                console.log(movieIdArray)
            }
        })
    })
}
