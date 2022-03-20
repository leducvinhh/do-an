import postApi from './api/postApi'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

// extend use fromNow function
dayjs.extend(relativeTime)
import {
	getUlPagination,
	setTextContent
} from './utils'
import debounce from 'lodash.debounce'

function createPostElement(post) {
	if (!post) return

	const postTemplate = document.getElementById('postTemplate')
	if (!postTemplate) return

	const liElement = postTemplate.content.firstElementChild.cloneNode(true)
	if (!liElement) return

	// update title, description, author, thumbnail

	setTextContent(liElement, '[data-id="title"]', post.title)
	setTextContent(liElement, '[data-id="description"]', post.description)
	setTextContent(liElement, '[data-id="author"]', post.author)

	// calculate timespan

	// console.log('timespan', dayjs(post.updatedAt).fromNow())
	setTextContent(liElement, '[data-id="timeSpan"]', `- ${dayjs(post.updatedAt).fromNow()}`)

	const thumbnailElement = liElement.querySelector('[data-id="thumbnail"]')
	if (thumbnailElement) {
		thumbnailElement.src = post.imageUrl

		thumbnailElement.addEventListener('error', () => {
			console.log('load image error')
			thumbnailElement.src = 'http://via.placeholder.com/640x360'
		})
	}
	// attach event

	return liElement
}

function renderPostList(postList) {
	if (!Array.isArray(postList)) return

	const ulElement = document.querySelector('#postList')
	if (!ulElement) return

	ulElement.textContent = ''

	postList.forEach((post) => {
		const liElement = createPostElement(post)
		ulElement.appendChild(liElement)
	})
}

async function handleFilterChange(filterName, filterValue) {
	const url = new URL(window.location)
	url.searchParams.set(filterName, filterValue)

	if (filterName === 'title_like') {
		url.searchParams.set('_page', 1)
	}

	history.pushState({}, '', url)

	// fetch API
	const {
		data,
		pagination
	} = await postApi.getAll(url.searchParams)
	renderPostList(data)
	renderPagination(pagination)
	// re-render post list
}

function renderPagination(pagination) {
	console.log(pagination)
	const ulElement = getUlPagination()
	if (!ulElement || !pagination) return

	const {
		_page,
		_limit,
		_totalRows
	} = pagination

	const totalPages = Math.ceil(_totalRows / _limit)

	ulElement.dataset.page = _page
	ulElement.dataset.totalPages = totalPages

	if (_page <= 1) {
		ulElement.firstElementChild.classList.add('disabled')
	} else {
		ulElement.firstElementChild.classList.remove('disabled')
	}

	if (_page >= totalPages) {
		ulElement.lastElementChild.classList.add('disabled')
	} else {
		ulElement.lastElementChild.classList.remove('disabled')
	}
}

function handlePrevClick(e) {
	e.preventDefault()
	const ulElement = getUlPagination()

	console.log('prev click')
	const page = Number.parseInt(ulElement.dataset.page) || 1
	if (page <= 1) return
	if (!ulElement) return

	handleFilterChange('_page', page - 1)
}

function handleNextClick(e) {
	e.preventDefault()

	const ulElement = getUlPagination()
	if (!ulElement) return

	const page = Number.parseInt(ulElement.dataset.page) || 1
	const totalPages = Number.parseInt(ulElement.dataset.totalPages) || 1

	if (page >= totalPages) return
	console.log('next click')

	handleFilterChange('_page', page + 1)
}

function initPagination() {
	const ulElement = getUlPagination()
	if (!ulElement) return

	const prevElement = ulElement.firstElementChild.firstElementChild
	const nextElement = ulElement.lastElementChild.lastElementChild

	// bind click event for prev link
	if (prevElement) {
		prevElement.addEventListener('click', handlePrevClick)
	}

	// bind click event for next link
	if (nextElement) {
		nextElement.addEventListener('click', handleNextClick)
	}
}

function initSearch() {
	const inputSearch = document.getElementById('searchInput')
	if (!initSearch) return

	const queryParams = new URLSearchParams(window.location.search)
	if (queryParams.get('title_like')) {
		inputSearch.value = queryParams.get('title_like')
	}

	const debounceSearch = debounce((event) => handleFilterChange('title_like', event.target.value), 500)

	inputSearch.addEventListener('input', debounceSearch)
}

(async () => {
	try {
		const url = new URL(window.location)

		if (!url.searchParams.get('_page')) {
			url.searchParams.set('_page', 1)
		}
		if (!url.searchParams.get('_limit')) {
			url.searchParams.set('_limit', 6)
		}

		history.pushState({}, '', url)
		const queryParams = url.searchParams

		initPagination(queryParams)
		initSearch(queryParams)

		// const queryParams = new URLSearchParams(window.location.search)
		const {
			data,
			pagination
		} = await postApi.getAll(queryParams)
		renderPostList(data)
		renderPagination(pagination)
	} catch (error) {
		console.log('get all failed', error)
	}
})()