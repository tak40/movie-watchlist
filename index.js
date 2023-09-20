// Constants and DOM References
const BASE_API_URL = 'https://omdbapi.com'
const API_KEY = '8489e969'
const searchBtn = document.getElementById('search-btn')
const searchInput = document.getElementById('search-input')
const searchForm = document.getElementById('search-form')
const moviesContainer = document.getElementById('movies')

// Retrieve movie IDs from local storage or initialize as an empty array
let movieIdArray = JSON.parse(localStorage.getItem("movieData")) || []

// ----- EVENT LISTENERS ----- //

// Add event listener for the movie search form submission
searchForm.addEventListener('submit', handleSearchSubmit)

// Add event listener for the watchlist button
moviesContainer.addEventListener('click', function(e) {
    if (e.target.classList.contains('movies__watchlist-btn')) {
        const movieId = e.target.dataset.imdbid
        addToWatchList(movieId)
    }
})

// ----- PRIMARY FUNCTIONS ----- //

// Handle form submission event
function handleSearchSubmit(e) {
    e.preventDefault()
    const searchTerm = searchInput.value
    searchMovies(searchTerm)
    searchInput.value = ""
}

// Fetch a list of movies based on the provided search term
async function searchMovies(searchTerm) {
    moviesContainer.innerHTML = ""
    const response = await fetch(`${BASE_API_URL}?s=${searchTerm}&apikey=${API_KEY}`)
    const data = await response.json()
    
    if(data.Search){
        const movieData = data.Search
        movieData.forEach(movie => fetchAndDisplayMovieDetails(movie.imdbID))
    } else {
        moviesContainer.innerHTML = `<p class='movies__error-text'>Unable to find what you’re looking for. Please try another search.</p>`
    }
}

// Fetch and display detailed movie information
async function fetchAndDisplayMovieDetails(imdbID) {
    try{
        // Fetch movie details
        const movieData = await fetchMovieDetails(imdbID)

        // Construct and append the movie's HTML to the container
        const movieHTML = constructMovieHTML(movieData)
        moviesContainer.innerHTML += movieHTML
    } catch (error) {
        console.error("Error fetching movie details:", error)
        moviesContainer.innerHTML = "Failed to load movie details. Please try again later."
    }
}

// ----- HELPER FUNCTIONS ----- //

// Fetch detailed information for a specific movie by its IMDb ID
async function fetchMovieDetails(imdbID) {
    const apiUrl = `${BASE_API_URL}?i=${imdbID}&apikey=${API_KEY}`
    const response = await fetch(apiUrl)
    if (!response.ok) {
        throw new Error('Failed to fetch movie details')
    }
    return await response.json()
}

// Construct HTML string to display movie details
function constructMovieHTML(data) {
    return `
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
                    <button class='movies__watchlist-btn' data-imdbid=${data.imdbID}>
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
}

// Display default landing screen
function defaultScreen(){
    moviesContainer.innerHTML = `
        <section class='movies__default-screen'>
            <img src='images/Icon.svg' class='movies__default-icon'>
            <p class='movies__default-text'>Start exploring</p>
        </section> 
    `
}
defaultScreen()

// Add movie to the watchlist by storing its IMDb ID in local storage
function addToWatchList(imdbID) {
    if (!movieIdArray.includes(imdbID)) {
        movieIdArray.push(imdbID)
        localStorage.setItem("movieData", JSON.stringify(movieIdArray))
        console.log(movieIdArray)
    }
}