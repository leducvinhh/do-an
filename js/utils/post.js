import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import {
    setTextContent
} from './common'

// extend use fromNow function
dayjs.extend(relativeTime)

export function createPostElement(post) {
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

    liElement.firstElementChild.addEventListener('click', () => {
        window.location.assign(`/post-detail.html?id=${post.id}`)
    })

    return liElement
}

export function renderPostList(elementId, postList) {
    if (!Array.isArray(postList)) return

    const ulElement = document.getElementById(elementId)
    if (!ulElement) return

    ulElement.textContent = ''

    postList.forEach((post) => {
        const liElement = createPostElement(post)
        ulElement.appendChild(liElement)
    })
}