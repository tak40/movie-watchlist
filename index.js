const searchBtn = document.getElementById('search-btn')
const searchInput = document.getElementById('search-input');
const searchForm = document.getElementById('search-form')
let moviesContainer = document.getElementById('movies')

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
        <section class='movies__default-screen'>
            <img src='images/Icon.svg' class='movies__default-icon'>
            <p class='movies__default-text'>Start exploring</p>
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
        moviesContainer.innerHTML = `<p class='movies__error-text'>Unable to find what you’re looking for. Please try another search.</p>`
    }
}

// Fetch and display movie details
async function fetchAndDisplayMovieDetails(imdbID) {
    moviesContainer.innerHTML = ""
    const apiUrl = `https://omdbapi.com/?i=${imdbID}&apikey=8489e969`
    const response = await fetch(apiUrl)
    const data = await response.json()
    const htmlString = `
        <article class='movies__movie'>
            <img class='movies__poster' src='${data.Poster}' alt='Movie poster for ${data.Title}'>
            <div class='movies__info'>
                <div class='movies__info-top'>
                    <h3 class='movies__title'>${data.Title}</h3>
                    <img src='images/star.svg' class='movies__star-icon' alt='Star Icon'>
                    <p class='movies__rating'>${data.imdbRating}</p>
                </div>
                <div class='movies__info-middle'>
                    <p class='movies__runtime'>${data.Runtime}</p>
                    <p class='movies__genre'>${data.Genre}</p>
                    <button class='movies__watchlist-btn' data-imdbID=${imdbID}>
                        <img src="images/plus.svg" class='movies__watchlist-icon' alt='Plus Icon'> 
                        Watchlist
                    </button>
                </div>
                <div class='movies__info-bottom'>
                    <p class='movies__plot'>${data.Plot}</p>
                </div>
            </div>
        </article>
    `
    moviesContainer.innerHTML += htmlString
    
    // Listen for watchlist button click
    const watchListBtns = document.querySelectorAll('.movies__watchlist-btn')
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
