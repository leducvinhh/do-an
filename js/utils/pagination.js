export function renderPagination(elementId, pagination) {
    const ulElement = document.getElementById(elementId)
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

export function initPagination({
    elementId,
    defaultParams,
    onChange
}) {
    const ulElement = document.getElementById(elementId)
    if (!ulElement) return

    const prevElement = ulElement.firstElementChild.firstElementChild
    const nextElement = ulElement.lastElementChild.lastElementChild

    // bind click event for prev link
    if (prevElement) {
        prevElement.addEventListener('click', (e) => {
            e.preventDefault()
            const page = Number.parseInt(ulElement.dataset.page) || 1

            if (page > 1) onChange(page - 1)
        })
    }

    // bind click event for next link
    if (nextElement) {
        nextElement.addEventListener('click', (e) => {
            e.preventDefault()

            const page = Number.parseInt(ulElement.dataset.page) || 1
            const totalPages = Number.parseInt(ulElement.dataset.totalPages) || 1

            if (page < totalPages) onChange(page + 1)
        })
    }
}