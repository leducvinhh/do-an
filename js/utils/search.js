import debounce from "lodash.debounce"

export function initSearch({
    elementId,
    defaultParams,
    onChange
}) {
    const inputSearch = document.getElementById(elementId)
    if (!initSearch) return

    if (defaultParams.get('title_like')) {
        inputSearch.value = defaultParams.get('title_like')
    }

    const debounceSearch = debounce((event) => onChange(event.target.value), 500)

    inputSearch.addEventListener('input', debounceSearch)
}