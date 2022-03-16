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
	console.log(postList)
	if (!Array.isArray(postList) || postList.length === 0) return

	const ulElement = document.querySelector('#postList')
	if (!ulElement) return

	postList.forEach((post) => {
		const liElement = createPostElement(post)
		ulElement.appendChild(liElement)
	})
}

(async () => {
	try {
		const queryParams = {
			_page: 1,
			_limit: 6,
		}
		const {
			data,
			pagination
		} = await postApi.getAll(queryParams)
		renderPostList(data)
	} catch (error) {
		console.log('get all failed', error)
	}
})()