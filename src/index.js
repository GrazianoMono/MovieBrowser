import './css/main.css'
const movieCardTemplate = document.getElementById('movie-card-template')

let filter = 1
let page = 1
let movies = [
	{
		adult: false,
		backdrop_path: '/1Rr5SrvHxMXHu5RjKpaMba8VTzi.jpg',
		genre_ids: [28, 12, 878],
		id: 634649,
		original_language: 'en',
		original_title: 'Spider-Man: No Way Home',
		overview:
			'Peter Parker is unmasked and no longer able to separate his normal life from the high-stakes of being a super-hero. When he asks for help from Doctor Strange the stakes become even more dangerous, forcing him to discover what it truly means to be Spider-Man.',
		popularity: 9425.322,
		poster_path: '/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg',
		release_date: '2021-12-15',
		title: 'Spider-Man: No Way Home',
		video: false,
		vote_average: 8.5,
		vote_count: 5898,
	},
]

const renderMovies = function () {
	let movieList = document.getElementById('movie-list')
	for (const movie of movies) {
		const movieCard = document.importNode(movieCardTemplate, true)
		movieCard.content.querySelector('.movie-card__title').textContent =
			movie.title
		movieList.appendChild(movieCard.content)
	}
}

const updateFilters = function (primary) {
	let filters = document.getElementsByClassName('movie-filter')
	for (const filter of filters) {
		filter.classList.remove('bg-blue-500', 'text-white', 'font-bold')
	}
	filters[primary - 1].classList.add('bg-blue-500', 'text-white', 'font-bold')
}

updateFilters(4)
renderMovies()
