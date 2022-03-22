import dayjs from "dayjs"
import postApi from "./api/postApi"
import {
    registerLightbox,
    setTextContent
} from "./utils"

function renderPostDetail(post) {
    console.log(post)
    setTextContent(document, '#postDetailTitle', post.title)
    setTextContent(document, '#postDetailDescription', post.description)
    setTextContent(document, '#postDetailAuthor', post.author)
    setTextContent(document, '#postDetailTimeSpan', dayjs(post.updatedAt).format('- DD/MM/YYYY HH:mm'))

    const heroImage = document.querySelector('#postHeroImage')
    if (heroImage) {
        heroImage.style.backgroundImage = `url(${post.imageUrl})`

        heroImage.addEventListener('error', () => {
            heroImage.style.backgroundImage = `url(http://via.placeholder.com/640x360)`
        })
    }

    const editPageLink = document.getElementById('goToEditPageLink')
    if (editPageLink) {
        editPageLink.setAttribute('href', `/add-edit-post.html?id=${post.id}`)
        editPageLink.innerHTML = '<i class="fas fa-edit"></i> Edit Post'
    }

}

(async () => {

    registerLightbox()
    try {
        const queryParams = new URLSearchParams(window.location.search)
        const postId = queryParams.get('id')

        if (!postId) return
        const post = await postApi.getById(postId)
        renderPostDetail(post)
    } catch (error) {
        console.log('failed to get post', error)
    }

})()