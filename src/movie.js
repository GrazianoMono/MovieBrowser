import './css/main.css'

const movieCardTemplate = document.getElementById('movie-card-template')
const actorCardTemplate = document.getElementById('actor-card-template')

let recomandations = []
let movie = {}
let movie_id = 0
let images = []
let genres = []
let cast = []

const getGenres = async function () {
	try {
		let data_genres = await fetch(
			`https://api.themoviedb.org/3/genre/movie/list?api_key=bf42acf712bba686cfff9820897f4edb&language=en-US`
		)
		let result_genres = await data_genres.json()
		genres = result_genres.genres
	} catch (e) {
		console.error(e)
	}
}

const renderRecomandations = function (htmlElement) {
	htmlElement.innerHTML = ''
	let movieList = htmlElement
	for (const movie of recomandations) {
		const movieCard = document.importNode(movieCardTemplate, true)
		movieCard.content.querySelector('.movie-card__title').textContent =
			movie.title
		movieCard.content.querySelector('.movie-card__vote').textContent =
			movie.vote_average
		movieCard.content.querySelector('.movie-card__vote').textContent =
			movie.vote_average
		let movieGenres = ''
		for (const genre_id of movie.genre_ids) {
			for (const genre of genres) {
				if (genre_id == genre.id) {
					movieGenres += genre.name + ', '
					break
				}
			}
		}
		movieGenres = movieGenres.slice(0, -2)
		movieCard.content.querySelector('.movie-card__genres').textContent =
			movieGenres
		if (movie.poster_path)
			movieCard.content.querySelector('.movie-card__poster').src =
				'https://image.tmdb.org/t/p/w300' + movie.poster_path
		movieCard.content.querySelector('.movie-card__link').href =
			'/movie.html#' + movie.id
		movieCard.content
			.querySelector('.movie-card__link')
			.addEventListener('click', () => {
				window.location.hash = movie.id
				location.reload()
			})
		movieList.appendChild(movieCard.content)
	}
}

const renderMovie = function () {
	document.getElementById('title').textContent = movie.title
	document.getElementById('subtitle').textContent = movie.tagline
	document.getElementById('plot').textContent = movie.overview
	let movieGenres = ''
	for (const genre of movie.genres) {
		movieGenres += genre.name + ', '
	}
	movieGenres = movieGenres.slice(0, -2)
	document.getElementById('genres') = movieGenres
	document.getElementById('vote').textContent = movie.vote_average
	document.getElementById('release').textContent = movie.release_date
	document.getElementById('budget').textContent = movie.budget
	document.getElementById('film-time').textContent = Math.floor(movie.runtime / 60) + (movie.runtime % 60) * 0.01
	if (movie.poster_path) document.getElementById('poster').src = movie.poster_path
}

const renderCredits = function (htmlElement) {
	let castDiv = htmlElement
	console.log(cast)
	for (const actor of cast) {
		const actorCard = document.importNode(actorCardTemplate, true)

		if (actor.profile_path) {
			actorCard.content.querySelector(
				'actor-card__poster'
			).src = `https://image.tmdb.org/t/p/w185${actor.profile_path}`
		}

		actorCard.content.querySelector('.actor-card__title').textContent =
			actor.character
		actorCard.content.querySelector('.actor-card__subtitle').textContent =
			actor.name
		castDiv.appendChild(actorCard.content)
	}
}

const getMovie = async function () {
	try {
		let res = await fetch(
			`https://api.themoviedb.org/3/movie/${movie_id}?api_key=bf42acf712bba686cfff9820897f4edb&language=en-US`
		)
		let data = await res.json()
		movie = data
		renderMovie()
	} catch (e) {}
}

const getMovieId = function () {
	movie_id = window.location.hash
	movie_id = movie_id.slice(1, movie_id.lenght)
}

const getRecomandations = async function () {
	try {
		let res = await fetch(
			`https://api.themoviedb.org/3/movie/${movie_id}/recommendations?api_key=bf42acf712bba686cfff9820897f4edb&language=null&page=1`
		)
		let data = await res.json()
		recomandations = data.results
		renderRecomandations(
			document.getElementById('recomandations')
		)
	} catch (e) {}
}

const getCredits = async function () {
	try {
		let res = await fetch(
			`https://api.themoviedb.org/3/movie/${movie_id}/credits?api_key=bf42acf712bba686cfff9820897f4edb&language=en-US`
		)
		let data = await res.json()
		cast = data.cast
		renderCredits(cast, document.getElementById('actors'))
	} catch (e) {}
}

const getImages = async function () {
	try {
		let res = await fetch(
			`https://api.themoviedb.org/3/movie/${movie_id}/images?api_key=bf42acf712bba686cfff9820897f4edb&language=null`
		)
		let data = await res.json()
		cast = data
	} catch (e) {}
}

document.onload = (function () {
	getMovieId()
	getGenres()
	getMovie()
	getRecomandations()
	getCredits()
	getImages()
})()
