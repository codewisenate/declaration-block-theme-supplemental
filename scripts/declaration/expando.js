/**
 * Actions icons DOM manipulation.
 * @return {void}
 */
const domReady = () => {
	/*
	 * SafarIE bug requires 0ms timeout.
	 */
	setTimeout(function () {

		const expandoGroups = document.querySelectorAll('.expando-group');

		if (expandoGroups.length > 0) {
			expandoGroups.forEach(expandoGroup => {
				const expandoButtons = expandoGroup.querySelectorAll('.expando-button a');
				if (expandoButtons.length > 0) {
					expandoButtons.forEach(button => {
						const ariaLabel = button.getAttribute('aria-label');
						buttonSetup(button, expandoGroup, ariaLabel);
						button.setAttribute('aria-expanded', false);
						button.setAttribute('aria-controls', expandoGroup.id);
						button.setAttribute('role', 'button');
						// if (expandoGroup.classList.contains('closed')) {
						// 	expandoGroup.setAttribute('aria-expanded', false);
						// } else {
						// 	expandoGroup.setAttribute('aria-expanded', true);
						// }
					});
				}

				const expandoDetailsHeader =
					expandoGroup.querySelectorAll('.detailed-action-results-container .expando-header');
				const expandoDetailsContent = expandoGroup.querySelector('.expando-content');

				if (expandoDetailsHeader.length > 0) {
					expandoDetailsHeader.forEach(header => {
						const title = header.querySelector('.wp-block-post-title');
						const label = header.querySelector('.item-label > .value');
						header.setAttribute('tabindex', 0);
						header.setAttribute('role', 'link');
						if (!expandoGroup.id) {
							expandoGroup.id = generateUniqueId();
						}
						header.setAttribute('aria-controls', expandoGroup.id);

						let expandoState = 'Collapsed';
						if (expandoGroup.classList.contains('closed')) {
							header.setAttribute('aria-expanded', false);
							expandoState = 'Collapsed group';
						} else {
							header.setAttribute('aria-expanded', true);
							expandoState = 'Expanded group';
						}
						const ariaLabel = `Action item ${title.innerText}: ${label.innerText}`;

						buttonSetup(header, expandoGroup, ariaLabel);

						header.setAttribute('aria-label', `${expandoState},  ${ariaLabel}`)

						if (expandoDetailsContent && title && title.clientWidth) {
							const screenWidth = window.innerWidth;
							const titleWidth = title.clientWidth;
							let paddingHorizontalValue = `calc(${titleWidth}px + 3.75rem)`;

							if (screenWidth < 680) {
								paddingHorizontalValue = '1rem';
							}

							expandoDetailsContent.style.padding = `0 ${paddingHorizontalValue}`;
						}

					});
				}
			});
		}

		function buttonSetup(clickableItem, expandoGroup, ariaLabel) {
			clickableItem.addEventListener('click', clickFunc);
			clickableItem.addEventListener('touchend', clickFunc);
			clickableItem.addEventListener('keypress', clickFunc);

			function clickFunc(e) {
				e.preventDefault();
				expandoGroup.classList.toggle('closed');

				let expandoState = 'Collapsed group';

				if (expandoGroup.classList.contains('closed')) {
					this.setAttribute('aria-expanded', false);
					// expandoGroup.setAttribute('aria-expanded', false);
					expandoState = 'Collapsed group';
				} else {
					this.setAttribute('aria-expanded', true);
					// expandoGroup.setAttribute('aria-expanded', true);
					expandoState = 'Expanded group';
				}

				if (clickableItem.hasAttribute('role') && clickableItem.getAttribute('role') === 'link') {
					clickableItem.setAttribute('aria-label', `${expandoState}, ${ariaLabel}`);
				}

			}
		}

		function generateUniqueId() {
			const baseId = 'expando-';
			const randomId = Math.random().toString(36).substring(2, 7);
			const timestamp = Date.now().toString(36);

			const uniqueId = baseId + (randomId + timestamp).substring(0, 11);
			return uniqueId;
		}

	}, 0);
};

if ('complete' === document.readyState) {
	domReady();
} else {
	document.addEventListener('DOMContentLoaded', domReady);
}
