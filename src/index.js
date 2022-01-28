import './css/main.css'
const movieCardTemplate = document.getElementById('movie-card-template')

let filter = '1'
let page = 1,
	totalPages
let movies = []
let genres = []
let query = ''
let searching = false

const renderMovies = function (movies, htmlElement) {
	htmlElement.innerHTML = ''
	let movieList = htmlElement
	for (const movie of movies) {
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
		movieList.appendChild(movieCard.content)
	}
}

const updateFiltersUi = function (primary) {
	let filters = document.getElementsByClassName('movies-filter')
	for (const filter of filters) {
		filter.classList.remove('bg-blue-500', 'text-white', 'font-bold')
	}
	filters[primary - 1].classList.add('bg-blue-500', 'text-white', 'font-bold')
}

const updatePaginationUi = function (page) {
	document.getElementById('pagination__number').textContent = page
}

const nextPage = function () {
	if (page + 1 > totalPages) return
	page += 1
	updatePaginationUi(page)
	if (!searching) renderFilter(filter, page)
	else renderSearch(page)
}

const previousPage = function () {
	if (page - 1 <= 0) return
	page -= 1
	updatePaginationUi(page)
	if (!searching) renderFilter(filter, page)
	else renderSearch(page)
}

const renderFilter = async function (filter, page) {
	let res, data
	try {
		switch (filter) {
			case '1':
				res = await fetch(
					`https://api.themoviedb.org/3/movie/popular?api_key=bf42acf712bba686cfff9820897f4edb&language=en-US&page=` +
						page
				)
				data = await res.json()
				break
			case '2':
				res = await fetch(
					`https://api.themoviedb.org/3/movie/now_playing?api_key=bf42acf712bba686cfff9820897f4edb&language=en-US&page=` +
						page
				)
				data = await res.json()
				break
			case '3':
				res = await fetch(
					`https://api.themoviedb.org/3/movie/top_rated?api_key=bf42acf712bba686cfff9820897f4edb&language=en-US&page=` +
						page
				)
				data = await res.json()
				break
			case '4':
				res = await fetch(
					`https://api.themoviedb.org/3/movie/upcoming?api_key=bf42acf712bba686cfff9820897f4edb&language=en-US&page=` +
						page
				)
				data = await res.json()
				break
		}
		movies = data.results
		totalPages = data.totalPages
		renderMovies(movies, document.getElementById('movie-list'))
	} catch (e) {
		console.error(e)
	}
}

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

const renderSearch = async function (page) {
	if (!query) return
	let res = await fetch(
		'https://api.themoviedb.org/3/search/movie?api_key=bf42acf712bba686cfff9820897f4edb&language=en-US&query=' +
			query +
			'&page=' +
			page
	)
	let data = await res.json()
	movies = data.results
	totalPages = data.total_pages
	renderMovies(movies, document.getElementById('movie-list'))
}

const hideDiv = function (htmlElement) {
	htmlElement.classList.add('hidden')
}

const showDiv = function (htmlElement) {
	htmlElement.classList.remove('hidden')
}

const executeSearch = function () {
	query = document.getElementById('search__field').value
	if (query) {
		searching = true
		hideDiv(document.getElementById('movies-filters'))
		showDiv(document.getElementById('search-header'))
		page = 1
		updatePaginationUi(page)
		renderSearch(page)
	} else {
		searching = false
		showDiv(document.getElementById('movies-filters'))
		hideDiv(document.getElementById('search-header'))
		page = 1
		updatePaginationUi(page)
		renderFilter(filter, page)
	}
}

document.onload = (function () {
	getGenres()

	document
		.getElementById('pagination__previous')
		.addEventListener('click', () => {
			previousPage()
		})

	document
		.getElementById('pagination__after')
		.addEventListener('click', () => {
			nextPage()
		})

	document
		.getElementById('search__field')
		.addEventListener('input', executeSearch)

	document
		.getElementById('search__button')
		.addEventListener('click', executeSearch)

	let filters = document.getElementsByClassName('movies-filter')
	for (let i = 0; i < filters.length; i++) {
		filters[i].addEventListener('click', (e) => {
			let filter_element = e.target.closest('li')
			let filter_number = filter_element.dataset.filter
			filter = filter_number
			updateFiltersUi(filter_number)
			page = 1
			updatePaginationUi(page)
			renderFilter(filter_number, page)
		})
	}

	renderFilter(filter, page)
})()
