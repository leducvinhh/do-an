export function setTextContent(parentEl, selecttor, text) {
	if (!parentEl) return
	const element = parentEl.querySelector(selecttor)

	if (element) {
		element.textContent = text
	}
}