export function setTextContent(parentEl, selector, text) {
	if (!parentEl) return
	const element = parentEl.querySelector(selector)

	if (element) {
		element.textContent = text
	}
}