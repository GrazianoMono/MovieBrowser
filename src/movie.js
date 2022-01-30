import './css/main.css'
import expand from './assets/svgs/expand-more.svg'
import collapse from './assets/svgs/expand-less.svg'

const movieCardTemplate = document.getElementById('movie-card-template')
const actorCardTemplate = document.getElementById('actor-card-template')
const imageContainerTemplate = document.getElementById(
	'image-container-template'
)

let recomandations = []
let movie = {}
let movie_id = 0
let images = []
let genres = []
let cast = []
let image_showed = 0
let showMoreCast = false

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
	let movieList = htmlElement
	movieList.innerHTML = ''
	for (const movie of recomandations) {
		const movieCard = document.importNode(movieCardTemplate, true)
		movieCard.content.querySelector('.movie-card__title').textContent =
			movie.title
		movieCard.content.querySelector('.movie-card__vote').textContent =
			movie.vote_average
		movieCard.content.querySelector('.movie-card__vote').textContent =
			Math.floor(movie.vote_average * 10) / 10

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
	document.getElementById('genres').textContent = movieGenres
	document.getElementById('vote').textContent = movie.vote_average
	document.getElementById('release').textContent = movie.release_date
	document.getElementById('budget').textContent = '$' + movie.budget
	document.getElementById('film-time').textContent =
		Math.round(
			(Math.floor(movie.runtime / 60) + (movie.runtime % 60) * 0.01) * 100
		) /
			100 +
		'h'
	if (movie.poster_path)
		document.getElementById(
			'poster'
		).src = `https://image.tmdb.org/t/p/w300${movie.poster_path}`
}

const renderCredits = function (htmlElement) {
	let castDiv = htmlElement
	castDiv.innerHTML = ''
	let castShowed = !showMoreCast ? cast.slice(0, 4) : cast.slice(0, 16)
	castShowed.forEach((element) => {
		let actorCard = document.importNode(actorCardTemplate, true)
		if (element.profile_path) {
			actorCard.content.querySelector(
				'.actor-card__poster'
			).src = `https://image.tmdb.org/t/p/w185${element.profile_path}`
		}

		actorCard.content.querySelector('.actor-card__title').textContent =
			element.character
		actorCard.content.querySelector('.actor-card__subtitle').textContent =
			element.name
		castDiv.appendChild(actorCard.content)
	})
}

const renderImages = function (htmlElement) {
	let image_slider = htmlElement
	images.forEach((image, i) => {
		let image_container = document.importNode(imageContainerTemplate, true)
		image_container.content.querySelector(
			'.image-container'
		).style.left = `${i}00%`
		image_container.content.querySelector(
			'.image-container__image'
		).src = `https://image.tmdb.org/t/p/original${image.file_path}`

		image_slider.appendChild(image_container.content)
	})
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
		renderRecomandations(document.getElementById('recomandations'))
	} catch (e) {}
}

const getCredits = async function () {
	try {
		let res = await fetch(
			`https://api.themoviedb.org/3/movie/${movie_id}/credits?api_key=bf42acf712bba686cfff9820897f4edb&language=en-US`
		)
		let data = await res.json()
		cast = data.cast
		renderCredits(document.getElementById('actors'))
	} catch (e) {}
}

const getImages = async function () {
	try {
		let res = await fetch(
			`https://api.themoviedb.org/3/movie/${movie_id}/images?api_key=bf42acf712bba686cfff9820897f4edb&language=null`
		)
		let data = await res.json()
		images = data.posters
		renderImages(document.getElementById('slider__images'))
	} catch (e) {}
}

const previousImage = function () {
	let slider = document.getElementById('slider__images')
	if (image_showed - 1 < 0) return
	image_showed -= 1
	for (const image of slider.children) {
		image.style.transform = `translateX(-${image_showed}00%)`
	}
}

const nextImage = function () {
	let slider = document.getElementById('slider__images')
	if (image_showed + 1 >= images.length) return
	image_showed += 1
	for (const image of slider.children) {
		image.style.transform = `translateX(-${image_showed}00%)`
	}
}

const updateShowMoreLess = function () {
	if (showMoreCast) {
		document.getElementById('showMoreLess').classList.remove('flex-col')
		document
			.getElementById('showMoreLess')
			.classList.add('flex-col-reverse')
		document.getElementById('showMoreLess__text').textContent = 'Show less'
		document.getElementById('showMoreLess__img').src = collapse
	} else {
		document
			.getElementById('showMoreLess')
			.classList.remove('flex-col-reverse')
		document.getElementById('showMoreLess').classList.add('flex-col')
		document.getElementById('showMoreLess__text').textContent = 'Show more'
		document.getElementById('showMoreLess__img').src = expand
	}
}

const showMoreLess = function () {
	if (!showMoreCast) {
		showMoreCast = true
		updateShowMoreLess()
		renderCredits(document.getElementById('actors'))
	} else {
		showMoreCast = false
		updateShowMoreLess()
		renderCredits(document.getElementById('actors'))
	}
}

document.onload = (function () {
	getMovieId()
	getGenres()

	document
		.getElementById('slider__previous')
		.addEventListener('click', previousImage)
	document.getElementById('slider__next').addEventListener('click', nextImage)

	document
		.getElementById('showMoreLess')
		.addEventListener('click', showMoreLess)

	getMovie()
	getRecomandations()
	getCredits()
	getImages()
})()
