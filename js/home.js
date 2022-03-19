import postApi from './api/postApi'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

// extend use fromNow function
dayjs.extend(relativeTime)
import {
	setTextContent
} from './utils'

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
	if (!Array.isArray(postList) || postList.length === 0) return

	const ulElement = document.querySelector('#postList')
	if (!ulElement) return

	postList.forEach((post) => {
		const liElement = createPostElement(post)
		ulElement.appendChild(liElement)
	})
}

function handleFilterChange(filterName, filterValue) {
	const url = new URL(window.location)
	url.searchParams.set(filterName, filterValue)
	history.pushState({}, '', url)

	// fetch API
	// re-render post list
}

function handlePrevClick(e) {
	console.log('prev click')
	e.preventDefault()
}

function handleNextClick(e) {
	console.log('next click')
	e.preventDefault()
}

function initPagination() {
	const ulElement = document.getElementById('pagination')
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

function initURL() {
	const url = new URL(window.location)

	if (!url.searchParams.get('_page')) {
		url.searchParams.set('_page', 1)
	}
	if (!url.searchParams.get('_limit')) {
		url.searchParams.set('_limit', 6)
	}

	history.pushState({}, '', url)
}

(async () => {
	try {
		initPagination()
		initURL()

		const queryParams = new URLSearchParams(window.location.search)
		const {
			data,
			pagination
		} = await postApi.getAll(queryParams)
		renderPostList(data)
	} catch (error) {
		console.log('get all failed', error)
	}
})()